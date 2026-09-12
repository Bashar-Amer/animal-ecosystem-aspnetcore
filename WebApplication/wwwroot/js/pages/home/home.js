document.addEventListener('DOMContentLoaded', () => {
    initFilterTabs();
    initHeroCountdown();
});

function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.animal-card');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            tabs.forEach(t => t.classList.toggle('active', t === tab));
            cards.forEach(card => {
                card.style.display = category === 'all' || card.dataset.category === category ? '' : 'none';
            });
        });
    });
}

function initHeroCountdown() {
    console.log('Hero countdown initialized');
}