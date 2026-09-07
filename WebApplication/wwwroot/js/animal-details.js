// wwwroot/js/animal-details.js

(function () {
    'use strict';

    const pageState = {
        // ── Images now come from C# via window.listingImages ──
        // In the original: scraped from data-lazy attributes
        // Now: injected by the Razor script block — cleaner & no DOM scraping
        animalId: window.listingId || 'unknown',
        currentImageIndex: 0,
        images: window.listingImages || []
    };

    function init() {
        initGallery();
        initContactButton();
        initFavoriteButton();
        loadFavoriteState();
    }

    function initGallery() {
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('[data-gallery-thumb]');

        if (!mainImage || thumbnails.length === 0) return;

        // ── No longer need to scrape data-lazy ──
        // pageState.images already set from window.listingImages above

        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => switchImage(index));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') previousImage();
            if (e.key === 'ArrowRight') nextImage();
        });
    }

    function switchImage(index) {
        if (index < 0 || index >= pageState.images.length) return;

        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('[data-gallery-thumb]');

        if (mainImage) {
            mainImage.src = pageState.images[index];
            mainImage.alt = `Animal - view ${index + 1}`;
        }

        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        pageState.currentImageIndex = index;
    }

    function previousImage() {
        const newIndex = pageState.currentImageIndex === 0
            ? pageState.images.length - 1
            : pageState.currentImageIndex - 1;
        switchImage(newIndex);
    }

    function nextImage() {
        const newIndex = (pageState.currentImageIndex + 1) % pageState.images.length;
        switchImage(newIndex);
    }

    // ── Contact, Favorite, loadFavoriteState, toggleFavorite,
    //    updateFavoriteButton, handleContactFormSubmit
    //    are IDENTICAL to your original — no changes needed ──
    function initContactButton() {
        document.querySelectorAll('[data-contact-seller]').forEach(btn => {
            btn.addEventListener('click', handleContactSeller);
        });

        const contactForm = document.querySelector('[data-contact-form]');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactFormSubmit);
        }
    }

    function handleContactSeller(e) {
        e.preventDefault();

        if (!AppState.user) {
            Utils.showToast('Please sign in to contact the seller', 'warning');
            setTimeout(() => {
                window.location.href = '/Account/Login?redirect='
                    + encodeURIComponent(window.location.pathname);
            }, 1500);
            return;
        }

        const contactModal = new Modal('contact-modal');
        if (contactModal.modal) contactModal.open();
    }

    function handleContactFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
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

        Utils.showToast('Sending message...', 'info');

        // TODO: replace with real fetch('/Marketplace/Contact', { method:'POST', body: formData })
        setTimeout(() => {
            Utils.showToast('Message sent! The seller will contact you soon.', 'success');
            new Modal('contact-modal').close();
            form.reset();
        }, 1500);
    }

    function initFavoriteButton() {
        document.querySelectorAll('[data-favorite]').forEach(btn => {
            btn.addEventListener('click', () => {
                const animalId = btn.dataset.animalId || pageState.animalId;
                toggleFavorite(animalId, btn);
            });
        });
    }

    function loadFavoriteState() {
        const favorites = Utils.storage.get('favorites') || [];
        document.querySelectorAll('[data-favorite]').forEach(btn => {
            if (favorites.includes(btn.dataset.animalId)) {
                updateFavoriteButton(btn, true);
            }
        });
    }

    function toggleFavorite(animalId, button) {
        let favorites = Utils.storage.get('favorites') || [];
        const isFav = favorites.includes(animalId);

        if (isFav) {
            favorites = favorites.filter(id => id !== animalId);
            Utils.showToast('Removed from favorites', 'info');
            updateFavoriteButton(button, false);
        } else {
            favorites.push(animalId);
            Utils.showToast('Added to favorites', 'success');
            updateFavoriteButton(button, true);
        }

        Utils.storage.set('favorites', favorites);
    }

    function updateFavoriteButton(button, isFavorited) {
        button.classList.toggle('favorited', isFavorited);

        const svg = button.querySelector('svg');
        if (svg) svg.style.fill = isFavorited ? 'currentColor' : 'none';

        const textNode = [...button.childNodes]
            .find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
        if (textNode) {
            textNode.textContent = isFavorited ? ' Saved' : ' Save Animal';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();