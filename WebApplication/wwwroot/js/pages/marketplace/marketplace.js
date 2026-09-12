document.addEventListener('DOMContentLoaded', () => {
  initFilterToggle();
  initFilters();
  initSearch();
  initSort();
  initFavorites();
  initContact();
});

const marketState = {
  breed: 'all',
  gender: 'all',
  age: 'all',
  verified: 'all',
  search: '',
  sort: 'newest'
};

function initFilterToggle() {
  const toggleBtn = document.getElementById('filter-toggle-btn');
  const panel = document.getElementById('filter-panel');
  const applyBtn = document.getElementById('apply-filters-btn');
  const clearBtn = document.getElementById('clear-filters-btn');
  const resetBtn = document.getElementById('reset-filters-btn');

  toggleBtn?.addEventListener('click', () => {
    panel.classList.toggle('active');
  });

  applyBtn?.addEventListener('click', () => {
    panel.classList.remove('active');
    applyFilters();
  });

  const clearAll = () => {
    marketState.breed = 'all';
    marketState.gender = 'all';
    marketState.age = 'all';
    marketState.verified = 'all';
    marketState.search = '';
    
    document.querySelectorAll('.filter-pill').forEach(pill => {
      const group = pill.closest('[data-filter-group]').dataset.filterGroup;
      if (pill.dataset.value === 'all') pill.classList.add('active');
      else pill.classList.remove('active');
    });

    const searchInput = document.getElementById('market-search');
    if (searchInput) searchInput.value = '';
    
    applyFilters();
  };

  clearBtn?.addEventListener('click', clearAll);
  resetBtn?.addEventListener('click', clearAll);
}

function initFilters() {
  const groups = document.querySelectorAll('[data-filter-group]');
  
  groups.forEach(group => {
    const filterType = group.dataset.filterGroup;
    const pills = group.querySelectorAll('.filter-pill');
    
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        marketState[filterType] = pill.dataset.value;
        
        // Auto apply if panel not visible, otherwise wait for Apply button
        const panel = document.getElementById('filter-panel');
        if (!panel.classList.contains('active')) {
          applyFilters();
        }
      });
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById('market-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', Utils.debounce((e) => {
    marketState.search = e.target.value.toLowerCase().trim();
    applyFilters();
  }, 300));
}

function initSort() {
  const sortSelect = document.getElementById('sort-select');
  sortSelect?.addEventListener('change', (e) => {
    marketState.sort = e.target.value;
    sortCards();
  });
}

function applyFilters() {
  const cards = document.querySelectorAll('.market-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const breed = card.dataset.breed;
    const gender = card.dataset.gender;
    const age = card.dataset.age;
    const verified = card.dataset.verified;
    const text = card.textContent.toLowerCase();

    let show = true;

    if (marketState.breed !== 'all' && breed !== marketState.breed) show = false;
    if (marketState.gender !== 'all' && gender !== marketState.gender) show = false;
    if (marketState.age !== 'all' && age !== marketState.age) show = false;
    
    if (marketState.verified !== 'all') {
      if (marketState.verified === 'verified' && !verified.includes('verified')) show = false;
      if (marketState.verified === 'vet-checked' && !verified.includes('vet-checked')) show = false;
    }

    if (marketState.search && !text.includes(marketState.search)) show = false;

    card.style.display = show ? '' : 'none';
    if (show) visibleCount++;
  });

  document.getElementById('results-count').textContent = visibleCount;

  const emptyState = document.getElementById('empty-state');
  const grid = document.getElementById('market-grid');
  if (visibleCount === 0) {
    emptyState.style.display = 'flex';
    grid.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    grid.style.display = 'grid';
  }
}

function sortCards() {
  const grid = document.getElementById('market-grid');
  const cards = Array.from(grid.querySelectorAll('.market-card'));

  cards.sort((a,b) => {
    const priceA = parseInt(a.dataset.price);
    const priceB = parseInt(b.dataset.price);

    switch(marketState.sort) {
      case 'price-low': return priceA - priceB;
      case 'price-high': return priceB - priceA;
      case 'newest':
      default: return 0; // keep original order
    }
  });

  cards.forEach(card => grid.appendChild(card));
}

function initFavorites() {
  const favButtons = document.querySelectorAll('.fav-btn');
  if (favButtons.length === 0) return;

  const csrfToken = document.querySelector('input[name="__RequestVerificationToken"]')?.value;

  const updateButtonUI = (button, isFavorited) => {
    button.classList.toggle('active', isFavorited);
    const icon = button.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.textContent = isFavorited ? 'favorite' : 'favorite_border';
    }
  };

  favButtons.forEach(button => {
    const animalId = button.dataset.favId;
    if (!animalId) return;

    fetch(`/api/favorite/status/${encodeURIComponent(animalId)}`)
      .then(response => response.json())
      .then(data => updateButtonUI(button, data.isFavorited))
      .catch(() => { });

    button.addEventListener('click', async event => {
      event.preventDefault();
      event.stopPropagation();

      try {
        const response = await fetch(`/api/favorite/toggle/${encodeURIComponent(animalId)}`, {
          method: 'POST',
          headers: { 'X-CSRF-TOKEN': csrfToken || '' }
        });

        if (response.status === 401) {
          Utils.showToast('Please sign in to save this animal', 'warning');
          setTimeout(() => {
            window.location.href = `/Account/Login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
          }, 1500);
          return;
        }

        if (!response.ok) {
          Utils.showToast('Something went wrong. Please try again.', 'error');
          return;
        }

        const data = await response.json();
        updateButtonUI(button, data.isFavorited);
        Utils.showToast(
          data.isFavorited ? 'Added to watchlist' : 'Removed from watchlist',
          data.isFavorited ? 'success' : 'info'
        );
      } catch {
        Utils.showToast('Something went wrong. Please try again.', 'error');
      }
    });
  });
}

function initContact() {
  const contactButtons = document.querySelectorAll('[data-contact-id]');
  
  contactButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.market-card');
      const title = card.querySelector('h3').textContent;
      Utils.showToast(`Contact request sent for ${title}. Seller will respond shortly.`, 'success');
    });
  });
}