 document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const rememberCheckbox = document.getElementById("remember-me");

    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        const { username, password, remember } = JSON.parse(rememberedUser);
        if (remember) {
            usernameInput.value = username;
            passwordInput.value = atob(password);
            rememberCheckbox.checked = true;
        } else {
            localStorage.removeItem('rememberedUser');
        }
    }

    function setupSmartAutofill() {
        const savedData = localStorage.getItem('formData');
        if (!savedData) return;
        const { username, password } = JSON.parse(savedData);
        usernameInput.addEventListener('input', function () {
            if (this.value === username) {
                passwordInput.value = atob(password);
                setTimeout(() => {
                    if (passwordInput.value === atob(password)) {
                        passwordInput.value = '';
                    }
                }, 3000);
            }
        });
    }

    function validateUsername() {
        const value = usernameInput.value.trim();
        const words = value.split(/\s+/);
        const allWordsValid = words.every(word => /^[a-zA-Z]+$/.test(word));
        const totalLetters = words.join('').length;

        if (!value) return "Username is required";
        if (!allWordsValid || totalLetters < 3) return "Only letters (min 3 characters, spaces allowed)";
        return "";
    }

    function validatePassword() {
    const value = passwordInput.value;
    if (!value) return "Password is required";
    if (!/^(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)) {
        return "Password must contain: 8+ chars, lowercase, number & special char";
    }
    return "";
    }


    function showError(input, message) {
        const errorElement = document.getElementById(`error-${input.id}`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            input.classList.add('invalid');
        }
    }

    function clearError(input) {
        const errorElement = document.getElementById(`error-${input.id}`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            input.classList.remove('invalid');
        }
    }

    function checkUserCredentials(username, password) {
        const savedData = localStorage.getItem('formData');
        if (!savedData) return { isValid: false, message: "Username not registered", field: "username" };
        const { username: savedUsername, password: savedPassword } = JSON.parse(savedData);
        const decryptedPassword = atob(savedPassword);
        if (username !== savedUsername) {
            return { isValid: false, message: "Username not found", field: "username" };
        }
        if (password !== decryptedPassword) {
            return { isValid: false, message: "Incorrect password", field: "password" };
        }
        return { isValid: true };
    }

    usernameInput.addEventListener('input', () => {
        clearError(usernameInput);
        const error = validateUsername();
        if (error) showError(usernameInput, error);
    });

    passwordInput.addEventListener('input', () => {
        clearError(passwordInput);
        const error = validatePassword();
        if (error) showError(passwordInput, error);
    });

    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function () {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePasswordBtn.src = passwordInput.type === 'password' ? '../images/two-eyelashes.png' : '../images/cartoon-eyes.png';
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isFormValid = true;
        const usernameError = validateUsername();
        if (usernameError) {
            showError(usernameInput, usernameError);
            isFormValid = false;
        }
        const passwordError = validatePassword();
        if (passwordError) {
            showError(passwordInput, passwordError);
            isFormValid = false;
        }
        if (isFormValid) {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const remember = rememberCheckbox.checked;
            const { isValid, message, field } = checkUserCredentials(username, password);
            if (!isValid) {
                showError(document.getElementById(field), message);
                return;
            }
            if (remember) {
                localStorage.setItem('rememberedUser', JSON.stringify({
                    username,
                    password: btoa(password),
                    remember: true
                }));
            } else {
                localStorage.removeItem('rememberedUser');
            }
            window.location.href = "launch.html";
        }
    });

    setupSmartAutofill();
});