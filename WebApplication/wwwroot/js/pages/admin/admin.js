document.addEventListener('DOMContentLoaded', () => {
    initAdminMobileMenu();
    initAdminButtonInteractions();
    initAdminSearch();
    initAdminNotificationBell();
});

function initAdminMobileMenu() {
    const btn = document.getElementById('admin-mobile-menu-btn'),
        drawer = document.getElementById('admin-mobile-drawer'),
        icon = document.getElementById('admin-mobile-menu-icon');
    if (btn && drawer) {
        btn.addEventListener('click', () => {
            const isHidden = drawer.classList.toggle('hidden');
            btn.setAttribute('aria-expanded', !isHidden);
            if (icon) icon.textContent = isHidden ? 'menu' : 'close';
        });
    }
}

function initAdminButtonInteractions() {
    document.querySelectorAll('button:not([disabled])').forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.add('scale-[0.98]');
            setTimeout(() => this.classList.remove('scale-[0.98]'), 120);
        });
    });
}

function initAdminSearch() {
    const inputs = document.querySelectorAll('[data-admin-search]');
    if (!inputs.length) return;
    inputs.forEach(input => {
        input.addEventListener('input', Utils.debounce(e => {
            const term = e.target.value.toLowerCase().trim();
            document.querySelectorAll('.pending-listing-item, .auction-monitor-row, .vet-queue-item').forEach(item => {
                item.style.display = !term || item.textContent.toLowerCase().includes(term) ? '' : 'none';
            });
        }, 250));
    });
}

function initAdminNotificationBell() {
    const bell = document.querySelector('[data-admin-notifications]');
    if (bell && typeof Utils !== 'undefined' && Utils.showToast) {
        bell.addEventListener('click', () => Utils.showToast('Admin Notifications: Pending listings, live auctions, and vet audits are active.', 'info'));
    }
}