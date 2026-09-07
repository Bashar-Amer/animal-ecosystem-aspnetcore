/**
 * Component Classes
 * Reusable UI component functionality
 */

/**
 * Countdown Timer Component
 */
class CountdownTimer {
  constructor(element, endDate) {
    this.element = element;
    this.endDate = new Date(endDate);
    this.interval = null;
    this.onExpire = null;
  }

  start() {
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  update() {
    const timeRemaining = Utils.getTimeRemaining(this.endDate);

    if (timeRemaining.isExpired) {
      this.element.textContent = 'Ended';
      this.stop();
      if (this.onExpire && typeof this.onExpire === 'function') {
        this.onExpire();
      }
      return;
    }

    this.element.textContent = Utils.formatCountdown(timeRemaining);
  }

  setExpireCallback(callback) {
    this.onExpire = callback;
  }
}

/**
 * Modal Component
 */
class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.closeButtons = this.modal?.querySelectorAll('[data-modal-close]');
    this.isOpen = false;

    if (this.modal) {
      this.init();
    }
  }

  init() {
    // Close button listeners
    this.closeButtons?.forEach((btn) => {
      btn.addEventListener('click', () => this.close());
    });

    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    if (this.modal) {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
      this.isOpen = false;
    }
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }
}

/**
 * Tabs Component
 */
class Tabs {
  constructor(tabsContainer) {
    this.container = tabsContainer;
    this.tabButtons = this.container.querySelectorAll('[data-tab]');
    this.tabPanels = this.container.querySelectorAll('[data-tab-panel]');
    this.activeTab = null;

    this.init();
  }

  init() {
    this.tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const tabId = button.dataset.tab;
        this.switchTab(tabId);
      });
    });

    // Activate first tab by default
    if (this.tabButtons.length > 0) {
      const firstTabId = this.tabButtons[0].dataset.tab;
      this.switchTab(firstTabId);
    }
  }

  switchTab(tabId) {
    // Deactivate all tabs
    this.tabButtons.forEach((btn) => btn.classList.remove('active'));
    this.tabPanels.forEach((panel) => panel.classList.remove('active'));

    // Activate selected tab
    const activeButton = this.container.querySelector(`[data-tab="${tabId}"]`);
    const activePanel = this.container.querySelector(`[data-tab-panel="${tabId}"]`);

    if (activeButton && activePanel) {
      activeButton.classList.add('active');
      activePanel.classList.add('active');
      this.activeTab = tabId;
    }
  }
}

/**
 * Accordion Component
 */
class Accordion {
  constructor(accordionElement) {
    this.accordion = accordionElement;
    this.items = this.accordion.querySelectorAll('[data-accordion-item]');
    this.allowMultiple = this.accordion.dataset.allowMultiple === 'true';

    this.init();
  }

  init() {
    this.items.forEach((item) => {
      const trigger = item.querySelector('[data-accordion-trigger]');
      const content = item.querySelector('[data-accordion-content]');

      trigger.addEventListener('click', () => {
        this.toggle(item, content);
      });

      // Set initial state
      if (!item.classList.contains('active')) {
        content.style.maxHeight = '0px';
      }
    });
  }

  toggle(item, content) {
    const isActive = item.classList.contains('active');

    // If not allowing multiple, close all others
    if (!this.allowMultiple) {
      this.items.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('[data-accordion-content]');
          otherContent.style.maxHeight = '0px';
        }
      });
    }

    // Toggle current item
    if (isActive) {
      item.classList.remove('active');
      content.style.maxHeight = '0px';
    } else {
      item.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  }
}

/**
 * Dropdown Component
 */
class Dropdown {
  constructor(dropdownElement) {
    this.dropdown = dropdownElement;
    this.trigger = this.dropdown.querySelector('[data-dropdown-trigger]');
    this.menu = this.dropdown.querySelector('[data-dropdown-menu]');
    this.isOpen = false;

    if (this.trigger && this.menu) {
      this.init();
    }
  }

  init() {
    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target) && this.isOpen) {
        this.close();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.menu.classList.add('active');
    this.isOpen = true;
  }

  close() {
    this.menu.classList.remove('active');
    this.isOpen = false;
  }
}

/**
 * Form Validation Component
 */
class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.errors = {};
    this.rules = {};
  }

  addRule(fieldName, rules) {
    this.rules[fieldName] = rules;
  }

  validate() {
    this.errors = {};
    let isValid = true;

    Object.keys(this.rules).forEach((fieldName) => {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      const rules = this.rules[fieldName];
      const value = field?.value.trim();

      // Required validation
      if (rules.required && !value) {
        this.errors[fieldName] = rules.requiredMessage || 'This field is required';
        isValid = false;
        return;
      }

      // Email validation
      if (rules.email && value && !Utils.isValidEmail(value)) {
        this.errors[fieldName] = rules.emailMessage || 'Please enter a valid email';
        isValid = false;
        return;
      }

      // Phone validation
      if (rules.phone && value && !Utils.isValidPhone(value)) {
        this.errors[fieldName] = rules.phoneMessage || 'Please enter a valid phone number';
        isValid = false;
        return;
      }

      // Min length validation
      if (rules.minLength && value && value.length < rules.minLength) {
        this.errors[fieldName] =
          rules.minLengthMessage || `Minimum ${rules.minLength} characters required`;
        isValid = false;
        return;
      }

      // Custom validation
      if (rules.custom && typeof rules.custom === 'function') {
        const customResult = rules.custom(value, field);
        if (customResult !== true) {
          this.errors[fieldName] = customResult;
          isValid = false;
          return;
        }
      }
    });

    return isValid;
  }

  showErrors() {
    // Clear previous errors
    this.form.querySelectorAll('.error-message').forEach((el) => el.remove());
    this.form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));

    // Show new errors
    Object.keys(this.errors).forEach((fieldName) => {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      if (field) {
        field.classList.add('error');

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = this.errors[fieldName];
        errorDiv.style.color = 'var(--error)';
        errorDiv.style.fontSize = 'var(--body-sm-size)';
        errorDiv.style.marginTop = 'var(--space-2xs)';

        field.parentElement.appendChild(errorDiv);
      }
    });
  }

  clearErrors() {
    this.errors = {};
    this.form.querySelectorAll('.error-message').forEach((el) => el.remove());
    this.form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));
  }
}

/**
 * Image Lazy Loader
 */
class LazyLoader {
  constructor(selector = '[data-lazy]') {
    this.images = document.querySelectorAll(selector);
    this.observer = null;

    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      this.images.forEach((img) => this.observer.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      this.images.forEach((img) => this.loadImage(img));
    }
  }

  loadImage(img) {
    const src = img.dataset.lazy;
    if (src) {
      img.src = src;
      img.removeAttribute('data-lazy');
      img.classList.add('loaded');
    }
  }
}

// Export components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CountdownTimer,
    Modal,
    Tabs,
    Accordion,
    Dropdown,
    FormValidator,
    LazyLoader,
  };
}