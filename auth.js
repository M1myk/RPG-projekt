document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth(); // Pobieramy dostęp do serwisu Authentication

    const authForm = document.getElementById('authForm');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const authButton = document.getElementById('authButton');
    
    // Elementy do przełączania formularza
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.createElement('a');
    switchToLogin.id = 'switch-to-login';
    switchToLogin.textContent = 'Zaloguj się tutaj';

    let isRegisterMode = false; // Flaga śledzящая tryb (login czy rejestracja)

    // --- Funkcje do przełączania trybu ---
    function setRegisterMode() {
        isRegisterMode = true;
        formTitle.textContent = 'Rejestracja';
        authButton.textContent = 'Zarejestruj się';
        formSubtitle.innerHTML = 'Masz już konto? ';
        formSubtitle.appendChild(switchToLogin);
    }

    function setLoginMode() {
        isRegisterMode = false;
        formTitle.textContent = 'Zaloguj się';
        authButton.textContent = 'Zaloguj się';
        formSubtitle.innerHTML = 'Potrzebujesz konta? ';
        formSubtitle.appendChild(switchToRegister);
    }
    
    // --- Obsługiwacze zdarzeń dla przełączników ---
    switchToRegister.addEventListener('click', setRegisterMode);
    switchToLogin.addEventListener('click', setLoginMode);

    // --- Główny obsługiwacz wysyłania formularza ---
    authForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        authButton.disabled = true;
        const email = emailInput.value;
        const password = passwordInput.value;

        if (isRegisterMode) {
            // --- LOGIKA REJESTRACJI ---
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Użytkownik został pomyślnie stworzony i automatycznie zalogowany
                    console.log('Użytkownik zarejestrowany i zalogowany:', userCredential.user);
                    showFeedback('Rejestracja powiodła się! Przekierowywanie...', 'success');
                    // Przekierowujemy na stronę główną lub panel kampanii
                    setTimeout(() => { window.location.href = 'campaign-panel.html'; }, 1500);
                })
                .catch((error) => {
                    // Obsługa błędów rejestracji
                    console.error('Błąd rejestracji:', error);
                    showFeedback(error.message, 'error');
                    authButton.disabled = false;
                });
        } else {
            // --- LOGIKA LOGOWANIA ---
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Użytkownik pomyślnie się zalogował
                    console.log('Użytkownik zalogowany:', userCredential.user);
                    showFeedback('Logowanie powiodło się! Przekierowywanie...', 'success');
                    // Przekierowujemy na stronę główną lub panel kampanii
                    setTimeout(() => { window.location.href = 'campaign-panel.html'; }, 1500);
                })
                .catch((error) => {
                    // Obsługa błędów logowania
                    console.error('Błąd logowania:', error);
                    showFeedback(error.message, 'error');
                    authButton.disabled = false;
                });
        }
    });

    // Funkcja pomocnicza do wyświetlania wiadomości
    function showFeedback(message, type) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = `feedback feedback-${type}`;
    }
});