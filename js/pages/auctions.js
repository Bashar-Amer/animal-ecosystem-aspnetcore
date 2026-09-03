/**
 * auctions.js
 * Auction directory page — tabs, grid, countdowns.
 *
 * Sections:
 *  1. COUNTDOWN MANAGER
 *  2. HELPERS
 *  3. STATE
 *  4. DATA & FILTER
 *  5. RENDER — card, grid, tabs, counts, empty state
 *  6. TABS
 *  7. INIT
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     1. COUNTDOWN MANAGER
     Tracks all active intervals so they can be
     cleared when tabs switch and cards re-render.
     Leaking intervals cause double/triple countdown
     ticks after each tab switch.
  ═══════════════════════════════════════════ */

  var CountdownManager = {
    intervals: [],

    /**
     * Start a countdown from totalSeconds.
     * Fires onTick(remaining) immediately and every second.
     * Fires onComplete() when it reaches zero.
     * Returns the interval ID.
     */
    start: function (totalSeconds, onTick, onComplete) {
      var remaining = totalSeconds;

      // Fire immediately before first tick
      if (onTick) onTick(remaining);

      var id = setInterval(function () {
        remaining--;
        if (remaining <= 0) {
          clearInterval(id);
          if (onComplete) onComplete();
        } else {
          if (onTick) onTick(remaining);
        }
      }, 1000);

      this.intervals.push(id);
      return id;
    },

    /**
     * Clear all tracked intervals.
     * Must be called before every re-render.
     */
    clearAll: function () {
      this.intervals.forEach(function (id) { clearInterval(id); });
      this.intervals = [];
    },

    /**
     * Format seconds into HH:MM:SS string.
     */
    format: function (seconds) {
      var h = Math.floor(seconds / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = seconds % 60;
      return (
        String(h).padStart(2, '0') + ':' +
        String(m).padStart(2, '0') + ':' +
        String(s).padStart(2, '0')
      );
    }
  };

  /* ═══════════════════════════════════════════
     2. HELPERS
  ═══════════════════════════════════════════ */

  /**
   * Safe getElementById — warns on null instead of crashing.
   */
  function el(id) {
    var element = document.getElementById(id);
    if (!element) {
      console.warn('[Auctions] Element not found: #' + id);
    }
    return element;
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
   * Format a numeric JOD amount with thousands separator.
   * 4500 → "4,500 JOD"
   */
  function formatJOD(amount) {
    if (typeof amount !== 'number') return String(amount);
    return amount.toLocaleString('en-JO') + ' JOD';
  }

  /**
   * Return status badge config for a given status string.
   */
  function getStatusConfig(status) {
    var configs = {
      'live': {
        badgeClass: 'badge-live',
        badgeText:  '● Live',
        showDot:    true,
        ctaText:    'Place Bid',
        ctaClass:   'btn-warm',
        countdownLabel: 'Time remaining'
      },
      'ending-soon': {
        badgeClass: 'badge-ending-soon',
        badgeText:  '⚡ Ending Soon',
        showDot:    true,
        ctaText:    'Bid Now — Ending Soon',
        ctaClass:   'btn-warm',
        countdownLabel: 'Time remaining'
      },
      'starting-soon': {
        badgeClass: 'badge-starting-soon',
        badgeText:  '◷ Starting Soon',
        showDot:    false,
        ctaText:    'Notify Me',
        ctaClass:   'btn-outline',
        countdownLabel: 'Starts in'
      },
      'no-bids': {
        badgeClass: 'badge-no-bids',
        badgeText:  'No Bids Yet',
        showDot:    true,
        ctaText:    'Be the First to Bid',
        ctaClass:   'btn-warm',
        countdownLabel: 'Time remaining'
      },
      'ended': {
        badgeClass: 'badge-ended',
        badgeText:  'Ended',
        showDot:    false,
        ctaText:    'View Results',
        ctaClass:   'btn-secondary',
        countdownLabel: null
      }
    };
    return configs[status] || configs['ended'];
  }

  /* ═══════════════════════════════════════════
     3. STATE
  ═══════════════════════════════════════════ */

  var state = {
    activeTab: 'all'
  };

  /* ═══════════════════════════════════════════
     4. DATA & FILTER
  ═══════════════════════════════════════════ */

  function loadAuctions() {
    if (
      !window.App ||
      !window.App.Data ||
      !Array.isArray(window.App.Data.auctions)
    ) {
      console.error('[Auctions] window.App.Data.auctions is unavailable.');
      return [];
    }
    return window.App.Data.auctions;
  }

  /**
   * Filter auctions by the active tab.
   * "live" tab includes no-bids auctions (they are active, just unbid).
   */
  function filterByTab(auctions, tab) {
    if (tab === 'all') return auctions;
    if (tab === 'live') {
      return auctions.filter(function (a) {
        return a.status === 'live' || a.status === 'no-bids';
      });
    }
    return auctions.filter(function (a) { return a.status === tab; });
  }

  /**
   * Count auctions per tab for the count pills.
   */
  function getTabCounts(auctions) {
    return {
      all:            auctions.length,
      live:           auctions.filter(function (a) {
                        return a.status === 'live' || a.status === 'no-bids';
                      }).length,
      'ending-soon':  auctions.filter(function (a) {
                        return a.status === 'ending-soon';
                      }).length,
      'starting-soon':auctions.filter(function (a) {
                        return a.status === 'starting-soon';
                      }).length,
      ended:          auctions.filter(function (a) {
                        return a.status === 'ended';
                      }).length
    };
  }

  /* ═══════════════════════════════════════════
     5. RENDER
  ═══════════════════════════════════════════ */

  /**
   * Build a single auction card DOM element.
   * Returns an <article> element.
   */
  function renderAuctionCard(auction) {
    var config = getStatusConfig(auction.status);
    var isEnded = auction.status === 'ended';

    // ── Status badge + live dot ────────────
    var dotHtml = config.showDot
      ? '<span class="live-dot" aria-hidden="true"></span>'
      : '';

    // ── Bid label — "Current Bid" vs "Starting Bid" ──
    var bidLabel = (auction.status === 'starting-soon' || auction.status === 'no-bids')
      ? 'Starting Bid'
      : 'Current Bid';

    // ── Countdown display ──────────────────
    var countdownHtml = '';
    if (isEnded) {
      countdownHtml =
        '<span class="auction-card-countdown" style="color: var(--color-charcoal-600);">' +
          'Auction Ended' +
        '</span>';
    } else {
      countdownHtml =
        '<div>' +
          '<div class="auction-card-countdown-label">' +
            escHtml(config.countdownLabel) +
          '</div>' +
          '<span class="auction-card-countdown" ' +
                'aria-live="off" ' +
                'data-countdown="' + auction.id + '">' +
            CountdownManager.format(auction.timeRemainingSeconds) +
          '</span>' +
        '</div>';
    }

    // ── Ended image overlay ────────────────
    var endedOverlayHtml = isEnded
      ? '<div class="auction-card-ended-overlay" aria-hidden="true">' +
          '<span class="auction-card-ended-label">Auction Ended</span>' +
        '</div>'
      : '';

    // ── Build article ──────────────────────
    var article = document.createElement('article');
    article.className = 'auction-card';
    article.setAttribute('data-status', auction.status);
    article.setAttribute('role', 'listitem');
    article.setAttribute(
      'aria-label',
      escHtml(auction.name) + ', ' + escHtml(config.badgeText)
    );

    article.innerHTML =
      // Image area
      '<div class="auction-card-image-wrap">' +
        '<img class="auction-card-image" ' +
             'src="' + escHtml(auction.image) + '" ' +
             'alt="' + escHtml(auction.name) + ' — auction listing" ' +
             'loading="lazy" />' +
        endedOverlayHtml +
        '<div class="auction-card-badge-wrap">' +
          dotHtml +
          '<span class="badge ' + escHtml(config.badgeClass) + '">' +
            escHtml(config.badgeText) +
          '</span>' +
        '</div>' +
      '</div>' +

      // Body
      '<div class="auction-card-body">' +
        '<h3 class="auction-card-name">' + escHtml(auction.name) + '</h3>' +
        '<p class="auction-card-meta">' +
          escHtml(auction.species) + ' · ' +
          escHtml(auction.breed) + ' · ' +
          escHtml(auction.age) +
        '</p>' +
        '<p class="auction-card-location">' +
          '<svg class="auction-card-location-icon" aria-hidden="true" ' +
               'viewBox="0 0 24 24" fill="none" ' +
               'stroke="currentColor" stroke-width="2">' +
            '<path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 ' +
                     '0l-4.244-4.243a8 8 0 1111.314 0z"/>' +
            '<path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>' +
          '</svg>' +
          escHtml(auction.location) +
        '</p>' +
      '</div>' +

      // Footer
      '<div class="auction-card-footer">' +
        '<div class="auction-card-bid-row">' +
          '<div>' +
            '<div class="auction-card-bid-label">' + escHtml(bidLabel) + '</div>' +
            '<div class="auction-card-bid-amount">' +
              formatJOD(auction.currentBid) +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="auction-card-bid-meta">' +
          (auction.bidCount > 0
            ? '<span>' + auction.bidCount + ' bid' +
              (auction.bidCount !== 1 ? 's' : '') + '</span>'
            : '<span>No bids yet</span>') +
          '<span aria-hidden="true">·</span>' +
          countdownHtml +
        '</div>' +
        '<a href="auction-details.html?id=' + auction.id + '" ' +
           'class="btn ' + escHtml(config.ctaClass) + ' auction-card-cta" ' +
           'aria-label="' + escHtml(config.ctaText) + ' — ' +
             escHtml(auction.name) + '">' +
          escHtml(config.ctaText) +
        '</a>' +
      '</div>';

    return article;
  }

  /**
   * Render the filtered auction list into the grid.
   * Clears all countdown intervals before rendering.
   */
  function renderGrid(auctions) {
    // Always clear intervals before re-rendering
    // to prevent stacking setInterval calls
    CountdownManager.clearAll();

    var grid  = el('auctionGrid');
    var empty = el('auctionEmpty');
    var count = el('resultCount');

    if (!grid) return;

    grid.innerHTML = '';

    if (auctions.length === 0) {
      if (empty) {
        empty.removeAttribute('hidden');
        empty.removeAttribute('aria-hidden');
      }
      if (count) count.textContent = 'Showing 0 auctions';
      return;
    }

    // Hide empty state
    if (empty) {
      empty.setAttribute('hidden', '');
      empty.setAttribute('aria-hidden', 'true');
    }

    // Update results count
    if (count) {
      count.textContent =
        'Showing ' + auctions.length +
        ' auction' + (auctions.length !== 1 ? 's' : '');
    }

    // Render cards
    auctions.forEach(function (auction) {
      grid.appendChild(renderAuctionCard(auction));
    });

    // Start countdowns for non-ended auctions
    auctions.forEach(function (auction) {
      if (auction.status === 'ended') return;
      if (auction.timeRemainingSeconds <= 0) return;

      var countdownEl = document.querySelector(
        '[data-countdown="' + auction.id + '"]'
      );
      if (!countdownEl) return;

      CountdownManager.start(
        auction.timeRemainingSeconds,

        // onTick — update the display element
        function (remaining) {
          // Keep data in sync
          auction.timeRemainingSeconds = remaining;
          if (countdownEl) {
            countdownEl.textContent = CountdownManager.format(remaining);
          }
        },

        // onComplete — auction has ended, update card
        function () {
          auction.status = 'ended';
          auction.timeRemainingSeconds = 0;

          // Replace the card with an ended version
          var oldCard = countdownEl
            ? countdownEl.closest('.auction-card')
            : null;

          if (oldCard) {
            var newCard = renderAuctionCard(auction);
            oldCard.replaceWith(newCard);
          }

          // Update the tab count for ended tab
          updateTabCounts(loadAuctions());
        }
      );
    });
  }

  /**
   * Update the count pills on all tabs.
   */
  function updateTabCounts(auctions) {
    var counts = getTabCounts(auctions);

    var tabCountMap = {
      'all':            'count-all',
      'live':           'count-live',
      'ending-soon':    'count-ending-soon',
      'starting-soon':  'count-starting-soon',
      'ended':          'count-ended'
    };

    Object.keys(tabCountMap).forEach(function (tab) {
      var countEl = el(tabCountMap[tab]);
      if (countEl) countEl.textContent = counts[tab] || 0;
    });
  }

  /* ═══════════════════════════════════════════
     6. TABS
  ═══════════════════════════════════════════ */

  function initTabs() {
    var tabList = el('auctionTabList');
    if (!tabList) return;

    var tabs = tabList.querySelectorAll('.auction-tab');
    var panel = el('auctionTabPanel');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var selectedTab = tab.dataset.tab;
        if (selectedTab === state.activeTab) return;

        // Update active tab state
        state.activeTab = selectedTab;

        // Update tab ARIA and visual state
        tabs.forEach(function (t) {
          var isActive = t.dataset.tab === selectedTab;
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
          t.classList.toggle('is-active', isActive);
        });

        // Update tabpanel labelledby
        if (panel) {
          panel.setAttribute('aria-labelledby', 'tab-' + selectedTab);
        }

        // Filter and re-render
        var allAuctions = loadAuctions();
        var filtered    = filterByTab(allAuctions, selectedTab);
        renderGrid(filtered);
      });
    });
  }

  /* ═══════════════════════════════════════════
     7. INIT
  ═══════════════════════════════════════════ */

  function init() {
    var allAuctions = loadAuctions();

    if (allAuctions.length === 0) {
      var grid = el('auctionGrid');
      var empty = el('auctionEmpty');
      if (empty) {
        empty.removeAttribute('hidden');
        empty.removeAttribute('aria-hidden');
      }
      return;
    }

    // Set initial tab counts
    updateTabCounts(allAuctions);

    // Render all auctions (default tab: "all")
    renderGrid(allAuctions);

    // Initialize tab click handlers
    initTabs();

    // Clear all intervals on page unload
    window.addEventListener('beforeunload', function () {
      CountdownManager.clearAll();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();