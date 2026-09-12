const Utils = {
    formatCurrency(t, e = false) {
        return new Intl.NumberFormat("en-JO", {
            style: "currency",
            currency: "JOD",
            minimumFractionDigits: e ? 2 : 0,
            maximumFractionDigits: e ? 2 : 0
        }).format(t).replace("JOD", "").trim() + " JOD"
    },
    formatNumber(t) {
        return new Intl.NumberFormat("en-US").format(t)
    },
    getTimeRemaining(t) {
        const e = Date.parse(t) - Date.parse(new Date()),
            r = Math.floor(e / 1000 % 60),
            s = Math.floor(e / 1000 / 60 % 60),
            o = Math.floor(e / (1000 * 60 * 60) % 24),
            a = Math.floor(e / (1000 * 60 * 60 * 24));
        return {
            total: e,
            days: a,
            hours: o,
            minutes: s,
            seconds: r,
            isExpired: e <= 0
        }
    },
    formatCountdown(t) {
        if (t.isExpired) return "Ended";
        const {
            days: e,
            hours: r,
            minutes: s,
            seconds: o
        } = t;
        return e > 0 ? `${e}d ${r}h ${s}m` : r > 0 ? `${r}h ${s}m ${o}s` : s > 0 ? `${s}m ${o}s` : `${o}s`
    },
    debounce(t, e = 300) {
        let r;
        return function (...s) {
            const o = () => {
                clearTimeout(r), t(...s)
            };
            clearTimeout(r), r = setTimeout(o, e)
        }
    },
    throttle(t, e = 300) {
        let r;
        return function (...s) {
            r || (t.apply(this, s), r = true, setTimeout(() => r = false, e))
        }
    },
    getUrlParameter(t) {
        return new URLSearchParams(window.location.search).get(t)
    },
    setUrlParameter(t, e) {
        const r = new URL(window.location);
        r.searchParams.set(t, e), window.history.pushState({}, "", r)
    },
    isValidEmail(t) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
    },
    isValidPhone(t) {
        return /^[\d\s\-\+\(\)]{8,}$/.test(t)
    },
    sanitizeHTML(t) {
        const e = document.createElement("div");
        return e.textContent = t, e.innerHTML
    },
    generateId(t = 8) {
        return Math.random().toString(36).substring(2, t + 2)
    },
    async copyToClipboard(t) {
        try {
            return await navigator.clipboard.writeText(t), true
        } catch (e) {
            return console.error("Failed to copy:", e), false
        }
    },
    showToast(t, e = "info", r = 3000) {
        const s = document.createElement("div");
        s.className = `toast toast-${e}`, s.textContent = t, s.style.cssText = `position:fixed;bottom:20px;right:20px;padding:16px 24px;border-radius:8px;background:var(--surface-container-lowest);box-shadow:var(--shadow-level-3);z-index:9999;animation:slideIn 0.3s ease-out;`;
        const o = {
            success: "var(--status-verified-bg)",
            error: "var(--error-container)",
            warning: "var(--status-ending-bg)",
            info: "var(--status-starting-bg)"
        };
        s.style.backgroundColor = o[e] || o.info, document.body.appendChild(s), setTimeout(() => {
            s.style.animation = "slideOut 0.3s ease-out", setTimeout(() => s.remove(), 300)
        }, r)
    },
    scrollToElement(t, e = 0) {
        const r = typeof t === "string" ? document.querySelector(t) : t;
        if (r) {
            const t = r.getBoundingClientRect().top + window.pageYOffset - e;
            window.scrollTo({
                top: t,
                behavior: "smooth"
            })
        }
    },
    isInViewport(t) {
        const e = t.getBoundingClientRect();
        return e.top >= 0 && e.left >= 0 && e.bottom <= (window.innerHeight || document.documentElement.clientHeight) && e.right <= (window.innerWidth || document.documentElement.clientWidth)
    },
    storage: {
        set(t, e) {
            try {
                return localStorage.setItem(t, JSON.stringify(e)), true
            } catch (r) {
                return console.error("Storage set error:", r), false
            }
        },
        get(t) {
            try {
                const e = localStorage.getItem(t);
                return e ? JSON.parse(e) : null
            } catch (r) {
                return console.error("Storage get error:", r), null
            }
        },
        remove(t) {
            localStorage.removeItem(t)
        },
        clear() {
            localStorage.clear()
        }
    }
};
typeof module !== "undefined" && module.exports && (module.exports = Utils);