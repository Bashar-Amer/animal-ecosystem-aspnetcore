class CountdownTimer {
    constructor(e, t) {
        this.element = e, this.endDate = new Date(t), this.interval = null, this.onExpire = null
    }
    start() {
        this.update(), this.interval = setInterval(() => this.update(), 1000)
    }
    stop() {
        this.interval && (clearInterval(this.interval), this.interval = null)
    }
    update() {
        const e = Utils.getTimeRemaining(this.endDate);
        e.isExpired ? (this.element.textContent = "Ended", this.stop(), this.onExpire && typeof this.onExpire == "function" && this.onExpire()) : this.element.textContent = Utils.formatCountdown(e)
    }
    setExpireCallback(e) {
        this.onExpire = e
    }
}
class Modal {
    constructor(e) {
        this.modal = document.getElementById(e), this.closeButtons = this.modal?.querySelectorAll("[data-modal-close]"), this.isOpen = false, this.modal && this.init()
    }
    init() {
        this.closeButtons?.forEach(e => e.addEventListener("click", () => this.close())), this.modal.addEventListener("click", e => {
            e.target === this.modal && this.close()
        }), document.addEventListener("keydown", e => {
            "Escape" === e.key && this.isOpen && this.close()
        })
    }
    open() {
        this.modal && (this.modal.classList.add("active"), document.body.style.overflow = "hidden", this.isOpen = true)
    }
    close() {
        this.modal && (this.modal.classList.remove("active"), document.body.style.overflow = "", this.isOpen = false)
    }
    toggle() {
        this.isOpen ? this.close() : this.open()
    }
}
class Tabs {
    constructor(e) {
        this.container = e, this.tabButtons = this.container.querySelectorAll("[data-tab]"), this.tabPanels = this.container.querySelectorAll("[data-tab-panel]"), this.activeTab = null, this.init()
    }
    init() {
        this.tabButtons.forEach(e => {
            e.addEventListener("click", () => this.switchTab(e.dataset.tab))
        }), this.tabButtons.length > 0 && this.switchTab(this.tabButtons[0].dataset.tab)
    }
    switchTab(e) {
        this.tabButtons.forEach(t => t.classList.remove("active")), this.tabPanels.forEach(t => t.classList.remove("active"));
        const t = this.container.querySelector(`[data-tab="${e}"]`),
            s = this.container.querySelector(`[data-tab-panel="${e}"]`);
        t && s && (t.classList.add("active"), s.classList.add("active"), this.activeTab = e)
    }
}
class Accordion {
    constructor(e) {
        this.accordion = e, this.items = this.accordion.querySelectorAll("[data-accordion-item]"), this.allowMultiple = "true" === this.accordion.dataset.allowMultiple, this.init()
    }
    init() {
        this.items.forEach(e => {
            const t = e.querySelector("[data-accordion-trigger]"),
                s = e.querySelector("[data-accordion-content]");
            t.addEventListener("click", () => this.toggle(e, s)), e.classList.contains("active") || (s.style.maxHeight = "0px")
        })
    }
    toggle(e, t) {
        const s = e.classList.contains("active");
        this.allowMultiple || this.items.forEach(i => {
            i !== e && (i.classList.remove("active"), i.querySelector("[data-accordion-content]").style.maxHeight = "0px")
        }), s ? (e.classList.remove("active"), t.style.maxHeight = "0px") : (e.classList.add("active"), t.style.maxHeight = t.scrollHeight + "px")
    }
}
class Dropdown {
    constructor(e) {
        this.dropdown = e, this.trigger = this.dropdown.querySelector("[data-dropdown-trigger]"), this.menu = this.dropdown.querySelector("[data-dropdown-menu]"), this.isOpen = false, this.trigger && this.menu && this.init()
    }
    init() {
        this.trigger.addEventListener("click", e => {
            e.stopPropagation(), this.toggle()
        }), document.addEventListener("click", e => {
            !this.dropdown.contains(e.target) && this.isOpen && this.close()
        }), document.addEventListener("keydown", e => {
            "Escape" === e.key && this.isOpen && this.close()
        })
    }
    toggle() {
        this.isOpen ? this.close() : this.open()
    }
    open() {
        this.menu.classList.add("active"), this.isOpen = true
    }
    close() {
        this.menu.classList.remove("active"), this.isOpen = false
    }
}
class FormValidator {
    constructor(e) {
        this.form = e, this.errors = {}, this.rules = {}
    }
    addRule(e, t) {
        this.rules[e] = t
    }
    validate() {
        this.errors = {};
        let e = true;
        return Object.keys(this.rules).forEach(t => {
            const s = this.form.querySelector(`[name="${t}"]`),
                i = this.rules[t],
                l = s?.value.trim();
            i.required && !l ? (this.errors[t] = i.requiredMessage || "This field is required", e = false) : i.email && l && !Utils.isValidEmail(l) ? (this.errors[t] = i.emailMessage || "Please enter a valid email", e = false) : i.phone && l && !Utils.isValidPhone(l) ? (this.errors[t] = i.phoneMessage || "Please enter a valid phone number", e = false) : i.minLength && l && l.length < i.minLength ? (this.errors[t] = i.minLengthMessage || `Minimum ${i.minLength} characters required`, e = false) : i.custom && typeof i.custom == "function" && i.custom(l, s) !== true && (this.errors[t] = i.custom(l, s), e = false)
        }), e
    }
    showErrors() {
        this.form.querySelectorAll(".error-message").forEach(e => e.remove()), this.form.querySelectorAll(".error").forEach(e => e.classList.remove("error")), Object.keys(this.errors).forEach(e => {
            const t = this.form.querySelector(`[name="${e}"]`);
            if (t) {
                t.classList.add("error");
                const s = document.createElement("div");
                s.className = "error-message", s.textContent = this.errors[e], s.style.color = "var(--error)", s.style.fontSize = "var(--body-sm-size)", s.style.marginTop = "var(--space-2xs)", t.parentElement.appendChild(s)
            }
        })
    }
    clearErrors() {
        this.errors = {}, this.form.querySelectorAll(".error-message").forEach(e => e.remove()), this.form.querySelectorAll(".error").forEach(e => e.classList.remove("error"))
    }
}
class LazyLoader {
    constructor(e = "[data-lazy]") {
        this.images = document.querySelectorAll(e), this.observer = null, this.init()
    }
    init() {
        "IntersectionObserver" in window ? (this.observer = new IntersectionObserver(e => {
            e.forEach(t => {
                t.isIntersecting && (this.loadImage(t.target), this.observer.unobserve(t.target))
            })
        }, {
            rootMargin: "50px"
        }), this.images.forEach(e => this.observer.observe(e))) : this.images.forEach(e => this.loadImage(e))
    }
    loadImage(e) {
        const t = e.dataset.lazy;
        t && (e.src = t, e.removeAttribute("data-lazy"), e.classList.add("loaded"))
    }
}
typeof module !== "undefined" && module.exports && (module.exports = {
    CountdownTimer,
    Modal,
    Tabs,
    Accordion,
    Dropdown,
    FormValidator,
    LazyLoader
});