// Authentication page functionality
document.addEventListener('DOMContentLoaded', () => {
    initAuthPage();
    setupFormValidation();
    setupSocialLogin();
    animatePageElements();
});

function initAuthPage() {
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    const institutionSelect = document.getElementById('institution');
    const otherInstitution = document.getElementById('otherInstitution');

    // Set initial state
    showLogin();

    // Tab switching
    loginTab.addEventListener('click', showLogin);
    signupTab.addEventListener('click', showSignup);
    switchToSignup.addEventListener('click', showSignup);
    switchToLogin.addEventListener('click', showLogin);

    function showLogin() {
        // Update tabs
        loginTab.classList.add('bg-gradient-to-r', 'from-constellation-primary', 'to-constellation-secondary', 'text-white');
        loginTab.classList.remove('text-constellation-light');
        signupTab.classList.remove('bg-gradient-to-r', 'from-constellation-primary', 'to-constellation-secondary', 'text-white');
        signupTab.classList.add('text-constellation-light');

        // Animate forms
        gsap.to(signupForm, {
            duration: 0.3,
            opacity: 0,
            x: 50,
            ease: "power2.in",
            onComplete: () => {
                signupForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                gsap.fromTo(loginForm, {
                    opacity: 0,
                    x: -50
                }, {
                    duration: 0.4,
                    opacity: 1,
                    x: 0,
                    ease: "power2.out"
                });
            }
        });
    }

    function showSignup() {
        // Update tabs
        signupTab.classList.add('bg-gradient-to-r', 'from-constellation-primary', 'to-constellation-secondary', 'text-white');
        signupTab.classList.remove('text-constellation-light');
        loginTab.classList.remove('bg-gradient-to-r', 'from-constellation-primary', 'to-constellation-secondary', 'text-white');
        loginTab.classList.add('text-constellation-light');

        // Animate forms
        gsap.to(loginForm, {
            duration: 0.3,
            opacity: 0,
            x: -50,
            ease: "power2.in",
            onComplete: () => {
                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
                gsap.fromTo(signupForm, {
                    opacity: 0,
                    x: 50
                }, {
                    duration: 0.4,
                    opacity: 1,
                    x: 0,
                    ease: "power2.out"
                });
            }
        });
    }

    // Institution selection handling
    institutionSelect.addEventListener('change', (e) => {
        if (e.target.value === 'other') {
            otherInstitution.style.display = 'block';
            gsap.fromTo(otherInstitution, {
                opacity: 0,
                height: 0
            }, {
                duration: 0.3,
                opacity: 1,
                height: 'auto',
                ease: "power2.out"
            });
        } else {
            gsap.to(otherInstitution, {
                duration: 0.3,
                opacity: 0,
                height: 0,
                ease: "power2.in",
                onComplete: () => {
                    otherInstitution.style.display = 'none';
                }
            });
        }
    });

    // Populate graduation years
    const currentYear = new Date().getFullYear();
    const graduationSelect = document.getElementById('graduationYear');
    for (let year = currentYear + 4; year >= currentYear - 50; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        graduationSelect.appendChild(option);
    }

    // User type selection styling
    document.querySelectorAll('input[name="userType"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Reset all options
            document.querySelectorAll('.user-type-option div').forEach(div => {
                div.classList.remove('border-constellation-primary', 'bg-constellation-primary/20');
                div.classList.add('border-constellation-glow/30');
            });

            // Highlight selected option
            const selectedDiv = e.target.parentElement.querySelector('div');
            selectedDiv.classList.remove('border-constellation-glow/30');
            selectedDiv.classList.add('border-constellation-primary', 'bg-constellation-primary/20');

            // Animate selection
            gsap.fromTo(selectedDiv, {
                scale: 0.95
            }, {
                duration: 0.2,
                scale: 1,
                ease: "back.out(1.7)"
            });
        });
    });
}

function setupFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Login form validation
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (validateLogin(email, password)) {
            showLoadingState(e.target);
            
            // Simulate login process
            setTimeout(() => {
                showSuccessMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'search.html';
                }, 1500);
            }, 2000);
        }
    });

    // Signup form validation
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = collectSignupData();
        
        if (validateSignup(formData)) {
            showLoadingState(e.target);
            
            // Simulate signup process
            setTimeout(() => {
                showSuccessMessage('Account created successfully! Please check your email to verify your account.');
                setTimeout(() => {
                    // Switch to login form
                    document.getElementById('loginTab').click();
                }, 2000);
            }, 2000);
        }
    });

    // Real-time validation
    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', (e) => {
            validateField(e.target);
        });

        input.addEventListener('focus', (e) => {
            clearFieldError(e.target);
        });
    });
}

function validateLogin(email, password) {
    let isValid = true;

    if (!validateEmail(email)) {
        showFieldError('loginEmail', 'Please enter a valid email address');
        isValid = false;
    }

    if (password.length < 6) {
        showFieldError('loginPassword', 'Password must be at least 6 characters');
        isValid = false;
    }

    return isValid;
}

