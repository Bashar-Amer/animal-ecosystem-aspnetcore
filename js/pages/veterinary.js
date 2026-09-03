/**
 * veterinary.js
 * Veterinarian directory page — search, filter, render.
 *
 * Sections:
 *  1. HELPERS
 *  2. STATE
 *  3. FILTER LOGIC
 *  4. RENDER — card, grid, empty state, count
 *  5. EVENTS — search, chips, clear
 *  6. INIT
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     1. HELPERS
  ═══════════════════════════════════════════ */

  /**
   * Safe getElementById with a console warning on miss.
   * Prevents a missing element from crashing the entire script.
   */
  function el(id) {
    var element = document.getElementById(id);
    if (!element) {
      console.warn('[Veterinary] Element not found: #' + id);
    }
    return element;
  }

  /**
   * Extract two-letter initials from a vet name.
   * Skips "Dr." prefix so "Dr. Ahmed Ali" → "AA" not "DAA".
   */
  function getInitials(name) {
    if (!name) return '?';
    var parts = name
      .replace(/^Dr\.\s*/i, '')  // remove "Dr." prefix
      .split(' ')
      .filter(function (w) { return w.length > 0; });
    return parts
      .slice(0, 2)
      .map(function (w) { return w[0].toUpperCase(); })
      .join('');
  }

  /**
   * Escape a string for safe insertion into innerHTML.
   * Prevents XSS from data values.
   */
  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Check whether a vet has any availability this week.
   * Uses the weeklyAvailability object if present,
   * falls back to the boolean available field.
   */
  function hasAvailabilityThisWeek(vet) {
    if (!vet.weeklyAvailability) return vet.available;
    return Object.values(vet.weeklyAvailability).some(function (day) {
      return day === true;
    });
  }

  /**
   * Normalize specialty string for loose matching.
   * "Large Animal Vet" should match filter value "Large Animal".
   * "Equine Specialist" should match "Equine".
   */
  function specialtyMatches(vetSpecialty, filterValue) {
    if (!vetSpecialty) return false;
    var normalized = vetSpecialty.toLowerCase();
    var filter = filterValue.toLowerCase();

    // Direct match
    if (normalized === filter) return true;

    // Starts-with match: "large animal vet" starts with "large animal"
    if (normalized.startsWith(filter)) return true;

    // Contains match: "small animal & mixed practice" contains "small animal"
    if (normalized.includes(filter)) return true;

    // Specific mappings for known data values
    var mappings = {
      'livestock': ['livestock health', 'livestock'],
      'poultry':   ['poultry health', 'poultry'],
      'equine':    ['equine specialist', 'equine'],
      'small animal': ['small animal & mixed practice', 'small animal'],
      'large animal': ['large animal vet', 'large animal & livestock', 'large animal']
    };

    if (mappings[filter]) {
      return mappings[filter].some(function (m) {
        return normalized.includes(m) || m.includes(normalized);
      });
    }

    return false;
  }

  /**
   * Check if a vet treats a given animal type.
   * "Sheep" filter should match vets with "Sheep" or "Goats" in animalTypes.
   */
  function animalTypeMatches(animalTypes, filterValue) {
    if (!animalTypes || animalTypes.length === 0) return false;
    var filter = filterValue.toLowerCase();

    return animalTypes.some(function (type) {
      var t = type.toLowerCase();
      // "Sheep" chip matches Sheep or Goats entries
      if (filter === 'sheep') {
        return t === 'sheep' || t === 'goats' || t === 'sheep & goats';
      }
      return t === filter || t.includes(filter) || filter.includes(t);
    });
  }

  /* ═══════════════════════════════════════════
     2. STATE
  ═══════════════════════════════════════════ */

  var state = {
    searchQuery: '',
    filters: {
      specialty:    'all',
      location:     'all',
      availability: 'all',
      animalType:   'all'
    }
  };

  /* ═══════════════════════════════════════════
     3. FILTER LOGIC
  ═══════════════════════════════════════════ */

  /**
   * Filter the full vets array against current state.
   * All active filters combine with AND logic.
   */
  function filterVets(vets) {
    var query = state.searchQuery.trim().toLowerCase();
    var filters = state.filters;

    return vets.filter(function (vet) {

      // ── Text search ───────────────────────
      if (query) {
        var nameMatch      = vet.name     && vet.name.toLowerCase().includes(query);
        var specialtyMatch = vet.specialty && vet.specialty.toLowerCase().includes(query);
        var locationMatch  = vet.location  && vet.location.toLowerCase().includes(query);
        if (!nameMatch && !specialtyMatch && !locationMatch) return false;
      }

      // ── Specialty filter ──────────────────
      if (filters.specialty !== 'all') {
        if (!specialtyMatches(vet.specialty, filters.specialty)) return false;
      }

      // ── Location filter ───────────────────
      if (filters.location !== 'all') {
        if (!vet.location) return false;
        if (vet.location.toLowerCase() !== filters.location.toLowerCase()) return false;
      }

      // ── Availability filter ───────────────
      if (filters.availability === 'available') {
        // Available Now — must have available: true
        if (!vet.available) return false;
      }
      if (filters.availability === 'week') {
        // Available This Week — uses weeklyAvailability if present
        if (!hasAvailabilityThisWeek(vet)) return false;
      }

      // ── Animal type filter ────────────────
      if (filters.animalType !== 'all') {
        if (!animalTypeMatches(vet.animalTypes, filters.animalType)) return false;
      }

      return true;
    });
  }

  /* ═══════════════════════════════════════════
     4. RENDER
  ═══════════════════════════════════════════ */

  /**
   * Build a single vet card DOM element.
   * Uses DOM creation (not innerHTML) for the card itself
   * to avoid XSS — innerHTML only used for trusted SVG strings.
   */
  function renderVetCard(vet) {
    // Icons (trusted static SVG strings — not from data)
    var locationIcon =
      '<svg class="vet-card-meta-icon" aria-hidden="true" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2">' +
      '<path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>' +
      '<path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>';

    var experienceIcon =
      '<svg class="vet-card-meta-icon" aria-hidden="true" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2">' +
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M12 7v5l3 3" stroke-linecap="round"/></svg>';

    // ── Availability badge ─────────────────
    var availBadgeClass = vet.available ? 'badge-available' : 'badge-unavailable';
    var availBadgeText  = vet.available ? 'Available'       : 'Unavailable';

    // ── Verified Vet badge ─────────────────
    var verifiedBadge = vet.verifiedVet
      ? '<span class="badge badge-verified-vet">Verified Vet</span>'
      : '';

    // ── Animal type chips ──────────────────
    var typeChipsHtml = '';
    if (vet.animalTypes && vet.animalTypes.length > 0) {
      typeChipsHtml = vet.animalTypes.map(function (type) {
        return '<span class="vet-type-chip">' + escHtml(type) + '</span>';
      }).join('');
    }

    // ── Build article element ──────────────
    var article = document.createElement('article');
    article.className = 'vet-card';
    article.setAttribute('role', 'listitem');
    article.setAttribute('aria-label', escHtml(vet.name) + ', ' + escHtml(vet.specialty));

    article.innerHTML =
      // Header: identity + availability
      '<div class="vet-card-header">' +
        '<div class="vet-card-identity">' +
          '<div class="vet-avatar" aria-hidden="true">' + getInitials(vet.name) + '</div>' +
          '<div class="vet-card-name-wrap">' +
            '<div class="vet-card-name">' + escHtml(vet.name) + '</div>' +
            '<div class="vet-card-specialty">' + escHtml(vet.specialty) + '</div>' +
          '</div>' +
        '</div>' +
        '<span class="badge ' + availBadgeClass + '">' + availBadgeText + '</span>' +
      '</div>' +

      // Body: meta + verified badge + animal types
      '<div class="vet-card-body">' +
        '<div class="vet-card-meta-row">' +
          locationIcon +
          '<span>' + escHtml(vet.location) + '</span>' +
        '</div>' +
        '<div class="vet-card-meta-row">' +
          experienceIcon +
          '<span>' + escHtml(vet.experience) + ' experience</span>' +
        '</div>' +
        (verifiedBadge ? '<div class="mt-2">' + verifiedBadge + '</div>' : '') +
        (typeChipsHtml
          ? '<div class="vet-animal-types">' + typeChipsHtml + '</div>'
          : '') +
      '</div>' +

      // Footer: price + CTA
      '<div class="vet-card-footer">' +
        '<div class="vet-card-price">' +
          '<span>Consultation</span>' +
          '<strong>' + escHtml(vet.consultationPrice || '—') + '</strong>' +
        '</div>' +
        '<a href="vet-profile.html" class="btn btn-primary" ' +
           'aria-label="Book consultation with ' + escHtml(vet.name) + '">' +
          'Book Consultation' +
        '</a>' +
      '</div>';

    return article;
  }

  /**
   * Render the filtered list of vets into the grid container.
   */
  function renderGrid(vets) {
    var gridEl = el('vetGrid');
    if (!gridEl) return;

    gridEl.innerHTML = '';
    vets.forEach(function (vet) {
      gridEl.appendChild(renderVetCard(vet));
    });
  }

  /**
   * Update the results count label.
   */
  function updateResultCount(count) {
    var countEl = el('resultCount');
    if (!countEl) return;
    countEl.textContent =
      'Showing ' + count + ' veterinarian' + (count !== 1 ? 's' : '');
  }

  /**
   * Show the empty state and hide the grid.
   * Moves focus to the Clear Filters button.
   */
  function showEmptyState() {
    var grid    = el('vetGrid');
    var empty   = el('emptyState');
    var countEl = el('resultCount');

    if (grid)    grid.style.display    = 'none';
    if (countEl) countEl.style.display = 'none';

    if (empty) {
      empty.removeAttribute('hidden');
      empty.removeAttribute('aria-hidden');
      // Move focus to clear button for keyboard users
      var clearBtn = el('clearFiltersBtn');
      if (clearBtn) {
        // Small delay so DOM is settled before focus
        setTimeout(function () { clearBtn.focus(); }, 50);
      }
    }
  }

  /**
   * Hide the empty state and show the grid.
   */
  function hideEmptyState() {
    var grid    = el('vetGrid');
    var empty   = el('emptyState');
    var countEl = el('resultCount');

    if (empty) {
      empty.setAttribute('hidden', '');
      empty.setAttribute('aria-hidden', 'true');
    }
    if (grid)    grid.style.display    = '';
    if (countEl) countEl.style.display = '';
  }

  /* ═══════════════════════════════════════════
     5. RENDER PIPELINE
  ═══════════════════════════════════════════ */

  function render() {
    if (
      !window.App ||
      !window.App.Data ||
      !Array.isArray(window.App.Data.veterinarians)
    ) {
      console.error('[Veterinary] window.App.Data.veterinarians is not available.');
      showEmptyState();
      return;
    }

    var vets     = window.App.Data.veterinarians;
    var filtered = filterVets(vets);

    updateResultCount(filtered.length);

    if (filtered.length === 0) {
      showEmptyState();
    } else {
      hideEmptyState();
      renderGrid(filtered);
    }
  }

  /* ═══════════════════════════════════════════
     6. EVENTS
  ═══════════════════════════════════════════ */

  function onSearchInput() {
    var searchInput = el('vetSearch');
    if (!searchInput) return;
    state.searchQuery = searchInput.value;
    render();
  }

  function onChipClick(e) {
    var chip  = e.currentTarget;
    var group = chip.dataset.group;
    var value = chip.dataset.value;

    if (!group) return;

    // Deactivate all chips in this group
    document.querySelectorAll('.filter-chip[data-group="' + group + '"]')
      .forEach(function (c) {
        c.setAttribute('aria-pressed', 'false');
        c.classList.remove('is-active');
      });

    // Activate clicked chip
    chip.setAttribute('aria-pressed', 'true');
    chip.classList.add('is-active');

    // Update state
    state.filters[group] = value;
    render();
  }

  function onClearFilters() {
    // Reset search input
    var searchInput = el('vetSearch');
    if (searchInput) {
      searchInput.value = '';
      state.searchQuery = '';
    }

    // Reset all filter chips to "All"
    document.querySelectorAll('.filter-chip').forEach(function (chip) {
      var isAll = chip.dataset.value === 'all';
      chip.setAttribute('aria-pressed', isAll ? 'true' : 'false');
      if (isAll) {
        chip.classList.add('is-active');
        // Reset state for this group
        if (chip.dataset.group) {
          state.filters[chip.dataset.group] = 'all';
        }
      } else {
        chip.classList.remove('is-active');
      }
    });

    render();

    // Return focus to search after clearing
    if (searchInput) searchInput.focus();
  }

  /* ═══════════════════════════════════════════
     7. INIT
  ═══════════════════════════════════════════ */

  function init() {
    // Guard: check required DOM elements exist
    var searchInput = el('vetSearch');
    var clearBtn    = el('clearFiltersBtn');
    var chips       = document.querySelectorAll('.filter-chip');

    if (searchInput) {
      searchInput.addEventListener('input', onSearchInput);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', onChipClick);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', onClearFilters);
    }

    // Initial render — show all vets
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();