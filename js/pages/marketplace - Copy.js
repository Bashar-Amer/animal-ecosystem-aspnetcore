// js/pages/marketplace.js
// Marketplace page script: handles filter UI, search, sorting, pagination, and rendering animal cards.

(function () {
  // DOM elements
  const filtersPanel = document.getElementById('filtersPanel');
  const openFiltersBtn = document.getElementById('openFiltersBtn');
  const closeFiltersBtn = document.getElementById('closeFiltersBtn');
  const searchInput = document.getElementById('searchInput');
  const speciesSelect = document.getElementById('speciesSelect');
  const breedSelect = document.getElementById('breedSelect');
  const ageSelect = document.getElementById('ageSelect');
  const genderSelect = document.getElementById('genderSelect');
  const locationSelect = document.getElementById('locationSelect');
  const priceSelect = document.getElementById('priceSelect');
  const purposeSelect = document.getElementById('purposeSelect');
  const verifiedSelect = document.getElementById('verifiedSelect');
  const sortSelect = document.getElementById('sortSelect');
  const resultCount = document.getElementById('resultCount');
  const marketplaceGrid = document.getElementById('marketplaceGrid');
  const loadingState = document.getElementById('loadingState');
  const emptyState = document.getElementById('emptyState');
  const errorState = document.getElementById('errorState');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  const PAGE_SIZE = 12; // number of cards per page
  let currentPage = 1;
  let filteredAnimals = [];

  // Utility: get selected values from a <select multiple>
  const getMultiValues = (select) => {
    return Array.from(select.selectedOptions).map(o => o.value);
  };

  // Populate filter options based on data (run once on load)
  const populateFilterOptions = () => {
    const animals = window.App.Data.animals || [];
    const unique = (arr) => [...new Set(arr)].sort();

    const addOptions = (select, values) => {
      select.innerHTML = '';
      values.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        select.appendChild(opt);
      });
    };

    addOptions(speciesSelect, unique(animals.map(a => a.species)));
    addOptions(breedSelect, unique(animals.map(a => a.breed)));
    addOptions(ageSelect, unique(animals.map(a => a.age)));
    addOptions(genderSelect, unique(animals.map(a => a.gender)));
    addOptions(locationSelect, unique(animals.map(a => a.location)));
    // purpose is not in mock animal data; you can extend later.
  };

  // Filtering logic (AND across all active filters)
  const applyFilters = () => {
    const animals = window.App.Data.animals || [];
    const searchTerm = searchInput.value.trim().toLowerCase();
    const speciesVals = getMultiValues(speciesSelect);
    const breedVals = getMultiValues(breedSelect);
    const ageVals = getMultiValues(ageSelect);
    const genderVals = getMultiValues(genderSelect);
    const locationVals = getMultiValues(locationSelect);
    const priceVals = getMultiValues(priceSelect);
    const purposeVals = getMultiValues(purposeSelect);
    const verifiedVal = verifiedSelect.value;

    filteredAnimals = animals.filter(animal => {
      // Search (matches name, breed, location)
      if (searchTerm && !(
        animal.name.toLowerCase().includes(searchTerm) ||
        animal.breed.toLowerCase().includes(searchTerm) ||
        animal.location.toLowerCase().includes(searchTerm)
      )) return false;

      if (speciesVals.length && !speciesVals.includes(animal.species)) return false;
      if (breedVals.length && !breedVals.includes(animal.breed)) return false;
      if (ageVals.length && !ageVals.includes(animal.age)) return false;
      if (genderVals.length && !genderVals.includes(animal.gender)) return false;
      if (locationVals.length && !locationVals.includes(animal.location)) return false;

      // Price range handling
      if (priceVals.length) {
        const price = parseFloat(animal.price.replace(/[^0-9.]/g, ''));
        const matches = priceVals.some(range => {
          if (range === 'low') return price < 500;
          if (range === 'mid') return price >= 500 && price <= 2000;
          if (range === 'high') return price > 2000;
          return false;
        });
        if (!matches) return false;
      }

      // Purpose (not present in mock data – skip if empty)
      if (purposeVals.length && animal.purpose && !purposeVals.includes(animal.purpose)) return false;

      // Verified seller
      if (verifiedVal === 'true' && !animal.verifiedOwner) return false;

      return true;
    });

    applySorting();
    currentPage = 1; // reset pagination
    renderResults();
  };

  // Sorting
  const applySorting = () => {
    const sortValue = sortSelect.value;
    if (!filteredAnimals) return;
    filteredAnimals.sort((a, b) => {
      switch (sortValue) {
        case 'newest':
          return new Date(b.listedAt) - new Date(a.listedAt);
        case 'price-asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'nearest':
          // Assuming a.distance field exists; fallback to 0.
          return (a.distance || 0) - (b.distance || 0);
        default:
          return 0;
      }
    });
  };

  // Render a page of results
  const renderResults = () => {
    // Clear previous UI state
    marketplaceGrid.innerHTML = '';
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    emptyState.style.display = 'none';

    const total = filteredAnimals.length;
    resultCount.textContent = `${total} animal${total !== 1 ? 's' : ''} found`;

    if (total === 0) {
      emptyState.style.display = 'block';
      loadMoreBtn.style.display = 'none';
      return;
    }

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, total);
    const pageItems = filteredAnimals.slice(start, end);

    pageItems.forEach(animal => {
      const html = window.App.Components.renderAnimalCard(animal);
      const container = document.createElement('div');
      container.innerHTML = html;
      marketplaceGrid.appendChild(container.firstElementChild);
    });

    // Show or hide Load More button
    if (end < total) {
      loadMoreBtn.style.display = 'inline-block';
    } else {
      loadMoreBtn.style.display = 'none';
    }
  };

  // Load more handler
  const loadMore = () => {
    currentPage++;
    renderResults();
  };

  // Mobile filter drawer toggles
  const openFilters = () => {
    filtersPanel.classList.add('open');
    closeFiltersBtn.style.display = 'block';
    openFiltersBtn.style.display = 'none';
  };
  const closeFilters = () => {
    filtersPanel.classList.remove('open');
    closeFiltersBtn.style.display = 'none';
    openFiltersBtn.style.display = 'block';
  };

  // Attach listeners (instant on change for desktop)
  const attachListeners = () => {
    const controls = [searchInput, speciesSelect, breedSelect, ageSelect, genderSelect, locationSelect, priceSelect, purposeSelect, verifiedSelect, sortSelect];
    controls.forEach(ctrl => {
      ctrl.addEventListener('change', applyFilters);
    });
    searchInput.addEventListener('input', applyFilters);
    loadMoreBtn.addEventListener('click', loadMore);
    openFiltersBtn.addEventListener('click', openFilters);
    closeFiltersBtn.addEventListener('click', closeFilters);
  };

  // Initialise
  const init = () => {
    loadingState.style.display = 'block';
    try {
      populateFilterOptions();
      attachListeners();
      applyFilters(); // initial render (no filters)
    } catch (e) {
      console.error('Marketplace init error:', e);
      loadingState.style.display = 'none';
      errorState.style.display = 'block';
    }
  };

  // Run after DOM ready (in case script loads before body)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
