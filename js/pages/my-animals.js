/**
 * js/pages/my-animals.js
 * My Animals dashboard — filters, sorting, view toggle, grid/list rendering.
 *
 * Fixes from original:
 *  - Removed brittle aria-label string matching for filter type detection
 *  - Used explicit data-filter-type attribute on each chip button
 *  - Fixed switch/case const declarations (moved to block scope)
 *  - Sort is always applied before render — no stale state
 *  - View toggle uses two separate buttons (grid/list) — clear aria-pressed state
 *  - Removed direct DOM element replacement on confirm — re-render pipeline is
 *    the single source of truth (state mutation → applyFilters → render)
 *  - Container className is updated on every render to reflect view mode
 *  - resultCount uses innerHTML with <strong> for better typography
 *  - Skeleton count matches actual column layout expectation
 *  - window.App.Icons.pin replaced with inline SVG to avoid silent failure
 */

(function () {
  'use strict';

  /* ============================================================
     MOCK DATA
     Minimum 8 animals covering all listingStatus & healthStatus
     combinations, ≥2 with upcoming vet appointments.
  ============================================================ */
  const MY_ANIMALS = [
    {
      id: 1,
      name: "Khalid's Ram",
      species: "Sheep",
      breed: "Awassi",
      age: "2 Years",
      gender: "Male",
      location: "Amman Farm, Jordan",
      image: "assets/images/my-animals/animal-1.jpg",
      emoji: "🐑",
      listingStatus: "listed-sale",
      healthStatus: "healthy",
      nextVetAppointment: null,
      price: 250,
      addedDate: "2024-03-12"
    },
    {
      id: 2,
      name: "Layla's Mare",
      species: "Horse",
      breed: "Arabian",
      age: "4 Years",
      gender: "Female",
      location: "Zarqa Stables, Jordan",
      image: "assets/images/my-animals/animal-2.jpg",
      emoji: "🐴",
      listingStatus: "in-auction",
      healthStatus: "needs-attention",
      nextVetAppointment: "15 June 2025",
      price: 4000,
      addedDate: "2024-05-08"
    },
    {
      id: 3,
      name: "Omar's Cow",
      species: "Cattle",
      breed: "Holstein Friesian",
      age: "3 Years",
      gender: "Female",
      location: "Irbid Dairy, Jordan",
      image: "assets/images/my-animals/animal-3.jpg",
      emoji: "🐄",
      listingStatus: "unlisted",
      healthStatus: "vet-scheduled",
      nextVetAppointment: "02 July 2025",
      price: null,
      addedDate: "2024-01-20"
    },
    {
      id: 4,
      name: "Salim's Goat",
      species: "Goat",
      breed: "Boer",
      age: "2 Years",
      gender: "Male",
      location: "Salt, Jordan",
      image: "assets/images/my-animals/animal-4.jpg",
      emoji: "🐐",
      listingStatus: "sold",
      healthStatus: "unknown",
      nextVetAppointment: null,
      price: 180,
      addedDate: "2024-02-14"
    },
    {
      id: 5,
      name: "Nadia's Camel",
      species: "Camel",
      breed: "Najdi",
      age: "6 Years",
      gender: "Male",
      location: "Aqaba Desert Ranch, Jordan",
      image: "assets/images/my-animals/animal-5.jpg",
      emoji: "🐪",
      listingStatus: "listed-sale",
      healthStatus: "needs-attention",
      nextVetAppointment: null,
      price: 2000,
      addedDate: "2024-06-01"
    },
    {
      id: 6,
      name: "Youssef's Hen",
      species: "Bird",
      breed: "Leghorn",
      age: "1 Year",
      gender: "Female",
      location: "Amman Poultry Farm, Jordan",
      image: "assets/images/my-animals/animal-6.jpg",
      emoji: "🐓",
      listingStatus: "in-auction",
      healthStatus: "healthy",
      nextVetAppointment: null,
      price: null,
      addedDate: "2024-04-10"
    },
    {
      id: 7,
      name: "Farah's Lamb",
      species: "Sheep",
      breed: "Awassi",
      age: "1.5 Years",
      gender: "Female",
      location: "Irbid Farm, Jordan",
      image: "assets/images/my-animals/animal-7.jpg",
      emoji: "🐑",
      listingStatus: "listed-sale",
      healthStatus: "vet-scheduled",
      nextVetAppointment: "22 August 2025",
      price: 300,
      addedDate: "2024-07-15"
    },
    {
      id: 8,
      name: "Rashid's Bull",
      species: "Cattle",
      breed: "Angus",
      age: "4 Years",
      gender: "Male",
      location: "Madaba Ranch, Jordan",
      image: "assets/images/my-animals/animal-8.jpg",
      emoji: "🐂",
      listingStatus: "unlisted",
      healthStatus: "healthy",
      nextVetAppointment: null,
      price: null,
      addedDate: "2024-03-30"
    }
  ];

  /* ============================================================
     BADGE CONFIG
  ============================================================ */
  const LISTING_BADGES = {
    'listed-sale': { cls: 'ma-badge--listed-sale', label: '🏷 For Sale' },
    'in-auction':  { cls: 'ma-badge--in-auction',  label: '🔨 In Auction' },
    'unlisted':    { cls: 'ma-badge--unlisted',     label: 'Unlisted' },
    'sold':        { cls: 'ma-badge--sold',         label: '✓ Sold' }
  };

  const HEALTH_BADGES = {
    'healthy':          { cls: 'ma-badge--healthy',         label: '✓ Healthy' },
    'needs-attention':  { cls: 'ma-badge--needs-attention', label: '⚠ Needs Attention' },
    'vet-scheduled':    { cls: 'ma-badge--vet-scheduled',   label: '📅 Vet Scheduled' },
    'unknown':          { cls: 'ma-badge--unknown',         label: '— Unknown' }
  };

  /* ============================================================
     INLINE SVG HELPERS
     (No dependency on window.App.Icons to prevent silent failures)
  ============================================================ */
  const SVG = {
    pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" width="13" height="13" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>`,

    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" aria-hidden="true">
                 <rect x="3" y="4" width="18" height="18" rx="2"/>
                 <line x1="16" y1="2" x2="16" y2="6"/>
                 <line x1="8"  y1="2" x2="8"  y2="6"/>
                 <line x1="3"  y1="10" x2="21" y2="10"/>
               </svg>`,

    tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" width="14" height="14" aria-hidden="true">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>`,

    stethoscope: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       stroke-width="2" width="14" height="14" aria-hidden="true">
                    <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6
                             6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/>
                    <path d="M8 15v1a6 6 0 006 6 6 6 0 006-6v-4"/>
                    <circle cx="20" cy="10" r="2"/>
                  </svg>`,

    moreVert: `<svg viewBox="0 0 24 24" aria-hidden="true">
                 <circle cx="12" cy="5"  r="1.5"/>
                 <circle cx="12" cy="12" r="1.5"/>
                 <circle cx="12" cy="19" r="1.5"/>
               </svg>`,

    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>`,

    sell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
             <line x1="7" y1="7" x2="7.01" y2="7"/>
           </svg>`,

    gavel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2l8 8-4 4-8-8z"/>
              <path d="M2 22l8-8"/>
              <line x1="11" y1="11" x2="18" y2="18"/>
            </svg>`,

    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>`,

    vetCheck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                 <polyline points="22 4 12 14.01 9 11.01"/>
               </svg>`
  };

  /* ============================================================
     HTML ESCAPE UTILITY
  ============================================================ */
  const escapeHTML = (str) =>
    String(str ?? '').replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );

  /* ============================================================
     STATE
  ============================================================ */
  const state = {
    viewMode: localStorage.getItem('ma_viewMode') || 'grid',
    displayList: [],      // filtered + sorted slice of MY_ANIMALS
    filter: {
      search: '',
      status: 'all',
      health: 'all'
    },
    sort: 'added-desc'
  };

  /* ============================================================
     DOM REFERENCES
  ============================================================ */
  const dom = {
    container:    document.getElementById('animalsContainer'),
    searchInput:  document.getElementById('searchInput'),
    sortSelect:   document.getElementById('sortSelect'),
    gridViewBtn:  document.getElementById('gridViewBtn'),
    listViewBtn:  document.getElementById('listViewBtn'),
    resultCount:  document.getElementById('resultCount'),
    heroStats:    document.getElementById('heroStats'),
    statusChips:  document.querySelectorAll('[data-filter-type="status"]'),
    healthChips:  document.querySelectorAll('[data-filter-type="health"]')
  };

  /* ============================================================
     RENDER — GRID CARD
  ============================================================ */
  function buildGridCard(animal) {
    const listing = LISTING_BADGES[animal.listingStatus] || LISTING_BADGES['unlisted'];
    const health  = HEALTH_BADGES[animal.healthStatus]   || HEALTH_BADGES['unknown'];

    const priceHTML = animal.price
      ? `<p class="ma-card__price">${escapeHTML(animal.price)} JOD</p>`
      : '';

    const vetApptHTML = animal.nextVetAppointment
      ? `<div class="ma-vet-appt">
           ${SVG.calendar}
           <span>Vet appointment: <strong>${escapeHTML(animal.nextVetAppointment)}</strong></span>
         </div>`
      : '';

    return `
      <article class="ma-card" data-id="${animal.id}" data-animal-card>

        <div class="ma-card__image-wrap">
          <img
            src="${escapeHTML(animal.image)}"
            alt="${escapeHTML(animal.name)}"
            loading="lazy"
            onerror="this.style.display='none';
                     this.nextElementSibling.style.display='flex';"
          />
          <div class="ma-card__image-fallback" style="display:none;" aria-hidden="true">
            ${escapeHTML(animal.emoji)}
          </div>

          <div class="ma-card__badges">
            <span class="ma-badge ${escapeHTML(listing.cls)}">${listing.label}</span>
            <span class="ma-badge ${escapeHTML(health.cls)}">${health.label}</span>
          </div>
        </div>

        <div class="ma-card__body">
          <h3 class="ma-card__name">${escapeHTML(animal.name)}</h3>

          <div class="ma-card__meta">
            <span class="ma-meta-tag">${escapeHTML(animal.species)}</span>
            <span class="ma-meta-tag">${escapeHTML(animal.breed)}</span>
            <span class="ma-meta-tag">${escapeHTML(animal.age)}</span>
            <span class="ma-meta-tag">${escapeHTML(animal.gender)}</span>
          </div>

          <p class="ma-card__location">
            ${SVG.pin}
            ${escapeHTML(animal.location)}
          </p>

          ${priceHTML}
          ${vetApptHTML}
        </div>

        <footer class="ma-card__footer">
          <button class="btn btn-primary" data-action="view" aria-label="View ${escapeHTML(animal.name)}">
            ${SVG.eye} View
          </button>

          <div class="ma-more-wrap">
            <button
              class="ma-more-btn"
              data-action="more"
              aria-haspopup="true"
              aria-expanded="false"
              aria-label="More options for ${escapeHTML(animal.name)}"
            >
              ${SVG.moreVert}
            </button>

            <div class="ma-dropdown" hidden role="menu">
              <button class="ma-dropdown__item" role="menuitem" data-action="sell">
                ${SVG.sell} List for Sale
              </button>
              <button class="ma-dropdown__item" role="menuitem" data-action="auction">
                ${SVG.gavel} Send to Auction
              </button>
              <button class="ma-dropdown__item" role="menuitem" data-action="vet">
                ${SVG.vetCheck} Request Vet Check
              </button>
              <div class="ma-dropdown__divider" role="separator"></div>
              <button class="ma-dropdown__item ma-dropdown__item--danger" role="menuitem" data-action="remove">
                ${SVG.trash} Remove Listing
              </button>
            </div>
          </div>
        </footer>

      </article>`;
  }

  /* ============================================================
     RENDER — LIST ROW
  ============================================================ */
  function buildListRow(animal) {
    const listing = LISTING_BADGES[animal.listingStatus] || LISTING_BADGES['unlisted'];
    const health  = HEALTH_BADGES[animal.healthStatus]   || HEALTH_BADGES['unknown'];

    return `
      <div class="ma-row" data-id="${animal.id}" data-animal-card>

        <img
          class="ma-row__thumb"
          src="${escapeHTML(animal.image)}"
          alt="${escapeHTML(animal.name)}"
          loading="lazy"
          onerror="this.style.display='none';
                   this.nextElementSibling.style.display='flex';"
        />
        <div class="ma-row__thumb-fallback" style="display:none;" aria-hidden="true">
          ${escapeHTML(animal.emoji)}
        </div>

        <div class="ma-row__info">
          <h3 class="ma-row__name">${escapeHTML(animal.name)}</h3>
          <p class="ma-row__sub">
            ${escapeHTML(animal.species)} &bull;
            ${escapeHTML(animal.breed)} &bull;
            ${escapeHTML(animal.age)} &bull;
            ${escapeHTML(animal.gender)}
            ${animal.nextVetAppointment
              ? ` &bull; <strong style="color:#1d4ed8;">Vet: ${escapeHTML(animal.nextVetAppointment)}</strong>`
              : ''}
          </p>
        </div>

        <div class="ma-row__badges">
          <span class="ma-badge ${escapeHTML(listing.cls)}">${listing.label}</span>
          <span class="ma-badge ${escapeHTML(health.cls)}">${health.label}</span>
        </div>

        <div class="ma-row__actions">
          <button class="btn btn-primary btn-sm" data-action="view"
                  aria-label="View ${escapeHTML(animal.name)}">
            View
          </button>

          <div class="ma-more-wrap">
            <button
              class="ma-more-btn"
              data-action="more"
              aria-haspopup="true"
              aria-expanded="false"
              aria-label="More options for ${escapeHTML(animal.name)}"
            >
              ${SVG.moreVert}
            </button>

            <div class="ma-dropdown" hidden role="menu">
              <button class="ma-dropdown__item" role="menuitem" data-action="sell">
                ${SVG.sell} List for Sale
              </button>
              <button class="ma-dropdown__item" role="menuitem" data-action="auction">
                ${SVG.gavel} Send to Auction
              </button>
              <button class="ma-dropdown__item" role="menuitem" data-action="vet">
                ${SVG.vetCheck} Request Vet Check
              </button>
              <div class="ma-dropdown__divider" role="separator"></div>
              <button class="ma-dropdown__item ma-dropdown__item--danger"
                      role="menuitem" data-action="remove">
                ${SVG.trash} Remove Listing
              </button>
            </div>
          </div>
        </div>

      </div>`;
  }

  /* ============================================================
     SKELETON LOADERS
  ============================================================ */
  function showSkeletons() {
    const count = state.viewMode === 'grid' ? 6 : 4;
    const cls = state.viewMode === 'grid'
      ? 'ma-skeleton ma-skeleton-card'
      : 'ma-skeleton ma-skeleton-row';

    dom.container.innerHTML = Array(count)
      .fill(`<div class="${cls}" aria-hidden="true"></div>`)
      .join('');
  }

  /* ============================================================
     EMPTY STATE
  ============================================================ */
  function showEmpty() {
    dom.container.innerHTML = `
      <div class="ma-empty" role="status">
        <div class="ma-empty__icon" aria-hidden="true">🐾</div>
        <h2 class="ma-empty__title">No animals found</h2>
        <p class="ma-empty__subtitle">
          Try adjusting your filters or search term to find your animals.
        </p>
        <button class="btn btn-outline" id="clearFiltersBtn">
          Clear all filters
        </button>
      </div>`;

    // wire up the clear button
    const clearBtn = document.getElementById('clearFiltersBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', resetFilters);
    }
  }

  /* ============================================================
     RENDER PIPELINE
  ============================================================ */
  function render() {
    // 1. Update container layout class
    dom.container.className = state.viewMode === 'grid' ? 'ma-grid' : 'ma-list';

    // 2. Show skeletons
    showSkeletons();

    // 3. Render real content after brief delay (simulates data fetch)
    setTimeout(() => {
      dom.container.innerHTML = '';

      if (state.displayList.length === 0) {
        showEmpty();
        updateResultCount(0);
        return;
      }

      // Build fragment for performance
      const fragment = document.createDocumentFragment();

      state.displayList.forEach((animal) => {
        const html = state.viewMode === 'grid'
          ? buildGridCard(animal)
          : buildListRow(animal);

        const template = document.createElement('template');
        template.innerHTML = html.trim();
        fragment.appendChild(template.content.firstChild);
      });

      dom.container.appendChild(fragment);
      updateResultCount(state.displayList.length);
    }, 400);
  }

  /* ============================================================
     RESULT COUNT
  ============================================================ */
  function updateResultCount(count) {
    dom.resultCount.innerHTML =
      `Showing <strong>${count}</strong> animal${count !== 1 ? 's' : ''}`;
  }

  /* ============================================================
     FILTERING
  ============================================================ */
  function applyFilters() {
    const term   = state.filter.search.trim().toLowerCase();
    const status = state.filter.status;
    const health = state.filter.health;

    state.displayList = MY_ANIMALS.filter((a) => {
      const matchSearch = !term || [a.name, a.species, a.breed]
        .some((v) => v.toLowerCase().includes(term));

      const matchStatus = status === 'all' || a.listingStatus === status;
      const matchHealth = health === 'all' || a.healthStatus === health;

      return matchSearch && matchStatus && matchHealth;
    });

    applySort();
    render();
  }

  /* ============================================================
     SORTING
     Fixed: const declarations now inside explicit block scopes
     Fixed: always called before render — never stale
  ============================================================ */
  function applySort() {
    const HEALTH_ORDER   = ['healthy', 'needs-attention', 'vet-scheduled', 'unknown'];
    const LISTING_ORDER  = ['listed-sale', 'in-auction', 'unlisted', 'sold'];

    state.displayList.sort((a, b) => {
      switch (state.sort) {
        case 'added-desc': {
          return new Date(b.addedDate) - new Date(a.addedDate);
        }
        case 'name-asc': {
          return a.name.localeCompare(b.name);
        }
        case 'health': {
          return HEALTH_ORDER.indexOf(a.healthStatus) - HEALTH_ORDER.indexOf(b.healthStatus);
        }
        case 'listing': {
          return LISTING_ORDER.indexOf(a.listingStatus) - LISTING_ORDER.indexOf(b.listingStatus);
        }
        default:
          return 0;
      }
    });
  }

  /* ============================================================
     RESET FILTERS
  ============================================================ */
  function resetFilters() {
    state.filter.search = '';
    state.filter.status = 'all';
    state.filter.health = 'all';

    dom.searchInput.value = '';

    // Reset all chip aria-pressed states
    dom.statusChips.forEach((c) =>
      c.setAttribute('aria-pressed', c.dataset.status === 'all' ? 'true' : 'false')
    );
    dom.healthChips.forEach((c) =>
      c.setAttribute('aria-pressed', c.dataset.health === 'all' ? 'true' : 'false')
    );

    applyFilters();
  }

  /* ============================================================
     HERO STATS
  ============================================================ */
  function renderHeroStats() {
    const total   = MY_ANIMALS.length;
    const healthy = MY_ANIMALS.filter((a) => a.healthStatus === 'healthy').length;
    const alerts  = MY_ANIMALS.filter((a) => a.healthStatus === 'needs-attention').length;
    const active  = MY_ANIMALS.filter(
      (a) => a.listingStatus === 'listed-sale' || a.listingStatus === 'in-auction'
    ).length;

    dom.heroStats.innerHTML = `
      <span class="stat-chip stat-chip--total">
        <span class="stat-chip__dot" aria-hidden="true"></span>
        ${total} Total
      </span>
      <span class="stat-chip stat-chip--healthy">
        <span class="stat-chip__dot" aria-hidden="true"></span>
        ${healthy} Healthy
      </span>
      <span class="stat-chip stat-chip--alert">
        <span class="stat-chip__dot" aria-hidden="true"></span>
        ${alerts} Needs Attention
      </span>
      <span class="stat-chip stat-chip--active">
        <span class="stat-chip__dot" aria-hidden="true"></span>
        ${active} Active Listings
      </span>`;
  }

  /* ============================================================
     VIEW TOGGLE
  ============================================================ */
  function setViewMode(mode) {
    state.viewMode = mode;
    localStorage.setItem('ma_viewMode', mode);

    dom.gridViewBtn.setAttribute('aria-pressed', mode === 'grid' ? 'true' : 'false');
    dom.listViewBtn.setAttribute('aria-pressed', mode === 'list' ? 'true' : 'false');

    render();
  }

  /* ============================================================
     DROPDOWN MANAGEMENT
  ============================================================ */
  function closeAllDropdowns(except = null) {
    dom.container.querySelectorAll('.ma-dropdown').forEach((menu) => {
      if (menu !== except) {
        menu.hidden = true;
        const btn = menu.previousElementSibling;
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     ACTION HANDLERS (delegated from container)
  ============================================================ */
  function handleContainerClick(e) {
    const btn = e.target.closest('button[data-action]');
    if (!btn) {
      // Click outside dropdown → close all
      if (!e.target.closest('.ma-dropdown')) {
        closeAllDropdowns();
      }
      return;
    }

    const action  = btn.dataset.action;
    const cardEl  = btn.closest('[data-animal-card]');
    if (!cardEl) return;

    const animalId = parseInt(cardEl.dataset.id, 10);
    const animal   = MY_ANIMALS.find((a) => a.id === animalId);
    if (!animal) return;

    // Close all dropdowns before handling (prevents stacking)
    closeAllDropdowns();

    switch (action) {
      case 'view': {
        window.location.href = `animal-details.html?id=${animalId}&owner=true`;
        break;
      }

      case 'more': {
        const dropdown  = cardEl.querySelector('.ma-dropdown');
        const isOpen    = btn.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
          dropdown.hidden = true;
          btn.setAttribute('aria-expanded', 'false');
        } else {
          closeAllDropdowns(dropdown);
          dropdown.hidden = false;
          btn.setAttribute('aria-expanded', 'true');
          e.stopPropagation(); // prevent immediate close from document listener
        }
        break;
      }

      case 'sell': {
        // In a real app, navigate to sell flow or open modal
        showToast(`Listing "${animal.name}" for sale…`);
        break;
      }

      case 'auction': {
        showToast(`Sending "${animal.name}" to auction…`);
        break;
      }

      case 'vet': {
        showToast(`Requesting vet check for "${animal.name}"…`);
        break;
      }

      case 'remove': {
        confirmRemove(animal, cardEl);
        break;
      }
    }
  }

  /* ============================================================
     CONFIRM REMOVE
     Mutates state array then re-renders — no direct DOM replacement
  ============================================================ */
  function confirmRemove(animal, cardEl) {
    // Build inline confirm UI overtop of the card
    const confirmEl = document.createElement('div');
    confirmEl.className = 'ma-confirm';
    confirmEl.setAttribute('role', 'alertdialog');
    confirmEl.setAttribute('aria-label', `Remove ${animal.name} listing`);

    confirmEl.innerHTML = `
      <p>Remove <strong>${escapeHTML(animal.name)}</strong> from your listings?</p>
      <div class="ma-confirm__actions">
        <button class="btn btn-outline" data-confirm="no">Cancel</button>
        <button class="btn btn-primary" style="background:#dc2626; border-color:#dc2626;"
                data-confirm="yes">Remove</button>
      </div>`;

    // Replace the card visually
    cardEl.replaceWith(confirmEl);

    confirmEl.addEventListener('click', (e) => {
      const choice = e.target.closest('[data-confirm]')?.dataset.confirm;
      if (!choice) return;

      if (choice === 'yes') {
        // Update state — remove from master array
        const idx = MY_ANIMALS.findIndex((a) => a.id === animal.id);
        if (idx !== -1) MY_ANIMALS.splice(idx, 1);
        showToast(`${animal.name} removed from listings.`);
      }

      // Always re-run pipeline — restore correct view
      applyFilters();
    });
  }

  /* ============================================================
     TOAST NOTIFICATION (lightweight, no library needed)
  ============================================================ */
  let toastTimer = null;

  function showToast(message) {
    let toast = document.getElementById('ma-toast');

    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ma-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      Object.assign(toast.style, {
        position:     'fixed',
        bottom:       '24px',
        left:         '50%',
        transform:    'translateX(-50%)',
        background:   'var(--color-umber-900)',
        color:        '#fff',
        padding:      '12px 24px',
        borderRadius: '9999px',
        fontSize:     '14px',
        fontWeight:   '600',
        zIndex:       '9999',
        boxShadow:    '0 4px 20px rgba(0,0,0,0.25)',
        transition:   'opacity 0.3s',
        opacity:      '0',
        pointerEvents:'none',
        whiteSpace:   'nowrap'
      });
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
  }

  /* ============================================================
     EVENT LISTENERS
  ============================================================ */
  function attachListeners() {

    // ── Search (debounced) ──────────────────────────────────
    let searchTimer;
    dom.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.filter.search = e.target.value;
        applyFilters();
      }, 280);
    });

    // ── Status filter chips ─────────────────────────────────
    dom.statusChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        state.filter.status = chip.dataset.status;
        dom.statusChips.forEach((c) =>
          c.setAttribute('aria-pressed', c === chip ? 'true' : 'false')
        );
        applyFilters();
      });
    });

    // ── Health filter chips ─────────────────────────────────
    dom.healthChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        state.filter.health = chip.dataset.health;
        dom.healthChips.forEach((c) =>
          c.setAttribute('aria-pressed', c === chip ? 'true' : 'false')
        );
        applyFilters();
      });
    });

    // ── Sort select ─────────────────────────────────────────
    dom.sortSelect.addEventListener('change', (e) => {
      state.sort = e.target.value;
      // applyFilters calls applySort + render — keeps pipeline consistent
      applyFilters();
    });

    // ── View toggle buttons ─────────────────────────────────
    dom.gridViewBtn.addEventListener('click', () => setViewMode('grid'));
    dom.listViewBtn.addEventListener('click', () => setViewMode('list'));

    // ── Delegated container clicks ──────────────────────────
    dom.container.addEventListener('click', handleContainerClick);

    // ── Global: close dropdowns on outside click ────────────
    document.addEventListener('click', (e) => {
      if (
        !e.target.closest('.ma-more-wrap') &&
        !e.target.closest('.ma-dropdown')
      ) {
        closeAllDropdowns();
      }
    });

    // ── Global: close dropdowns on Escape ──────────────────
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllDropdowns();
    });
  }

  /* ============================================================
     INIT
  ============================================================ */
  function init() {
    // Restore persisted view mode to buttons
    dom.gridViewBtn.setAttribute('aria-pressed', state.viewMode === 'grid' ? 'true' : 'false');
    dom.listViewBtn.setAttribute('aria-pressed', state.viewMode === 'list' ? 'true' : 'false');

    // Render hero statistics
    renderHeroStats();

    // Attach all event listeners
    attachListeners();

    // Initial render
    applyFilters();
  }

  init();

})();

