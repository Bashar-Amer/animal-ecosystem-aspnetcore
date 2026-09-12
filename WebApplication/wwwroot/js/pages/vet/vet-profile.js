document.addEventListener('DOMContentLoaded', () => {
    initBooking();
    initFavorite();
    initInquiry();
    initServiceCards();
});

function getVetSlug() {
    return document.querySelector('.booking-card')?.dataset.vetSlug || '';
}

function initBooking() {
    const btn = document.getElementById('book-visit-btn');
    btn?.addEventListener('click', async event => {
        event.preventDefault();

        const phone = btn.dataset.vetPhone?.trim();
        if (!phone) {
            Utils.showToast('This veterinarian has not provided a phone number.', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(phone);
            const label = btn.querySelector('[data-contact-vet-label]');
            if (label) label.textContent = phone;
            Utils.showToast(`Veterinarian phone number ${phone} copied`, 'success');
        } catch {
            Utils.showToast('Unable to copy the veterinarian phone number. Please copy it manually.', 'error');
        }
    });
}

function initFavorite() {
    const btn = document.getElementById('save-vet-btn');
    const slug = getVetSlug();
    if (!btn || !slug) return;

    fetch(`/api/vet-favorite/status/${encodeURIComponent(slug)}`)
        .then(response => response.ok ? response.json() : Promise.reject())
        .then(data => updateFavUI(btn, data.isFavorited))
        .catch(() => { });

    btn.addEventListener('click', async () => {
        try {
            const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value || '';
            const response = await fetch(`/api/vet-favorite/toggle/${encodeURIComponent(slug)}`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': token }
            });

            if (response.status === 401) {
                Utils.showToast('Please sign in to save veterinarians', 'warning');
                setTimeout(() => {
                    window.location.href = `/Account/Login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
                }, 1500);
                return;
            }

            if (!response.ok) {
                Utils.showToast('Unable to update saved veterinarians. Please try again.', 'error');
                return;
            }

            const data = await response.json();
            updateFavUI(btn, data.isFavorited);
            Utils.showToast(
                data.isFavorited ? 'Veterinarian saved to favorites' : 'Removed from favorites',
                data.isFavorited ? 'success' : 'info');
        } catch {
            Utils.showToast('Unable to update saved veterinarians. Please try again.', 'error');
        }
    });
}

function updateFavUI(btn, saved) {
    if (!btn) return;
    btn.innerHTML = `<span class="material-symbols-outlined">${saved ? 'favorite' : 'favorite_border'}</span> ${saved ? 'Saved to Favorites' : 'Save Veterinarian'}`;
    btn.classList.toggle('btn-outline', !saved);
    btn.classList.toggle('btn-secondary', saved);
}

function initInquiry() {
    document.getElementById('inquiry-btn')?.addEventListener('click', () => Utils.showToast('Direct inquiry feature coming soon', 'info'));
}

function initServiceCards() {
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => Utils.showToast(`${card.querySelector('h3')?.textContent} - Details coming soon`, 'info'));
    });
}