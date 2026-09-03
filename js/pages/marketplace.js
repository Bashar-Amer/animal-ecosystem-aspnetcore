/* ============================================================
   Marketplace Page Controller
   ============================================================ */

(function () {
    "use strict";

    window.App = window.App || {};

    const App = window.App;
    const Data = App.Data || {};
    const Components = App.Components || {};

    /* ========================================================
       Configuration
       ======================================================== */

    const CONFIG = {
        pageSize: 8,
        favoriteStorageKey: "animalEcosystem.marketplace.favorites",

        ageRanges: [
            { value: "under-1", labelKey: "age_under_1", min: 0, max: 1 },
            { value: "1-2", labelKey: "age_1_2", min: 1, max: 3 },
            { value: "3-5", labelKey: "age_3_5", min: 3, max: 6 },
            { value: "6-10", labelKey: "age_6_10", min: 6, max: 11 },
            { value: "10-plus", labelKey: "age_10_plus", min: 10, max: Infinity }
        ],

        purposeOptions: [
            { value: "breeding", labelKey: "purpose_breeding", keywords: ["breeding", "breed", "stud", "stallion", "mare", "ram", "doe"] },
            { value: "dairy", labelKey: "purpose_dairy", keywords: ["dairy", "milk", "cow", "holstein"] },
            { value: "meat", labelKey: "purpose_meat", keywords: ["meat", "boer", "sheep", "goat"] },
            { value: "farm", labelKey: "purpose_farm", keywords: ["farm", "livestock", "cattle", "sheep", "goat"] },
            { value: "sport", labelKey: "purpose_sport", keywords: ["sport", "racing", "race", "horse", "stallion"] }
        ]
    };

    /* ========================================================
       State
       ======================================================== */

    const state = {
        allAnimals: [],
        filteredAnimals: [],
        visibleCount: CONFIG.pageSize,

        filters: {
            species: [],
            breed: [],
            age: [],
            gender: [],
            location: [],
            purpose: [],
            minPrice: "",
            maxPrice: "",
            verifiedSeller: false
        },

        search: "",
        sort: "newest",

        mobileDraftFilters: null,

        favorites: new Set(),

        isLoading: false,
        hasError: false
    };

    /* ========================================================
       DOM References
       ======================================================== */

    const elements = {};

    function cacheElements() {
        elements.search = document.getElementById("marketplace-search");
        elements.searchLabel = document.getElementById("marketplace-search-label");
        elements.clearSearch = document.getElementById("clear-search");

        elements.openFilters = document.getElementById("open-filters");
        elements.mobileFilterCount = document.getElementById("mobile-filter-count");
        elements.mobileSort = document.getElementById("mobile-sort");

        elements.desktopFilters = document.getElementById("desktop-filters");
        elements.clearFilters = document.getElementById("clear-filters");
        elements.filterSummary = document.getElementById("filter-summary");

        elements.speciesFilters = document.getElementById("species-filters");
        elements.breedFilters = document.getElementById("breed-filters");
        elements.ageFilters = document.getElementById("age-filters");
        elements.genderFilters = document.getElementById("gender-filters");
        elements.locationFilters = document.getElementById("location-filters");
        elements.purposeFilters = document.getElementById("purpose-filters");

        elements.minPrice = document.getElementById("min-price");
        elements.maxPrice = document.getElementById("max-price");
        elements.verifiedSeller = document.getElementById("verified-seller");

        elements.resultCount = document.getElementById("result-count");
        elements.sortSelect = document.getElementById("sort-select");
        elements.activeFilters = document.getElementById("active-filters");

        elements.loadingState = document.getElementById("loading-state");
        elements.errorState = document.getElementById("error-state");
        elements.retryButton = document.getElementById("retry-button");

        elements.emptyState = document.getElementById("empty-state");
        elements.emptyClearFilters = document.getElementById("empty-clear-filters");

        elements.animalGrid = document.getElementById("animal-grid");

        elements.pagination = document.getElementById("pagination");
        elements.loadMore = document.getElementById("load-more");

        elements.filterDrawer = document.getElementById("filter-drawer");
        elements.filterBackdrop = document.getElementById("filter-backdrop");
        elements.closeFilters = document.getElementById("close-filters");
        elements.mobileFilterContent = document.getElementById("mobile-filter-content");
        elements.mobileClearFilters = document.getElementById("mobile-clear-filters");
        elements.applyMobileFilters = document.getElementById("apply-mobile-filters");
    }

    /* ========================================================
       Initialization
       ======================================================== */

    function init() {
        cacheElements();

        loadFavorites();
        bindEvents();

        applyStaticTranslations();
        showLoading();

        try {
            loadAnimals();
            buildFilterOptions();
            applyFilters();
        } catch (error) {
            console.error("Marketplace initialization failed:", error);
            showError();
        }
    }

    function loadAnimals() {
        const animals = Array.isArray(Data.animals) ? Data.animals : [];

        state.allAnimals = animals.map(normalizeAnimal);
        state.filteredAnimals = [...state.allAnimals];
        state.hasError = false;
    }

    /* ========================================================
       Animal Normalization
       ======================================================== */

    function normalizeAnimal(animal) {
        const normalized = { ...animal };

        normalized.id = animal.id;
        normalized.name = safeString(animal.name);
        normalized.breed = safeString(animal.breed);
        normalized.age = safeString(animal.age);
        normalized.gender = safeString(animal.gender);
        normalized.location = safeString(animal.location);
        normalized.price = safeString(animal.price);
        normalized.description = safeString(animal.description);

        normalized.verifiedOwner = Boolean(animal.verifiedOwner);
        normalized.vetChecked = Boolean(animal.vetChecked);

        /*
         * Prefer explicit species/purpose from data.js. Older records
         * without them fall back to a best-effort guess so the page
         * degrades gracefully rather than breaking, but new/real data
         * should always set these explicitly.
         */
        normalized.species = animal.species || inferSpecies(animal);

        normalized.purpose = Array.isArray(animal.purpose) && animal.purpose.length
            ? animal.purpose
            : inferPurposes(animal);

        /*
         * Prefer explicit numeric priceValue. Falling back to parsing
         * the display string only covers legacy records.
         */
        normalized.priceValue = typeof animal.priceValue === "number"
            ? animal.priceValue
            : parsePrice(normalized.price);

        normalized.ageValue = parseAge(normalized.age);
        normalized.city = extractCity(normalized.location);

        return normalized;
    }

    /* ========================================================
       Species / Purpose fallback inference
       (only used when data.js doesn't already provide them)
       ======================================================== */

    function inferSpecies(animal) {
        const text = [animal.name, animal.breed, animal.description].join(" ").toLowerCase();

        if (/horse|stallion|mare|arabian/.test(text)) return "Horse";
        if (/camel|najdi/.test(text)) return "Camel";
        if (/sheep|awassi|ram|ewe/.test(text)) return "Sheep";
        if (/goat|boer|doe|buck/.test(text)) return "Goat";
        if (/cow|cattle|holstein|friesian|bull/.test(text)) return "Cattle";
        if (/chicken|poultry|hen|rooster/.test(text)) return "Poultry";

        return "Other";
    }

    function inferPurposes(animal) {
        const text = [animal.name, animal.breed, animal.description].join(" ").toLowerCase();

        return CONFIG.purposeOptions
            .filter(option => option.keywords.some(keyword => text.includes(keyword)))
            .map(option => option.value);
    }

    /* ========================================================
       Age
       ======================================================== */

    function parseAge(value) {
        const text = safeString(value).toLowerCase();

        if (!text) return null;

        const match = text.match(/(\d+(?:\.\d+)?)/);

        return match ? Number(match[1]) : null;
    }

    function matchesAgeRange(animal, rangeValue) {
        const range = CONFIG.ageRanges.find(item => item.value === rangeValue);

        if (!range || animal.ageValue === null) return false;

        return animal.ageValue >= range.min && animal.ageValue < range.max;
    }

    /* ========================================================
       Location
       ======================================================== */

    function extractCity(location) {
        const text = safeString(location);

        if (!text) return "";

        const parts = text.split(",");

        return parts[0].trim();
    }

    /* ========================================================
       Filter Options
       ======================================================== */

    function buildFilterOptions() {
        renderSpeciesOptions();
        renderBreedOptions();
        renderAgeOptions();
        renderGenderOptions();
        renderLocationOptions();
        renderPurposeOptions();

        syncMobileFilters();
    }

    function renderSpeciesOptions() {
        const values = uniqueSorted(state.allAnimals.map(animal => animal.species));
        renderCheckboxGroup(elements.speciesFilters, "species", values);
    }

    function renderBreedOptions() {
        const values = uniqueSorted(state.allAnimals.map(animal => animal.breed));
        renderCheckboxGroup(elements.breedFilters, "breed", values);
    }

    function renderAgeOptions() {
        if (!elements.ageFilters) return;

        elements.ageFilters.innerHTML = CONFIG.ageRanges
            .map(range => {
                const count = state.allAnimals.filter(animal => matchesAgeRange(animal, range.value)).length;
                return createFilterOptionMarkup("age", range.value, App.translate(range.labelKey), count);
            })
            .join("");
    }

    function renderGenderOptions() {
        const values = uniqueSorted(state.allAnimals.map(animal => animal.gender));
        renderCheckboxGroup(elements.genderFilters, "gender", values);
    }

    function renderLocationOptions() {
        const values = uniqueSorted(state.allAnimals.map(animal => animal.city));
        renderCheckboxGroup(elements.locationFilters, "location", values);
    }

    function renderPurposeOptions() {
        if (!elements.purposeFilters) return;

        const available = CONFIG.purposeOptions.filter(option =>
            state.allAnimals.some(animal => animal.purpose.includes(option.value))
        );

        elements.purposeFilters.innerHTML = available
            .map(option => {
                const count = state.allAnimals.filter(animal => animal.purpose.includes(option.value)).length;
                return createFilterOptionMarkup("purpose", option.value, App.translate(option.labelKey), count);
            })
            .join("");
    }

    function renderCheckboxGroup(container, filterName, values) {
        if (!container) return;

        container.innerHTML = values
            .map(value => {
                const count = countMatchingValue(filterName, value);
                return createFilterOptionMarkup(filterName, value, value, count);
            })
            .join("");
    }

    function createFilterOptionMarkup(filterName, value, label, count) {
        const id = `marketplace-${filterName}-${slugify(value)}`;

        return `
            <label class="marketplace-filter-option" for="${escapeAttribute(id)}">
                <input
                    type="checkbox"
                    id="${escapeAttribute(id)}"
                    name="${escapeAttribute(filterName)}"
                    value="${escapeAttribute(value)}"
                    data-marketplace-filter="${escapeAttribute(filterName)}"
                >

                <span class="marketplace-filter-option__box">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m5 12 4 4L19 6" />
                    </svg>
                </span>

                <span class="marketplace-filter-option__label">${escapeHtml(label)}</span>
                <span class="marketplace-filter-option__count">${count}</span>
            </label>
        `;
    }

    function countMatchingValue(filterName, value) {
        return state.allAnimals.filter(animal => {
            switch (filterName) {
                case "species": return animal.species === value;
                case "breed": return animal.breed === value;
                case "gender": return animal.gender === value;
                case "location": return animal.city === value;
                default: return false;
            }
        }).length;
    }

    /* ========================================================
       Mobile Filters
       ======================================================== */

    function syncMobileFilters() {
        if (!elements.mobileFilterContent) return;

        elements.mobileFilterContent.innerHTML = `
            ${createMobileFilterSection(App.translate("marketplace_filter_species"), elements.speciesFilters)}
            ${createMobileFilterSection(App.translate("marketplace_filter_breed"), elements.breedFilters)}
            ${createMobileFilterSection(App.translate("marketplace_filter_age"), elements.ageFilters)}
            ${createMobileFilterSection(App.translate("marketplace_filter_gender"), elements.genderFilters)}
            ${createMobileFilterSection(App.translate("marketplace_filter_location"), elements.locationFilters)}
            ${createMobileFilterSection(App.translate("marketplace_filter_purpose"), elements.purposeFilters)}

            <div class="marketplace-mobile-filter-group">
                <h3>${escapeHtml(App.translate("marketplace_filter_price"))}</h3>

                <div class="marketplace-price-fields">
                    <label>
                        <span>${escapeHtml(App.translate("marketplace_filter_price_min"))}</span>
                        <input type="number" min="0" data-mobile-filter="min-price" placeholder="0">
                    </label>

                    <span class="marketplace-price-divider">—</span>

                    <label>
                        <span>${escapeHtml(App.translate("marketplace_filter_price_max"))}</span>
                        <input type="number" min="0" data-mobile-filter="max-price" placeholder="Any">
                    </label>
                </div>
            </div>

            <div class="marketplace-mobile-filter-group">
                <label class="marketplace-checkbox">
                    <input type="checkbox" data-mobile-filter="verified-seller">

                    <span class="marketplace-checkbox__box">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m5 12 4 4L19 6" />
                        </svg>
                    </span>

                    <span>${escapeHtml(App.translate("marketplace_filter_verified_only"))}</span>
                </label>
            </div>
        `;

        syncMobileFilterValues();
    }

    function createMobileFilterSection(title, sourceContainer) {
        if (!sourceContainer) return "";

        return `
            <div class="marketplace-mobile-filter-group">
                <h3>${escapeHtml(title)}</h3>
                <div class="marketplace-filter-options">${sourceContainer.innerHTML}</div>
            </div>
        `;
    }

    function syncMobileFilterValues() {
        if (!elements.mobileFilterContent) return;

        const draft = state.mobileDraftFilters || state.filters;

        const checkboxes = elements.mobileFilterContent.querySelectorAll("[data-marketplace-filter]");

        checkboxes.forEach(input => {
            const filterName = input.dataset.marketplaceFilter;
            input.checked = draft[filterName]?.includes(input.value) || false;
        });

        const minPrice = elements.mobileFilterContent.querySelector('[data-mobile-filter="min-price"]');
        const maxPrice = elements.mobileFilterContent.querySelector('[data-mobile-filter="max-price"]');
        const verified = elements.mobileFilterContent.querySelector('[data-mobile-filter="verified-seller"]');

        if (minPrice) minPrice.value = draft.minPrice || "";
        if (maxPrice) maxPrice.value = draft.maxPrice || "";
        if (verified) verified.checked = Boolean(draft.verifiedSeller);
    }

    function openMobileFilters() {
        state.mobileDraftFilters = cloneFilters(state.filters);

        syncMobileFilterValues();

        elements.filterDrawer?.setAttribute("aria-hidden", "false");
        elements.filterDrawer?.classList.add("is-open");
        document.body.classList.add("marketplace-filters-open");
    }

    function closeMobileFilters() {
        elements.filterDrawer?.setAttribute("aria-hidden", "true");
        elements.filterDrawer?.classList.remove("is-open");
        document.body.classList.remove("marketplace-filters-open");

        state.mobileDraftFilters = null;
    }

    function applyMobileFilters() {
        if (!state.mobileDraftFilters) {
            closeMobileFilters();
            return;
        }

        state.filters = cloneFilters(state.mobileDraftFilters);

        syncDesktopFilterControls();
        applyFilters();

        closeMobileFilters();
    }

    function readMobileDraftFilters() {
        if (!state.mobileDraftFilters) {
            state.mobileDraftFilters = cloneFilters(state.filters);
        }

        const filterNames = ["species", "breed", "age", "gender", "location", "purpose"];

        filterNames.forEach(filterName => {
            const inputs = elements.mobileFilterContent.querySelectorAll(
                `[data-marketplace-filter="${filterName}"]`
            );

            state.mobileDraftFilters[filterName] = Array.from(inputs)
                .filter(input => input.checked)
                .map(input => input.value);
        });

        const minPrice = elements.mobileFilterContent.querySelector('[data-mobile-filter="min-price"]');
        const maxPrice = elements.mobileFilterContent.querySelector('[data-mobile-filter="max-price"]');
        const verified = elements.mobileFilterContent.querySelector('[data-mobile-filter="verified-seller"]');

        state.mobileDraftFilters.minPrice = minPrice?.value || "";
        state.mobileDraftFilters.maxPrice = maxPrice?.value || "";
        state.mobileDraftFilters.verifiedSeller = Boolean(verified?.checked);
    }

    /* ========================================================
       Filtering
       ======================================================== */

    function applyFilters() {
        state.visibleCount = CONFIG.pageSize;

        const filtered = state.allAnimals.filter(animal => matchesSearch(animal) && matchesFilters(animal));

        state.filteredAnimals = sortAnimals(filtered);

        render();
    }

    function matchesSearch(animal) {
        const query = state.search.trim().toLowerCase();

        if (!query) return true;

        const searchableText = [
            animal.name, animal.breed, animal.location, animal.city,
            animal.species, animal.description, animal.gender
        ].join(" ").toLowerCase();

        return searchableText.includes(query);
    }

    function matchesFilters(animal) {
        const filters = state.filters;

        if (filters.species.length > 0 && !filters.species.includes(animal.species)) return false;
        if (filters.breed.length > 0 && !filters.breed.includes(animal.breed)) return false;
        if (filters.age.length > 0 && !filters.age.some(ageRange => matchesAgeRange(animal, ageRange))) return false;
        if (filters.gender.length > 0 && !filters.gender.includes(animal.gender)) return false;
        if (filters.location.length > 0 && !filters.location.includes(animal.city)) return false;
        if (filters.purpose.length > 0 && !filters.purpose.some(purpose => animal.purpose.includes(purpose))) return false;
        if (filters.minPrice !== "" && animal.priceValue < Number(filters.minPrice)) return false;
        if (filters.maxPrice !== "" && animal.priceValue > Number(filters.maxPrice)) return false;
        if (filters.verifiedSeller && !animal.verifiedOwner) return false;

        return true;
    }

    /* ========================================================
       Sorting
       ======================================================== */

    function sortAnimals(animals) {
        const sorted = [...animals];

        switch (state.sort) {
            case "price-low":
                return sorted.sort((a, b) => a.priceValue - b.priceValue);

            case "price-high":
                return sorted.sort((a, b) => b.priceValue - a.priceValue);

            case "name":
                return sorted.sort((a, b) => a.name.localeCompare(b.name));

            case "newest":
            default:
                /*
                 * Current mock data has no createdAt.
                 * Use descending ID temporarily.
                 */
                return sorted.sort((a, b) => Number(b.id) - Number(a.id));
        }
    }

    /* ========================================================
       Rendering
       ======================================================== */

    function render() {
        hideLoading();
        hideError();

        renderResultsSummary();
        renderActiveFilters();
        renderAnimals();
        renderPagination();
        renderFilterSummary();
        updateFilterCount();
        syncDesktopFilterControls();
    }

    function renderAnimals() {
        if (!elements.animalGrid) return;

        const visibleAnimals = state.filteredAnimals.slice(0, state.visibleCount);

        if (state.filteredAnimals.length === 0) {
            elements.animalGrid.innerHTML = "";
            showEmpty();
            return;
        }

        hideEmpty();

        elements.animalGrid.innerHTML = visibleAnimals
            .map(animal => Components.renderAnimalCard(animal))
            .join("");

        restoreFavoriteStates();
    }

    function renderResultsSummary() {
        if (!elements.resultCount) return;

        const count = state.filteredAnimals.length;
        const total = state.allAnimals.length;

        elements.resultCount.textContent = (state.search || hasActiveFilters())
            ? App.translate("marketplace_results_count_filtered", { count, total })
            : App.translate("marketplace_results_count_all", { count: total });
    }

    function renderPagination() {
        if (!elements.pagination) return;

        const hasMore = state.visibleCount < state.filteredAnimals.length;
        elements.pagination.classList.toggle("hidden", !hasMore);
    }

    function renderActiveFilters() {
        if (!elements.activeFilters) return;

        const chips = [];

        state.filters.species.forEach(value => chips.push(createFilterChip("species", value, value)));
        state.filters.breed.forEach(value => chips.push(createFilterChip("breed", value, value)));

        state.filters.age.forEach(value => {
            const option = CONFIG.ageRanges.find(item => item.value === value);
            chips.push(createFilterChip("age", value, option ? App.translate(option.labelKey) : value));
        });

        state.filters.gender.forEach(value => chips.push(createFilterChip("gender", value, value)));
        state.filters.location.forEach(value => chips.push(createFilterChip("location", value, value)));

        state.filters.purpose.forEach(value => {
            const option = CONFIG.purposeOptions.find(item => item.value === value);
            chips.push(createFilterChip("purpose", value, option ? App.translate(option.labelKey) : value));
        });

        if (state.filters.minPrice !== "") {
            chips.push(createFilterChip("minPrice", "minPrice", App.translate("marketplace_min_price_chip", { value: state.filters.minPrice })));
        }

        if (state.filters.maxPrice !== "") {
            chips.push(createFilterChip("maxPrice", "maxPrice", App.translate("marketplace_max_price_chip", { value: state.filters.maxPrice })));
        }

        if (state.filters.verifiedSeller) {
            chips.push(createFilterChip("verifiedSeller", "verifiedSeller", App.translate("marketplace_verified_chip")));
        }

        if (state.search) {
            chips.push(createFilterChip("search", "search", App.translate("marketplace_search_chip", { value: state.search })));
        }

        elements.activeFilters.innerHTML = chips.join("");
        elements.activeFilters.classList.toggle("hidden", chips.length === 0);
    }

    function createFilterChip(filterName, value, label) {
        return `
            <button
                type="button"
                class="marketplace-active-filter"
                data-remove-filter="${escapeAttribute(filterName)}"
                data-filter-value="${escapeAttribute(value)}"
                aria-label="${escapeAttribute(label)}"
            >
                <span>${escapeHtml(label)}</span>
                <span class="marketplace-active-filter__remove" aria-hidden="true">×</span>
            </button>
        `;
    }

    function renderFilterSummary() {
        if (!elements.filterSummary) return;

        const count = getActiveFilterCount();

        if (count === 0) {
            elements.filterSummary.textContent = App.translate("marketplace_filters_summary");
            return;
        }

        elements.filterSummary.textContent = App.translate(
            count === 1 ? "marketplace_active_filters_count" : "marketplace_active_filters_count_plural",
            { count }
        );
    }

    /* ========================================================
       Filter Count
       ======================================================== */

    function getActiveFilterCount() {
        let count = 0;

        ["species", "breed", "age", "gender", "location", "purpose"].forEach(filterName => {
            count += state.filters[filterName].length;
        });

        if (state.filters.minPrice !== "") count++;
        if (state.filters.maxPrice !== "") count++;
        if (state.filters.verifiedSeller) count++;

        return count;
    }

    function updateFilterCount() {
        if (!elements.mobileFilterCount) return;

        const count = getActiveFilterCount();

        elements.mobileFilterCount.textContent = count;
        elements.mobileFilterCount.classList.toggle("hidden", count === 0);
    }

    function hasActiveFilters() {
        return getActiveFilterCount() > 0;
    }

    /* ========================================================
       Desktop Controls
       ======================================================== */

    function syncDesktopFilterControls() {
        syncCheckboxGroup(elements.speciesFilters, "species");
        syncCheckboxGroup(elements.breedFilters, "breed");
        syncCheckboxGroup(elements.ageFilters, "age");
        syncCheckboxGroup(elements.genderFilters, "gender");
        syncCheckboxGroup(elements.locationFilters, "location");
        syncCheckboxGroup(elements.purposeFilters, "purpose");

        if (elements.minPrice) elements.minPrice.value = state.filters.minPrice;
        if (elements.maxPrice) elements.maxPrice.value = state.filters.maxPrice;
        if (elements.verifiedSeller) elements.verifiedSeller.checked = state.filters.verifiedSeller;
        if (elements.sortSelect) elements.sortSelect.value = state.sort;
        if (elements.mobileSort) elements.mobileSort.value = state.sort;
    }

    function syncCheckboxGroup(container, filterName) {
        if (!container) return;

        const inputs = container.querySelectorAll(`[data-marketplace-filter="${filterName}"]`);

        inputs.forEach(input => {
            input.checked = state.filters[filterName].includes(input.value);
        });
    }

    /* ========================================================
       Events
       ======================================================== */

    function bindEvents() {
        elements.search?.addEventListener("input", handleSearch);
        elements.clearSearch?.addEventListener("click", clearSearch);
        elements.clearFilters?.addEventListener("click", clearFilters);
        elements.emptyClearFilters?.addEventListener("click", clearFilters);
        elements.retryButton?.addEventListener("click", init);

        elements.sortSelect?.addEventListener("change", event => {
            state.sort = event.target.value;
            applyFilters();
        });

        elements.mobileSort?.addEventListener("change", event => {
            state.sort = event.target.value;
            applyFilters();
        });

        elements.openFilters?.addEventListener("click", openMobileFilters);
        elements.closeFilters?.addEventListener("click", closeMobileFilters);
        elements.filterBackdrop?.addEventListener("click", closeMobileFilters);

        elements.applyMobileFilters?.addEventListener("click", () => {
            readMobileDraftFilters();
            applyMobileFilters();
        });

        elements.mobileClearFilters?.addEventListener("click", clearMobileFilters);
        elements.loadMore?.addEventListener("click", loadMore);

        elements.desktopFilters?.addEventListener("change", handleDesktopFilterChange);
        elements.desktopFilters?.addEventListener("input", handleDesktopFilterChange);

        elements.mobileFilterContent?.addEventListener("change", readMobileDraftFilters);
        elements.mobileFilterContent?.addEventListener("input", readMobileDraftFilters);

        elements.activeFilters?.addEventListener("click", handleActiveFilterClick);
        elements.animalGrid?.addEventListener("click", handleAnimalGridClick);

        document.addEventListener("keydown", handleKeyboard);

        // Re-render translated text/labels + reapply filters/state when
        // the language toggles (dispatched by app.js's #lang-toggle).
        window.addEventListener("languageChanged", handleLanguageChanged);
    }

    function handleLanguageChanged() {
        applyStaticTranslations();
        buildFilterOptions();
        applyFilters();
    }

    /* ========================================================
       Static translations (chrome that isn't rebuilt by render())
       ======================================================== */

    function applyStaticTranslations() {
        if (elements.search) {
            elements.search.setAttribute("placeholder", App.translate("marketplace_search_placeholder"));
        }

        if (elements.clearSearch) {
            elements.clearSearch.setAttribute("aria-label", App.translate("marketplace_search_clear"));
        }
    }

    /* ========================================================
       Search
       ======================================================== */

    function handleSearch(event) {
        state.search = event.target.value.trim();

        updateSearchClearButton();
        applyFilters();
    }

    function clearSearch() {
        state.search = "";

        if (elements.search) elements.search.value = "";

        updateSearchClearButton();
        applyFilters();
    }

    function updateSearchClearButton() {
        if (!elements.clearSearch) return;
        if (!elements.search) return;
        elements.clearSearch.classList.toggle("hidden", state.search.length === 0);
    }

    /* ========================================================
       Desktop Filter Events
       ======================================================== */

    function handleDesktopFilterChange(event) {
        const input = event.target;

        if (input.matches("[data-marketplace-filter]")) {
            const filterName = input.dataset.marketplaceFilter;
            updateMultiSelectFilter(filterName, input.value, input.checked);
            applyFilters();
            return;
        }

        if (input.id === "min-price") {
            state.filters.minPrice = input.value;
            applyFilters();
            return;
        }

        if (input.id === "max-price") {
            state.filters.maxPrice = input.value;
            applyFilters();
            return;
        }

        if (input.id === "verified-seller") {
            state.filters.verifiedSeller = input.checked;
            applyFilters();
        }
    }

    function updateMultiSelectFilter(filterName, value, checked) {
        const values = state.filters[filterName];

        if (!Array.isArray(values)) return;

        if (checked) {
            if (!values.includes(value)) values.push(value);
        } else {
            const index = values.indexOf(value);
            if (index !== -1) values.splice(index, 1);
        }
    }

    /* ========================================================
       Active Filter Removal
       ======================================================== */

    function handleActiveFilterClick(event) {
        const button = event.target.closest("[data-remove-filter]");

        if (!button) return;

        removeFilter(button.dataset.removeFilter, button.dataset.filterValue);
        applyFilters();
    }

    function removeFilter(filterName, value) {
        if (Array.isArray(state.filters[filterName])) {
            state.filters[filterName] = state.filters[filterName].filter(item => item !== value);
            return;
        }

        if (filterName === "minPrice") { state.filters.minPrice = ""; return; }
        if (filterName === "maxPrice") { state.filters.maxPrice = ""; return; }
        if (filterName === "verifiedSeller") { state.filters.verifiedSeller = false; return; }
        if (filterName === "search") { clearSearch(); }
    }

    /* ========================================================
       Clear Filters
       ======================================================== */

    function clearFilters() {
        state.filters = createEmptyFilters();

        syncDesktopFilterControls();
        applyFilters();
    }

    function clearMobileFilters() {
        state.mobileDraftFilters = createEmptyFilters();
        syncMobileFilterValues();
    }

    function createEmptyFilters() {
        return {
            species: [], breed: [], age: [], gender: [], location: [], purpose: [],
            minPrice: "", maxPrice: "", verifiedSeller: false
        };
    }

    /* ========================================================
       Pagination
       ======================================================== */

    function loadMore() {
        state.visibleCount += CONFIG.pageSize;

        renderAnimals();
        renderPagination();
    }

    /* ========================================================
       Favorites
       ======================================================== */

    function loadFavorites() {
        try {
            const stored = localStorage.getItem(CONFIG.favoriteStorageKey);

            if (!stored) return;

            const parsed = JSON.parse(stored);

            if (Array.isArray(parsed)) {
                state.favorites = new Set(parsed);
            }
        } catch (error) {
            console.warn("Unable to load marketplace favorites.", error);
            state.favorites = new Set();
        }
    }

    function saveFavorites() {
        try {
            localStorage.setItem(CONFIG.favoriteStorageKey, JSON.stringify(Array.from(state.favorites)));
        } catch (error) {
            console.warn("Unable to save marketplace favorites.", error);
        }
    }

    function handleAnimalGridClick(event) {
        const favoriteButton = event.target.closest(".animal-card__favorite");

        if (!favoriteButton) return;

        const card = favoriteButton.closest(".animal-card");

        if (!card) return;

        const animalId = card.dataset.animalId;

        if (!animalId) return;

        toggleFavorite(animalId);
    }

    function toggleFavorite(animalId) {
        const normalizedId = String(animalId);

        if (state.favorites.has(normalizedId)) {
            state.favorites.delete(normalizedId);
        } else {
            state.favorites.add(normalizedId);
        }

        saveFavorites();
        updateFavoriteButton(normalizedId);
    }

    function updateFavoriteButton(animalId) {
        const card = elements.animalGrid?.querySelector(
            `.animal-card[data-animal-id="${CSS.escape(animalId)}"]`
        );

        if (!card) return;

        const button = card.querySelector(".animal-card__favorite");

        if (!button) return;

        const isFavorite = state.favorites.has(animalId);

        button.classList.toggle("is-favorite", isFavorite);
        button.setAttribute("aria-pressed", String(isFavorite));
        button.setAttribute("aria-label", App.translate(isFavorite ? "marketplace_unfavorite" : "marketplace_favorite"));
    }

    function restoreFavoriteStates() {
        if (!elements.animalGrid) return;

        const cards = elements.animalGrid.querySelectorAll(".animal-card");

        cards.forEach(card => {
            const animalId = card.dataset.animalId;

            if (!animalId) return;

            const button = card.querySelector(".animal-card__favorite");

            if (!button) return;

            const isFavorite = state.favorites.has(String(animalId));

            button.classList.toggle("is-favorite", isFavorite);
            button.setAttribute("aria-pressed", String(isFavorite));
            button.setAttribute("aria-label", App.translate(isFavorite ? "marketplace_unfavorite" : "marketplace_favorite"));
        });
    }

    /* ========================================================
       UI States
       ======================================================== */

    function showLoading() {
        state.isLoading = true;

        if (elements.loadingState) elements.loadingState.classList.remove("hidden");
        if (elements.errorState) elements.errorState.classList.add("hidden");
        if (elements.emptyState) elements.emptyState.classList.add("hidden");
    }

    function hideLoading() {
        state.isLoading = false;
        if (elements.loadingState) elements.loadingState.classList.add("hidden");
    }

    function showError() {
        state.hasError = true;

        if (elements.loadingState) elements.loadingState.classList.add("hidden");
        if (elements.errorState) elements.errorState.classList.remove("hidden");
        if (elements.emptyState) elements.emptyState.classList.add("hidden");
    }

    function hideError() {
        if (elements.errorState) elements.errorState.classList.add("hidden");
        state.hasError = false;
    }

    function showEmpty() {
        if (elements.emptyState) elements.emptyState.classList.remove("hidden");
    }

    function hideEmpty() {
        if (elements.emptyState) elements.emptyState.classList.add("hidden");
    }

    /* ========================================================
       Keyboard
       ======================================================== */

    function handleKeyboard(event) {
        if (event.key !== "Escape") return;

        if (elements.filterDrawer?.classList.contains("is-open")) {
            closeMobileFilters();
        }
    }

    /* ========================================================
       Utilities
       ======================================================== */

    function safeString(value) {
        if (value === null || value === undefined) return "";
        return String(value).trim();
    }

    function parsePrice(value) {
        const number = Number(String(value).replace(/,/g, "").replace(/[^\d.]/g, ""));
        return Number.isFinite(number) ? number : 0;
    }

    function uniqueSorted(values) {
        return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
    }

    function slugify(value) {
        return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    }

    function cloneFilters(filters) {
        return {
            species: [...filters.species],
            breed: [...filters.breed],
            age: [...filters.age],
            gender: [...filters.gender],
            location: [...filters.location],
            purpose: [...filters.purpose],
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            verifiedSeller: filters.verifiedSeller
        };
    }

    function escapeHtml(value) {
        if (Components && typeof Components.escapeHtml === "function") {
            return Components.escapeHtml(value);
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeAttribute(value) {
        return escapeHtml(value);
    }

    /* ========================================================
       Public API
       ======================================================== */

    App.Marketplace = {
        init,
        clearFilters,
        applyFilters,
        loadMore,

        getState: function () {
            return { ...state, filters: cloneFilters(state.filters) };
        }
    };

    /* ========================================================
       Start
       ======================================================== */

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }

})();


