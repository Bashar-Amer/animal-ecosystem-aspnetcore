const AppState = {
    user: null,
    filters: {},
    sortBy: "ending-soon",
    viewMode: "grid"
};
document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initCountdownTimers();
    initModals();
    initTabs();
    initAccordions();
    initDropdowns();
    initLazyLoading();
    initFilters();
    initSearch();
    initAuctionCards();
    initScrollEffects()
});

function initMobileMenu() {
    const e = document.querySelector(".mobile-menu-toggle"),
        t = document.querySelector(".mobile-menu");
    e && t && (e.addEventListener("click", () => {
        t.classList.toggle("active");
        const s = t.classList.contains("active");
        e.setAttribute("aria-expanded", s);
        const n = e.querySelector("svg, i");
        n && n.classList.toggle("rotate-90")
    }), t.querySelectorAll("a").forEach(s => {
        s.addEventListener("click", () => {
            t.classList.remove("active"), e.setAttribute("aria-expanded", "false")
        })
    }))
}

function initCountdownTimers() {
    document.querySelectorAll("[data-countdown]").forEach(e => {
        const t = e.dataset.countdown;
        if (t) {
            const s = new CountdownTimer(e, t);
            s.setExpireCallback(() => {
                const n = e.closest(".card");
                if (n) {
                    const a = n.querySelector(".badge");
                    a && (a.className = "badge badge-ended", a.textContent = "Ended");
                    const i = n.querySelector(".btn-primary, .btn-urgent");
                    i && (i.disabled = true, i.textContent = "Auction Ended", i.classList.add("btn-disabled"))
                }
            }), s.start()
        }
    })
}

function initModals() {
    document.querySelectorAll("[data-modal-trigger]").forEach(e => {
        const t = e.dataset.modalTrigger,
            s = new Modal(t);
        e.addEventListener("click", n => {
            n.preventDefault(), s.open()
        })
    })
}

function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(e => {
        new Tabs(e)
    })
}

function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach(e => {
        new Accordion(e)
    })
}

function initDropdowns() {
    document.querySelectorAll("[data-dropdown]").forEach(e => {
        new Dropdown(e)
    })
}

function initLazyLoading() {
    new LazyLoader("[data-lazy]")
}

function initFilters() {
    document.querySelectorAll("[data-filter]").forEach(e => {
        e.addEventListener("change", Utils.debounce(() => {
            AppState.filters[e.dataset.filter] = e.value, applyFilters()
        }, 300))
    })
}

function applyFilters() {
    document.querySelectorAll(".auction-card").forEach(e => {
        let t = true;
        Object.keys(AppState.filters).forEach(s => {
            const n = AppState.filters[s];
            if (!n || n === "all") return;
            e.dataset[s] !== n && (t = false)
        }), e.style.display = t ? "" : "none"
    }), updateResultsCount()
}

function updateResultsCount() {
    const e = document.querySelectorAll('.auction-card:not([style*="display: none"])'),
        t = document.querySelector("[data-results-count]");
    t && (t.textContent = `${e.length} ${1 === e.length ? "listing" : "listings"}`)
}

function initSearch() {
    const e = document.querySelector("[data-search]");
    e && e.addEventListener("input", Utils.debounce(t => {
        performSearch(t.target.value.toLowerCase())
    }, 300))
}

function performSearch(e) {
    document.querySelectorAll(".auction-card").forEach(t => {
        const s = t.querySelector(".card-title")?.textContent.toLowerCase() || "",
            n = t.querySelector(".card-meta")?.textContent.toLowerCase() || "";
        t.style.display = (s + " " + n).includes(e) ? "" : "none"
    }), updateResultsCount()
}

function initAuctionCards() {
    document.querySelectorAll("[data-bid-button]").forEach(e => {
        e.addEventListener("click", t => {
            t.preventDefault(), handleBidClick(e.dataset.auctionId)
        })
    }), document.querySelectorAll("[data-favorite]").forEach(e => {
        e.addEventListener("click", t => {
            t.preventDefault(), toggleFavorite(e.dataset.favorite, e)
        })
    })
}

