// js/pages/auction-details.js
(function () {
  'use strict';

  // ── Helpers ───────────────────────────────────────────────────────────

  const escapeHtml = (value) => {
    const d = document.createElement('div');
    d.textContent = value == null ? '' : String(value);
    return d.innerHTML;
  };

  const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt == null ? '' : String(txt);
  };

  const setHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };

  const getEl = (id) => document.getElementById(id);

  const getParam = (name) =>
    new URLSearchParams(window.location.search).get(name);

  // ── Not-found state ───────────────────────────────────────────────────

  const showNotFound = () => {
    const nf   = getEl('notFoundState');
    const main = getEl('mainContent');
    const hero = getEl('auctionHero');
    if (nf)   nf.hidden   = false;
    if (main) main.hidden = true;
    if (hero) hero.hidden = true;
    setText('breadcrumbCurrent', 'Not found');
    document.title = 'Auction not found – Animal Ecosystem';
  };

  // ── Resolve auction ───────────────────────────────────────────────────

  const auctions = (window.App?.Data?.auctions) || [];
  const rawId    = getParam('id');
  let auction    = null;

  if (rawId !== null) {
    const numId = parseInt(rawId, 10);
    if (!isNaN(numId)) auction = auctions.find((a) => a.id === numId) || null;
  }

  // Dev fallback: no ?id param → show first auction
  if (!auction && rawId === null && auctions.length > 0) {
    auction = auctions[0];
    console.info('[auction-details] No ?id= – showing first auction:', auction.name);
  }

  if (!auction) {
    console.warn('[auction-details] No auction found for id:', rawId);
    showNotFound();
    return;
  }

  // ── Status helpers ────────────────────────────────────────────────────

  const STATUS_CONFIG = {
    'live':          { cls: 'auction-badge-live',          label: '🔴 Live',          dot: true  },
    'ending-soon':   { cls: 'auction-badge-ending-soon',   label: '⚡ Ending Soon',   dot: true  },
    'starting-soon': { cls: 'auction-badge-starting-soon', label: '🕐 Starting Soon', dot: false },
    'no-bids':       { cls: 'auction-badge-no-bids',       label: 'No Bids Yet',      dot: false },
    'ended':         { cls: 'auction-badge-ended',         label: 'Ended',            dot: false },
  };

  const applyStatus = (status) => {
    const cfg = STATUS_CONFIG[status] || { cls: '', label: status || '', dot: false };

    // Hero badge + sidebar badge
    ['heroBadge', 'statusBadge'].forEach((id) => {
      const el = getEl(id);
      if (!el) return;
      el.textContent = cfg.label;
      el.className   = `badge ${cfg.cls}`;
    });

    // Pulsing dot
    const dot = getEl('pulsingDot');
    if (dot) dot.style.display = cfg.dot ? 'inline-block' : 'none';
  };

  // ── Hero & breadcrumb ─────────────────────────────────────────────────

  document.title = `${auction.name} – Auction Details – Animal Ecosystem`;

  setText('auctionHeroName',      auction.name);
  setText('breadcrumbCurrent',    auction.name);
  setText('sidebarAuctionName',   auction.name);

  // Hero location
  const heroLocSpan = document.querySelector('#auctionHeroLocation span');
  if (heroLocSpan) heroLocSpan.textContent = auction.location || '';

  // Hero eyebrow: update label based on status
  const eyebrowLabels = {
    'live':          'Live Auction',
    'ending-soon':   'Ending Soon',
    'starting-soon': 'Starting Soon',
    'no-bids':       'Open Auction – No Bids Yet',
    'ended':         'Auction Ended',
  };
  const heroEyebrow = getEl('heroEyebrow');
  if (heroEyebrow) {
    // Keep the SVG icon; only update the text node
    const textNode = [...heroEyebrow.childNodes]
      .find((n) => n.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.textContent = ` ${eyebrowLabels[auction.status] || 'Auction'}`;
  }

  applyStatus(auction.status);

  // ── Overview section ──────────────────────────────────────────────────

  setText('auctionTitle',       auction.name);
  setText('auctionLocationText', auction.location);
  setText('auctionDescription', auction.description);

  // Spec chips
  const specsEl = getEl('auctionSpecs');
  if (specsEl) {
    const specs = [
      { label: 'Species', value: auction.species },
      { label: 'Breed',   value: auction.breed   },
      { label: 'Age',     value: auction.age      },
      { label: 'Gender',  value: auction.gender   },
    ].filter((s) => s.value != null && s.value !== '');

    specsEl.innerHTML = specs
      .map(
        (s) => `<span class="auction-spec-chip" role="listitem">
                  ${escapeHtml(s.label)}: <strong>${escapeHtml(s.value)}</strong>
                </span>`
      )
      .join('');
  }

  // ── Gallery ───────────────────────────────────────────────────────────

  const mainImg = getEl('galleryMainImg');

  // Deduplicate image list: hero image + gallery array
  const allImages = [
    ...(auction.image ? [auction.image] : []),
    ...(Array.isArray(auction.gallery) ? auction.gallery : []),
  ];
  const uniqueImages = [...new Set(allImages)];

  if (mainImg && uniqueImages.length > 0) {
    mainImg.src = uniqueImages[0];
    mainImg.alt = `${auction.name} – main photo`;
  }

  const thumbsEl = getEl('galleryThumbs');
  if (thumbsEl && uniqueImages.length > 1) {
    thumbsEl.innerHTML = uniqueImages
      .map(
        (src, i) =>
          `<img src="${escapeHtml(src)}"
                alt="${escapeHtml(auction.name)} – photo ${i + 1}"
                class="auction-gallery-thumb${i === 0 ? ' is-active' : ''}"
                loading="lazy"
                tabindex="0"
                role="button"
                aria-label="View photo ${i + 1}" />`
      )
      .join('');

    const setActive = (src) => {
      if (mainImg) {
        mainImg.style.opacity = '0.6';
        mainImg.src = src;
        mainImg.onload = () => { mainImg.style.opacity = '1'; };
      }
      thumbsEl.querySelectorAll('.auction-gallery-thumb').forEach((img) => {
        // Compare just the filename to avoid http/https or path mismatches
        img.classList.toggle('is-active', img.getAttribute('src') === src);
      });
    };

    thumbsEl.addEventListener('click', (e) => {
      if (e.target?.tagName === 'IMG') setActive(e.target.getAttribute('src'));
    });
    thumbsEl.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target?.tagName === 'IMG') {
        e.preventDefault();
        setActive(e.target.getAttribute('src'));
      }
    });
  }

  // ── Health records ────────────────────────────────────────────────────

  const healthListEl = getEl('healthList');
  if (healthListEl) {
    if (Array.isArray(auction.healthRecords) && auction.healthRecords.length) {
      healthListEl.innerHTML = auction.healthRecords
        .map(
          (rec) => `<li class="auction-health-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" aria-hidden="true">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            ${escapeHtml(rec)}
          </li>`
        )
        .join('');
    } else {
      healthListEl.innerHTML =
        `<li class="auction-health-empty">No health records available for this auction.</li>`;
    }
  }

  // ── Bid history ───────────────────────────────────────────────────────

  const bidHistoryEl = getEl('bidHistoryList');

  const renderBidEntry = (b, isFirst = false) => {
    const isYou = b.bidder === 'You';
    const cls   = isYou ? 'is-you' : (isFirst ? 'is-top' : '');
    return `<li class="auction-bid-entry ${cls}">
      <span class="auction-bid-bidder">${escapeHtml(b.bidder)}${isYou ? ' (you)' : ''}</span>
      <span class="auction-bid-amount">${Number(b.amount).toLocaleString()} JOD</span>
      <span class="auction-bid-time">${escapeHtml(b.timeAgo)}</span>
    </li>`;
  };

  const renderBidHistory = () => {
    if (!bidHistoryEl) return;
    const history = auction.bidHistory || [];
    if (history.length === 0) {
      bidHistoryEl.innerHTML =
        `<li class="auction-bid-empty">No bids have been placed yet. Be the first!</li>`;
    } else {
      bidHistoryEl.innerHTML = history
        .map((b, i) => renderBidEntry(b, i === 0))
        .join('');
    }
  };

  renderBidHistory();

  // ── Sidebar: current bid display ──────────────────────────────────────

  const currentBidEl       = getEl('currentBid');
  const bidCountDisplay    = getEl('bidCountDisplay');
  const minIncrementDisplay = getEl('minIncrementDisplay');
  const minBidNote         = getEl('minBidNote');

  const renderBidPanel = () => {
    if (currentBidEl) {
      currentBidEl.textContent =
        `${Number(auction.currentBid || 0).toLocaleString()} JOD`;
    }
    if (bidCountDisplay)     bidCountDisplay.textContent     = auction.bidCount || 0;
    if (minIncrementDisplay) minIncrementDisplay.textContent = `${auction.minimumIncrement || 1} JOD`;
    const minNext = Number(auction.currentBid || 0) + Number(auction.minimumIncrement || 1);
    if (minBidNote) {
      minBidNote.textContent = `Minimum next bid: ${minNext.toLocaleString()} JOD`;
    }
  };

  renderBidPanel();

  // ── Seller card ───────────────────────────────────────────────────────

  const seller = auction.seller || {};

  setText('sellerName',        seller.name        || 'Unknown seller');
  setText('sellerMeta',        seller.memberSince ? `Member since ${seller.memberSince}` : '');
  setText('sellerLocation',    seller.location    || '');
  setText('sellerMemberSince', seller.memberSince ? `Member since ${seller.memberSince}` : '');

  // Response rate (optional)
  const responseRow = getEl('sellerResponseRow');
  const responseEl  = getEl('sellerResponse');
  if (seller.responseRate && responseRow && responseEl) {
    responseEl.textContent = seller.responseRate;
    responseRow.style.display = 'flex';
  }

  // Avatar initial
  const avatarEl = getEl('sellerAvatar');
  if (avatarEl) {
    avatarEl.textContent = (seller.name || '').trim().charAt(0).toUpperCase() || '?';
  }

  // Verified badge – FIX: data.js uses `verifiedOwner` not `verified`
  const verifiedBadgeEl = getEl('sellerVerifiedBadge');
  if (verifiedBadgeEl) {
    verifiedBadgeEl.innerHTML = seller.verifiedOwner
      ? `<div class="auction-seller-verified">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="3" aria-hidden="true">
             <path d="M20 6L9 17l-5-5"/>
           </svg>
           Verified Seller
         </div>`
      : '';
  }

  // ── Countdown timer ───────────────────────────────────────────────────

  const timeRemainingEl = getEl('timeRemaining');
  const pulsingDotEl    = getEl('pulsingDot');
  let   intervalId      = null;

  const formatTime = (totalSeconds) => {
    const secs = Math.max(0, Math.floor(totalSeconds));
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs % 86400) / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600)  /   60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60           ).toString().padStart(2, '0');
    return d > 0 ? `${d}d ${h}:${m}:${s}` : `${h}:${m}:${s}`;
  };

  const markEnded = () => {
    auction.status = 'ended';
    applyStatus('ended');

    if (timeRemainingEl) {
      timeRemainingEl.textContent = 'Auction ended';
      timeRemainingEl.classList.add('auction-timer-ended');
    }
    if (pulsingDotEl) pulsingDotEl.style.display = 'none';

    // Disable bid button
    const btn = getEl('placeBidBtn');
    if (btn) {
      btn.disabled    = true;
      btn.textContent = 'Auction Ended';
    }
    if (minBidNote) minBidNote.textContent = '';
  };

  if (timeRemainingEl) {
    if (auction.status === 'ended' || !(auction.timeRemainingSeconds > 0)) {
      markEnded();
    } else {
      timeRemainingEl.textContent = formatTime(auction.timeRemainingSeconds);
      intervalId = setInterval(() => {
        auction.timeRemainingSeconds -= 1;
        if (auction.timeRemainingSeconds <= 0) {
          clearInterval(intervalId);
          markEnded();
          return;
        }
        timeRemainingEl.textContent = formatTime(auction.timeRemainingSeconds);
      }, 1000);
    }
  }

  window.addEventListener('pagehide', () => {
    if (intervalId) clearInterval(intervalId);
  });

  // ── Place Bid modal ───────────────────────────────────────────────────

  const placeBidBtn = getEl('placeBidBtn');

  const openBidModal = () => {
    if (auction.status === 'ended') return;

    // FIX: respect minimumIncrement correctly
    const minBid = Number(auction.currentBid || 0) + Number(auction.minimumIncrement || 1);

    const backdrop = document.createElement('div');
    backdrop.className = 'bid-modal-backdrop';
    backdrop.setAttribute('role', 'presentation');
    backdrop.innerHTML = `
      <div class="bid-modal" role="dialog" aria-modal="true" aria-labelledby="bidModalTitle">
        <h3 class="bid-modal-title" id="bidModalTitle">Place Your Bid</h3>
        <div class="bid-modal-subtitle">
          Current bid: <strong>${Number(auction.currentBid).toLocaleString()} JOD</strong>
          &nbsp;·&nbsp;
          Min. increment: <strong>${auction.minimumIncrement} JOD</strong>
        </div>
        <label class="bid-modal-label" for="bidAmountInput">
          Your bid (JOD) — minimum ${minBid.toLocaleString()} JOD
        </label>
        <input
          class="bid-modal-input"
          type="number"
          id="bidAmountInput"
          min="${minBid}"
          step="${auction.minimumIncrement || 1}"
          placeholder="${minBid}"
          autocomplete="off"
        />
        <p class="bid-modal-error" id="bidModalError" role="alert" aria-live="assertive"></p>
        <div class="bid-modal-actions">
          <button class="btn btn-outline" id="bidCancelBtn" type="button">Cancel</button>
          <button class="btn btn-warm"    id="bidConfirmBtn" type="button">Confirm Bid</button>
        </div>
      </div>`;

    document.body.appendChild(backdrop);

    // Focus input immediately
    const input   = backdrop.querySelector('#bidAmountInput');
    const errorEl = backdrop.querySelector('#bidModalError');
    setTimeout(() => input?.focus(), 50);

    const closeModal = () => backdrop.remove();

    backdrop.addEventListener('click',   (e) => { if (e.target === backdrop) closeModal(); });
    backdrop.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    backdrop.querySelector('#bidCancelBtn').addEventListener('click', closeModal);

    backdrop.querySelector('#bidConfirmBtn').addEventListener('click', () => {
      const bidNum = parseFloat(input.value);

      // Validation: must be >= minBid AND a whole number of the increment
      if (isNaN(bidNum) || bidNum < minBid) {
        errorEl.textContent =
          `Bid must be at least ${minBid.toLocaleString()} JOD.`;
        input.focus();
        return;
      }

      // Update local state (client-side only — no server in this MVP)
      auction.currentBid  = bidNum;
      auction.bidCount    = (auction.bidCount || 0) + 1;
      auction.bidHistory  = auction.bidHistory || [];
      auction.bidHistory.unshift({ bidder: 'You', amount: bidNum, timeAgo: 'just now' });

      // Re-render
      renderBidPanel();
      renderBidHistory();

      closeModal();
    });
  };

  if (placeBidBtn) {
    placeBidBtn.addEventListener('click', openBidModal);
  }

})();