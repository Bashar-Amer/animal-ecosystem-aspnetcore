document.addEventListener('DOMContentLoaded', () => {
    initAuctionFilters();
    initWatchlistButtons();
    initViewToggle();
    initNotificationButtons();
});

function initAuctionFilters() {
    const filterTabs = document.querySelectorAll('.filter-tabs-auction .filter-tab');
    const filterSelects = document.querySelectorAll('.filter-select');
    const searchInput = document.querySelector('[data-search]');
    const auctionCards = document.querySelectorAll('.auction-card');
    const filters = { status: 'all', category: 'all', price: 'all', search: '' };

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.dataset.filter === tab.dataset.filter && t.classList.remove('active'));
            tab.classList.add('active');
            filters[tab.dataset.filter] = tab.dataset.value;
            applyFilters(filters, auctionCards);
        });
    });

    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            const type = select.dataset.filter || 'sort';
            type === 'sort' ? sortAuctions(select.value, auctionCards) : (filters[type] = select.value, applyFilters(filters, auctionCards));
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce(e => {
            filters.search = e.target.value.toLowerCase();
            applyFilters(filters, auctionCards);
        }, 300));
    }
}

function applyFilters(filters, cards) {
    let visibleCount = 0;
    cards.forEach(card => {
        const { status, category, price } = card.dataset;
        const title = card.querySelector('.auction-card-title').textContent.toLowerCase();
        const details = card.querySelector('.auction-details').textContent.toLowerCase();
        const numPrice = parseInt(price);
        let show = true;

        if (filters.status !== 'all' && status !== filters.status) show = false;
        if (filters.category !== 'all' && category !== filters.category) show = false;
        if (filters.price !== 'all') {
            if (filters.price === 'under-1000' && numPrice >= 1000) show = false;
            if (filters.price === '1000-5000' && (numPrice < 1000 || numPrice > 5000)) show = false;
            if (filters.price === '5000-10000' && (numPrice < 5000 || numPrice > 10000)) show = false;
            if (filters.price === 'over-10000' && numPrice < 10000) show = false;
        }
        if (filters.search && !title.includes(filters.search) && !details.includes(filters.search)) show = false;

        card.style.display = show ? '' : 'none';
        if (show) visibleCount++;
    });

    const resultsCount = document.querySelector('[data-results-count]');
    if (resultsCount) resultsCount.textContent = visibleCount;
}

function sortAuctions(sortBy, cards) {
    const grid = document.getElementById('auctions-grid');
    Array.from(cards).sort((a, b) => {
        if (sortBy === 'price-low') return parseInt(a.dataset.price) - parseInt(b.dataset.price);
        if (sortBy === 'price-high') return parseInt(b.dataset.price) - parseInt(a.dataset.price);
        return 0;
    }).forEach(card => grid.appendChild(card));
}

function initWatchlistButtons() {
    document.querySelectorAll('.watchlist-btn').forEach(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const id = button.dataset.auctionId;
            const active = button.classList.contains('active');

            button.classList.toggle('active', !active);
            const watchlist = Utils.storage.get('watchlist') || [];
            const updated = active ? watchlist.filter(item => item !== id) : [...watchlist, id];
            Utils.storage.set('watchlist', updated);
            Utils.showToast(active ? 'Removed from watchlist' : 'Added to watchlist', active ? 'info' : 'success');
        });
    });
}

function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-toggle-btn');
    const grid = document.getElementById('auctions-grid');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            grid.classList.toggle('auctions-list', button.dataset.view === 'list');
        });
    });
}

function initNotificationButtons() {
    document.querySelectorAll('[data-notify-auction]').forEach(button => {
        button.addEventListener('click', e => {
            e.preventDefault();
            Utils.showToast('You will be notified when this auction starts', 'success');
            button.innerHTML = `<span class="material-symbols-outlined">notifications_active</span>Notifications On`;
            button.className = 'btn btn-primary btn-block';
        });
    });
}