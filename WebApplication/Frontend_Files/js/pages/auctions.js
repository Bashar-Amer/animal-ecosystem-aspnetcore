/**
 * Auctions Page Specific Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuctionFilters();
  initWatchlistButtons();
  initViewToggle();
  initNotificationButtons();
});

/**
 * Initialize Auction Filters
 */
function initAuctionFilters() {
  const filterTabs = document.querySelectorAll('.filter-tabs-auction .filter-tab');
  const filterSelects = document.querySelectorAll('.filter-select');
  const searchInput = document.querySelector('[data-search]');
  const auctionCards = document.querySelectorAll('.auction-card');

  const filters = {
    status: 'all',
    category: 'all',
    price: 'all',
    search: ''
  };

  // Filter Tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filterType = tab.dataset.filter;
      const filterValue = tab.dataset.value;

      // Update active tab
      filterTabs.forEach(t => {
        if (t.dataset.filter === filterType) {
          t.classList.remove('active');
        }
      });
      tab.classList.add('active');

      filters[filterType] = filterValue;
      applyFilters(filters, auctionCards);
    });
  });

  // Select Dropdowns
  filterSelects.forEach(select => {
    select.addEventListener('change', () => {
      const filterType = select.dataset.filter || 'sort';
      const filterValue = select.value;

      if (filterType === 'sort') {
        sortAuctions(filterValue, auctionCards);
      } else {
        filters[filterType] = filterValue;
        applyFilters(filters, auctionCards);
      }
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', Utils.debounce((e) => {
      filters.search = e.target.value.toLowerCase();
      applyFilters(filters, auctionCards);
    }, 300));
  }
}

/**
 * Apply Filters to Auction Cards
 */
function applyFilters(filters, cards) {
  let visibleCount = 0;

  cards.forEach(card => {
    const status = card.dataset.status;
    const category = card.dataset.category;
    const price = parseInt(card.dataset.price);
    const title = card.querySelector('.auction-card-title').textContent.toLowerCase();
    const details = card.querySelector('.auction-details').textContent.toLowerCase();

    let shouldShow = true;

    // Status Filter
    if (filters.status !== 'all' && status !== filters.status) {
      shouldShow = false;
    }

    // Category Filter
    if (filters.category !== 'all' && category !== filters.category) {
      shouldShow = false;
    }

    // Price Filter
    if (filters.price !== 'all') {
      switch (filters.price) {
        case 'under-1000':
          if (price >= 1000) shouldShow = false;
          break;
        case '1000-5000':
          if (price < 1000 || price > 5000) shouldShow = false;
          break;
        case '5000-10000':
          if (price < 5000 || price > 10000) shouldShow = false;
          break;
        case 'over-10000':
          if (price < 10000) shouldShow = false;
          break;
      }
    }

    // Search Filter
    if (filters.search && !title.includes(filters.search) && !details.includes(filters.search)) {
      shouldShow = false;
    }

    // Show/Hide Card
    card.style.display = shouldShow ? '' : 'none';
    if (shouldShow) visibleCount++;
  });

  // Update Results Count
  const resultsCount = document.querySelector('[data-results-count]');
  if (resultsCount) {
    resultsCount.textContent = visibleCount;
  }
}

/**
 * Sort Auctions
 */
function sortAuctions(sortBy, cards) {
  const grid = document.getElementById('auctions-grid');
  const cardsArray = Array.from(cards);

  cardsArray.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseInt(a.dataset.price) - parseInt(b.dataset.price);
      case 'price-high':
        return parseInt(b.dataset.price) - parseInt(a.dataset.price);
      case 'ending-soon':
        // Sort by countdown (would need actual time data)
        return 0;
      case 'newly-listed':
        // Sort by listing date (would need actual date data)
        return 0;
      case 'most-bids':
        // Sort by bid count (would need actual bid data)
        return 0;
      default:
        return 0;
    }
  });

  // Reorder cards in DOM
  cardsArray.forEach(card => grid.appendChild(card));
}

/**
 * Initialize Watchlist Buttons
 */
function initWatchlistButtons() {
  const watchlistButtons = document.querySelectorAll('.watchlist-btn');

  watchlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const auctionId = button.dataset.auctionId;
      const isActive = button.classList.contains('active');

      if (isActive) {
        button.classList.remove('active');
        removeFromWatchlist(auctionId);
        Utils.showToast('Removed from watchlist', 'info');
      } else {
        button.classList.add('active');
        addToWatchlist(auctionId);
        Utils.showToast('Added to watchlist', 'success');
      }
    });
  });
}

/**
 * Add to Watchlist
 */
function addToWatchlist(auctionId) {
  let watchlist = Utils.storage.get('watchlist') || [];
  if (!watchlist.includes(auctionId)) {
    watchlist.push(auctionId);
    Utils.storage.set('watchlist', watchlist);
  }
}

/**
 * Remove from Watchlist
 */
function removeFromWatchlist(auctionId) {
  let watchlist = Utils.storage.get('watchlist') || [];
  watchlist = watchlist.filter(id => id !== auctionId);
  Utils.storage.set('watchlist', watchlist);
}

/**
 * Initialize View Toggle
 */
function initViewToggle() {
  const viewButtons = document.querySelectorAll('.view-toggle-btn');
  const grid = document.getElementById('auctions-grid');

  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;

      // Update active button
      viewButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update grid view
      if (view === 'list') {
        grid.classList.add('auctions-list');
      } else {
        grid.classList.remove('auctions-list');
      }
    });
  });
}

/**
 * Initialize Notification Buttons
 */
function initNotificationButtons() {
  const notifyButtons = document.querySelectorAll('[data-notify-auction]');

  notifyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const auctionId = button.dataset.notifyAuction;

      // TODO: Implement actual notification subscription
      Utils.showToast('You will be notified when this auction starts', 'success');

      // Update button state
      button.innerHTML = `
        <span class="material-symbols-outlined">notifications_active</span>
        Notifications On
      `;
      button.classList.add('btn-primary');
      button.classList.remove('btn-secondary');
    });
  });
}