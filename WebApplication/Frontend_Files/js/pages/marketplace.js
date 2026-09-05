document.addEventListener('DOMContentLoaded', () => {
  initFilterToggle();
  initFilters();
  initSearch();
  initSort();
  initFavorites();
  initContact();
});

const marketState = {
  species: 'all',
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
    marketState.species = 'all';
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
    const species = card.dataset.species;
    const gender = card.dataset.gender;
    const age = card.dataset.age;
    const verified = card.dataset.verified;
    const text = card.textContent.toLowerCase();

    let show = true;

    if (marketState.species !== 'all' && species !== marketState.species) show = false;
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
  const savedFavs = Utils.storage.get('market_favorites') || [];

  favButtons.forEach(btn => {
    const id = btn.dataset.favId;
    if (savedFavs.includes(id)) {
      btn.classList.add('active');
      btn.querySelector('.material-symbols-outlined').textContent = 'favorite';
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const icon = btn.querySelector('.material-symbols-outlined');
      const isActive = btn.classList.contains('active');

      let favs = Utils.storage.get('market_favorites') || [];

      if (isActive) {
        btn.classList.remove('active');
        icon.textContent = 'favorite_border';
        favs = favs.filter(f => f !== id);
        Utils.showToast('Removed from favorites', 'info');
      } else {
        btn.classList.add('active');
        icon.textContent = 'favorite';
        if (!favs.includes(id)) favs.push(id);
        Utils.showToast('Added to favorites', 'success');
      }
      Utils.storage.set('market_favorites', favs);
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