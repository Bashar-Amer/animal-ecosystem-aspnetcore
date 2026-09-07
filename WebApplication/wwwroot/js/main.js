/**
 * Main Application Logic
 * Initialize components and handle global functionality
 */

// App State
const AppState = {
  user: null,
  filters: {},
  sortBy: 'ending-soon',
  viewMode: 'grid',
};

/**
 * Initialize Application
 */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCountdownTimers();
  initModals();
  initTabs();
  initAccordions();
  initDropdowns();
  initLazyLoading();
  initFilters();
  initSearch();
  initAuctionCards();
  initScrollEffects();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');

      // Update aria-expanded for accessibility
      const isExpanded = mobileMenu.classList.contains('active');
      mobileMenuToggle.setAttribute('aria-expanded', isExpanded);

      // Update icon (if using icon toggle)
      const icon = mobileMenuToggle.querySelector('svg, i');
      if (icon) {
        icon.classList.toggle('rotate-90');
      }
    });

    // Close menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/**
 * Initialize All Countdown Timers
 */
function initCountdownTimers() {
  const timerElements = document.querySelectorAll('[data-countdown]');

  timerElements.forEach((element) => {
    const endDate = element.dataset.countdown;
    if (endDate) {
      const timer = new CountdownTimer(element, endDate);
      timer.setExpireCallback(() => {
        // Handle timer expiration
        const card = element.closest('.card');
        if (card) {
          const badge = card.querySelector('.badge');
          if (badge) {
            badge.className = 'badge badge-ended';
            badge.textContent = 'Ended';
          }

          const actionButton = card.querySelector('.btn-primary, .btn-urgent');
          if (actionButton) {
            actionButton.disabled = true;
            actionButton.textContent = 'Auction Ended';
            actionButton.classList.add('btn-disabled');
          }
        }
      });
      timer.start();
    }
  });
}

/**
 * Initialize All Modals
 */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-trigger]');

  modalTriggers.forEach((trigger) => {
    const modalId = trigger.dataset.modalTrigger;
    const modal = new Modal(modalId);

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modal.open();
    });
  });
}

/**
 * Initialize All Tabs
 */
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs]');

  tabContainers.forEach((container) => {
    new Tabs(container);
  });
}

/**
 * Initialize All Accordions
 */
function initAccordions() {
  const accordions = document.querySelectorAll('[data-accordion]');

  accordions.forEach((accordion) => {
    new Accordion(accordion);
  });
}

/**
 * Initialize All Dropdowns
 */
function initDropdowns() {
  const dropdowns = document.querySelectorAll('[data-dropdown]');

  dropdowns.forEach((dropdown) => {
    new Dropdown(dropdown);
  });
}

/**
 * Initialize Lazy Loading for Images
 */
function initLazyLoading() {
  new LazyLoader('[data-lazy]');
}

/**
 * Initialize Filters
 */
function initFilters() {
  const filterInputs = document.querySelectorAll('[data-filter]');

  filterInputs.forEach((input) => {
    input.addEventListener(
      'change',
      Utils.debounce(() => {
        const filterType = input.dataset.filter;
        const filterValue = input.value;

        AppState.filters[filterType] = filterValue;
        applyFilters();
      }, 300)
    );
  });
}

/**
 * Apply Filters to Auction Listings
 */
function applyFilters() {
  const cards = document.querySelectorAll('.auction-card');

  cards.forEach((card) => {
    let shouldShow = true;

    // Check each filter
    Object.keys(AppState.filters).forEach((filterType) => {
      const filterValue = AppState.filters[filterType];

      if (!filterValue || filterValue === 'all') return;

      const cardValue = card.dataset[filterType];

      if (cardValue !== filterValue) {
        shouldShow = false;
      }
    });

    // Show/hide card
    card.style.display = shouldShow ? '' : 'none';
  });

  updateResultsCount();
}

/**
 * Update visible results count
 */
function updateResultsCount() {
  const visibleCards = document.querySelectorAll('.auction-card:not([style*="display: none"])');
  const resultsCount = document.querySelector('[data-results-count]');

  if (resultsCount) {
    resultsCount.textContent = `${visibleCards.length} ${
      visibleCards.length === 1 ? 'listing' : 'listings'
    }`;
  }
}

/**
 * Initialize Search
 */
function initSearch() {
  const searchInput = document.querySelector('[data-search]');

  if (searchInput) {
    searchInput.addEventListener(
      'input',
      Utils.debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        performSearch(searchTerm);
      }, 300)
    );
  }
}

/**
 * Perform Search on Auction Cards
 */
function performSearch(searchTerm) {
  const cards = document.querySelectorAll('.auction-card');

  cards.forEach((card) => {
    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    const description = card.querySelector('.card-meta')?.textContent.toLowerCase() || '';
    const searchableText = title + ' ' + description;

    if (searchableText.includes(searchTerm)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });

  updateResultsCount();
}

/**
 * Initialize Auction Card Interactions
 */
function initAuctionCards() {
  const bidButtons = document.querySelectorAll('[data-bid-button]');

  bidButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const auctionId = button.dataset.auctionId;
      handleBidClick(auctionId);
    });
  });

  // Favorite/Watchlist buttons
  const favoriteButtons = document.querySelectorAll('[data-favorite]');

  favoriteButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const auctionId = button.dataset.favorite;
      toggleFavorite(auctionId, button);
    });
  });
}

/**
 * Handle Bid Button Click
 */
function handleBidClick(auctionId) {
  // Check if user is logged in
  if (!AppState.user) {
    Utils.showToast('Please sign in to place a bid', 'warning');
    // Open login modal or redirect
    const loginModal = new Modal('login-modal');
    loginModal.open();
    return;
  }

  // Open bid modal
  const bidModal = new Modal('bid-modal');
  if (bidModal.modal) {
    // Set auction ID in modal
    bidModal.modal.dataset.auctionId = auctionId;
    bidModal.open();
  }
}

