/**
 * Home Page Specific Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initFilterTabs();
  initHeroCountdown();
});

/**
 * Initialize Category Filter Tabs
 */
function initFilterTabs() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const animalCards = document.querySelectorAll('.animal-card');

  if (filterTabs.length === 0 || animalCards.length === 0) return;

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      // Update active tab
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter cards
      animalCards.forEach((card) => {
        const cardCategory = card.dataset.category;

        if (category === 'all' || cardCategory === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Initialize Hero Showcase Countdown
 */
function initHeroCountdown() {
  // This is handled by the main countdown timer initialization
  // but we can add specific hero enhancements here if needed
  console.log('Hero countdown initialized');
}