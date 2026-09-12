document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initSearch();
    initSort();
    initEmergency();
});

const vetState = { specialty: 'all', city: 'all', availability: 'all', species: 'all', search: '' };

function initFilters() {
    document.querySelectorAll('[data-filter-group]').forEach(group => {
        const filterType = group.dataset.filterGroup;
        const pills = group.querySelectorAll('.filter-pill');

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
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
    searchInput?.addEventListener('keydown', e => e.key === 'Enter' && handleSearch());
}

function initSort() {
    document.getElementById('vet-sort')?.addEventListener('change', e => sortVets(e.target.value));
}

function applyFilters() {
    let visible = 0;
    document.querySelectorAll('.vet-dir-card').forEach(card => {
        const { specialty, city, availability, breed } = card.dataset;
        const text = card.textContent.toLowerCase();

        let show = (vetState.specialty === 'all' || specialty.includes(vetState.specialty)) &&
            (vetState.city === 'all' || city === vetState.city) &&
            (vetState.availability === 'all' || availability === vetState.availability) &&
            (vetState.species === 'all' || breed.includes(vetState.species)) &&
            (!vetState.search || text.includes(vetState.search));

        card.style.display = show ? '' : 'none';
        if (show) visible++;
    });

    const countEl = document.getElementById('vet-count');
    if (countEl) countEl.textContent = visible;
}

function sortVets(criteria) {
    const grid = document.getElementById('vet-grid');
    Array.from(grid.querySelectorAll('.vet-dir-card')).sort((a, b) => {
        if (criteria === 'rating-high') return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        if (criteria === 'reviews-high') return parseInt(b.dataset.reviews) - parseInt(a.dataset.reviews);
        if (criteria === 'experience-high') return parseInt(b.dataset.experience) - parseInt(a.dataset.experience);
        if (criteria === 'price-low') return parseInt(a.dataset.price) - parseInt(b.dataset.price);
        return 0;
    }).forEach(card => grid.appendChild(card));
}

function initEmergency() {
    document.getElementById('tele-triage-btn')?.addEventListener('click', () => {
        Utils.showToast('Connecting to tele-triage service...', 'info');
        setTimeout(() => Utils.showToast('Tele-triage feature coming soon', 'info'), 1000);
    });
}