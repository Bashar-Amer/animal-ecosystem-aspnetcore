/**
 * Animal Details Page
 * Uses existing Utils and Components from your codebase
 */

(function() {
  'use strict';

  // Page-specific state
  const pageState = {
    animalId: 'animal-001',
    currentImageIndex: 0,
    images: []
  };

  /**
   * Initialize Page
   */
  function init() {
    initGallery();
    initContactButton();
    initFavoriteButton();
    loadFavoriteState();
  }

  /**
   * Initialize Image Gallery
   */
  function initGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('[data-gallery-thumb]');

    if (!mainImage || thumbnails.length === 0) return;

    // Store image sources from thumbnails
    pageState.images = Array.from(thumbnails).map(thumb => {
      const img = thumb.querySelector('img');
      return img ? img.dataset.lazy || img.src : null;
    }).filter(Boolean);

    // Thumbnail click handlers
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        switchImage(index);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        previousImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    });
  }

  /**
   * Switch to specific image
   */
  function switchImage(index) {
    if (index < 0 || index >= pageState.images.length) return;

    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('[data-gallery-thumb]');

    // Update main image
    if (mainImage) {
      mainImage.src = pageState.images[index];
      mainImage.alt = `Awassi Ram - view ${index + 1}`;
    }

    // Update thumbnail active state
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });

    pageState.currentImageIndex = index;
  }

  /**
   * Navigate to previous image
   */
  function previousImage() {
    const newIndex = pageState.currentImageIndex === 0 
      ? pageState.images.length - 1 
      : pageState.currentImageIndex - 1;
    switchImage(newIndex);
  }

  /**
   * Navigate to next image
   */
  function nextImage() {
    const newIndex = (pageState.currentImageIndex + 1) % pageState.images.length;
    switchImage(newIndex);
  }

  /**
   * Initialize Contact Seller Button
   */
  function initContactButton() {
    const contactButtons = document.querySelectorAll('[data-contact-seller]');
    
    contactButtons.forEach(button => {
      button.addEventListener('click', handleContactSeller);
    });

    // Handle contact form submission
    const contactForm = document.querySelector('[data-contact-form]');
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactFormSubmit);
    }
  }

  /**
   * Handle Contact Seller Click
   */
  function handleContactSeller(e) {
    e.preventDefault();
    
    // Check if user is logged in (from your main.js AppState)
    if (!AppState.user) {
      Utils.showToast('Please sign in to contact the seller', 'warning');
      
      // Open login modal (if you have one)
      const loginModal = new Modal('login-modal');
      if (loginModal.modal) {
        loginModal.open();
      } else {
        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/signin?redirect=' + encodeURIComponent(window.location.pathname);
        }, 1500);
      }
      return;
    }

    // Open contact modal
    const contactModal = new Modal('contact-modal');
    if (contactModal.modal) {
      contactModal.open();
    }
  }

  /**
   * Handle Contact Form Submission
   */
  function handleContactFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Simple validation
    const message = formData.get('message');
    const phone = formData.get('phone');

    if (!message || message.trim().length < 10) {
      Utils.showToast('Please enter a detailed message (at least 10 characters)', 'warning');
      return;
    }

    if (!Utils.isValidPhone(phone)) {
      Utils.showToast('Please enter a valid phone number', 'warning');
      return;
    }

    // Show loading state
    Utils.showToast('Sending message...', 'info');

    // Simulate API call (replace with actual implementation)
    setTimeout(() => {
      Utils.showToast('Message sent successfully! The seller will contact you soon.', 'success');
      
      // Close modal
      const contactModal = new Modal('contact-modal');
      contactModal.close();
      
      // Reset form
      form.reset();
    }, 1500);
  }

  /**
   * Initialize Favorite Button
   */
  function initFavoriteButton() {
    const favoriteButtons = document.querySelectorAll('[data-favorite]');
    
    favoriteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const animalId = button.dataset.animalId || pageState.animalId;
        toggleFavorite(animalId, button);
      });
    });
  }

  /**
   * Load Favorite State from Storage
   */
  function loadFavoriteState() {
    const favorites = Utils.storage.get('favorites') || [];
    
    // Update main favorite button
    const mainFavoriteBtn = document.querySelector(`[data-favorite][data-animal-id="${pageState.animalId}"]`);
    if (mainFavoriteBtn && favorites.includes(pageState.animalId)) {
      updateFavoriteButton(mainFavoriteBtn, true);
    }

    // Update all favorite buttons on page
    document.querySelectorAll('[data-favorite]').forEach(btn => {
      const animalId = btn.dataset.animalId;
      if (favorites.includes(animalId)) {
        updateFavoriteButton(btn, true);
      }
    });
  }

  /**
   * Toggle Favorite (using your Utils.storage)
   */
  function toggleFavorite(animalId, button) {
    let favorites = Utils.storage.get('favorites') || [];
    const isFavorited = favorites.includes(animalId);
    
    if (isFavorited) {
      // Remove from favorites
      favorites = favorites.filter(id => id !== animalId);
      Utils.showToast('Removed from favorites', 'info');
      updateFavoriteButton(button, false);
    } else {
      // Add to favorites
      favorites.push(animalId);
      Utils.showToast('Added to favorites', 'success');
      updateFavoriteButton(button, true);
    }

    // Save to storage
    Utils.storage.set('favorites', favorites);
  }

  /**
   * Update Favorite Button Appearance
   */
  function updateFavoriteButton(button, isFavorited) {
    if (isFavorited) {
      button.classList.add('favorited');
      
      // Update text if it's a text button
      const textSpan = button.querySelector('span:not(.icon)');
      if (textSpan) {
        textSpan.textContent = 'Saved';
      }
      
      // Fill heart icon if needed
      const svg = button.querySelector('svg');
      if (svg) {
        svg.style.fill = 'currentColor';
      }
    } else {
      button.classList.remove('favorited');
      
      const textSpan = button.querySelector('span:not(.icon)');
      if (textSpan) {
        textSpan.textContent = 'Save Animal';
      }
      
      const svg = button.querySelector('svg');
      if (svg) {
        svg.style.fill = 'none';
      }
    }
  }

  /**
   * Initialize on DOM ready
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();