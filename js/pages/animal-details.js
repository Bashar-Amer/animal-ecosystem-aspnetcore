/**
 * animal-details.js
 * Animal Details page controller.
 *
 * Responsibilities:
 *  1. Load animal data from window.App.Data
 *  2. Render gallery with thumbnail switching + active state
 *  3. Render animal overview, specs, description
 *  4. Render trust & verification section
 *  5. Render seller card
 *  6. Render seller's other listings
 *  7. Render similar animals
 *  8. Handle Save toggle (desktop + mobile)
 *  9. Sync mobile sticky action bar
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────

  /**
   * Safe element getter — logs a warning if not found
   * instead of crashing the whole page.
   */
  function el(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn('[AnimalDetails] Element not found: #' + id);
    }
    return element;
  }

  /** Create a badge span element */
  function makeBadge(className, text) {
    const span = document.createElement('span');
    span.className = 'badge ' + className;
    span.textContent = text;
    return span;
  }

  /** Create a spec chip element */
  function makeSpecChip(label, value) {
    const chip = document.createElement('div');
    chip.className = 'spec-chip';
    chip.setAttribute('role', 'listitem');
    chip.innerHTML =
      '<span class="spec-chip-label">' + label + '</span>' +
      '&nbsp;' + value;
    return chip;
  }

  /** Get initials from a name string */
  function getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map(function (w) { return w[0]; })
      .join('');
  }

  // ─────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────

  function loadAnimal() {
    if (
      !window.App ||
      !window.App.Data ||
      !Array.isArray(window.App.Data.animals) ||
      window.App.Data.animals.length === 0
    ) {
      console.error('[AnimalDetails] window.App.Data.animals is not available.');
      return null;
    }
    // In production this would use a URL param (e.g. ?id=1)
    // For prototype, always use animals[0] as specified
    return window.App.Data.animals[0];
  }

  // ─────────────────────────────────────────
  // GALLERY
  // ─────────────────────────────────────────

  function initGallery(animal) {
    const mainImg = el('galleryMainImg');
    const thumbsContainer = el('galleryThumbs');
    if (!mainImg || !thumbsContainer) return;

    const gallery = (animal.gallery && animal.gallery.length > 0)
      ? animal.gallery
      : [animal.image || 'assets/images/placeholder-sheep.jpg'];

    // Set main image
    mainImg.src = gallery[0];
    mainImg.alt = animal.name + ' — main photo';

    // Build thumbnails
    thumbsContainer.innerHTML = '';

    gallery.forEach(function (src, index) {
      const btn = document.createElement('button');
      btn.className = 'thumb-btn' + (index === 0 ? ' is-active' : '');
      btn.setAttribute('aria-label', 'View photo ' + (index + 1) + ' of ' + gallery.length);
      btn.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');

      const img = document.createElement('img');
      img.src = src;
      img.alt = animal.name + ' — photo ' + (index + 1);
      img.loading = 'lazy';

      btn.appendChild(img);
      thumbsContainer.appendChild(btn);

      btn.addEventListener('click', function () {
        // Swap main image with a brief fade
        mainImg.classList.add('is-loading');
        setTimeout(function () {
          mainImg.src = src;
          mainImg.alt = animal.name + ' — photo ' + (index + 1);
          mainImg.classList.remove('is-loading');
        }, 150);

        // Update active thumbnail
        thumbsContainer
          .querySelectorAll('.thumb-btn')
          .forEach(function (b) {
            b.classList.remove('is-active');
            b.setAttribute('aria-pressed', 'false');
          });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
      });

      // Keyboard: Enter / Space already handled natively for <button>
    });
  }

  // ─────────────────────────────────────────
  // ANIMAL OVERVIEW
  // ─────────────────────────────────────────

  function renderOverview(animal) {
    // Page title
    document.title = animal.name + ' — Animal Ecosystem';
    const titleEl = document.getElementById('pageTitle');
    if (titleEl) titleEl.textContent = animal.name + ' — Animal Ecosystem';

    // Breadcrumb
    const breadcrumbCurrent = el('breadcrumbCurrent');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = animal.name;

    // H1
    const nameEl = el('animalName');
    if (nameEl) nameEl.textContent = animal.name;

    // Location
    const locationEl = el('animalLocation');
    if (locationEl && animal.location) {
      locationEl.innerHTML =
        '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;">' +
          '<path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>' +
          '<path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>' +
        '</svg>' +
        '<span>' + animal.location + '</span>';
    }

    // Spec chips
    const specsEl = el('animalSpecs');
    if (specsEl) {
      specsEl.innerHTML = '';
      var specs = [
        { label: 'Species', value: animal.species },
        { label: 'Breed',   value: animal.breed },
        { label: 'Age',     value: animal.age },
        { label: 'Gender',  value: animal.gender }
      ];
      specs.forEach(function (s) {
        if (s.value) {
          specsEl.appendChild(makeSpecChip(s.label, s.value));
        }
      });
    }

    // Description
    const descEl = el('animalDescription');
    if (descEl) {
      descEl.textContent = animal.description ||
        'No description provided for this listing.';
    }
  }

  // ─────────────────────────────────────────
  // TRUST & VERIFICATION
  // ─────────────────────────────────────────

  function renderTrust(animal) {
    // Badges
    const badgesEl = el('trustBadges');
    if (badgesEl) {
      badgesEl.innerHTML = '';
      if (animal.verifiedOwner) {
        badgesEl.appendChild(makeBadge('badge-verified-owner', '✓ Verified Owner'));
      }
      if (animal.vetChecked) {
        badgesEl.appendChild(makeBadge('badge-vet-checked', '✓ Vet Checked'));
      }
      if (!animal.verifiedOwner && !animal.vetChecked) {
        badgesEl.appendChild(makeBadge('badge-neutral', 'Not yet verified'));
      }
    }

    // Health records
    const healthEl = el('healthList');
    if (healthEl) {
      healthEl.innerHTML = '';
      var records = animal.healthRecords || [];

      if (records.length === 0) {
        var li = document.createElement('li');
        li.className = 'health-record-item';
        li.textContent = 'No health records provided.';
        healthEl.appendChild(li);
      } else {
        records.forEach(function (record) {
          var li = document.createElement('li');
          li.className = 'health-record-item';
          li.innerHTML =
            '<svg class="health-record-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
              '<path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
            '<span>' + record + '</span>';
          healthEl.appendChild(li);
        });
      }
    }
  }

  // ─────────────────────────────────────────
  // PRICE & SIDEBAR
  // ─────────────────────────────────────────

  function renderSidebar(animal) {
    const priceAmountEl = el('priceAmount');
    const priceTypeEl = el('priceType');
    const mobilePriceEl = el('mobilePriceAmount');

    if (priceAmountEl) priceAmountEl.textContent = animal.price || '—';
    if (mobilePriceEl) mobilePriceEl.textContent = animal.price || '—';

    if (priceTypeEl) {
      priceTypeEl.textContent = animal.priceType
        ? animal.priceType
        : '';
    }
  }

  // ─────────────────────────────────────────
  // SELLER CARD
  // ─────────────────────────────────────────

  function renderSeller(animal) {
    var seller = animal.seller || {};

    var avatarEl = el('sellerAvatar');
    if (avatarEl) {
      avatarEl.textContent = getInitials(seller.name || 'Seller');
    }

    var nameEl = el('sellerName');
    if (nameEl) nameEl.textContent = seller.name || 'Seller';

    var metaEl = el('sellerMeta');
    if (metaEl) {
      metaEl.textContent = seller.memberSince
        ? 'Member since ' + seller.memberSince
        : '';
    }

    var locationEl = el('sellerLocation');
    if (locationEl) locationEl.textContent = seller.location || '';

    var sinceEl = el('sellerSince');
    if (sinceEl) {
      sinceEl.textContent = seller.memberSince
        ? 'Member since ' + seller.memberSince
        : '';
    }

    var responseEl = el('sellerResponse');
    if (responseEl) responseEl.textContent = seller.responseRate || '';

    var verifiedEl = el('sellerVerifiedBadge');
    if (verifiedEl) {
      verifiedEl.innerHTML = '';
      if (seller.verifiedOwner) {
        verifiedEl.appendChild(makeBadge('badge-verified-owner', '✓ Verified Owner'));
        verifiedEl.style.marginBottom = 'var(--space-4)';
      }
    }
  }

  // ─────────────────────────────────────────
  // RELATED LISTINGS
  // ─────────────────────────────────────────

  function renderAnimalCard(a) {
    // Use existing component if available, else build minimal card
    if (
      window.App &&
      window.App.Components &&
      typeof window.App.Components.renderAnimalCard === 'function'
    ) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = window.App.Components.renderAnimalCard(a);
      return wrapper.firstElementChild;
    }

    // Fallback minimal card
    var card = document.createElement('a');
    card.href = 'animal-details.html';
    card.className = 'card';
    card.style.textDecoration = 'none';
    card.style.display = 'block';
    card.innerHTML =
      '<div class="card-image-container">' +
        '<img class="card-image" src="' + (a.image || '') + '" alt="' + (a.name || 'Animal') + '" loading="lazy" />' +
      '</div>' +
      '<div class="card-content">' +
        '<div class="text-h4 mb-2">' + (a.name || '—') + '</div>' +
        '<div class="text-body-sm">' + (a.breed || '') + '</div>' +
      '</div>' +
      '<div class="card-footer">' +
        '<span class="number-emphasized">' + (a.price || '—') + '</span>' +
      '</div>';
    return card;
  }

  function renderSellerListings(animal) {
    var container = el('sellerListings');
    if (!container) return;
    container.innerHTML = '';

    var sellerName = (animal.seller && animal.seller.name) || null;
    var others = window.App.Data.animals.filter(function (a) {
      return a.id !== animal.id &&
        a.seller &&
        a.seller.name === sellerName;
    });

    if (others.length === 0) {
      var msg = document.createElement('p');
      msg.className = 'seller-listings-empty';
      msg.textContent = 'No other listings from this seller.';
      container.appendChild(msg);
      return;
    }

    others.forEach(function (a) {
      container.appendChild(renderAnimalCard(a));
    });
  }

  function renderSimilarAnimals(animal) {
    var container = el('similarAnimals');
    if (!container) return;
    container.innerHTML = '';

    var similar = window.App.Data.animals
      .filter(function (a) { return a.id !== animal.id; })
      .slice(0, 4);

    if (similar.length === 0) {
      var msg = document.createElement('p');
      msg.className = 'seller-listings-empty';
      msg.textContent = 'No similar animals found.';
      container.appendChild(msg);
      return;
    }

    similar.forEach(function (a) {
      container.appendChild(renderAnimalCard(a));
    });
  }

  // ─────────────────────────────────────────
  // SAVE TOGGLE
  // ─────────────────────────────────────────

  function initSaveToggle() {
    var isSaved = false;

    function updateSaveButtons() {
      var desktopBtn = el('saveAnimalBtn');
      var mobileBtn = el('mobileSaveBtn');

      if (desktopBtn) {
        desktopBtn.textContent = isSaved ? '♥ Saved' : '♡ Save Animal';
        desktopBtn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
        desktopBtn.setAttribute('aria-label',
          isSaved ? 'Remove from saved animals' : 'Save this animal to your saved list');
        if (isSaved) {
          desktopBtn.classList.remove('btn-outline');
          desktopBtn.classList.add('btn-saved');
        } else {
          desktopBtn.classList.add('btn-outline');
          desktopBtn.classList.remove('btn-saved');
        }
      }

      if (mobileBtn) {
        mobileBtn.textContent = isSaved ? '♥' : '♡';
        mobileBtn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
        mobileBtn.setAttribute('aria-label',
          isSaved ? 'Remove from saved animals' : 'Save this animal');
        if (isSaved) {
          mobileBtn.classList.remove('btn-outline');
          mobileBtn.classList.add('btn-saved');
        } else {
          mobileBtn.classList.add('btn-outline');
          mobileBtn.classList.remove('btn-saved');
        }
      }
    }

    function toggle() {
      isSaved = !isSaved;
      updateSaveButtons();
    }

    var desktopBtn = el('saveAnimalBtn');
    var mobileBtn = el('mobileSaveBtn');
    if (desktopBtn) desktopBtn.addEventListener('click', toggle);
    if (mobileBtn) mobileBtn.addEventListener('click', toggle);

    // Set initial state
    updateSaveButtons();
  }

  // ─────────────────────────────────────────
  // CONTACT SELLER
  // ─────────────────────────────────────────

  function initContactButtons() {
    function handleContact() {
      // Scroll to seller card on desktop
      var sellerCard = el('sellerCard');
      if (sellerCard && window.innerWidth >= 768) {
        sellerCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        sellerCard.style.outline = '2px solid var(--color-umber-500)';
        sellerCard.style.outlineOffset = '4px';
        setTimeout(function () {
          sellerCard.style.outline = '';
          sellerCard.style.outlineOffset = '';
        }, 2000);
      } else {
        // On mobile, show a simple prototype notice
        var btn = el('mobileContactBtn') || el('contactSellerBtn');
        if (btn) {
          var original = btn.textContent;
          btn.textContent = 'Contact — Prototype Only';
          btn.disabled = true;
          setTimeout(function () {
            btn.textContent = original;
            btn.disabled = false;
          }, 2000);
        }
      }
    }

    var desktopBtn = el('contactSellerBtn');
    var mobileBtn = el('mobileContactBtn');
    if (desktopBtn) desktopBtn.addEventListener('click', handleContact);
    if (mobileBtn) mobileBtn.addEventListener('click', handleContact);
  }

  // ─────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────

  function init() {
    var animal = loadAnimal();

    if (!animal) {
      // Graceful error state
      var main = document.querySelector('main');
      if (main) {
        main.innerHTML =
          '<div class="container" style="padding-block:var(--space-16); text-align:center;">' +
            '<p class="text-h3" style="color:var(--color-charcoal-600);">Animal not found.</p>' +
            '<a href="marketplace.html" class="btn btn-primary" style="margin-block-start:var(--space-6);">Back to Marketplace</a>' +
          '</div>';
      }
      return;
    }

    initGallery(animal);
    renderOverview(animal);
    renderTrust(animal);
    renderSidebar(animal);
    renderSeller(animal);
    renderSellerListings(animal);
    renderSimilarAnimals(animal);
    initSaveToggle();
    initContactButtons();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();