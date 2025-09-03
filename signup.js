document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const submitButton = form.querySelector('button[type="submit"]');

    // Defines validation rules for each form field.
    const validationRules = {
        firstName: { required: true, minLength: 2, message: 'First name must be at least 2 characters.' },
        lastName: { required: true, minLength: 2, message: 'Last name must be at least 2 characters.' },
        email: { required: true, pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i, message: 'Please enter a valid email.' },
        password: { required: true, minLength: 8, message: 'Password must be at least 8 characters.' },
        confirmPassword: { required: true, custom: (value) => value === document.getElementById('password').value, message: 'Passwords do not match.' },
        skillsToTeach: { required: true, message: 'Please list at least one skill.' },
        skillsToLearn: { required: true, message: 'Please list at least one skill.' },
        terms: { required: true, message: 'You must accept the terms.' }
    };

    // Displays an error message for a field.
    function showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        field.parentElement.classList.add('error');
        field.parentElement.classList.remove('success');
        errorElement.textContent = message;
    }

    // Shows a success state for a field.
    function showSuccess(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');
        field.parentElement.classList.add('success');
        field.parentElement.classList.remove('error');
        errorElement.textContent = '';
    }

    // Validates a single field based on the rules.
    function validateField(fieldName) {
        const rule = validationRules[fieldName];
        const field = document.getElementById(fieldName);
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();

        if (rule.required && !value) {
            showError(fieldName, rule.message);
            return false;
        }
        if (rule.minLength && value.length < rule.minLength) {
            showError(fieldName, rule.message);
            return false;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
            showError(fieldName, rule.message);
            return false;
        }
        if (rule.custom && !rule.custom(field.value)) {
            showError(fieldName, rule.message);
            return false;
        }
        
        if(value){
            showSuccess(fieldName);
        }
        return true;
    }

    // Attaches event listeners to validate fields when the user moves away from them.
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName));
        }
    });

    // Handles the main form submission.
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevents the browser from reloading.
        
        let isFormValid = true;
        // Checks all fields before submitting.
        Object.keys(validationRules).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;

            // Simulates a network delay.
            setTimeout(function() {
                // Creates the user object by directly getting values from each input.
                const newUser = {
                    firstName: document.getElementById('firstName').value.trim(),
                    lastName: document.getElementById('lastName').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    bio: document.getElementById('bio').value.trim(),
                    skillsToTeach: document.getElementById('skillsToTeach').value.split(',').map(skill => skill.trim()).filter(skill => skill),
                    skillsToLearn: document.getElementById('skillsToLearn').value.split(',').map(skill => skill.trim()).filter(skill => skill),
                    dateJoined: new Date().toISOString()
                };

                // Stores the new user's data in local storage.
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                
                // Shows a success message.
                form.style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';
                
                // Redirects to the profile page.
                setTimeout(function() {
                    window.location.href = 'profile.html';
                }, 2000);

            }, 1000);
        }
    });
});