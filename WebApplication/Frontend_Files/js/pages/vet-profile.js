document.addEventListener('DOMContentLoaded', () => {
  initBooking();
  initFavorite();
  initInquiry();
  initServiceCards();
});

function initBooking() {
  const btn = document.getElementById('book-visit-btn');
  btn?.addEventListener('click', () => {
    btn.disabled = true;
    const original = btn.innerHTML;
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
  let saved = Utils.storage.get('saved_vets')?.includes('ahmed-ali') || false;
  updateFavUI(btn, saved);

  btn?.addEventListener('click', () => {
    saved = !saved;
    let savedVets = Utils.storage.get('saved_vets') || [];
    if (saved) {
      if (!savedVets.includes('ahmed-ali')) savedVets.push('ahmed-ali');
      Utils.showToast('Veterinarian saved to favorites', 'success');
    } else {
      savedVets = savedVets.filter(id => id !== 'ahmed-ali');
      Utils.showToast('Removed from favorites', 'info');
    }
    Utils.storage.set('saved_vets', savedVets);
    updateFavUI(btn, saved);
  });
}

function updateFavUI(btn, saved) {
  if (!btn) return;
  if (saved) {
    btn.innerHTML = '<span class="material-symbols-outlined">favorite</span> Saved to Favorites';
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-secondary');
  } else {
    btn.innerHTML = '<span class="material-symbols-outlined">favorite_border</span> Save Veterinarian';
    btn.classList.add('btn-outline');
    btn.classList.remove('btn-secondary');
  }
}

function initInquiry() {
  const btn = document.getElementById('inquiry-btn');
  btn?.addEventListener('click', () => {
    Utils.showToast('Direct inquiry feature coming soon', 'info');
  });
}

function initServiceCards() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3')?.textContent;
      Utils.showToast(`${title} - Details coming soon`, 'info');
    });
    card.style.cursor = 'pointer';
  });
}