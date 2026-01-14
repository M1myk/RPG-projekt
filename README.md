# Chronicles of Adventure

**Chronicles of Adventure** is a web-based platform designed to move tabletop RPG sessions from paper to a dynamic, real-time web application. It provides tools for both Game Masters and players to manage campaigns, characters, and live game sessions with an interactive map, all powered by Firebase.

---

### Language / Język / Мова

*   [English](#english-version)
*   [Polski](#polska-wersja)
*   [Українська](#українська-версія)

---

## English Version <a name="english-version"></a>

### For Players (How to Play)

You can play the live version of the application right in your browser. No installation or setup is needed.

**Simply click the link below to start:**

### ► [Play Chronicles of Adventure](https://uknown-projekt.web.app)

---

### For Developers (How to Set Up Locally)

This guide is for developers who want to run the project on their local machine to contribute or experiment with the code.

#### Prerequisites

1.  **Git:** Installed on your system.
2.  **Visual Studio Code (or any code editor):** [VS Code](https://code.visualstudio.com/) is recommended.
3.  **Live Server Extension:** Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.

#### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/M1myk/RPG-projekt.git
    cd RPG-projekt.git
    ```

2.  **Set up your own Firebase project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    *   In your project, go to **Project settings** > **General**.
    *   Under "Your apps", click the web icon (`</>`) to register a new web app.
    *   Firebase will provide you with a `firebaseConfig` object. Copy it.

3.  **Configure Firebase Keys:**
    *   In the root of the project, create a new file named `firebase-config.js`.
    *   Paste the `firebaseConfig` object you copied and add the initialization lines:
        ```javascript
        const firebaseConfig = {
          apiKey: "YOUR_COPIED_API_KEY",
          // ... all other keys
        };

        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        const auth = firebase.auth();
        ```
    *   **Important:** This file is listed in `.gitignore` and must not be committed to the repository.

4.  **Enable Firebase Services:**
    *   In the Firebase Console, go to **Authentication** and enable the **Email/Password** sign-in method.
    *   Go to **Firestore Database** and create a database in **test mode**.
    *   Go to **Storage** and set it up (you may need to upgrade to the Blaze plan, but you will stay within the free tier).

#### How to Run

1.  Open the project folder in VS Code.
2.  Right-click on `index.html`.
3.  Select **"Open with Live Server"**.

---

## Polska Wersja <a name="polska-wersja"></a>

### Dla Graczy (Jak Zagrać)

Możesz zagrać w opublikowaną wersję aplikacji bezpośrednio w swojej przeglądarce. Nie jest wymagana żadna instalacja ani konfiguracja.

**Po prostu kliknij poniższy link, aby rozpocząć:**

### ► [Zagraj w Chronicles of Adventure](https://uknown-projekt.web.app)

---

### Dla Deweloperów (Jak Uruchomić Lokalnie)

Ten przewodnik jest przeznaczony dla deweloperów, którzy chcą uruchomić projekt na swojej lokalnej maszynie w celu wprowadzania zmian lub eksperymentowania z kodem.

#### Wymagania Wstępne

1.  **Git:** Zainstalowany w systemie.
2.  **Visual Studio Code (lub inny edytor kodu):** Zalecany jest [VS Code](https://code.visualstudio.com/).
3.  **Rozszerzenie Live Server:** Zainstaluj rozszerzenie [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) w VS Code.

#### Lokalna Konfiguracja

1.  **Sklonuj repozytorium:**
    ```bash
    git clone https://github.com/M1myk/RPG-projekt.git
    cd RPG-projekt.git
    ```

2.  **Skonfiguruj własny projekt Firebase:**
    *   Przejdź do [Konsoli Firebase](https://console.firebase.google.com/) i utwórz nowy projekt.
    *   W swoim projekcie przejdź do **Ustawienia projektu** > **Ogólne**.
    *   W sekcji "Twoje aplikacje" kliknij ikonę internetową (`</>`), aby zarejestrować nową aplikację internetową.
    *   Po rejestracji Firebase dostarczy Ci obiekt konfiguracyjny `firebaseConfig`. Skopiuj go.

3.  **Skonfiguruj klucze Firebase:**
    *   W głównym folderze projektu utwórz nowy plik o nazwie `firebase-config.js`.
    *   Wklej skopiowany obiekt `firebaseConfig` i dodaj linie inicjalizacyjne:
        ```javascript
        const firebaseConfig = {
          apiKey: "TWÓJ_SKOPIOWANY_KLUCZ_API",
          // ... wszystkie pozostałe klucze
        };

        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        const auth = firebase.auth();
        ```
    *   **Ważne:** Ten plik znajduje się na liście w `.gitignore` i nie wolno go dodawać do repozytorium.

4.  **Włącz usługi Firebase:**
    *   W Konsoli Firebase przejdź do sekcji **Authentication** i włącz metodę logowania **Email/Password**.
    *   Przejdź do sekcji **Firestore Database** i utwórz bazę danych w **trybie testowym (test mode)**.
    *   Przejdź do sekcji **Storage** i skonfiguruj ją (może być konieczne przejście na plan Blaze, ale pozostaniesz w ramach darmowego limitu).

#### Jak Uruchomić

1.  Otwórz folder projektu w VS Code.
2.  Kliknij prawym przyciskiem myszy na plik `index.html`.
3.  Wybierz **"Open with Live Server"**.

---

## Українська версія <a name="українська-версія"></a>

### Для Гравців (Як Грати)

Ви можете грати в опубліковану версію додатку прямо у вашому браузері. Не потрібно нічого встановлювати чи налаштовувати.

**Просто натисніть на посилання нижче, щоб почати:**

### ► [Грати в Chronicles of Adventure](https://uknown-projekt.web.app)

---

### Для Розробників (Як Запустити Локально)

Ця інструкція призначена для розробників, які хочуть запустити проєкт на своєму локальному комп'ютері для внесення змін або експериментів з кодом.

#### Необхідні інструменти

1.  **Git:** Встановлений у вашій системі.
2.  **Visual Studio Code (або інший редактор коду):** Рекомендовано [VS Code](https://code.visualstudio.com/).
3.  **Розширення Live Server:** Встановіть розширення [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) у VS Code.

#### Локальне налаштування

1.  **Склонуйте репозиторій:**
    ```bash
    git clone https://github.com/M1myk/RPG-projekt.git
    cd RPG-projekt.git
    ```

2.  **Налаштуйте власний проєкт Firebase:**
    *   Перейдіть до [Консолі Firebase](https://console.firebase.google.com/) та створіть новий проєкт.
    *   У вашому проєкті перейдіть до **Налаштування проєкту** > **Загальні**.
    *   У розділі "Ваші додатки" натисніть на іконку вебу (`</>`), щоб зареєструвати новий веб-додаток.
    *   Після реєстрації Firebase надасть вам конфігураційний об'єкт `firebaseConfig`. Скопіюйте його.

3.  **Налаштуйте ключі Firebase:**
    *   У кореневій папці проєкту створіть новий файл з назвою `firebase-config.js`.
    *   Вставте скопійований об'єкт `firebaseConfig` і додайте рядки ініціалізації:
        ```javascript
        const firebaseConfig = {
          apiKey: "ВАШ_СКОПІЙОВАНИЙ_API_KEY",
          // ... всі інші ключі
        };

        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
        const auth = firebase.auth();
        ```
    *   **Важливо:** Цей файл знаходиться у `.gitignore` і не повинен потрапити до репозиторію.

4.  **Увімкніть сервіси Firebase:**
    *   У Консолі Firebase перейдіть до розділу **Authentication** та увімкніть метод входу **Email/Password**.
    *   Перейдіть до розділу **Firestore Database** та створіть базу даних у **тестовому режимі (test mode)**.
    *   Перейдіть до розділу **Storage** та налаштуйте його (можливо, доведеться перейти на план Blaze, але ви залишитеся в межах безкоштовного ліміту).

#### Як Запустити

1.  Відкрийте папку проєкту у VS Code.
2.  Натисніть правою кнопкою миші на файл `index.html`.
3.  Виберіть **"Open with Live Server"**.
# RPG-projekt
