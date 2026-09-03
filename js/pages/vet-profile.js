/**
 * vet-profile.js
 * Veterinarian profile page controller.
 *
 * Sections:
 *  1. HELPERS
 *  2. DATA
 *  3. RENDER — header, about, services, credentials, reviews, availability, sidebar
 *  4. EVENTS — consultation request, save toggle (desktop + mobile)
 *  5. INIT
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     1. HELPERS
  ═══════════════════════════════════════════ */

  /**
   * Safe getElementById — warns instead of crashing on null.
   */
  function el(id) {
    var element = document.getElementById(id);
    if (!element) {
      console.warn('[VetProfile] Element not found: #' + id);
    }
    return element;
  }

  /**
   * Get initials from a vet name.
   * Strips "Dr." prefix so "Dr. Ahmed Ali" → "AA".
   */
  function getInitials(name) {
    if (!name) return '?';
    var parts = name
      .replace(/^Dr\.\s*/i, '')
      .split(' ')
      .filter(function (w) { return w.length > 0; });
    return parts
      .slice(0, 2)
      .map(function (w) { return w[0].toUpperCase(); })
      .join('');
  }

  /**
   * Get initials for reviewer names (no Dr. stripping needed).
   */
  function getReviewerInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .filter(function (w) { return w.length > 0; })
      .slice(0, 2)
      .map(function (w) { return w[0].toUpperCase(); })
      .join('');
  }

  /**
   * Escape a string for safe innerHTML insertion.
   */
  function escHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Read the ?id= URL parameter.
   * Returns null if not present or not a valid number.
   */
  function getVetIdFromURL() {
    var params = new URLSearchParams(window.location.search);
    var raw = params.get('id');
    var parsed = parseInt(raw, 10);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Capitalize the first letter of a string.
   */
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ═══════════════════════════════════════════
     2. DATA
  ═══════════════════════════════════════════ */

  function loadVet() {
    if (
      !window.App ||
      !window.App.Data ||
      !Array.isArray(window.App.Data.veterinarians) ||
      window.App.Data.veterinarians.length === 0
    ) {
      console.error('[VetProfile] window.App.Data.veterinarians is unavailable.');
      return null;
    }

    var vets = window.App.Data.veterinarians;
    var vetId = getVetIdFromURL();

    // Find by ID, fall back to first vet for prototype
    var vet = vetId
      ? vets.find(function (v) { return v.id === vetId; })
      : null;

    return vet || vets[0];
  }

  /* ═══════════════════════════════════════════
     3. RENDER
  ═══════════════════════════════════════════ */

  function renderPageMeta(vet) {
    // Page title
    document.title = escHtml(vet.name) + ' — Animal Ecosystem';

    // Breadcrumb current
    var breadcrumbEl = el('breadcrumbName');
    if (breadcrumbEl) breadcrumbEl.textContent = vet.name;
  }

  function renderProfileHeader(vet) {
    // Avatar
    var avatarEl = el('profileAvatar');
    if (avatarEl) avatarEl.textContent = getInitials(vet.name);

    // Name (h1)
    var nameEl = el('profileName');
    if (nameEl) nameEl.textContent = vet.name;

    // Badges
    var badgesEl = el('profileBadges');
    if (badgesEl) {
      badgesEl.innerHTML = '';
      if (vet.verifiedVet) {
        var badge = document.createElement('span');
        badge.className = 'badge badge-verified-vet';
        badge.textContent = 'Verified Vet';
        badgesEl.appendChild(badge);
      }
      if (vet.available) {
        var availBadge = document.createElement('span');
        availBadge.className = 'badge badge-available';
        availBadge.textContent = 'Available';
        badgesEl.appendChild(availBadge);
      }
    }

    // Meta rows (specialty, location, experience)
    var metaEl = el('profileMeta');
    if (metaEl) {
      var locationIcon =
        '<svg class="vet-profile-meta-icon" aria-hidden="true" viewBox="0 0 24 24" ' +
        'fill="none" stroke="currentColor" stroke-width="2">' +
        '<path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>' +
        '<path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>';

      var specialtyIcon =
        '<svg class="vet-profile-meta-icon" aria-hidden="true" viewBox="0 0 24 24" ' +
        'fill="none" stroke="currentColor" stroke-width="2">' +
        '<path d="M9 12l2 2 4-4"/>' +
        '<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>' +
        '</svg>';

      var experienceIcon =
        '<svg class="vet-profile-meta-icon" aria-hidden="true" viewBox="0 0 24 24" ' +
        'fill="none" stroke="currentColor" stroke-width="2">' +
        '<circle cx="12" cy="12" r="9"/>' +
        '<path d="M12 7v5l3 3" stroke-linecap="round"/></svg>';

      metaEl.innerHTML =
        '<div class="vet-profile-meta-row">' +
          specialtyIcon +
          '<span>' + escHtml(vet.specialty) + '</span>' +
        '</div>' +
        '<div class="vet-profile-meta-row">' +
          locationIcon +
          '<span>' + escHtml(vet.location) + '</span>' +
        '</div>' +
        '<div class="vet-profile-meta-row">' +
          experienceIcon +
          '<span>' + escHtml(vet.experience) + ' experience</span>' +
        '</div>';
    }

    // Animal type chips
    var typesEl = el('profileAnimalTypes');
    if (typesEl) {
      typesEl.innerHTML = '';
      (vet.animalTypes || []).forEach(function (type) {
        var chip = document.createElement('span');
        chip.className = 'vet-type-chip';
        chip.setAttribute('role', 'listitem');
        chip.textContent = type;
        typesEl.appendChild(chip);
      });
    }
  }

  function renderAbout(vet) {
    var aboutEl = el('profileAbout');
    if (aboutEl) {
      aboutEl.textContent = vet.about ||
        'No description available for this veterinarian.';
    }
  }

  function renderServices(vet) {
    var servicesEl = el('profileServices');
    if (!servicesEl) return;

    servicesEl.innerHTML = '';

    // Inline SVG for service icon — farm/animal health relevant
    var serviceIconSvg =
      '<svg class="vet-service-icon" aria-hidden="true" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<path d="M9 12l2 2 4-4"/>' +
      '<circle cx="12" cy="12" r="9"/>' +
      '</svg>';

    (vet.services || []).forEach(function (service) {
      var li = document.createElement('li');
      li.className = 'vet-service-item';
      li.innerHTML =
        serviceIconSvg +
        '<span class="vet-service-text">' + escHtml(service) + '</span>';
      servicesEl.appendChild(li);
    });

    if (!vet.services || vet.services.length === 0) {
      var empty = document.createElement('li');
      empty.className = 'vet-service-item';
      empty.innerHTML =
        '<span class="vet-service-text" style="color: var(--color-charcoal-600);">' +
        'No services listed.' +
        '</span>';
      servicesEl.appendChild(empty);
    }
  }

  function renderCredentials(vet) {
    var credsEl = el('profileCredentials');
    if (!credsEl) return;

    credsEl.innerHTML = '';

    var credentials = vet.credentials || [];

    if (credentials.length === 0) {
      var empty = document.createElement('li');
      empty.className = 'vet-credential-item';
      empty.innerHTML =
        '<p class="vet-credential-degree" ' +
        'style="color: var(--color-charcoal-600);">No credentials listed.</p>';
      credsEl.appendChild(empty);
      return;
    }

    // Sort chronologically (oldest first)
    var sorted = credentials.slice().sort(function (a, b) {
      return parseInt(a.year, 10) - parseInt(b.year, 10);
    });

    sorted.forEach(function (cred) {
      var li = document.createElement('li');
      li.className = 'vet-credential-item';
      li.innerHTML =
        '<div class="vet-credential-year">' + escHtml(cred.year) + '</div>' +
        '<div class="vet-credential-degree">' + escHtml(cred.degree) + '</div>' +
        '<div class="vet-credential-institution">' +
          escHtml(cred.institution) +
        '</div>';
      credsEl.appendChild(li);
    });
  }

  function renderReviews(vet) {
    var reviewsEl = el('profileReviews');
    if (!reviewsEl) return;

    reviewsEl.innerHTML = '';

    var reviews = vet.reviews || [];

    if (reviews.length === 0) {
      var empty = document.createElement('p');
      empty.style.cssText =
        'font-size: var(--font-body-sm); color: var(--color-charcoal-600);';
      empty.textContent = 'No reviews yet.';
      reviewsEl.appendChild(empty);
      return;
    }

    reviews.forEach(function (review, index) {
      var article = document.createElement('article');
      article.className = 'vet-review-card';
      article.setAttribute('role', 'listitem');
      article.setAttribute(
        'aria-label',
        'Review by ' + escHtml(review.reviewer)
      );

      var reviewerName = review.reviewer || 'Anonymous';
      var initials     = getReviewerInitials(reviewerName);

      article.innerHTML =
        '<h3 class="sr-only">Review ' + (index + 1) + ' by ' +
          escHtml(reviewerName) + '</h3>' +
        '<div class="vet-review-header">' +
          '<div class="vet-reviewer-avatar" aria-hidden="true">' +
            escHtml(initials) +
          '</div>' +
          '<div>' +
            '<div class="vet-reviewer-name">' +
              escHtml(reviewerName) +
            '</div>' +
            '<div class="vet-reviewer-date">' +
              escHtml(review.date || '') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<p class="vet-review-text">' + escHtml(review.text) + '</p>';

      reviewsEl.appendChild(article);
    });
  }

  function renderAvailability(vet) {
    var tbody = el('availabilityBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    var availability = vet.weeklyAvailability;

    if (!availability || typeof availability !== 'object') {
      var row = document.createElement('tr');
      var cell = document.createElement('td');
      cell.setAttribute('colspan', '2');
      cell.textContent = 'Availability not listed.';
      cell.style.cssText =
        'color: var(--color-charcoal-600); font-size: var(--font-body-sm);';
      row.appendChild(cell);
      tbody.appendChild(row);
      return;
    }

    // Jordan work week: Sat–Thu. Friday shown but typically day off.
    var dayOrder = [
      'saturday', 'sunday', 'monday',
      'tuesday', 'wednesday', 'thursday', 'friday'
    ];

    var dayLabels = {
      saturday:  'Saturday',
      sunday:    'Sunday',
      monday:    'Monday',
      tuesday:   'Tuesday',
      wednesday: 'Wednesday',
      thursday:  'Thursday',
      friday:    'Friday'
    };

    dayOrder.forEach(function (dayKey) {
      var isAvailable = availability[dayKey] === true;
      var tr = document.createElement('tr');

      var tdDay = document.createElement('td');
      tdDay.textContent = dayLabels[dayKey];

      var tdStatus = document.createElement('td');
      var dotClass = isAvailable ? 'avail-dot is-available' : 'avail-dot is-unavailable';
      var dotText  = isAvailable ? 'Available' : 'Unavailable';

      // Set as text so it's screen-reader readable
      // The ::before pseudo-element provides the color dot visually
      tdStatus.innerHTML =
        '<span class="' + dotClass + '">' + dotText + '</span>';

      tr.appendChild(tdDay);
      tr.appendChild(tdStatus);
      tbody.appendChild(tr);
    });
  }

  function renderSidebar(vet) {
    // Booking card — vet name
    var bookingNameEl = el('bookingVetName');
    if (bookingNameEl) bookingNameEl.textContent = vet.name;

    // Price
    var priceEl = el('bookingPrice');
    if (priceEl) priceEl.textContent = vet.consultationPrice || '—';

    // Mobile price
    var mobilePriceEl = el('mobilePriceDisplay');
    if (mobilePriceEl) {
      mobilePriceEl.textContent = vet.consultationPrice || '—';
    }
  }

  /* ═══════════════════════════════════════════
     4. EVENTS
  ═══════════════════════════════════════════ */

  function initConsultationRequest(vet) {
    var desktopBtn = el('requestConsultationBtn');
    var mobileBtn  = el('mobileRequestBtn');
    var actionsEl  = el('bookingActions');
    var subNoteEl  = document.querySelector('.vet-booking-sub-note');

    function handleRequest() {
      if (!actionsEl) return;

      // Build confirmation block
      var confirmEl = document.createElement('div');
      confirmEl.className = 'vet-booking-confirmation';
      confirmEl.setAttribute('tabindex', '-1');
      confirmEl.innerHTML =
        '<svg class="vet-booking-confirmation-icon" aria-hidden="true" ' +
          'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
          '<path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
        '<p class="vet-booking-confirmation-text">' +
          'Request sent! ' + escHtml(vet.name) +
          ' will contact you shortly.' +
        '</p>';

      // Hide actions + sub-note
      actionsEl.style.display = 'none';
      if (subNoteEl) subNoteEl.style.display = 'none';

      // Insert confirmation and move focus
      actionsEl.insertAdjacentElement('afterend', confirmEl);
      confirmEl.focus();

      // Restore after 3 seconds
      setTimeout(function () {
        confirmEl.remove();
        actionsEl.style.display = '';
        if (subNoteEl) subNoteEl.style.display = '';

        // Return focus to button
        if (desktopBtn) desktopBtn.focus();
      }, 3000);
    }

    if (desktopBtn) desktopBtn.addEventListener('click', handleRequest);
    if (mobileBtn)  mobileBtn.addEventListener('click', handleRequest);
  }

  function initSaveToggle() {
    var isSaved = false;

    var desktopBtn = el('saveVetBtn');
    var mobileBtn  = el('mobileSaveBtn');

    function updateButtons() {
      var label      = isSaved ? '♥ Saved'           : '♡ Save Veterinarian';
      var mobileIcon = isSaved ? '♥'                  : '♡';
      var ariaLabel  = isSaved
        ? 'Remove from saved veterinarians'
        : 'Save this veterinarian to your saved list';

      if (desktopBtn) {
        desktopBtn.textContent  = label;
        desktopBtn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
        desktopBtn.setAttribute('aria-label', ariaLabel);
        desktopBtn.className = isSaved
          ? 'btn btn-vet-saved'
          : 'btn btn-outline';
      }

      if (mobileBtn) {
        mobileBtn.textContent  = mobileIcon;
        mobileBtn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
        mobileBtn.setAttribute('aria-label',
          isSaved ? 'Remove from saved' : 'Save this veterinarian');
        mobileBtn.className = isSaved
          ? 'btn btn-vet-saved'
          : 'btn btn-outline';
      }
    }

    function toggle() {
      isSaved = !isSaved;
      updateButtons();
    }

    if (desktopBtn) desktopBtn.addEventListener('click', toggle);
    if (mobileBtn)  mobileBtn.addEventListener('click', toggle);

    // Set initial visual state
    updateButtons();
  }

  /* ═══════════════════════════════════════════
     5. INIT
  ═══════════════════════════════════════════ */

  function showErrorState() {
    var main = document.getElementById('mainContent');
    if (main) {
      main.innerHTML =
        '<div style="padding-block: var(--space-16); text-align: center;">' +
          '<p class="vet-section-title" ' +
             'style="color: var(--color-charcoal-600); border: none;">' +
            'Veterinarian not found.' +
          '</p>' +
          '<a href="veterinary.html" class="btn btn-primary" ' +
             'style="margin-block-start: var(--space-6);">' +
            'Back to Directory' +
          '</a>' +
        '</div>';
    }
  }

  function init() {
    var vet = loadVet();

    if (!vet) {
      showErrorState();
      return;
    }

    renderPageMeta(vet);
    renderProfileHeader(vet);
    renderAbout(vet);
    renderServices(vet);
    renderCredentials(vet);
    renderReviews(vet);
    renderAvailability(vet);
    renderSidebar(vet);
    initConsultationRequest(vet);
    initSaveToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();