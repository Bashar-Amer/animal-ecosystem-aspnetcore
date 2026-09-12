document.addEventListener('DOMContentLoaded', () => {
    ['Gallery', 'BidStepper', 'QuickBids', 'Countdown', 'BidPlacement', 'BidPolling', 'Watchlist', 'ShareSave'].forEach(fn => window[`init${fn}`]?.());
});

function initGallery() {
    const mainImg = document.getElementById('main-image');
    document.querySelectorAll('.thumbnail-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.type) return Utils.showToast('Preview coming soon', 'info');
            if (btn.dataset.image && mainImg) {
                mainImg.src = btn.dataset.image;
                document.querySelectorAll('.thumbnail-btn').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });
}

function initBidStepper() {
    const input = document.getElementById('bid-amount-input');
    const placeBidText = document.getElementById('place-bid-text');
    if (!input) return;

    const STEP = 25;

    function updateBidText() {
        if (placeBidText) placeBidText.textContent = `Place Bid of ${input.value} JOD`;
    }

    function setValue(val) {
        const min = parseInt(input.min) || 0;
        input.value = Math.max(parseInt(val) || min, min);
        updateBidText();
    }

    // Stepper buttons: snap to clean increments of STEP above the current value
    document.querySelector('[data-stepper="minus"]')?.addEventListener('click', () => {
        setValue(parseInt(input.value) - STEP);
    });
    document.querySelector('[data-stepper="plus"]')?.addEventListener('click', () => {
        setValue(parseInt(input.value) + STEP);
    });

    // Manual typing: just keep the text field's label in sync, don't rewrite what they're typing
    input.addEventListener('input', updateBidText);

    // Enforce the minimum only when they leave the field (not on every keystroke)
    input.addEventListener('blur', () => {
        const min = parseInt(input.min) || 0;
        if (parseInt(input.value) < min || isNaN(parseInt(input.value))) {
            setValue(min);
        }
    });

    updateBidText();
}

function initQuickBids() {
    const input = document.getElementById('bid-amount-input');
    const text = document.getElementById('place-bid-text');
    document.querySelectorAll('[data-quick-bid]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (input) {
                input.value = btn.dataset.quickBid;
                if (text) text.textContent = `Place Bid of ${input.value} JOD`;
            }
        });
    });
}

function initCountdown() {
    const el = document.querySelector('.countdown-grid');
    if (!el?.dataset.countdown) return;

    const [h, m, s] = ['[data-hours]', '[data-minutes]', '[data-seconds]'].map(sel => el.querySelector(sel));
    const update = () => {
        const rem = Utils.getTimeRemaining(el.dataset.countdown);
        if (rem.isExpired) return [h, m, s].forEach(node => node && (node.textContent = '00'));
        if (h) h.textContent = String(rem.hours + rem.days * 24).padStart(2, '0');
        if (m) m.textContent = String(rem.minutes).padStart(2, '0');
        if (s) s.textContent = String(rem.seconds).padStart(2, '0');
    };
    update();
    setInterval(update, 1000);
}