function collectSignupData() {
    return {
        userType: document.querySelector('input[name="userType"]:checked')?.value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('signupEmail').value,
        institution: document.getElementById('institution').value === 'other' 
            ? document.getElementById('customInstitution').value 
            : document.getElementById('institution').value,
        graduationYear: document.getElementById('graduationYear').value,
        fieldOfStudy: document.getElementById('fieldOfStudy').value,
        password: document.getElementById('signupPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        agreeTerms: document.getElementById('agreeTerms').checked
    };
}

function validateSignup(data) {
    let isValid = true;

    if (!data.userType) {
        showErrorMessage('Please select your role (Student, Alumni, or Institution)');
        isValid = false;
    }

    if (!data.firstName.trim()) {
        showFieldError('firstName', 'First name is required');
        isValid = false;
    }

    if (!data.lastName.trim()) {
        showFieldError('lastName', 'Last name is required');
        isValid = false;
    }

    if (!validateEmail(data.email)) {
        showFieldError('signupEmail', 'Please enter a valid email address');
        isValid = false;
    }

    if (!data.institution) {
        showFieldError('institution', 'Please select your institution');
        isValid = false;
    }

    if (!data.graduationYear) {
        showFieldError('graduationYear', 'Please select your graduation year');
        isValid = false;
    }

    if (!data.fieldOfStudy) {
        showFieldError('fieldOfStudy', 'Please select your field of study');
        isValid = false;
    }

    if (!validatePassword(data.password)) {
        showFieldError('signupPassword', 'Password must be at least 8 characters with uppercase, lowercase, and numbers');
        isValid = false;
    }

    if (data.password !== data.confirmPassword) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }

    if (!data.agreeTerms) {
        showErrorMessage('Please agree to the Terms of Service and Privacy Policy');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    switch (field.type) {
        case 'email':
            if (value && !validateEmail(value)) {
                showFieldError(field.id, 'Please enter a valid email address');
                return false;
            }
            break;
        case 'password':
            if (field.id === 'signupPassword' && value && !validatePassword(value)) {
                showFieldError(field.id, 'Password must be at least 8 characters with uppercase, lowercase, and numbers');
                return false;
            }
            if (field.id === 'confirmPassword') {
                const password = document.getElementById('signupPassword').value;
                if (value && value !== password) {
                    showFieldError(field.id, 'Passwords do not match');
                    return false;
                }
            }
            break;
    }

    clearFieldError(field);
    return true;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    clearFieldError(field);

    const errorElement = document.createElement('div');
    errorElement.className = 'field-error text-red-400 text-sm mt-1';
    errorElement.textContent = message;

    field.parentElement.appendChild(errorElement);
    field.classList.add('border-red-400');

    // Animate error appearance
    gsap.fromTo(errorElement, {
        opacity: 0,
        y: -10
    }, {
        duration: 0.3,
        opacity: 1,
        y: 0,
        ease: "power2.out"
    });
}

function clearFieldError(field) {
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.classList.remove('border-red-400');
}

function showLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.innerHTML = `
        <div class="flex items-center justify-center space-x-2">
            <div class="loading-spinner w-5 h-5"></div>
            <span>Processing...</span>
        </div>
    `;

    // Animate button
    gsap.to(submitButton, {
        duration: 0.3,
        scale: 0.95,
        ease: "power2.out"
    });
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 z-50 p-4 rounded-lg shadow-lg max-w-md ${
        type === 'success' 
            ? 'bg-green-500/20 border border-green-500/50 text-green-100' 
            : 'bg-red-500/20 border border-red-500/50 text-red-100'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-start space-x-3">
            <div class="flex-shrink-0">
                ${type === 'success' 
                    ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>'
                    : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/></svg>'
                }
            </div>
            <div class="flex-1">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 text-current opacity-70 hover:opacity-100">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                </svg>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate notification
    gsap.fromTo(notification, {
        opacity: 0,
        x: 100,
        scale: 0.8
    }, {
        duration: 0.4,
        opacity: 1,
        x: 0,
        scale: 1,
        ease: "back.out(1.7)"
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        gsap.to(notification, {
            duration: 0.3,
            opacity: 0,
            x: 100,
            scale: 0.8,
            ease: "power2.in",
            onComplete: () => notification.remove()
        });
    }, 5000);
}

function setupSocialLogin() {
    document.querySelectorAll('.social-login button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const provider = button.textContent.trim();
            
            // Animate button
            gsap.to(button, {
                duration: 0.1,
                scale: 0.95,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            });

            showNotification(`${provider} login will be implemented soon!`, 'success');
        });
    });
}

function animatePageElements() {
    // Animate auth header
    gsap.fromTo('.auth-header', {
        opacity: 0,
        y: 30
    }, {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "power3.out",
        delay: 0.2
    });

    // Animate auth toggle
    gsap.fromTo('.auth-toggle', {
        opacity: 0,
        scale: 0.9
    }, {
        duration: 0.6,
        opacity: 1,
        scale: 1,
        ease: "back.out(1.7)",
        delay: 0.4
    });

    // Animate form
    gsap.fromTo('.auth-form', {
        opacity: 0,
        y: 20
    }, {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "power3.out",
        delay: 0.6
    });

    // Animate social login
    gsap.fromTo('.social-login', {
        opacity: 0,
        y: 20
    }, {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "power3.out",
        delay: 0.8
    });
}