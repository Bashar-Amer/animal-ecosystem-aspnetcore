/**
 * app.js
 * Global initialization and shared behavior.
 */

// app.js will remain for your Modals, RTL toggles, and Auction timers.

window.App.TimerEngine = {
  init() {
    setInterval(() => {
      const timerElements = document.querySelectorAll('[data-timer-end]');
      const now = Date.now();

      timerElements.forEach(el => {
        const endTime = parseInt(el.getAttribute('data-timer-end'), 10);
        const distance = endTime - now;

        if (distance > 0) {
          const secondsLeft = Math.floor(distance / 1000);
          el.textContent = formatSecondsShort(secondsLeft);
          
          // Visual change for less than 10 minutes (600,000 ms)
          if (distance < 600000) { 
             el.closest('.badge-auction')?.classList.add('badge-ending');
          }
        } else {
          el.textContent = window.App.translate('auctionEnded') || "Auction Ended";
          el.closest('.badge-auction')?.classList.remove('badge-auction', 'badge-ending');
          el.closest('.badge-auction')?.classList.add('badge-neutral');
        }
      });
    }, 1000);
  }
};


document.addEventListener('DOMContentLoaded', () => {

  window.App.TimerEngine.init();

  // Modal Toggle Logic
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseBtns = document.querySelectorAll('[data-modal-close]');
  const modals = document.querySelectorAll('.modal-overlay');

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) activeModal.classList.remove('active');
    }
  });

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) modal.classList.add('active');
      const firstInput = modal.querySelector('input, button[data-modal-close]');
      if (firstInput) firstInput.focus();
    });
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  // Close modal when clicking outside
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // RTL Toggle for testing
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      document.documentElement.setAttribute('dir', isRtl ? 'ltr' : 'rtl');
      document.documentElement.setAttribute('lang', isRtl ? 'en' : 'ar');

      langToggle.textContent = isRtl ? 'العربية' : 'English';

      window.dispatchEvent(new Event('languageChanged'));
    });
  }
});


window.addEventListener('languageChanged', () => {
  // Re-render UI elements that rely on window.App.translate()
  // Example:
  // document.getElementById('marketplace-grid').innerHTML = 
  //   window.App.Data.animals.map(window.App.Components.renderAnimalCard).join('');
  
  // Re-initialize any dynamic text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = window.App.translate(key);
  });
});


// <!-- Example Modal Structure -->
// <div id="contactModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
//   <div class="modal-content">
//     <h2 id="modalTitle">Contact Seller</h2>
//     <!-- ... your form ... -->
//     <button data-modal-close aria-label="Close modal">×</button>
//   </div>
// </div>