document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth(); // Get access to the Authentication service

    const authForm = document.getElementById('authForm');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const authButton = document.getElementById('authButton');
    
    // Elements for switching form
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.createElement('a');
    switchToLogin.id = 'switch-to-login';
    switchToLogin.textContent = 'Log in here';

    let isRegisterMode = false; // Flag tracking mode (login or registration)

    // --- Functions for switching mode ---
    function setRegisterMode() {
        isRegisterMode = true;
        formTitle.textContent = 'Register';
        authButton.textContent = 'Sign Up';
        formSubtitle.innerHTML = 'Already have an account? ';
        formSubtitle.appendChild(switchToLogin);
    }

    function setLoginMode() {
        isRegisterMode = false;
        formTitle.textContent = 'Login';
        authButton.textContent = 'Log In';
        formSubtitle.innerHTML = 'Need an account? ';
        formSubtitle.appendChild(switchToRegister);
    }
    
    // --- Event handlers for switches ---
    switchToRegister.addEventListener('click', setRegisterMode);
    switchToLogin.addEventListener('click', setLoginMode);

    // Function to translate Firebase error codes into user-friendly messages
    function getErrorMessage(errorCode, isRegisterMode) {
        const errorMessages = {
            'auth/email-already-in-use': 'This email is already registered. Try another email or log in to your account.',
            'auth/invalid-email': 'Invalid email format.',
            'auth/weak-password': 'Password is too weak. Minimum 6 characters.',
            'auth/user-not-found': 'User with this email not found. Check your credentials or register.',
            'auth/wrong-password': 'Wrong password. Please try again.',
            'auth/invalid-credential': 'Invalid credentials. Check your email and password.',
            'auth/operation-not-allowed': 'Login is currently disabled. Please try later.',
            'auth/too-many-requests': 'Too many login attempts. Please try later.',
            'auth/network-request-failed': 'Network error. Check your internet connection.',
        };

        return errorMessages[errorCode] || (
            isRegisterMode 
                ? 'Error during registration. Please try again.'
                : 'Error during login. Please try again.'
        );
    }

    // --- Main form submission handler ---
    authForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        authButton.disabled = true;
        const email = emailInput.value;
        const password = passwordInput.value;

        if (isRegisterMode) {
            // --- REGISTRATION LOGIC ---
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // User successfully created and automatically logged in
                    console.log('The user is now logged in:', userCredential.user);
                    
                    // Create user record in Firestore
                    db.collection('users').doc(userCredential.user.uid).set({
                        uid: userCredential.user.uid,
                        email: userCredential.user.email,
                        isOnline: true,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    }).catch(error => {
                        console.error("Error creating user record:", error);
                    });
                    
                    showFeedback('Registration successful! Redirecting...', 'success');
                    // Redirect to main page or campaign panel
                    setTimeout(() => { window.location.href = 'campaign-panel.html'; }, 1500);
                })
                .catch((error) => {
                    // Handle registration errors
                    console.error('Error in registration:', error);
                    const userFriendlyMessage = getErrorMessage(error.code, true);
                    showFeedback(userFriendlyMessage, 'error');
                    authButton.disabled = false;
                });
        } else {
            // --- LOGIN LOGIC ---
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // User successfully logged in
                    console.log('The user is now logged in:', userCredential.user);
                    
                    // Update user online status in Firestore
                    db.collection('users').doc(userCredential.user.uid).update({
                        isOnline: true,
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                    }).catch(error => {
                        console.error("Error updating user status:", error);
                    });
                    
                    showFeedback('Login successful! Redirecting...', 'success');
                    // Redirect to main page or campaign panel
                    setTimeout(() => { window.location.href = 'campaign-panel.html'; }, 1500);
                })
                .catch((error) => {
                    // Handle login errors
                    console.error('Error in login:', error);
                    const userFriendlyMessage = getErrorMessage(error.code, false);
                    showFeedback(userFriendlyMessage, 'error');
                    authButton.disabled = false;
                });
        }
    });

    // Helper function to display messages
    function showFeedback(message, type) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = `feedback feedback-${type}`;
    }
});