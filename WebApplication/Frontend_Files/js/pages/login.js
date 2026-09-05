/**
 * Login Page Specific Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggle();
});

/**
 * Initialize the password visibility toggle
 */
function initPasswordToggle() {
  const toggleBtn = document.getElementById('togglePasswordBtn');
  const passwordInput = document.getElementById('password');
  const toggleIcon = document.getElementById('passwordToggleIcon');

  if (toggleBtn && passwordInput && toggleIcon) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      
      // Toggle attribute
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      
      // Update icon based on state
      toggleIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });
  }
}