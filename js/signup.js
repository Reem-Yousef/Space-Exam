document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');

    const inputs = {
        username: document.getElementById('username'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        confpass: document.getElementById('confpass')
    };

    const validators = {
        username: {
            validate: value => {
                if (!value) return 'Name is required';
                if (!/^[a-zA-Z]{3,}$/.test(value)) return 'Only letters (min 3 characters)';
                return '';
            },
            errorElement: document.getElementById('error-username')
        },
        email: {
            validate: value => {
                if (!value) return 'Email is required';
                if (!/^[\w.-]+@(gmail|yahoo)\.com$/.test(value)) return 'Enter valid email (user@gmail/yahoo.com)';
                return '';
            },
            errorElement: document.getElementById('error-email')
        },
        password: {
            validate: value => {
                if (!value) return 'Password is required';
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) {
                    return 'Password must be 8+ chars with upper/lowercase, number & special char';
                }
                return '';
            },
            errorElement: document.getElementById('error-password')
        },
        confpass: {
            validate: (value, passwordValue) => {
                if (!value) return 'Please confirm your password';
                if (value !== passwordValue) return "Passwords don't match";
                return '';
            },
            errorElement: document.getElementById('error-confpass')
        }
    };

    function showError(inputName, message) {
        const { errorElement } = validators[inputName];
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputs[inputName].classList.add('invalid');
    }

    function clearError(inputName) {
        const { errorElement } = validators[inputName];
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        inputs[inputName].classList.remove('invalid');
    }

    function validateInput(inputName) {
        const value = inputs[inputName].value;
        const error = inputName === 'confpass'
            ? validators.confpass.validate(value, inputs.password.value)
            : validators[inputName].validate(value);

        if (error) {
            showError(inputName, error);
            return false;
        } else {
            clearError(inputName);
            return true;
        }
    }

    function setupRealTimeValidation() {
        Object.keys(inputs).forEach(inputName => {
            const input = inputs[inputName];
            
            input.addEventListener('input', function () {
                clearTimeout(input.debounceTimer);
                input.debounceTimer = setTimeout(() => {
                    validateInput(inputName);
                }, 400);
            });

            input.addEventListener('blur', () => validateInput(inputName));
        });
    }

    function togglePasswordVisibility(input, icon) {
        input.type = input.type === 'password' ? 'text' : 'password';
        icon.src = input.type === 'password' ? '../images/two-eyelashes.png' : '../images/cartoon-eyes.png';
    }

    function setupPasswordToggles() {
        const togglePassword = document.getElementById('toggle-password');
        const toggleConfpass = document.getElementById('toggle-confpass');

        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                togglePasswordVisibility(inputs.password, togglePassword);
            });
        }

        if (toggleConfpass) {
            toggleConfpass.addEventListener('click', () => {
                togglePasswordVisibility(inputs.confpass, toggleConfpass);
            });
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isFormValid = true;

        Object.keys(inputs).forEach(inputName => {
            const isValid = validateInput(inputName);
            if (!isValid) isFormValid = false;
        });

        if (isFormValid) {
            const formData = {
                username: inputs.username.value,
                email: inputs.email.value,
                password: btoa(inputs.password.value)
            };

            localStorage.setItem('formData', JSON.stringify(formData));

            form.classList.add('submitting');
            setTimeout(() => {
                form.reset();
                form.classList.remove('submitting');
                window.location.href = 'login.html';
            }, 800);
        } else {
            const firstInvalid = Object.keys(inputs).find(key => !validateInput(key));
            if (firstInvalid) inputs[firstInvalid].focus();
        }
    });

    setupRealTimeValidation();
    setupPasswordToggles();
});