/**
 * Toggle Favorite/Watchlist
 */
function toggleFavorite(auctionId, button) {
  const isFavorited = button.classList.contains('favorited');

  if (isFavorited) {
    button.classList.remove('favorited');
    Utils.showToast('Removed from watchlist', 'info');
  } else {
    button.classList.add('favorited');
    Utils.showToast('Added to watchlist', 'success');
  }

  // Update icon
  const icon = button.querySelector('svg');
  if (icon) {
    icon.classList.toggle('filled');
  }

  // Save to local storage or send to server
  saveFavoriteState(auctionId, !isFavorited);
}

/**
 * Save Favorite State
 */
function saveFavoriteState(auctionId, isFavorited) {
  let favorites = Utils.storage.get('favorites') || [];

  if (isFavorited) {
    if (!favorites.includes(auctionId)) {
      favorites.push(auctionId);
    }
  } else {
    favorites = favorites.filter((id) => id !== auctionId);
  }

  Utils.storage.set('favorites', favorites);
}

/**
 * Initialize Scroll Effects (Header shadow, back-to-top button)
 */
function initScrollEffects() {
  const header = document.querySelector('.header');
  const backToTopButton = document.querySelector('[data-back-to-top]');

  window.addEventListener(
    'scroll',
    Utils.throttle(() => {
      const scrollY = window.scrollY;

      // Add shadow to header on scroll
      if (header) {
        if (scrollY > 10) {
          header.style.boxShadow = 'var(--shadow-level-1)';
        } else {
          header.style.boxShadow = 'none';
        }
      }

      // Show/hide back to top button
      if (backToTopButton) {
        if (scrollY > 500) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
      }
    }, 100)
  );

  // Back to top button click
  if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * Form Submission Handlers
 */
function initForms() {
  // Login Form
  const loginForm = document.querySelector('[data-login-form]');
  if (loginForm) {
    const validator = new FormValidator(loginForm);
    validator.addRule('email', {
      required: true,
      email: true,
      requiredMessage: 'Email is required',
      emailMessage: 'Please enter a valid email address',
    });
    validator.addRule('password', {
      required: true,
      minLength: 6,
      requiredMessage: 'Password is required',
      minLengthMessage: 'Password must be at least 6 characters',
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (validator.validate()) {
        // Submit form
        handleLogin(new FormData(loginForm));
      } else {
        validator.showErrors();
      }
    });
  }

  // Registration Form
  const registerForm = document.querySelector('[data-register-form]');
  if (registerForm) {
    const validator = new FormValidator(registerForm);
    validator.addRule('name', {
      required: true,
      requiredMessage: 'Name is required',
    });
    validator.addRule('email', {
      required: true,
      email: true,
    });
    validator.addRule('phone', {
      required: true,
      phone: true,
    });
    validator.addRule('password', {
      required: true,
      minLength: 8,
    });

    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (validator.validate()) {
        handleRegistration(new FormData(registerForm));
      } else {
        validator.showErrors();
      }
    });
  }

  // Bid Form
  const bidForm = document.querySelector('[data-bid-form]');
  if (bidForm) {
    bidForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleBidSubmission(new FormData(bidForm));
    });
  }
}

/**
 * Handle Login (placeholder - integrate with backend)
 */
async function handleLogin(formData) {
  try {
    // Simulate API call
    Utils.showToast('Logging in...', 'info');

    // TODO: Replace with actual API call
    // const response = await fetch('/api/login', {
    //   method: 'POST',
    //   body: formData
    // });

    // Simulate success
    setTimeout(() => {
      AppState.user = {
        id: 1,
        email: formData.get('email'),
        name: 'User Name',
      };

      Utils.showToast('Login successful!', 'success');

      // Close modal
      const loginModal = new Modal('login-modal');
      loginModal.close();

      // Update UI
      updateUserUI();
    }, 1000);
  } catch (error) {
    Utils.showToast('Login failed. Please try again.', 'error');
  }
}

/**
 * Handle Registration (placeholder)
 */
async function handleRegistration(formData) {
  try {
    Utils.showToast('Creating account...', 'info');

    // TODO: Replace with actual API call
    setTimeout(() => {
      Utils.showToast('Account created successfully!', 'success');

      const registerModal = new Modal('register-modal');
      registerModal.close();
    }, 1000);
  } catch (error) {
    Utils.showToast('Registration failed. Please try again.', 'error');
  }
}

/**
 * Handle Bid Submission (placeholder)
 */
async function handleBidSubmission(formData) {
  try {
    Utils.showToast('Placing bid...', 'info');

    // TODO: Replace with actual API call
    setTimeout(() => {
      Utils.showToast('Bid placed successfully!', 'success');

      const bidModal = new Modal('bid-modal');
      bidModal.close();

      // Update card UI with new bid
    }, 1000);
  } catch (error) {
    Utils.showToast('Failed to place bid. Please try again.', 'error');
  }
}

/**
 * Update UI based on user login state
 */
function updateUserUI() {
  const userMenus = document.querySelectorAll('[data-user-menu]');
  const guestMenus = document.querySelectorAll('[data-guest-menu]');

  if (AppState.user) {
    userMenus.forEach((menu) => (menu.style.display = ''));
    guestMenus.forEach((menu) => (menu.style.display = 'none'));
  } else {
    userMenus.forEach((menu) => (menu.style.display = 'none'));
    guestMenus.forEach((menu) => (menu.style.display = ''));
  }
}

// Initialize forms if present
initForms();