document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id');
    
    // Отримуємо елементи сторінки
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const creaturesListDiv = document.getElementById('creatures-list');
    const addCreatureForm = document.getElementById('addCreatureForm');
    const mainContainer = document.querySelector('.management-main .container');

    // --- NIEZAWODNA WERYFIKACJA ID KAMPANII ---
    if (!campaignId || campaignId.includes('${')) { // Sprawdzamy, czy ID istnieje i nie jest szablona tekstowym
        mainContainer.innerHTML = '<h1>Błąd: Nieprawidłowe ID kampanii podane w URL.</h1><p>Wróć do pulpitu i spróbuj ponownie.</p>';
        return;
    }

    // Ustalamy prawidłowy link dla przycisku "Powrót do pulpitu"
    const backLink = document.getElementById('back-to-dashboard-link');
        if (backLink) {
            backLink.href = `session.html?id=${campaignId}`;
        }

    auth.onAuthStateChanged(user => {
        if (user) {
            // Ścieżka do kolekcji jest teraz gwarantowana prawidłowa
            const creaturesRef = db.collection('campaigns').doc(campaignId).collection('creatures');

            // --- TWÓJ ISTNIEJĄCY KOD (bez zmian, działa prawidłowo) ---

            // Słuchacz do wyświetlania listy stworów
            creaturesRef.onSnapshot(snapshot => {
                creaturesListDiv.innerHTML = '';
                if (snapshot.empty) {
                    creaturesListDiv.innerHTML = '<p>Nie dodano jeszcze żadnych szablonów stworów.</p>';
                    return;
                }
                snapshot.forEach(doc => {
                    const creature = doc.data();
                    const creatureEl = document.createElement('div');
                    creatureEl.className = 'creature-item';
                    creatureEl.innerHTML = `
                        <span><strong>${creature.name}</strong> (HP: ${creature.maxHp}, AC: ${creature.armorClass})</span>
                        <button class="btn danger-btn small-btn" data-id="${doc.id}">Usuń</button>
                    `;
                    creaturesListDiv.appendChild(creatureEl);
                });
            });

            // Słuchacz dla formularza dodawania
            addCreatureForm.addEventListener('submit', event => {
                event.preventDefault();
                const newCreature = {
                    name: document.getElementById('creatureName').value,
                    tokenUrl: document.getElementById('creatureTokenUrl').value,
                    maxHp: parseInt(document.getElementById('creatureHP').value),
                    currentHp: parseInt(document.getElementById('creatureHP').value),
                    armorClass: parseInt(document.getElementById('creatureAC').value),
                    position: { top: '50%', left: '50%' }
                };
                creaturesRef.add(newCreature).then(() => {
                    addCreatureForm.reset();
                }).catch(console.error);
            });
            
            // Słuchacz dla przycisków usuwania
            creaturesListDiv.addEventListener('click', event => {
                if (event.target.tagName === 'BUTTON' && event.target.dataset.id) {
                    if (confirm('Czy na pewno chcesz usunąć ten szablon stwora?')) {
                        creaturesRef.doc(event.target.dataset.id).delete().catch(console.error);
                    }
                }
            });

        } else { window.location.href = 'login.html'; }
    });
});