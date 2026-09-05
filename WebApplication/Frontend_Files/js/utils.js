/**
 * Utility Functions
 * Common helper functions used throughout the application
 */

const Utils = {
  /**
   * Format currency in Jordanian Dinar
   * @param {number} amount - The amount to format
   * @param {boolean} includeDecimals - Whether to include decimal places
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount, includeDecimals = false) {
    const formatter = new Intl.NumberFormat('en-JO', {
      style: 'currency',
      currency: 'JOD',
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : 0,
    });
    return formatter.format(amount).replace('JOD', '').trim() + ' JOD';
  },

  /**
   * Format number with commas
   * @param {number} number - The number to format
   * @returns {string} Formatted number string
   */
  formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
  },

  /**
   * Calculate time remaining until a specific date
   * @param {Date|string} endDate - The end date
   * @returns {Object} Object containing days, hours, minutes, seconds
   */
  getTimeRemaining(endDate) {
    const total = Date.parse(endDate) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
      isExpired: total <= 0,
    };
  },

  /**
   * Format countdown timer display
   * @param {Object} timeRemaining - Object from getTimeRemaining
   * @returns {string} Formatted time string
   */
  formatCountdown(timeRemaining) {
    if (timeRemaining.isExpired) {
      return 'Ended';
    }

    const { days, hours, minutes, seconds } = timeRemaining;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  },

  /**
   * Debounce function to limit function execution rate
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function to limit function execution rate
   * @param {Function} func - Function to throttle
   * @param {number} limit - Limit time in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Get URL query parameters
   * @param {string} param - Parameter name
   * @returns {string|null} Parameter value or null
   */
  getUrlParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  /**
   * Set URL query parameter without page reload
   * @param {string} param - Parameter name
   * @param {string} value - Parameter value
   */
  setUrlParameter(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
  },

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number (simple validation)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid phone
   */
  isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Sanitize HTML to prevent XSS
   * @param {string} html - HTML string to sanitize
   * @returns {string} Sanitized HTML
   */
  sanitizeHTML(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
  },

  /**
   * Generate random ID
   * @param {number} length - Length of ID
   * @returns {string} Random ID
   */
  generateId(length = 8) {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
  },

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  },

  /**
   * Show toast notification (requires toast element in HTML)
   * @param {string} message - Message to display
   * @param {string} type - Type of toast (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds
   */
  showToast(message, type = 'info', duration = 3000) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 8px;
      background: var(--surface-container-lowest);
      box-shadow: var(--shadow-level-3);
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `;

    // Set color based on type
    const colors = {
      success: 'var(--status-verified-bg)',
      error: 'var(--error-container)',
      warning: 'var(--status-ending-bg)',
      info: 'var(--status-starting-bg)',
    };
    toast.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(toast);

    // Remove after duration
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /**
   * Scroll to element smoothly
   * @param {string|HTMLElement} element - Element or selector
   * @param {number} offset - Offset from top in pixels
   */
  scrollToElement(element, offset = 0) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  },

  /**
   * Check if element is in viewport
   * @param {HTMLElement} element - Element to check
   * @returns {boolean} True if in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Local storage helper with JSON support
   */
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.error('Storage set error:', err);
        return false;
      }
    },
    get(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (err) {
        console.error('Storage get error:', err);
        return null;
      }
    },
    remove(key) {
      localStorage.removeItem(key);
    },
    clear() {
      localStorage.clear();
    },
  },
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}