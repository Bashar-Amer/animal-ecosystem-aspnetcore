/**
 * Register Page Specific Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initRoleSelector();
  initPasswordToggles();
  initPasswordStrengthChecker();
});

/**
 * Handle account role selection (Breeder vs Vet)
 */
function initRoleSelector() {
  const roleButtons = document.querySelectorAll('.role-btn');
  const hiddenInput = document.getElementById('accountRole');

  if (roleButtons.length === 0 || !hiddenInput) return;

  roleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const role = btn.dataset.role;
      hiddenInput.value = role;

      roleButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/**
 * Initialize password visibility toggles
 */
function initPasswordToggles() {
  setupToggle('togglePasswordBtn', 'password', 'passwordToggleIcon');
  setupToggle('confirmToggleBtn', 'confirmPassword', 'confirmToggleIcon');
}

function setupToggle(btnId, inputId, iconId) {
  const toggleBtn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (toggleBtn && input && icon) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      icon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });
  }
}

/**
 * Initialize password strength indicator
 */
function initPasswordStrengthChecker() {
  const passwordInput = document.getElementById('password');
  if (!passwordInput) return;

  passwordInput.addEventListener('input', (e) => {
    const val = e.target.value;
    const bars = [
      document.getElementById('bar1'),
      document.getElementById('bar2'),
      document.getElementById('bar3'),
      document.getElementById('bar4')
    ];
    const strengthText = document.getElementById('strengthText');

    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    bars.forEach((b) => {
      b.style.backgroundColor = 'transparent';
    });

    if (val.length === 0) {
      strengthText.textContent = 'Security Strength: None';
      strengthText.style.color = 'var(--muted-neutral)';
      strengthText.style.fontWeight = 'normal';
      return;
    }

    if (score === 1) {
      bars[0].style.backgroundColor = 'var(--error)';
      strengthText.textContent = 'Security Strength: Weak';
      strengthText.style.color = 'var(--error)';
      strengthText.style.fontWeight = 'bold';
    } else if (score === 2) {
      bars[0].style.backgroundColor = 'var(--secondary-container)';
      bars[1].style.backgroundColor = 'var(--secondary-container)';
      strengthText.textContent = 'Security Strength: Fair';
      strengthText.style.color = 'var(--secondary)';
      strengthText.style.fontWeight = 'bold';
    } else if (score === 3) {
      bars[0].style.backgroundColor = 'var(--secondary)';
      bars[1].style.backgroundColor = 'var(--secondary)';
      bars[2].style.backgroundColor = 'var(--secondary)';
      strengthText.textContent = 'Security Strength: Good';
      strengthText.style.color = 'var(--secondary)';
      strengthText.style.fontWeight = 'bold';
    } else if (score >= 4) {
      bars.forEach((b) => b.style.backgroundColor = 'var(--primary-container)');
      strengthText.textContent = 'Security Strength: Excellent';
      strengthText.style.color = 'var(--primary)';
      strengthText.style.fontWeight = 'bold';
    }
  });
}