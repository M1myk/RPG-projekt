// System internacjonalizacji (i18n)
const translations = {
    en: {
        // Nawigacja
        'nav-home': 'Home',
        'nav-find-game': 'Find a Game',
        'nav-create': 'Create',
        'nav-my-campaigns': 'My Campaigns',
        'nav-sign-in': 'Sign In',
        'nav-sign-up': 'Sign Up',
        'nav-my-profile': 'My Profile',
        'nav-logout': 'Logout',
        
        // Strony główne
        'title-chronicles': 'Chronicles of Adventure',
        'btn-create-campaign': 'Create Campaign',
        'btn-join-campaign': 'Join a Campaign',
        'btn-become-dm': 'Become a Dungeon Master',
        
        // Sesja
        'session-history': 'History & Log',
        'session-dice': 'Dice Roller',
        'session-characters': 'Characters on Map',
        'session-creatures': 'Creatures on Map',
        'session-add-creature': 'Add to Map',
        'session-select-creature': 'Select a creature to add',
        'btn-back-dashboard': 'Back to Dashboard',
        'btn-start-session': 'Start Live Session',
        'session-description': 'Launch the interactive map and start the game for you and your players.',
        
        // Kampania
        'campaign-settings': 'Campaign Settings',
        'campaign-creatures': 'Creatures',
        'campaign-gm-notes': 'GM Notes',
        'campaign-description': 'Edit campaign name, description, and image.',
        'campaign-add-creatures': 'Add and manage creatures in your campaign.',
        'campaign-notes-description': 'Keep your secret notes and plot points.',
        'campaign-management': 'Campaign Management',
        'campaign-danger-zone': 'Danger Zone',
        'btn-delete-campaign': 'Delete This Campaign',
        
        // Postać
        'character-edit': 'Edit Character',
        'character-create': 'Create Character',
        'character-update': 'Update Character',
        'character-save': 'Save Character',
        'character-inventory': 'Inventory',
        'character-add-item': 'Add Item',
        'character-item-name': 'Item Name',
        'character-item-description': 'Description',
        'character-item-quantity': 'Quantity',
        'btn-delete': 'Delete',
        
        // Ogólne
        'btn-cancel': 'Cancel',
        'btn-save': 'Save',
        'btn-close': 'Close',
        'btn-submit': 'Submit',
        'loading': 'Loading...',
        'error-not-found': 'Not Found',
        'error-access-denied': 'Access Denied'
    },
    pl: {
        // Nawigacja
        'nav-home': 'Strona Główna',
        'nav-find-game': 'Znajdź Grę',
        'nav-create': 'Utwórz',
        'nav-my-campaigns': 'Moje Kampanie',
        'nav-sign-in': 'Zaloguj się',
        'nav-sign-up': 'Zarejestruj się',
        'nav-my-profile': 'Mój Profil',
        'nav-logout': 'Wyloguj się',
        
        // Strony główne
        'title-chronicles': 'Chronicles of Adventure',
        'btn-create-campaign': 'Utwórz Kampanię',
        'btn-join-campaign': 'Dołącz do Kampanii',
        'btn-become-dm': 'Zostań Mistrzem Podziemi',
        
        // Sesja
        'session-history': 'Historia & Log',
        'session-dice': 'Kostki',
        'session-characters': 'Postacie na Mapie',
        'session-creatures': 'Stwory na Mapie',
        'session-add-creature': 'Dodaj na Mapę',
        'session-select-creature': 'Wybierz stworzenie do dodania',
        'btn-back-dashboard': 'Powrót do Panelu',
        'btn-start-session': 'Rozpocznij Sesję na Żywo',
        'session-description': 'Uruchom interaktywną mapę i zacznij grę dla siebie i swoich graczy.',
        
        // Kampania
        'campaign-settings': 'Ustawienia Kampanii',
        'campaign-creatures': 'Stwory',
        'campaign-gm-notes': 'Notatki MG',
        'campaign-description': 'Edytuj nazwę kampanii, opis i obrazek.',
        'campaign-add-creatures': 'Dodaj i zarządzaj stworami w swojej kampanii.',
        'campaign-notes-description': 'Przechowuj swoje sekretne notatki i punkty fabularne.',
        'campaign-management': 'Zarządzanie Kampanią',
        'campaign-danger-zone': 'Strefa Niebezpieczna',
        'btn-delete-campaign': 'Usuń Tę Kampanię',
        
        // Postać
        'character-edit': 'Edytuj Postać',
        'character-create': 'Utwórz Postać',
        'character-update': 'Zaktualizuj Postać',
        'character-save': 'Zapisz Postać',
        'character-inventory': 'Ekwipunek',
        'character-add-item': 'Dodaj Przedmiot',
        'character-item-name': 'Nazwa Przedmiotu',
        'character-item-description': 'Opis',
        'character-item-quantity': 'Ilość',
        'btn-delete': 'Usuń',
        
        // Ogólne
        'btn-cancel': 'Anuluj',
        'btn-save': 'Zapisz',
        'btn-close': 'Zamknij',
        'btn-submit': 'Wyślij',
        'loading': 'Ładowanie...',
        'error-not-found': 'Nie Znaleziono',
        'error-access-denied': 'Odmowa Dostępu'
    },
    uk: {
        // Nawigacja
        'nav-home': 'Головна',
        'nav-find-game': 'Знайти Гру',
        'nav-create': 'Створити',
        'nav-my-campaigns': 'Мої Кампанії',
        'nav-sign-in': 'Увійти',
        'nav-sign-up': 'Зареєструватися',
        'nav-my-profile': 'Мій Профіль',
        'nav-logout': 'Вийти',
        
        // Strony główne
        'title-chronicles': 'Chronicles of Adventure',
        'btn-create-campaign': 'Створити Кампанію',
        'btn-join-campaign': 'Приєднатися до Кампанії',
        'btn-become-dm': 'Стати Майстром Підземель',
        
        // Sesja
        'session-history': 'Історія & Лог',
        'session-dice': 'Кістки',
        'session-characters': 'Персонажі на Карті',
        'session-creatures': 'Істоти на Карті',
        'session-add-creature': 'Додати на Карту',
        'session-select-creature': 'Виберіть істоту для додавання',
        'btn-back-dashboard': 'Повернутися до Панелі',
        'btn-start-session': 'Запустити Живу Сесію',
        'session-description': 'Запустіть інтерактивну карту та почніть гру для себе та своїх гравців.',
        
        // Kampania
        'campaign-settings': 'Налаштування Кампанії',
        'campaign-creatures': 'Істоти',
        'campaign-gm-notes': 'Нотатки ГМ',
        'campaign-description': 'Редагуйте назву кампанії, опис та зображення.',
        'campaign-add-creatures': 'Додавайте та керуйте істотами у своїй кампанії.',
        'campaign-notes-description': 'Зберігайте свої секретні нотатки та сюжетні точки.',
        'campaign-management': 'Управління Кампанією',
        'campaign-danger-zone': 'Небезпечна Зона',
        'btn-delete-campaign': 'Видалити Цю Кампанію',
        
        // Postać
        'character-edit': 'Редагувати Персонажа',
        'character-create': 'Створити Персонажа',
        'character-update': 'Оновити Персонажа',
        'character-save': 'Зберегти Персонажа',
        'character-inventory': 'Інвентар',
        'character-add-item': 'Додати Предмет',
        'character-item-name': 'Назва Предмета',
        'character-item-description': 'Опис',
        'character-item-quantity': 'Кількість',
        'btn-delete': 'Видалити',
        
        // Ogólne
        'btn-cancel': 'Скасувати',
        'btn-save': 'Зберегти',
        'btn-close': 'Закрити',
        'btn-submit': 'Відправити',
        'loading': 'Завантаження...',
        'error-not-found': 'Не Знайдено',
        'error-access-denied': 'Доступ Заборонено'
    }
};