function initBidPlacement() {
    const btn = document.getElementById('place-bid-btn');
    const input = document.getElementById('bid-amount-input');
    const currentBid = document.getElementById('current-bid-display');
    const minLabel = document.getElementById('min-bid-label');
    const history = document.getElementById('bid-history');
    const count = document.getElementById('bid-count');
    if (!btn || !input) return;

    const auctionId = btn.dataset.auctionId;
    const token = document.querySelector('input[name="__RequestVerificationToken"]')?.value;
    const STEP = 25;

    function syncBidUI(newCurrentPrice, newMinNextBid, bidCount) {
        if (currentBid) currentBid.textContent = newCurrentPrice;
        if (minLabel) minLabel.textContent = `${newMinNextBid} JOD`;
        if (input) input.min = input.value = newMinNextBid;
        const text = document.getElementById('place-bid-text');
        if (text) text.textContent = `Place Bid of ${newMinNextBid} JOD`;
        if (count && bidCount != null) count.textContent = `${bidCount} Total Bids Placed`;
    }

    btn.addEventListener('click', async () => {
        const val = parseInt(input.value);
        const minReq = parseInt(currentBid.textContent) + STEP;
        if (val < minReq) return Utils.showToast(`Bid must be at least ${minReq} JOD`, 'error');

        btn.disabled = true;
        btn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Processing...';

        try {
            const res = await fetch(`/api/bid/place/${auctionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
                body: JSON.stringify({ amount: val })
            });

            if (res.status === 401) {
                window.location.href = `/Account/Login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
                return;
            }

            const data = await res.json();

            if (res.status === 400) {
                Utils.showToast(data.message || 'Unable to place bid.', 'error');
                if (data.minNextBid) syncBidUI(data.minNextBid - STEP, data.minNextBid, null);
                return;
            }

            if (res.status === 409) {
                Utils.showToast(data.message || "Someone just outbid you. Refresh and try again.", 'error');
                return;
            }

            if (!res.ok) {
                Utils.showToast('Something went wrong. Please try again.', 'error');
                return;
            }

            syncBidUI(data.currentPrice, data.minNextBid, data.bidCount);

            history.querySelector('.winning')?.classList.remove('winning');
            history.querySelector('.badge-ending')?.remove();
            history.insertAdjacentHTML('afterbegin', `
                <div class="bid-row winning">
                    <div class="bidder-info">
                        <div class="bidder-avatar winning">Y</div>
                        <div>
                            <div class="bidder-name"><span>You</span><span class="badge badge-ending badge-sm">Winning Bid</span></div>
                            <span class="bid-time">Just now</span>
                        </div>
                    </div>
                    <span class="bid-value headline-sm">${data.currentPrice} JOD</span>
                </div>
            `);

            Utils.showToast(`Bid of ${data.currentPrice} JOD placed successfully!`, 'success');
        } catch {
            Utils.showToast('Something went wrong. Please try again.', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<span class="material-symbols-outlined">gavel</span><span id="place-bid-text">Place Bid of ${input.value} JOD</span>`;
        }
    });
}

function initBidPolling() {
    const btn = document.getElementById('place-bid-btn');
    if (!btn?.dataset.auctionId) return;

    const auctionId = btn.dataset.auctionId;
    const currentBid = document.getElementById('current-bid-display');
    const minLabel = document.getElementById('min-bid-label');
    const count = document.getElementById('bid-count');
    const input = document.getElementById('bid-amount-input');
    const POLL_INTERVAL = 8000;

    let lastKnownPrice = currentBid ? parseInt(currentBid.textContent) : null;
    let wasHighestBidder = false;

    async function poll() {
        try {
            const res = await fetch(`/api/bid/status/${auctionId}`);
            if (!res.ok) return;
            const data = await res.json();

            if (lastKnownPrice !== null && data.currentPrice > lastKnownPrice) {
                if (wasHighestBidder) {
                    Utils.showToast("You've been outbid!", 'error');
                }
                if (currentBid) currentBid.textContent = data.currentPrice;
                if (minLabel) minLabel.textContent = `${data.minNextBid} JOD`;
                if (input) input.min = input.value = data.minNextBid;
                const text = document.getElementById('place-bid-text');
                if (text) text.textContent = `Place Bid of ${data.minNextBid} JOD`;
                if (count) count.textContent = `${data.bidCount} Total Bids Placed`;
            }

            lastKnownPrice = data.currentPrice;
            wasHighestBidder = data.isHighestBidder;

            if (data.status === 'Ended') {
                clearInterval(intervalId);
                btn.disabled = true;
                btn.innerHTML = '<span class="material-symbols-outlined">block</span> Auction Ended';
                Utils.showToast('This auction has ended.', 'info');
            }
        } catch {
            // silent — a missed poll isn't worth interrupting the user
        }
    }

    const intervalId = setInterval(poll, POLL_INTERVAL);
}

function initWatchlist() {
    const btn = document.getElementById('watchlist-btn');
    if (!btn) return;
    const id = btn.dataset.animalId, token = document.querySelector('input[name="__RequestVerificationToken"]')?.value;

    const updateUI = (fav) => {
        btn.innerHTML = `<span class="material-symbols-outlined">${fav ? 'favorite' : 'favorite_border'}</span> ${fav ? 'In Watchlist' : 'Add to Watchlist'}`;
        btn.classList.toggle('btn-primary', fav);
        btn.classList.toggle('btn-outline', !fav);
    };

    fetch(`/api/favorite/status/${id}`).then(r => r.json()).then(d => updateUI(d.isFavorited)).catch(() => { });

    btn.addEventListener('click', async () => {
        try {
            const res = await fetch(`/api/favorite/toggle/${id}`, { method: 'POST', headers: { 'X-CSRF-TOKEN': token } });
            if (res.status === 401) return window.location.href = `/Account/Login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
            if (!res.ok) return Utils.showToast('Something went wrong. Please try again.', 'error');
            const d = await res.json();
            updateUI(d.isFavorited);
            Utils.showToast(d.isFavorited ? 'Added to watchlist' : 'Removed from watchlist', d.isFavorited ? 'success' : 'info');
        } catch { Utils.showToast('Something went wrong. Please try again.', 'error'); }
    });
}

function initShareSave() {
    const share = document.querySelector('[data-action="share"]');

    share?.addEventListener('click', async () => {
        if (navigator.share) {
            try { await navigator.share({ title: 'Boer Goat Buck - Live Auction', text: 'Check out this Boer Goat Buck auction on AnimalEcosystem', url: window.location.href }); } catch { }
        } else if (await Utils.copyToClipboard(window.location.href)) {
            Utils.showToast('Link copied to clipboard', 'success');
        }
    });
}