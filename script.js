document.addEventListener('DOMContentLoaded', () => {
    // Elementy nawigacji dla zalogowanych użytkowników
    const navCreate = document.getElementById('nav-create');
    const navMyCampaigns = document.getElementById('nav-my-campaigns');
    
    // Nasz nowy uniwersalny element
    const navUserAction = document.getElementById('nav-user-action');
    
    // Nowy element do wylogowania
    const navLogout = document.getElementById('nav-logout');

    // Przycisk Sign Up na głównej stronie
    const signupButton = document.getElementById('signup-button');

    // Sprawdzamy, czy wszystkie elementy menu istnieją
    if (!navCreate || !navMyCampaigns || !navUserAction || !navLogout) {
        console.warn("Jeden lub więcej elementów nawigacji brakuje.");
    }

    // Główna funkcja Firebase do śledzenia stanu zalogowania
    auth.onAuthStateChanged(user => {
        const userActionLink = navUserAction ? navUserAction.querySelector('a') : null;

        if (user) {
            // --- UŻYTKOWNIK ZALOGOWANY ---
            
            // Pokazujemy linki przeznaczone dla zalogowanych
            if (navCreate) navCreate.style.display = 'list-item';
            if (navMyCampaigns) navMyCampaigns.style.display = 'list-item';

            // Zmieniamy uniwersalny przycisk na "Mój profil"
            if (userActionLink) {
                userActionLink.textContent = 'Mój profil';
                userActionLink.href = 'profile.html'; // Ustawiamy link do strony profilu
            }
            
            // Pokazujemy przycisk "Wyloguj"
            if (navLogout) {
                navLogout.style.display = 'list-item';
                const logoutLink = navLogout.querySelector('a');
                logoutLink.onclick = (event) => {
                    event.preventDefault();
                    auth.signOut().then(() => {
                        window.location.href = 'index.html';
                    });
                };
            }

            // Ukrywamy przycisk "Sign Up" na głównej stronie
            if (signupButton) {
                signupButton.style.display = 'none';
            }

        } else {
            // --- UŻYTKOWNIK NIEZALOGOWANY ---

            // Ukrywamy linki dla zalogowanych
            if (navCreate) navCreate.style.display = 'none';
            if (navMyCampaigns) navMyCampaigns.style.display = 'none';
            
            // Zmieniamy uniwersalny przycisk na "Zaloguj się"
            if (userActionLink) {
                userActionLink.textContent = 'Zaloguj się';
                userActionLink.href = 'login.html'; // Ustawiamy link do strony logowania
            }
            
            // Ukrywamy przycisk "Wyloguj"
            if (navLogout) navLogout.style.display = 'none';
            
            // Pokazujemy przycisk "Sign Up" na głównej
            if (signupButton) {
                signupButton.style.display = 'block';
            }
        }
    });
});

// Inicjalizacja systemu internacjonalizacji (i18n)
document.addEventListener('DOMContentLoaded', () => {
    // Sprawdzamy czy translations.js został załadowany
    if (typeof setLanguage === 'function') {
        // Wczytujemy zapisany język z localStorage lub używamy domyślnego 'english'
        const savedLanguage = localStorage.getItem('language') || 'english';
        
        // Dodajemy event listener do selektora języka
        const langSelector = document.getElementById('language-selector') || document.getElementById('language');
        if (langSelector) {
            // Ustawiamy aktualną wartość selektora przed ustawieniem języka
            langSelector.value = savedLanguage;
            
            // Ustawiamy język po załadowaniu strony
            setLanguage(savedLanguage);
            
            // Event listener dla zmiany języka
            langSelector.addEventListener('change', (event) => {
                const selectedLang = event.target.value;
                setLanguage(selectedLang);
            });
        } else {
            // Jeśli nie ma selektora, ustawiamy język domyślny
            setLanguage(savedLanguage);
        }
    }
});

// Obsługa wyświetlania emaila użytkownika
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        const emailDisplayElement = document.getElementById('user-email-display');
        if (emailDisplayElement && user) {
            emailDisplayElement.textContent = user.email;
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Знаходимо необхідні елементи за їхніми ID
    const orcImage = document.getElementById('orc-image');
    const killButton = document.getElementById('kill-btn');
    const mercyButton = document.getElementById('mercy-btn');

    // Перевіряємо, чи всі елементи існують, щоб уникнути помилок
    if (orcImage && killButton && mercyButton) {

        // 2. Додаємо слухача події до кнопки "Kill"
        killButton.addEventListener('click', (event) => {
            event.preventDefault(); // Запобігаємо стандартній дії, якщо це посилання
            
            console.log("Action: Kill");
            // Змінюємо атрибут 'src' зображення
            orcImage.src = 'ork-photo-dead.png'; 
        });

        // 3. Додаємо слухача події до кнопки "Mercy"
        mercyButton.addEventListener('click', (event) => {
            event.preventDefault();
            
            console.log("Action: Mercy");
            // Змінюємо атрибут 'src' зображення
            orcImage.src = 'ork-photo-alive.png';
        });

    } else {
        console.warn("One or more elements for the orc interaction are missing.");
    }
});