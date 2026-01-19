document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id');
    const playerDashboard = document.getElementById('player-dashboard');

    if (!campaignId) {
        playerDashboard.innerHTML = '<h1>Error: Campaign ID not found in URL.</h1>';
        return;
    }

    // Główna funkcja, która uruchamia się po sprawdzeniu stanu logowania
    auth.onAuthStateChanged(user => {
        if (user) {
            // Użytkownik zalogował się, zaczynamy ładowanie
            loadPlayerData(user, campaignId);
        } else {
            // Użytkownik niezalogowany, przekierowujemy na stronę logowania
            window.location.href = 'login.html';
        }
    });

    function loadPlayerData(user, campaignId) {
        // Najpierw sprawdzamy, czy użytkownik ma już postać w tej kampanii
        db.collection('campaigns').doc(campaignId).collection('characters')
          .where('ownerPlayerId', '==', user.uid)
          .limit(1) // Potrzebujemy tylko jeden wynik
          .get()
          .then(snapshot => {
            if (snapshot.empty) {
                // PRZYPADEK 1: POSTAĆ JESZCZE NIE ISTNIEJE
                // Pokazujemy propozycję stworzenia postaci
                displayCreateCharacterPrompt(campaignId);
            } else {
                // PRZYPADEK 2: POSTAĆ JUŻ ISTNIEJE
                const characterDoc = snapshot.docs[0];
                const characterData = characterDoc.data();
                const characterId = characterDoc.id;
                // Pokazujemy panel postaci
                displayCharacterDashboard(characterData, characterId, campaignId);
            }
        }).catch(error => {
            console.error("Błąd sprawdzania postaci: ", error);
            playerDashboard.innerHTML = '<h1>Błąd</h1><p>Nie udało się sprawdzić Twojej postaci.</p>';
        });
    }

    // Функція для відображення пропозиції створити персонажа
    function displayCreateCharacterPrompt(campaignId) {
        playerDashboard.innerHTML = `
            <div class="campaign-header">
                <h1>Welcome to the Campaign!</h1>
            </div>
            <div class="start-session-container">
                <p>You don't have a character in this campaign yet. Every adventurer needs a hero to guide through the realms.</p>
                    <a href="character-form.html?id=${campaignId}" class="btn primary-btn start-btn">Create Your Character</a>
            </div>
        `;
    }

    // Функція для відображення панелі існуючого персонажа
    function displayCharacterDashboard(character, charId, campaignId) {
        playerDashboard.innerHTML = `
            <div class="campaign-header">
                <h1>${character.name}</h1>
                <p>${character.race} ${character.class}, Level ${character.level}</p>
            </div>
            
            <div class="start-session-container">
                <a href="live-session-player.html?id=${campaignId}" class="btn primary-btn start-btn">Join Live Session</a>
                <label>Join the interactive map and start the game for you and your players.</label>
                <a href="character-form.html?id=${campaignId}&charId=${charId}" class="btn secondary-btn edit-btn">Edit Character</a>
            </div>

            
            <div class="character-sheet">
                <!-- Секція Основних Показників -->
                <div class="sheet-section">
                    <h3>Combat Stats</h3>
                    <div class="sheet-grid">
                        <div class="stat-block"><div class="label">HP</div><div class="value">${character.currentHp || 0} / ${character.maxHp || 0}</div></div>
                        <div class="stat-block"><div class="label">Armor Class</div><div class="value">${character.armorClass || 10}</div></div>
                        <div class="stat-block"><div class="label">Temp HP</div><div class="value">${character.tempHp || 0}</div></div>
                        <div class="stat-block"><div class="label">Inspiration</div><div class="value">${character.inspiration || 0}</div></div>
                    </div>
                </div>

                
                <div class="sheet-section">
                    <h3>Ability Scores</h3>
                    <div class="sheet-grid">
                        ${Object.keys(character.stats || {}).map(stat => `
                            <div class="stat-block">
                                <div class="label">${stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
                                <div class="value">${character.stats[stat]} 
                                    <span style="font-size: 0.7em; opacity: 0.8;">(${character.modifiers[stat] >= 0 ? '+' : ''}${character.modifiers[stat]})</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                
                <div class="sheet-section">
                    <h3>Personality</h3>
                    <div class="personality-block">
                        <p><strong>Traits:</strong> ${character.personality.traits || 'N/A'}</p>
                        <p><strong>Ideals:</strong> ${character.personality.ideals || 'N/A'}</p>
                        <p><strong>Bonds:</strong> ${character.personality.bonds || 'N/A'}</p>
                        <p><strong>Flaws:</strong> ${character.personality.flaws || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div class="danger-zone">
                <button class="btn danger-btn" id="leaveCampaignBtn">Leave This Campaign</button>
            </div>
        `;

        // Додаємо логіку до кнопки "Leave Campaign"
        const leaveCampaignBtn = document.getElementById('leaveCampaignBtn');
        leaveCampaignBtn.addEventListener('click', () => {
            const user = auth.currentUser;
            if (confirm('Are you sure you want to leave this campaign? This will also delete your character.')) {
                
            }
        });
    }
});