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
    btn?.addEventListener('click', () => {
        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Requesting...';
        setTimeout(() => {
            Utils.showToast('Visit request sent! You will be contacted within 2 hours.', 'success');
            btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Request Sent';
            btn.classList.add('btn-disabled');
        }, 1000);
    });
}

function initFavorite() {
    const btn = document.getElementById('save-vet-btn');
    const slug = getVetSlug();
    let saved = Utils.storage.get('saved_vets')?.includes(slug) || false;
    updateFavUI(btn, saved);

    btn?.addEventListener('click', () => {
        saved = !saved;
        let savedVets = Utils.storage.get('saved_vets') || [];
        savedVets = saved ? [...new Set([...savedVets, slug])] : savedVets.filter(id => id !== slug);
        Utils.storage.set('saved_vets', savedVets);
        Utils.showToast(saved ? 'Veterinarian saved to favorites' : 'Removed from favorites', saved ? 'success' : 'info');
        updateFavUI(btn, saved);
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