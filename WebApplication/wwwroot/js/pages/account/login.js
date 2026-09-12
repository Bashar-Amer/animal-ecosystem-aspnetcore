document.addEventListener('DOMContentLoaded', initPasswordToggle);

function initPasswordToggle() {
    const toggleBtn = document.getElementById('togglePasswordBtn');
    const passwordInput = document.getElementById('Password');
    const toggleIcon = document.getElementById('passwordToggleIcon');

    if (toggleBtn && passwordInput && toggleIcon) {
        toggleBtn.addEventListener('click', () => {
            const show = passwordInput.type === 'password';
            passwordInput.type = show ? 'text' : 'password';
            toggleIcon.textContent = show ? 'visibility_off' : 'visibility';
        });
    }
}