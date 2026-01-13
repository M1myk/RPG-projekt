// --- FUNKCJA GENERATORA KODU ---
function generateSessionCode(length = 6) {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createCampaignForm');
    const createButton = form.querySelector('button[type="submit"]');

    // Używamy onAuthStateChanged do niezawodnej weryfikacji
    auth.onAuthStateChanged(user => {
        if (!user) {
            // Jeśli użytkownik nie jest zalogowany, blokujemy formularz i proponujemy zalogowanie
            form.innerHTML = `<p style="text-align: center;">Musisz być <a href="login.html">zalogowany</a>, aby utworzyć kampanię.</p>`;
            return;
        }

        // Jeśli użytkownik jest zalogowany, dodajemy słuchacza do formularza
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            createButton.disabled = true;
            createButton.textContent = 'Tworzenie...';

            const campaignName = document.getElementById('campaignName').value;
            const gameSystem = document.getElementById('gameSystem').value;

            if (!campaignName || !gameSystem) {
                alert('Wypełnij wymagane pola.');
                createButton.disabled = false; createButton.textContent = 'Utwórz kampanię';
                return;
            }

            const newCampaign = {
                name: campaignName,
                system: gameSystem,
                description: document.getElementById('campaignDescription').value,
                maxPlayers: parseInt(document.getElementById('maxPlayers').value, 10),
                currentPlayers: 1, // Тільки GM
                image: document.getElementById('campaignImage').value || 'default-image-url.jpg',
                sessionCode: generateSessionCode(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                ownerId: user.uid,
                playerIds: [user.uid], // Додаємо GM до списку учасників
                
                // Зберігаємо правила створення персонажа
                rules: {
                    skillProficiencyLimit: parseInt(document.getElementById('skillProficiencyLimit').value, 10)
                }
            };

            db.collection('campaigns').add(newCampaign).then(() => {
                window.location.href = 'campaign-panel.html';
            }).catch((error) => {
                console.error("Błąd podczas tworzenia kampanii: ", error);
                alert('Podczas tworzenia kampanii wystąpił błąd.');
                createButton.disabled = false; createButton.textContent = 'Utwórz kampanię';
            });
        });
    });
});