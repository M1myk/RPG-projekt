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
            // If user is not logged in, block the form and suggest logging in
            form.innerHTML = `<p style="text-align: center;">You must be <a href="login.html">logged in</a> to create a campaign.</p>`;
            return;
        }

        // If user is logged in, add listener to the form
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            createButton.disabled = true;
            createButton.textContent = 'Creating...';

            const campaignName = document.getElementById('campaignName').value;
            const gameSystem = document.getElementById('gameSystem').value;
            const imageUrl = document.getElementById('campaignImage').value;

            if (!campaignName || !gameSystem || !imageUrl) {
                alert('Fill in required fields.');
                createButton.disabled = false; createButton.textContent = 'Create campaign';
                return;
            }

            const newCampaign = {
                name: campaignName,
                system: gameSystem,
                description: document.getElementById('campaignDescription').value,
                maxPlayers: parseInt(document.getElementById('maxPlayers').value, 10),
                currentPlayers: 1, // Тільки GM
                image: document.getElementById('campaignImage').value || 'rebel-dnd-mapa-faerunu-pl.jpg',
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
                console.error("Error creating campaign: ", error);
                alert('An error occurred while creating the campaign.');
                createButton.disabled = false; createButton.textContent = 'Create campaign';
            });
        });
    });
});