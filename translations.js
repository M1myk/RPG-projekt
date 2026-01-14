// System internacjonalizacji (i18n)
const translations = {
    en: {
        // Header & Navigation
        'nav-home': 'Home',
        'nav-find-game': 'Find a Game',
        'nav-create': 'Create',
        'nav-my-campaigns': 'My Campaigns',
        'nav-sign-in': 'Sign In',
        'nav-sign-up': 'Sign Up',
        'nav-my-profile': 'My Profile',
        'nav-profile': 'My profile',
        'nav-logout': 'Logout',
        
        // Homepage
        'title-chronicles': 'Chronicles of Adventure',
        'eyebrow-tagline': 'Tabletop • Social • Organized',
        'hero-title': 'Craft — Play — Remember',
        'hero-subtitle': 'Join players and game masters from around the world. Host campaigns, find groups, or build a legendary adventure — all in one place.',
        'btn-create-campaign': 'Create Campaign',
        'btn-join-campaign': 'Join a Campaign',
        'btn-become-dm': 'Become a Dungeon Master',
        'feature-campaign-title': 'Campaign Management',
        'feature-campaign-desc': 'Organize sessions, notes and NPCs in one place.',
        'feature-players-title': 'Find Players',
        'feature-players-desc': 'Match with players by time, experience and tone.',
        'feature-secure-title': 'Secure & Social',
        'feature-secure-desc': 'Built-in chat, invites and verified game masters.',
        
        // Create Campaign
        'campaign-name': 'Campaign Name:',
        'campaign-name-placeholder': 'E.g., Brzydkie Twarze',
        'campaign-system': 'Game System:',
        'campaign-system-select': 'Select System',
        'campaign-system-dnd5e': 'D&D 5th Edition',
        'campaign-description': 'Campaign Description:',
        'campaign-image': 'Campaign Image (URL):',
        'campaign-max-players': 'Maximum Players:',
        'campaign-frequency': 'Session Frequency:',
        'btn-create-new': 'Create Campaign',
        'btn-clear-form': 'Clear Form',
        
        // Session & Gameplay
        'session-history': 'History & Log',
        'session-dice': 'Dice Roller',
        'session-characters': 'Characters on Map',
        'session-creatures': 'Creatures on Map',
        'session-add-creature': 'Add to Map',
        'session-select-creature': 'Select a creature to add',
        'btn-back-dashboard': 'Back to Dashboard',
        'btn-back-session': 'Back to Session',
        'btn-start-session': 'Start Live Session',
        'session-description': 'Launch the interactive map and start the game for you and your players.',
        'loading-campaign': 'Loading Campaign...',
        'loading-creatures': 'Loading creatures...',
        
        // Campaign Management
        'campaign-settings': 'Campaign Settings',
        'campaign-creatures': 'Creatures',
        'campaign-gm-notes': 'GM Notes',
        'campaign-management': 'Campaign Management',
        'campaign-danger-zone': 'Danger Zone',
        'btn-delete-campaign': 'Delete This Campaign',
        'my-campaigns': 'My Campaigns',
        
        // Characters
        'character-edit': 'Edit Character',
        'character-create': 'Create Character',
        'character-update': 'Update Character',
        'character-save': 'Save Character',
        'character-inventory': 'Inventory',
        'character-add-item': 'Add Item',
        'character-item-name': 'Item Name',
        'character-item-description': 'Description',
        'character-item-quantity': 'Quantity',
        'character-name': 'Character Name:',
        'character-class': 'Class:',
        'character-level': 'Level:',
        'character-attributes': 'Attributes',
        'character-existing': 'Existing Creatures',
        'character-add-new': 'Add New Creature',
        'creature-name': 'Creature Name:',
        'manage-creatures': 'Manage Creatures',
        
        // GM Notes
        'gm-notes': 'GM Secret Notes',
        'gm-notes-auto': 'Your notes are saved automatically as you type. Only you can see them.',
        'gm-notes-placeholder': 'Write your secret plot points, NPC details, and ideas here...',
        
        // Profile & Settings
        'your-settings': 'Your Settings',
        'edit-profile': 'Edit Profile',
        'profile-settings': 'Profile Settings',
        'your-profile': 'Your Profile',
        
        // Buttons & Actions
        'btn-cancel': 'Cancel',
        'btn-save': 'Save',
        'btn-close': 'Close',
        'btn-submit': 'Submit',
        'btn-delete': 'Delete',
        'btn-edit': 'Edit',
        'btn-logout': 'Logout',
        
        // Messages & Status
        'loading': 'Loading...',
        'error-not-found': 'Not Found',
        'error-access-denied': 'Access Denied',
        'save-status': 'Saving...',
        'save-success': 'Saved successfully'
    },
    pl: {
        // Header & Navigation
        'nav-home': 'Strona Główna',
        'nav-find-game': 'Znajdź Grę',
        'nav-create': 'Utwórz',
        'nav-my-campaigns': 'Moje Kampanie',
        'nav-sign-in': 'Zaloguj się',
        'nav-sign-up': 'Zarejestruj się',
        'nav-my-profile': 'Mój Profil',
        'nav-profile': 'Mój profil',
        'nav-logout': 'Wyloguj się',
        
        // Homepage
        'title-chronicles': 'Chronicles of Adventure',
        'eyebrow-tagline': 'Tabletop • Społeczne • Zorganizowane',
        'hero-title': 'Craft — Play — Remember',
        'hero-subtitle': 'Dołącz do graczy i mistrzów gry z całego świata. Prowadź kampanie, szukaj grup lub buduj legendarne przygody — wszystko w jednym miejscu.',
        'btn-create-campaign': 'Utwórz Kampanię',
        'btn-join-campaign': 'Dołącz do Kampanii',
        'btn-become-dm': 'Zostań Mistrzem Podziemi',
        'feature-campaign-title': 'Zarządzanie Kampanią',
        'feature-campaign-desc': 'Organizuj sesje, notatki i postacie niezależne w jednym miejscu.',
        'feature-players-title': 'Znajdź Graczy',
        'feature-players-desc': 'Dopasuj się do graczy po czasie, doświadczeniu i nastroju.',
        'feature-secure-title': 'Bezpieczne & Społeczne',
        'feature-secure-desc': 'Wbudowany czat, zaproszenia i zweryfikowani mistrzowie gry.',
        
        // Create Campaign
        'campaign-name': 'Nazwa Kampanii:',
        'campaign-name-placeholder': 'Np. Brzydkie Twarze',
        'campaign-system': 'System Gry:',
        'campaign-system-select': 'Wybierz System',
        'campaign-system-dnd5e': 'D&D 5. Edycja',
        'campaign-description': 'Opis Kampanii:',
        'campaign-image': 'Obraz Kampanii (URL):',
        'campaign-max-players': 'Maksymalna liczba graczy:',
        'campaign-frequency': 'Częstotliwość sesji:',
        'btn-create-new': 'Utwórz Kampanię',
        'btn-clear-form': 'Wyczyść Formularz',
        
        // Session & Gameplay
        'session-history': 'Historia & Log',
        'session-dice': 'Kostki',
        'session-characters': 'Postacie na Mapie',
        'session-creatures': 'Potwory na Mapie',
        'session-add-creature': 'Dodaj do Mapy',
        'session-select-creature': 'Wybierz potworę do dodania',
        'btn-back-dashboard': 'Wróć do Pulpitu',
        'btn-back-session': 'Wróć do Sesji',
        'btn-start-session': 'Uruchom Sesję na Żywo',
        'session-description': 'Uruchom interaktywną mapę i rozpocznij grę dla siebie i swoich graczy.',
        'loading-campaign': 'Ładowanie Kampanii...',
        'loading-creatures': 'Ładowanie potworów...',
        
        // Campaign Management
        'campaign-settings': 'Ustawienia Kampanii',
        'campaign-creatures': 'Potwory',
        'campaign-gm-notes': 'Notatki MG',
        'campaign-management': 'Zarządzanie Kampanią',
        'campaign-danger-zone': 'Strefa Niebezpieczna',
        'btn-delete-campaign': 'Usuń Tę Kampanię',
        'my-campaigns': 'Moje Kampanie',
        
        // Characters
        'character-edit': 'Edytuj Postać',
        'character-create': 'Utwórz Postać',
        'character-update': 'Zaktualizuj Postać',
        'character-save': 'Zapisz Postać',
        'character-inventory': 'Ekwipunek',
        'character-add-item': 'Dodaj Przedmiot',
        'character-item-name': 'Nazwa Przedmiotu',
        'character-item-description': 'Opis',
        'character-item-quantity': 'Ilość',
        'character-name': 'Nazwa Postaci:',
        'character-class': 'Klasa:',
        'character-level': 'Poziom:',
        'character-attributes': 'Atrybuty',
        'character-existing': 'Istniejące Potwory',
        'character-add-new': 'Dodaj Nowego Potworę',
        'creature-name': 'Nazwa Potworę:',
        'manage-creatures': 'Zarządzaj Potworami',
        
        // GM Notes
        'gm-notes': 'Tajne Notatki MG',
        'gm-notes-auto': 'Twoje notatki są automatycznie zapisywane podczas pisania. Tylko Ty je widzisz.',
        'gm-notes-placeholder': 'Napisz swoje tajne punkty fabuły, szczegóły NPC i pomysły tutaj...',
        
        // Profile & Settings
        'your-settings': 'Twoje Ustawienia',
        'edit-profile': 'Edytuj Profil',
        'profile-settings': 'Ustawienia Profilu',
        'your-profile': 'Twój Profil',
        
        // Buttons & Actions
        'btn-cancel': 'Anuluj',
        'btn-save': 'Zapisz',
        'btn-close': 'Zamknij',
        'btn-submit': 'Wyślij',
        'btn-delete': 'Usuń',
        'btn-edit': 'Edytuj',
        'btn-logout': 'Wyloguj się',
        
        // Messages & Status
        'loading': 'Ładowanie...',
        'error-not-found': 'Nie Znaleziono',
        'error-access-denied': 'Dostęp Niedozwolony',
        'save-status': 'Zapisywanie...',
        'save-success': 'Zapisano pomyślnie'
    },
    uk: {
        // Header & Navigation
        'nav-home': 'Головна',
        'nav-find-game': 'Знайти гру',
        'nav-create': 'Створити',
        'nav-my-campaigns': 'Мої кампанії',
        'nav-sign-in': 'Увійти',
        'nav-sign-up': 'Зареєструватися',
        'nav-my-profile': 'Мій профіль',
        'nav-profile': 'Мій профіль',
        'nav-logout': 'Вийти',
        
        // Homepage
        'title-chronicles': 'Chronicles of Adventure',
        'eyebrow-tagline': 'Настільні • Соціальні • Організовані',
        'hero-title': 'Craft — Play — Remember',
        'hero-subtitle': 'Приєднуйтесь до гравців та майстрів гри з усього світу. Керуйте кампаніями, знайдіть групи або створіть легендарну пригоду — все в одному місці.',
        'btn-create-campaign': 'Створити кампанію',
        'btn-join-campaign': 'Приєднатись до кампанії',
        'btn-become-dm': 'Стати Майстром Підземель',
        'feature-campaign-title': 'Управління кампанією',
        'feature-campaign-desc': 'Організуйте сеанси, нотатки та NPC в одному місці.',
        'feature-players-title': 'Знайти гравців',
        'feature-players-desc': 'Зберіть команду за часом, досвідом і стилем.',
        'feature-secure-title': 'Безпечно і соціально',
        'feature-secure-desc': 'Вбудований чат, запрошення та верифіковані майстри гри.',
        
        // Create Campaign
        'campaign-name': 'Назва кампанії:',
        'campaign-name-placeholder': 'Напр., Brzydkie Twarze',
        'campaign-system': 'Система гри:',
        'campaign-system-select': 'Виберіть систему',
        'campaign-system-dnd5e': 'D&D 5-е видання',
        'campaign-description': 'Опис кампанії:',
        'campaign-image': 'Зображення кампанії (URL):',
        'campaign-max-players': 'Максимум гравців:',
        'campaign-frequency': 'Частота сеансів:',
        'btn-create-new': 'Створити кампанію',
        'btn-clear-form': 'Очистити форму',
        
        // Session & Gameplay
        'session-history': 'Історія та журнал',
        'session-dice': 'Кубики',
        'session-characters': 'Персонажи на карті',
        'session-creatures': 'Створіння на карті',
        'session-add-creature': 'Додати на карту',
        'session-select-creature': 'Виберіть створіння для додавання',
        'btn-back-dashboard': 'Повернутись до панелі',
        'btn-back-session': 'Повернутись до сеансу',
        'btn-start-session': 'Почати живий сеанс',
        'session-description': 'Запустіть інтерактивну карту та почніть гру для себе та своїх гравців.',
        'loading-campaign': 'Завантаження кампанії...',
        'loading-creatures': 'Завантаження створінь...',
        
        // Campaign Management
        'campaign-settings': 'Налаштування кампанії',
        'campaign-creatures': 'Створіння',
        'campaign-gm-notes': 'Нотатки МГ',
        'campaign-management': 'Управління кампанією',
        'campaign-danger-zone': 'Небезпечна зона',
        'btn-delete-campaign': 'Видалити цю кампанію',
        'my-campaigns': 'Мої кампанії',
        
        // Characters
        'character-edit': 'Редагувати персонажа',
        'character-create': 'Створити персонажа',
        'character-update': 'Оновити персонажа',
        'character-save': 'Зберегти персонажа',
        'character-inventory': 'Інвентар',
        'character-add-item': 'Додати предмет',
        'character-item-name': 'Назва предмета',
        'character-item-description': 'Опис',
        'character-item-quantity': 'Кількість',
        'character-name': 'Назва персонажа:',
        'character-class': 'Клас:',
        'character-level': 'Рівень:',
        'character-attributes': 'Атрибути',
        'character-existing': 'Існуючі створіння',
        'character-add-new': 'Додати нового створіння',
        'creature-name': 'Назва створіння:',
        'manage-creatures': 'Керувати створіннями',
        
        // GM Notes
        'gm-notes': 'Секретні нотатки МГ',
        'gm-notes-auto': 'Ваші нотатки зберігаються автоматично під час введення. Тільки ви їх бачите.',
        'gm-notes-placeholder': 'Напишіть свої таємні сюжетні пункти, деталі NPC та ідеї тут...',
        
        // Profile & Settings
        'your-settings': 'Ваші налаштування',
        'edit-profile': 'Редагувати профіль',
        'profile-settings': 'Налаштування профілю',
        'your-profile': 'Ваш профіль',
        
        // Buttons & Actions
        'btn-cancel': 'Скасувати',
        'btn-save': 'Зберегти',
        'btn-close': 'Закрити',
        'btn-submit': 'Надіслати',
        'btn-delete': 'Видалити',
        'btn-edit': 'Редагувати',
        'btn-logout': 'Вийти',
        
        // Messages & Status
        'loading': 'Завантаження...',
        'error-not-found': 'Не знайдено',
        'error-access-denied': 'Доступ заборонено',
        'save-status': 'Збереження...',
        'save-success': 'Успішно збережено'
    }
};

// Функция установки языка
function setLanguage(lang) {
    // Убедитесь, что lang является действительным кодом языка
    if (!translations[lang]) {
        console.warn(`Language ${lang} not found, falling back to 'en'`);
        lang = 'en';
    }
    
    // Сохраняем выбранный язык в localStorage
    localStorage.setItem('language', lang);
    
    // Обновляем все элементы с атрибутом data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        } else {
            console.warn(`Translation key "${key}" not found for language "${lang}"`);
        }
    });
    
    // Обновляем селектор языка
    const langSelector = document.getElementById('language');
    if (langSelector) {
        langSelector.value = lang;
    }
    
    // Обновляем атрибут lang в элементе html
    document.documentElement.lang = lang;
    
    console.log(`Language set to: ${lang}`);
}

