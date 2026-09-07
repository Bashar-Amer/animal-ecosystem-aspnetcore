document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initBidStepper();
    initQuickBids();
    initCountdown();
    initBidPlacement();
    initWatchlist();
    initShareSave();
});

function initGallery() {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail-btn');

    thumbnails.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.type) return Utils.showToast('Preview coming soon', 'info');
            const newSrc = btn.dataset.image;
            if (newSrc && mainImage) {
                mainImage.src = newSrc;
                thumbnails.forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });
}

function initBidStepper() {
    const input = document.getElementById('bid-amount-input');
    const minusBtn = document.querySelector('[data-stepper="minus"]');
    const plusBtn = document.querySelector('[data-stepper="plus"]');
    const placeBidText = document.getElementById('place-bid-text');
    if (!input) return;

    const STEP = 25, MIN_BID = 300;
    const updateBidText = () => placeBidText && (placeBidText.textContent = `Place Bid of $${input.value}`);

    minusBtn?.addEventListener('click', () => {
        let val = parseInt(input.value) || MIN_BID;
        if (val - STEP >= MIN_BID) { input.value = val - STEP; updateBidText(); }
    });

    plusBtn?.addEventListener('click', () => {
        input.value = (parseInt(input.value) || MIN_BID) + STEP;
        updateBidText();
    });

    input.addEventListener('input', () => {
        let val = Math.max(parseInt(input.value) || MIN_BID, MIN_BID);
        input.value = Math.ceil(val / STEP) * STEP;
        updateBidText();
    });

    updateBidText();
}

function initQuickBids() {
    const input = document.getElementById('bid-amount-input');
    const placeBidText = document.getElementById('place-bid-text');

    document.querySelectorAll('[data-quick-bid]').forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.dataset.quickBid;
            if (input) {
                input.value = amount;
                if (placeBidText) placeBidText.textContent = `Place Bid of $${amount}`;
            }
        });
    });
}

function initCountdown() {
    const countdownEl = document.querySelector('.countdown-grid');
    if (!countdownEl || !countdownEl.dataset.countdown) return;

    const endDate = countdownEl.dataset.countdown;
    const hoursEl = countdownEl.querySelector('[data-hours]');
    const minutesEl = countdownEl.querySelector('[data-minutes]');
    const secondsEl = countdownEl.querySelector('[data-seconds]');

    const update = () => {
        const remaining = Utils.getTimeRemaining(endDate);
        if (remaining.isExpired) {
            [hoursEl, minutesEl, secondsEl].forEach(el => el && (el.textContent = '00'));
            return;
        }
        if (hoursEl) hoursEl.textContent = String(remaining.hours + remaining.days * 24).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(remaining.minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(remaining.seconds).padStart(2, '0');
    };

    update();
    setInterval(update, 1000);
}

function initBidPlacement() {
    const placeBidBtn = document.getElementById('place-bid-btn');
    const input = document.getElementById('bid-amount-input');
    const currentBidDisplay = document.getElementById('current-bid-display');
    const minBidLabel = document.getElementById('min-bid-label');
    const bidHistory = document.getElementById('bid-history');
    const bidCount = document.getElementById('bid-count');

    placeBidBtn?.addEventListener('click', () => {
        const bidAmount = parseInt(input.value);
        const minRequired = parseInt(currentBidDisplay.textContent) + 25;

        if (bidAmount < minRequired) {
            Utils.showToast(`Bid must be at least $${minRequired}`, 'error');
            return;
        }

        placeBidBtn.disabled = true;
        placeBidBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Processing...';

        setTimeout(() => {
            currentBidDisplay.textContent = bidAmount;
            minBidLabel.textContent = `$${bidAmount + 25}`;
            input.min = bidAmount + 25;
            input.value = bidAmount + 25;

            const newRow = document.createElement('div');
            newRow.className = 'bid-row winning';
            newRow.innerHTML = `
        <div class="bidder-info">
          <div class="bidder-avatar winning">Y</div>
          <div>
            <div class="bidder-name"><span>You</span><span class="badge badge-ending badge-sm">Winning Bid</span></div>
            <span class="bid-time">Just now</span>
          </div>
        </div>
        <span class="bid-value headline-sm">$${bidAmount}</span>
      `;

            const prevWinning = bidHistory.querySelector('.winning');
            if (prevWinning) {
                prevWinning.classList.remove('winning');
                prevWinning.querySelector('.badge-ending')?.remove();
            }

            bidHistory.prepend(newRow);
            if (bidCount) bidCount.textContent = `${bidHistory.children.length} Total Bids Placed`;
            Utils.showToast(`Bid of $${bidAmount} placed successfully!`, 'success');

            placeBidBtn.disabled = false;
            placeBidBtn.innerHTML = `<span class="material-symbols-outlined">gavel</span><span id="place-bid-text">Place Bid of $${bidAmount + 25}</span>`;
            initBidStepper();
        }, 1200);
    });
}

function initWatchlist() {
    const watchlistBtn = document.getElementById('watchlist-btn');
    let isWatchlisted = false;

    watchlistBtn?.addEventListener('click', () => {
        isWatchlisted = !isWatchlisted;
        watchlistBtn.innerHTML = `<span class="material-symbols-outlined">${isWatchlisted ? 'favorite' : 'favorite_border'}</span> ${isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}`;
        watchlistBtn.classList.toggle('btn-primary', isWatchlisted);
        watchlistBtn.classList.toggle('btn-outline', !isWatchlisted);
        Utils.showToast(isWatchlisted ? 'Added to watchlist' : 'Removed from watchlist', isWatchlisted ? 'success' : 'info');
    });
}

function initShareSave() {
    const saveBtn = document.querySelector('[data-action="save"]');
    const shareBtn = document.querySelector('[data-action="share"]');

    saveBtn?.addEventListener('click', () => {
        const icon = saveBtn.querySelector('.material-symbols-outlined');
        const isSaved = icon.textContent === 'favorite';
        icon.textContent = isSaved ? 'favorite_border' : 'favorite';
        icon.style.fontVariationSettings = isSaved ? "'FILL' 0" : "'FILL' 1";
        icon.style.color = isSaved ? '' : 'var(--error)';
        Utils.showToast(isSaved ? 'Removed from saved' : 'Saved to favorites', isSaved ? 'info' : 'success');
    });

    shareBtn?.addEventListener('click', async () => {
        if (navigator.share) {
            try { await navigator.share({ title: 'Boer Goat Buck - Live Auction', text: 'Check out this Boer Goat Buck auction on AnimalEcosystem', url: window.location.href }); } catch (err) { console.log('Share cancelled'); }
        } else if (await Utils.copyToClipboard(window.location.href)) {
            Utils.showToast('Link copied to clipboard', 'success');
        }
    });
}