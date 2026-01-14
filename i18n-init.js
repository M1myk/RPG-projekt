// Universal i18n initialization script - Place this BEFORE other scripts
// This ensures translations are loaded and applied properly on all pages

// 1. Initialize language system when DOM is ready
function initializeLanguageSystem() {
    // Check if translations.js is loaded
    if (typeof setLanguage !== 'function') {
        console.warn('translations.js not loaded properly');
        return;
    }

    // Get saved language from localStorage or default to English
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    // Find language selector
    const langSelector = document.getElementById('language');
    
    if (langSelector) {
        // Set selector to saved language
        langSelector.value = savedLanguage;
        
        // Apply translations to page
        applyLanguage(savedLanguage);
        
        // Listen for language changes
        langSelector.addEventListener('change', (event) => {
            const selectedLanguage = event.target.value;
            applyLanguage(selectedLanguage);
        });
    } else {
        // If no selector found, just apply the saved language
        applyLanguage(savedLanguage);
    }
}

// 2. Apply language to all elements with data-i18n attribute
function applyLanguage(lang) {
    // Validate language
    if (!translations[lang]) {
        console.warn(`Language ${lang} not found, using 'en'`);
        lang = 'en';
    }
    
    // Save to localStorage
    localStorage.setItem('language', lang);
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        } else {
            console.warn(`Missing translation: ${lang}.${key}`);
        }
    });
    
    // Update language selector value
    const langSelector = document.getElementById('language');
    if (langSelector && langSelector.value !== lang) {
        langSelector.value = lang;
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    console.log(`Language changed to: ${lang}`);
}

// 3. Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Small delay to ensure all DOM elements are ready
        setTimeout(initializeLanguageSystem, 50);
    });
} else {
    // DOM is already loaded
    initializeLanguageSystem();
}
