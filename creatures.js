document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id');
    
    // Отримуємо елементи сторінки
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const creaturesListDiv = document.getElementById('creatures-list');
    const addCreatureForm = document.getElementById('addCreatureForm');
    const mainContainer = document.querySelector('.management-main .container');

    // --- RELIABLE CAMPAIGN ID VERIFICATION ---
    if (!campaignId || campaignId.includes('${')) { // Check if ID exists and is not a text template
        mainContainer.innerHTML = '<h1>Error: Invalid campaign ID provided in URL.</h1><p>Return to dashboard and try again.</p>';
        return;
    }

    // Set the correct link for the "Back to dashboard" button
    const backLink = document.getElementById('back-to-dashboard-link');
        if (backLink) {
            backLink.href = `session.html?id=${campaignId}`;
        }

    auth.onAuthStateChanged(user => {
        if (user) {
            // The path to the collection is now guaranteed to be correct
            const creaturesRef = db.collection('campaigns').doc(campaignId).collection('creatures');

            // --- YOUR EXISTING CODE (unchanged, works correctly) ---

            // Listener to display the list of creatures
            creaturesRef.onSnapshot(snapshot => {
                creaturesListDiv.innerHTML = '';
                if (snapshot.empty) {
                    creaturesListDiv.innerHTML = '<p>No creature templates added yet.</p>';
                    return;
                }
                snapshot.forEach(doc => {
                    const creature = doc.data();
                    const creatureEl = document.createElement('div');
                    creatureEl.className = 'creature-item';
                    creatureEl.innerHTML = `
                        <span><strong>${creature.name}</strong> (HP: ${creature.maxHp}, AC: ${creature.armorClass})</span>
                        <button class="btn danger-btn small-btn" data-id="${doc.id}">Delete</button>
                    `;
                    creaturesListDiv.appendChild(creatureEl);
                });
            });

            // Listener for adding form
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
            
            // Listener for delete buttons
            creaturesListDiv.addEventListener('click', event => {
                if (event.target.tagName === 'BUTTON' && event.target.dataset.id) {
                    if (confirm('Are you sure you want to delete this creature template?')) {
                        creaturesRef.doc(event.target.dataset.id).delete().catch(console.error);
                    }
                }
            });

        } else { window.location.href = 'login.html'; }
    });
});