function handleBidClick(e) {
    if (!AppState.user) {
        Utils.showToast("Please sign in to place a bid", "warning");
        new Modal("login-modal").open();
        return
    }
    const t = new Modal("bid-modal");
    t.modal && (t.modal.dataset.auctionId = e, t.modal.open())
}

function toggleFavorite(e, t) {
    const s = t.classList.contains("favorited");
    s ? (t.classList.remove("favorited"), Utils.showToast("Removed from watchlist", "info")) : (t.classList.add("favorited"), Utils.showToast("Added to watchlist", "success"));
    const n = t.querySelector("svg");
    n && n.classList.toggle("filled"), saveFavoriteState(e, !s)
}

function saveFavoriteState(e, t) {
    let s = Utils.storage.get("favorites") || [];
    t ? s.includes(e) || s.push(e) : s = s.filter(n => n !== e), Utils.storage.set("favorites", s)
}

function initScrollEffects() {
    const e = document.querySelector(".header"),
        t = document.querySelector("[data-back-to-top]");
    window.addEventListener("scroll", Utils.throttle(() => {
        const s = window.scrollY;
        e && (e.style.boxShadow = s > 10 ? "var(--shadow-level-1)" : "none"), t && (s > 500 ? t.classList.add("visible") : t.classList.remove("visible"))
    }, 100)), t && t.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    })
}

function initForms() {
    const e = document.querySelector("[data-login-form]");
    if (e) {
        const t = new FormValidator(e);
        t.addRule("email", {
            required: true,
            email: true,
            requiredMessage: "Email is required",
            emailMessage: "Please enter a valid email address"
        }), t.addRule("password", {
            required: true,
            minLength: 6,
            requiredMessage: "Password is required",
            minLengthMessage: "Password must be at least 6 characters"
        }), e.addEventListener("submit", s => {
            s.preventDefault(), t.validate() ? handleLogin(new FormData(e)) : t.showErrors()
        })
    }
    const t = document.querySelector("[data-register-form]");
    if (t) {
        const s = new FormValidator(t);
        s.addRule("name", {
            required: true,
            requiredMessage: "Name is required"
        }), s.addRule("email", {
            required: true,
            email: true
        }), s.addRule("phone", {
            required: true,
            phone: true
        }), s.addRule("password", {
            required: true,
            minLength: 8
        }), t.addEventListener("submit", n => {
            n.preventDefault(), s.validate() ? handleRegistration(new FormData(t)) : s.showErrors()
        })
    }
    const s = document.querySelector("[data-bid-form]");
    s && s.addEventListener("submit", e => {
        e.preventDefault(), handleBidSubmission(new FormData(s))
    })
}
async function handleLogin(e) {
    try {
        Utils.showToast("Logging in...", "info"), setTimeout(() => {
            AppState.user = {
                id: 1,
                email: e.get("email"),
                name: "User Name"
            }, Utils.showToast("Login successful!", "success"), new Modal("login-modal").close(), updateUserUI()
        }, 1000)
    } catch (t) {
        Utils.showToast("Login failed. Please try again.", "error")
    }
}
async function handleRegistration(e) {
    try {
        Utils.showToast("Creating account...", "info"), setTimeout(() => {
            Utils.showToast("Account created successfully!", "success"), new Modal("register-modal").close()
        }, 1000)
    } catch (t) {
        Utils.showToast("Registration failed. Please try again.", "error")
    }
}
async function handleBidSubmission(e) {
    try {
        Utils.showToast("Placing bid...", "info"), setTimeout(() => {
            Utils.showToast("Bid placed successfully!", "success"), new Modal("bid-modal").close()
        }, 1000)
    } catch (t) {
        Utils.showToast("Failed to place bid. Please try again.", "error")
    }
}

function updateUserUI() {
    const e = document.querySelectorAll("[data-user-menu]"),
        t = document.querySelectorAll("[data-guest-menu]");
    AppState.user ? (e.forEach(s => s.style.display = ""), t.forEach(s => s.style.display = "none")) : (e.forEach(s => s.style.display = "none"), t.forEach(s => s.style.display = ""))
}
initForms();