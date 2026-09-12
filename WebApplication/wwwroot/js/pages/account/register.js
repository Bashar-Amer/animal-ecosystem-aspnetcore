document.addEventListener('DOMContentLoaded', () => {
    initRoleSelector();
    initPasswordToggles();
    initPasswordStrengthChecker();
    initLocationFields();
});

function initLocationFields() {
    const country = document.getElementById('Country');
    const city = document.getElementById('City');
    if (!country || !city) return;

    country.addEventListener('blur', () => {
        country.value = country.value.trim();
    });

    city.addEventListener('change', () => {
        city.setCustomValidity(city.value ? '' : 'Please select your city.');
    });
}

function initRoleSelector() {
    const btns = document.querySelectorAll('.role-btn');
    const input = document.getElementById('accountRole');
    if (!btns.length || !input) return;

    btns.forEach(btn => btn.addEventListener('click', () => {
        input.value = btn.dataset.role;
        btns.forEach(b => b.classList.toggle('active', b === btn));
    }));
}

function initPasswordToggles() {
    setupToggle('togglePasswordBtn', 'Password', 'passwordToggleIcon');
    setupToggle('confirmToggleBtn', 'ConfirmPassword', 'confirmToggleIcon');
}

function setupToggle(btnId, inputId, iconId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (btn && input && icon) {
        btn.addEventListener('click', () => {
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            icon.textContent = show ? 'visibility_off' : 'visibility';
        });
    }
}

function initPasswordStrengthChecker() {
    const input = document.getElementById('Password');
    if (!input) return;

    const bars = [1, 2, 3, 4].map(i => document.getElementById(`bar${i}`));
    const text = document.getElementById('strengthText');

    input.addEventListener('input', e => {
        const val = e.target.value;
        bars.forEach(b => b.style.backgroundColor = 'transparent');

        if (!val) {
            text.textContent = 'Security Strength: None';
            text.style.cssText = 'color:var(--muted-neutral);font-weight:normal';
            return;
        }

        const score = [val.length >= 8, /[A-Z]/.test(val), /[0-9]/.test(val), /[^A-Za-z0-9]/.test(val)].filter(Boolean).length;

        const configs = [
            { color: 'var(--error)', text: 'Weak', textColor: 'var(--error)', count: 1 },
            { color: 'var(--secondary-container)', text: 'Fair', textColor: 'var(--secondary)', count: 2 },
            { color: 'var(--secondary)', text: 'Good', textColor: 'var(--secondary)', count: 3 },
            { color: 'var(--primary-container)', text: 'Excellent', textColor: 'var(--primary)', count: 4 }
        ];

        const cfg = configs[score - 1] || configs[0];
        for (let i = 0; i < cfg.count; i++) bars[i].style.backgroundColor = cfg.color;
        text.textContent = `Security Strength: ${cfg.text}`;
        text.style.cssText = `color:${cfg.textColor};font-weight:bold`;
    });
}