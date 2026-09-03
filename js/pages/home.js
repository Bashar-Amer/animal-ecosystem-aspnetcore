/**
 * home.js
 * Logic specifically for the Homepage.
 */

document.addEventListener('DOMContentLoaded', () => {
  renderPage();

  window.addEventListener('languageChanged', renderPage);
});



function renderPage() {


  const { Data, Components } = window.App;

  // 1. Translate Static Elements (The ones with data-i18n attribute)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = window.App.translate(key);
  });


  const animalsContainer = document.getElementById('featured-animals-grid');
  
  

  if (animalsContainer && Data.animals) {
    animalsContainer.innerHTML = Data.animals.map(animal => Components.renderAnimalCard(animal)).join('');
  }

  const auctionsContainer = document.getElementById('live-auctions-grid');
  if (auctionsContainer && Data.auctions) {
    auctionsContainer.innerHTML = Data.auctions.map(auction => Components.renderAuctionCard(auction)).join('');
  }

  const vetsContainer = document.getElementById('featured-vets-grid');
  if (vetsContainer && Data.veterinarians) {
    vetsContainer.innerHTML = Data.veterinarians.map(vet => Components.renderVetCard(vet)).join('');
  }
}
