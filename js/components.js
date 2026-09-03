/* ============================================================
   components.js
   Reusable UI components for the Animal Ecosystem frontend.

   NOTE: These components are temporary frontend components.
   They are designed to be replaced by Razor Partial Views
   such as _AnimalCard.cshtml when the ASP.NET Core backend
   is connected.
   ============================================================ */

window.App = window.App || {};

window.App.Icons = {
  pin: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
  check: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>`,
  vetCross: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 8v8M8 12h8"/><circle cx="12" cy="12" r="9"/></svg>`,
  clock: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
  heart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9C.6 8.4 2 4.5 6 4c2.2-.3 4.2 1 6 3 1.8-2 3.8-3.3 6-3 4 .5 5.4 4.4 4 8-2.5 4.4-10 9-10 9z"/></svg>`
};

/* ------------------------------------------------------------
   Small shared HTML-escaping helper.
   Reused by marketplace.js (App.Components.escapeHtml) so text
   pulled from data (seller names, descriptions, locations —
   real user input once this is backed by a database) never
   breaks out of the markup.
   ------------------------------------------------------------ */
function escapeHtml(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPrice(animal) {
  const value =
    typeof animal.priceValue === "number"
      ? animal.priceValue
      : Number(String(animal.price || "").replace(/[^\d.]/g, "")) || 0;

  return value.toLocaleString();
}

window.App.Components = {
  escapeHtml,

  renderAnimalCard: (animal) => `
    <article class="card animal-card" data-animal-id="${escapeHtml(animal.id)}">
      <div class="card-image-container">
        <img class="card-image" src="${escapeHtml(animal.image)}" alt="${escapeHtml(animal.breed)} ${escapeHtml(animal.species || 'animal')} — ${escapeHtml(animal.name)}" loading="lazy">

        <button
          type="button"
          class="animal-card__favorite"
          aria-pressed="false"
          aria-label="${escapeHtml(window.App.translate('marketplace_favorite'))}"
        >
          ${window.App.Icons.heart}
        </button>
      </div>

      <div class="card-content">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="text-h4 text-umber-900">${escapeHtml(animal.name)}</h3>
            <p class="text-caption">${escapeHtml(animal.breed)} • ${escapeHtml(animal.age)} • ${escapeHtml(animal.gender)}</p>
          </div>
        </div>

        <p class="text-body-sm text-charcoal-700 flex items-center gap-1 mt-2 mb-4">${window.App.Icons.pin} ${escapeHtml(animal.location)}</p>

        <div class="flex gap-2 flex-wrap mb-4">
          ${animal.verifiedOwner ? `<span class="badge badge-verified-owner">${window.App.Icons.check} ${escapeHtml(window.App.translate('verifiedOwner'))}</span>` : ''}
          ${animal.vetChecked ? `<span class="badge badge-vet-checked">${window.App.Icons.vetCross} ${escapeHtml(window.App.translate('vetChecked'))}</span>` : ''}
        </div>

        <div class="flex justify-between items-center mt-4">
          <span class="text-h3 number-emphasized text-umber-700">${formatPrice(animal)} <span style="font-size:var(--font-caption); font-weight:600;">${escapeHtml(window.App.translate('jod'))}</span></span>
          <button class="btn btn-primary" style="padding: var(--space-2) var(--space-4);">${escapeHtml(window.App.translate('contact'))}</button>
        </div>
      </div>
    </article>
  `,

  renderAuctionCard: (auction) => `
    <article class="card" style="border-color: var(--color-terracotta-500);">
      <div class="card-image-container">
        <img class="card-image" src="${escapeHtml(auction.image)}" alt="${escapeHtml(auction.name)} — up for auction" loading="lazy">
      </div>
      <div class="card-content">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-h4" style="color: var(--color-umber-900);">${escapeHtml(auction.name)}</h3>
          <span class="badge badge-auction">Live Auction</span>
        </div>
        <p class="text-body-sm mb-4" style="color: var(--color-terracotta-700); display:flex; align-items:center; gap:4px;">${window.App.Icons.clock} ${escapeHtml(window.App.translate('endsIn'))} <span class="number-emphasized" data-timer-end="${auction.endTime}"></span></p>

        <div class="flex justify-between items-center mt-4 pt-4" style="border-block-start: 1px solid var(--color-sand-200);">
          <div>
            <span class="text-caption">Current Bid</span>
            <div class="text-h3 number-emphasized" style="color: var(--color-terracotta-600);">${auction.currentBid.toLocaleString()} ${escapeHtml(window.App.translate('jod'))}</div>
          </div>
          <button class="btn btn-warm" style="padding: var(--space-2) var(--space-4);">${escapeHtml(window.App.translate('place_bid'))}</button>
        </div>
      </div>
    </article>
  `,

  renderVetCard: (vet) => `
    <article class="card">
      <div class="card-content">
        <div class="flex items-center gap-4 mb-4">
          <div style="width: 60px; height: 60px; background: var(--color-sage-200); border-radius: var(--radius-pill); overflow: hidden;">
            ${vet.image
              ? `<img src="${escapeHtml(vet.image)}" alt="${escapeHtml(vet.name)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentElement.style.background='var(--color-sage-200)';" />`
              : ''}
          </div>
          <div>
            <h3 class="text-h4" style="color: var(--color-umber-900);">${escapeHtml(vet.name)}</h3>
            <span class="badge badge-neutral">${escapeHtml(vet.specialty)}</span>
          </div>
        </div>
        <p class="text-body-sm mb-4" style="color: var(--color-charcoal-700);">${window.App.Icons.pin} ${escapeHtml(vet.location)} • ${escapeHtml(vet.experience)} experience</p>
        <button class="btn ${vet.available ? 'btn-secondary' : 'btn-outline'}" style="width: 100%;" ${!vet.available ? 'disabled' : ''}>
          ${vet.available ? escapeHtml(window.App.translate('book_now')) : escapeHtml(window.App.translate('unavailable'))}
        </button>
      </div>
    </article>
  `
};

function formatSecondsShort(seconds) {
  const days = Math.floor(seconds / 86400);
  const hrs = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (num) => String(num).padStart(2, '0');

  // Include days if present
  if (days > 0) {
    return `${days}d ${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  // Include hours if present
  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  return `${pad(mins)}:${pad(secs)}`;
}