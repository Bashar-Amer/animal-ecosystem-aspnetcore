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
      if (btn.dataset.type) {
        Utils.showToast('Preview coming soon', 'info');
        return;
      }

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

  const STEP = 25;
  const MIN_BID = 300;

  const updateBidText = () => {
    if (placeBidText) {
      placeBidText.textContent = `Place Bid of $${input.value}`;
    }
  };

  minusBtn?.addEventListener('click', () => {
    let val = parseInt(input.value) || MIN_BID;
    if (val - STEP >= MIN_BID) {
      input.value = val - STEP;
      updateBidText();
    }
  });

  plusBtn?.addEventListener('click', () => {
    let val = parseInt(input.value) || MIN_BID;
    input.value = val + STEP;
    updateBidText();
  });

  input.addEventListener('input', () => {
    let val = parseInt(input.value) || MIN_BID;
    if (val < MIN_BID) val = MIN_BID;
    // Snap to step
    val = Math.ceil(val / STEP) * STEP;
    input.value = val;
    updateBidText();
  });

  updateBidText();
}

function initQuickBids() {
  const quickBtns = document.querySelectorAll('[data-quick-bid]');
  const input = document.getElementById('bid-amount-input');
  const placeBidText = document.getElementById('place-bid-text');

  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = btn.dataset.quickBid;
      if (input) {
        input.value = amount;
        if (placeBidText) {
          placeBidText.textContent = `Place Bid of $${amount}`;
        }
      }
    });
  });
}

function initCountdown() {
  const countdownEl = document.querySelector('.countdown-grid');
  if (!countdownEl) return;

  const endDate = countdownEl.dataset.countdown;
  if (!endDate) return;

  const hoursEl = countdownEl.querySelector('[data-hours]');
  const minutesEl = countdownEl.querySelector('[data-minutes]');
  const secondsEl = countdownEl.querySelector('[data-seconds]');

  const update = () => {
    const remaining = Utils.getTimeRemaining(endDate);
    if (remaining.isExpired) {
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
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
    const currentBid = parseInt(currentBidDisplay.textContent);
    const minRequired = currentBid + 25;

    if (bidAmount < minRequired) {
      Utils.showToast(`Bid must be at least $${minRequired}`, 'error');
      return;
    }

    // Simulate success
    placeBidBtn.disabled = true;
    placeBidBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_top</span> Processing...';

    setTimeout(() => {
      // Update display
      currentBidDisplay.textContent = bidAmount;
      minBidLabel.textContent = `$${bidAmount + 25}`;
      input.min = bidAmount + 25;
      input.value = bidAmount + 25;

      // Add to history
      const newRow = document.createElement('div');
      newRow.className = 'bid-row winning';
      newRow.innerHTML = `
        <div class="bidder-info">
          <div class="bidder-avatar winning">Y</div>
          <div>
            <div class="bidder-name">
              <span>You</span>
              <span class="badge badge-ending badge-sm">Winning Bid</span>
            </div>
            <span class="bid-time">Just now</span>
          </div>
        </div>
        <span class="bid-value headline-sm">$${bidAmount}</span>
      `;

      // Remove previous winning class
      const prevWinning = bidHistory.querySelector('.winning');
      if (prevWinning) {
        prevWinning.classList.remove('winning');
        const badge = prevWinning.querySelector('.badge-ending');
        if (badge) badge.remove();
      }

      bidHistory.prepend(newRow);

      // Update count
      const count = bidHistory.children.length;
      if (bidCount) bidCount.textContent = `${count} Total Bids Placed`;

      Utils.showToast(`Bid of $${bidAmount} placed successfully!`, 'success');

      placeBidBtn.disabled = false;
      placeBidBtn.innerHTML = `<span class="material-symbols-outlined">gavel</span><span id="place-bid-text">Place Bid of $${bidAmount + 25}</span>`;
      initBidStepper(); // re-init text updater
    }, 1200);
  });
}

function initWatchlist() {
  const watchlistBtn = document.getElementById('watchlist-btn');
  let isWatchlisted = false;

  watchlistBtn?.addEventListener('click', () => {
    isWatchlisted = !isWatchlisted;
    if (isWatchlisted) {
      watchlistBtn.innerHTML = '<span class="material-symbols-outlined">favorite</span> In Watchlist';
      watchlistBtn.classList.add('btn-primary');
      watchlistBtn.classList.remove('btn-outline');
      Utils.showToast('Added to watchlist', 'success');
    } else {
      watchlistBtn.innerHTML = '<span class="material-symbols-outlined">favorite_border</span> Add to Watchlist';
      watchlistBtn.classList.remove('btn-primary');
      watchlistBtn.classList.add('btn-outline');
      Utils.showToast('Removed from watchlist', 'info');
    }
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
      try {
        await navigator.share({
          title: 'Boer Goat Buck - Live Auction',
          text: 'Check out this Boer Goat Buck auction on AnimalEcosystem',
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      const copied = await Utils.copyToClipboard(window.location.href);
      if (copied) Utils.showToast('Link copied to clipboard', 'success');
    }
  });
}