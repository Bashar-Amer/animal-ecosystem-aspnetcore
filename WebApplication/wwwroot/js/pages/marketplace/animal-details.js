(function () {
    'use strict';
    const state = { animalId: window.listingId || 'unknown', idx: 0, images: window.listingImages || [] };

    const init = () => { initGallery(); initContact(); initFav(); };

    const initGallery = () => {
        const img = document.getElementById('mainImage');
        const thumbs = document.querySelectorAll('[data-gallery-thumb]');
        if (!img || !thumbs.length) return;
        thumbs.forEach((t, i) => t.addEventListener('click', () => switchImg(i)));
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') switchImg((state.idx - 1 + state.images.length) % state.images.length);
            if (e.key === 'ArrowRight') switchImg((state.idx + 1) % state.images.length);
        });
    };

    const switchImg = (i) => {
        if (i < 0 || i >= state.images.length) return;
        const img = document.getElementById('mainImage');
        if (img) { img.src = state.images[i]; img.alt = `Animal - view ${i + 1}`; }
        document.querySelectorAll('[data-gallery-thumb]').forEach((t, idx) => t.classList.toggle('active', idx === i));
        state.idx = i;
    };

    const initContact = () => {
        document.querySelectorAll('[data-contact-seller]').forEach(b => b.addEventListener('click', e => {
            e.preventDefault();
            copySellerPhone(b);
        }));
    };

    const copySellerPhone = async (button) => {
        const phone = button.dataset.sellerPhone?.trim();
        if (!phone) {
            Utils.showToast('The seller has not provided a phone number.', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(phone);
            const label = button.querySelector('[data-contact-label]');
            if (label) label.textContent = phone;
            Utils.showToast(`Seller phone number ${phone} copied`, 'success');
        } catch {
            Utils.showToast('Unable to copy the seller phone number. Please copy it manually.', 'error');
        }
    };

    const csrfToken = () => document.querySelector('input[name="__RequestVerificationToken"]')?.value;

    const initFav = () => {
        const buttons = document.querySelectorAll('[data-favorite]');
        if (!buttons.length) return;

        // Reflect current server-side status for each favorite button on load
        buttons.forEach(btn => {
            const id = btn.dataset.animalId || state.animalId;
            fetch(`/api/favorite/status/${id}`)
                .then(r => r.json())
                .then(d => updateFavBtn(btn, d.isFavorited))
                .catch(() => { });
        });

        buttons.forEach(b => b.addEventListener('click', () => toggleFav(b.dataset.animalId || state.animalId, b)));
    };

    const toggleFav = async (id, btn) => {
        try {
            const res = await fetch(`/api/favorite/toggle/${id}`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': csrfToken() }
            });

            if (res.status === 401) {
                Utils.showToast('Please sign in to save this animal', 'warning');
                setTimeout(() => window.location.href = `/Account/Login?returnUrl=${encodeURIComponent(window.location.pathname)}`, 1500);
                return;
            }

            if (!res.ok) {
                Utils.showToast('Something went wrong. Please try again.', 'error');
                return;
            }

            const d = await res.json();
            updateFavBtn(btn, d.isFavorited);
            Utils.showToast(d.isFavorited ? 'Added to watchlist' : 'Removed from watchlist', d.isFavorited ? 'success' : 'info');
        } catch {
            Utils.showToast('Something went wrong. Please try again.', 'error');
        }
    };

    const updateFavBtn = (btn, isFav) => {
        btn.classList.toggle('favorited', isFav);
        const svg = btn.querySelector('svg');
        if (svg) svg.style.fill = isFav ? 'currentColor' : 'none';
        const txt = [...btn.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
        if (txt) txt.textContent = isFav ? ' Saved' : ' Save Animal';
    };

    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();