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
    const buttons = document.querySelectorAll('.watchlist-btn');
    if (buttons.length === 0) return;

    const csrfToken = document.querySelector('input[name="__RequestVerificationToken"]')?.value;

    function updateButtonUI(button, isWatchlisted) {
        button.classList.toggle('active', isWatchlisted);
        const icon = button.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = isWatchlisted ? 'favorite' : 'favorite_border';
        }
    }

    // On page load, check status for every card at once
    buttons.forEach(button => {
        const animalId = button.dataset.animalId;
        if (!animalId) return;

        fetch(`/api/favorite/status/${animalId}`)
            .then(res => res.json())
            .then(data => updateButtonUI(button, data.isFavorited))
            .catch(() => { });
    });

    buttons.forEach(button => {
        button.addEventListener('click', async e => {
            e.preventDefault();
            e.stopPropagation();

            const animalId = button.dataset.animalId;
            if (!animalId) return;

            try {
                const response = await fetch(`/api/favorite/toggle/${animalId}`, {
                    method: 'POST',
                    headers: { 'X-CSRF-TOKEN': csrfToken }
                });

                if (response.status === 401) {
                    const returnUrl = encodeURIComponent(window.location.pathname);
                    window.location.href = `/Account/Login?returnUrl=${returnUrl}`;
                    return;
                }

                if (!response.ok) {
                    Utils.showToast('Something went wrong. Please try again.', 'error');
                    return;
                }

                const data = await response.json();
                updateButtonUI(button, data.isFavorited);
                Utils.showToast(data.isFavorited ? 'Added to watchlist' : 'Removed from watchlist', data.isFavorited ? 'success' : 'info');
            } catch (err) {
                Utils.showToast('Something went wrong. Please try again.', 'error');
            }
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