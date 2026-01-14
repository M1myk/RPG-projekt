// Hide auth button initially to prevent flickering
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuthUI);
} else {
    initializeAuthUI();
}

function initializeAuthUI() {
    // Navigation elements for logged in users
    const navCreate = document.getElementById('nav-create');
    const navMyCampaigns = document.getElementById('nav-my-campaigns');
    
    // Universal user action element
    const navUserAction = document.getElementById('nav-user-action');
    
    // Logout element
    const navLogout = document.getElementById('nav-logout');

    // Sign Up button on main page
    const signupButton = document.getElementById('signup-button');

    // Check if all navigation elements exist
    if (!navCreate || !navMyCampaigns || !navUserAction || !navLogout) {
        console.warn("One or more navigation elements are missing.");
    }

    // Main Firebase function to track login state
    auth.onAuthStateChanged(user => {
        const userActionLink = navUserAction ? navUserAction.querySelector('a') : null;

        if (user) {
            // --- USER IS LOGGED IN ---
            
            // Show links for logged in users
            if (navCreate) navCreate.style.display = 'list-item';
            if (navMyCampaigns) navMyCampaigns.style.display = 'list-item';

            // Change universal button to "My profile"
            if (userActionLink) {
                userActionLink.textContent = 'My profile';
                userActionLink.href = 'profile.html';
            }
            
            // Show "Logout" button
            if (navLogout) {
                navLogout.style.display = 'list-item';
                const logoutLink = navLogout.querySelector('a');
                logoutLink.onclick = (event) => {
                    event.preventDefault();
                    
                    // Mark user as offline before signing out
                    if (user) {
                        db.collection('users').doc(user.uid).update({
                            isOnline: false
                        }).catch(error => {
                            console.error("Error marking user offline:", error);
                        });
                    }
                    
                    auth.signOut().then(() => {
                        window.location.href = 'index.html';
                    });
                };
            }

            // Hide "Sign Up" button on main page
            if (signupButton) {
                signupButton.style.display = 'none';
            }

        } else {
            // --- USER IS NOT LOGGED IN ---

            // Hide links for logged in users
            if (navCreate) navCreate.style.display = 'none';
            if (navMyCampaigns) navMyCampaigns.style.display = 'none';
            
            // Change universal button to "Sign In"
            if (userActionLink) {
                userActionLink.textContent = 'Sign In';
                userActionLink.href = 'login.html';
            }
            
            // Hide "Logout" button
            if (navLogout) navLogout.style.display = 'none';
            
            // Show "Sign Up" button on main page
            if (signupButton) {
                signupButton.style.display = 'block';
            }
        }
        
        // Make the button visible after auth state is determined
        if (navUserAction) {
            navUserAction.style.visibility = 'visible';
        }
    });
}

// Initialize internationalization system (i18n)
function initializeLanguageSystem() {
    // Check if translations.js has been loaded
    if (typeof setLanguage !== 'function') {
        console.warn('translations.js not loaded');
        return;
    }

    // Load saved language from localStorage or use default 'en'
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    const langSelector = document.getElementById('language');
    if (langSelector) {
        // Set current selector value
        langSelector.value = savedLanguage;
        
        // Apply language to page
        setLanguage(savedLanguage);
        
        // Event listener for language change
        langSelector.addEventListener('change', (event) => {
            const selectedLang = event.target.value;
            setLanguage(selectedLang);
        });
    } else {
        // If no selector, apply default language
        setLanguage(savedLanguage);
    }
}

// Run after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeLanguageSystem, 100); // Small delay to ensure all elements are rendered
    });
} else {
    initializeLanguageSystem();
}

// Handle user email display
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        const emailDisplayElement = document.getElementById('user-email-display');
        if (emailDisplayElement && user) {
            emailDisplayElement.textContent = user.email;
        }
    });
});

// Handle orc image interactions
document.addEventListener('DOMContentLoaded', () => {
    const orcImage = document.getElementById('orc-image');
    const killButton = document.getElementById('kill-btn');
    const mercyButton = document.getElementById('mercy-btn');

    if (orcImage && killButton && mercyButton) {
        killButton.addEventListener('click', (event) => {
            event.preventDefault(); 
            console.log("Action: Kill");
            orcImage.src = 'ork-photo-dead.png'; 
        });

        mercyButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log("Action: Mercy");
            orcImage.src = 'ork-photo-alive.png';
        });
    } else {
        console.warn("One or more elements for the orc interaction are missing.");
    }
});


document.addEventListener('DOMContentLoaded', () => {
    loadHomepageStats();
    
});