// Mapowanie wartości z HTML na klucze tłumaczeń
const languageMap = {
    'english': 'en',
    'polish': 'pl',
    'ukrainian': 'uk',
    'en': 'en',
    'pl': 'pl',
    'uk': 'uk'
};

// Funkcja ustawiająca język
function setLanguage(lang) {
    // Mapujemy wartość z HTML na klucz tłumaczenia
    const langKey = languageMap[lang] || lang;
    
    if (!translations[langKey]) {
        console.warn(`Language ${langKey} not found, falling back to 'en'`);
        lang = 'en';
    } else {
        lang = langKey;
    }
    
    // Zapisujemy wybrany język (w formie użytej w HTML)
    const htmlLangValue = Object.keys(languageMap).find(key => languageMap[key] === lang) || lang;
    localStorage.setItem('language', htmlLangValue);
    
    // Aktualizujemy wszystkie elementy z atrybutem data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        } else {
            console.warn(`Translation key "${key}" not found for language "${lang}"`);
        }
    });
    
    // Aktualizujemy selektor języka
    const langSelector = document.getElementById('language-selector') || document.getElementById('language');
    if (langSelector) {
        langSelector.value = htmlLangValue;
    }
    
    // Aktualizujemy atrybut lang w elemencie html
    document.documentElement.lang = lang;
}

