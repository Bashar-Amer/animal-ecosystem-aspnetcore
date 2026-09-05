document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initSearch();
  initSort();
  initEmergency();
});

const vetState = {
  specialty: 'all',
  region: 'all',
  availability: 'all',
  species: 'all',
  search: ''
};

function initFilters() {
  const groups = document.querySelectorAll('[data-filter-group]');
  
  groups.forEach(group => {
    const filterType = group.dataset.filterGroup;
    const pills = group.querySelectorAll('.filter-pill');
    
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        // Update active
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        vetState[filterType] = pill.dataset.value;
        applyFilters();
      });
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById('vet-search');
  const searchBtn = document.getElementById('vet-search-btn');
  
  const handleSearch = () => {
    vetState.search = searchInput.value.toLowerCase().trim();
    applyFilters();
  };
  
  searchInput?.addEventListener('input', Utils.debounce(handleSearch, 300));
  searchBtn?.addEventListener('click', handleSearch);
  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
}

function initSort() {
  const sortSelect = document.getElementById('vet-sort');
  sortSelect?.addEventListener('change', () => {
    sortVets(sortSelect.value);
  });
}

function applyFilters() {
  const cards = document.querySelectorAll('.vet-dir-card');
  let visible = 0;
  
  cards.forEach(card => {
    const specialties = card.dataset.specialty;
    const region = card.dataset.region;
    const availability = card.dataset.availability;
    const species = card.dataset.species;
    const text = card.textContent.toLowerCase();
    
    let show = true;
    
    if (vetState.specialty !== 'all' && !specialties.includes(vetState.specialty)) show = false;
    if (vetState.region !== 'all' && region !== vetState.region) show = false;
    if (vetState.availability !== 'all' && availability !== vetState.availability) show = false;
    if (vetState.species !== 'all' && !species.includes(vetState.species)) show = false;
    if (vetState.search && !text.includes(vetState.search)) show = false;
    
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  
  const countEl = document.getElementById('vet-count');
  if (countEl) countEl.textContent = visible;
}

function sortVets(criteria) {
  const grid = document.getElementById('vet-grid');
  const cards = Array.from(grid.querySelectorAll('.vet-dir-card'));
  
  cards.sort((a,b) => {
    switch(criteria) {
      case 'rating-high':
        return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
      case 'reviews-high':
        return parseInt(b.dataset.reviews) - parseInt(a.dataset.reviews);
      case 'experience-high':
        return parseInt(b.dataset.experience) - parseInt(a.dataset.experience);
      case 'price-low':
        return parseInt(a.dataset.price) - parseInt(b.dataset.price);
      default:
        return 0;
    }
  });
  
  cards.forEach(card => grid.appendChild(card));
}

function initEmergency() {
  const teleBtn = document.getElementById('tele-triage-btn');
  teleBtn?.addEventListener('click', () => {
    Utils.showToast('Connecting to tele-triage service...', 'info');
    setTimeout(() => {
      Utils.showToast('Tele-triage feature coming soon', 'info');
    }, 1000);
  });
}