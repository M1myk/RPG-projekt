// Skrypt dla widoku gracza w sesji na żywo
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id');
    
    // Pobieranie wszystkich wymaganych elementów z HTML
    const campaignNameHeader = document.getElementById('campaign-name-header');
    const mapContainer = document.getElementById('map-container');
    const historyLog = document.getElementById('history-log');
    const diceRoller = document.getElementById('dice-roller');
    const diceResult = document.getElementById('dice-result');
    const myCharacterName = document.getElementById('my-character-name');
    const myCharacterStats = document.getElementById('my-character-stats');
    const creaturesOnMapList = document.getElementById('creatures-on-map-list');
    const charactersOnMapList = document.getElementById('characters-on-map-list');

    if (!campaignId) {
        document.body.innerHTML = '<h1>Błąd: ID kampanii nie znaleziono w URL.</h1>';
        return;
    }

    // Ustawienie linku powrotu do panelu gracza
    const backLink = document.getElementById('back-to-session-link');
    if (backLink) {
        backLink.href = `session-player.html?id=${campaignId}`;
    }

    let myCharacterData = null; // Zmienna do przechowywania danych postaci gracza

    // Główna funkcja inicjalizująca
    auth.onAuthStateChanged(user => {
        if (user) {
            initializeApp(user);
        } else {
            window.location.href = 'login.html';
        }
    });

    function initializeApp(user) {
        const campaignRef = db.collection('campaigns').doc(campaignId);
        const charactersRef = campaignRef.collection('characters');
        
        const historyCollectionRef = campaignRef.collection('history'); // Do zapisu
        const historyQueryRef = historyCollectionRef.orderBy('timestamp');   // Do odczytu
        const creaturesOnMapRef = campaignRef.collection('creaturesOnMap');

        // 1. Sprawdzenie dostępu i ładowanie danych kampanii
        campaignRef.get().then(doc => {
            if (!doc.exists) {
                document.body.innerHTML = '<h1>Kampania nie znaleziona.</h1>';
                return;
            }
            const campaign = doc.data();

            if (!campaign.playerIds || !campaign.playerIds.includes(user.uid)) {
                document.body.innerHTML = '<h1>Odmowa dostępu.</h1><p>Nie jesteś graczem w tej kampanii.</p>';
                return;
            }
            
            campaignNameHeader.textContent = campaign.name;
            if (campaign.image) {
                mapContainer.style.backgroundImage = `url('${campaign.image}')`;
            }

            // Znajdowanie postaci aktualnego użytkownika dla panelu bocznego
            charactersRef.where('ownerPlayerId', '==', user.uid).limit(1).get().then(snapshot => {
                if (!snapshot.empty) {
                    myCharacterData = snapshot.docs[0].data();
                    myCharacterName.textContent = myCharacterData.name;
                    myCharacterStats.innerHTML = `<p>HP: ${myCharacterData.currentHp}/${myCharacterData.maxHp}</p><p>KP: ${myCharacterData.armorClass}</p>`;
                }
            });
        });

        // 2. Słuchanie aktualizacji wszystkich postaci (tokeny i lista)
        charactersRef.onSnapshot(
            (snapshot) => {
                console.log(`Otrzymano snapshot. Znaleziono ${snapshot.size} postaci.`);
                if (snapshot.empty) {
                    console.warn("Kolekcja 'characters' jest pusta.");
                }
                snapshot.docChanges().forEach(change => {
                    const charId = change.doc.id;
                    const charData = change.doc.data();
                    console.log(` > Zmiana: '${change.type}' dla postaci '${charData.name}'`);
                    if (change.type === 'added' && !document.getElementById(charId)) {
                        createToken(charId, charData, user.uid);
                        renderCharacterInList(charId, charData);
                    }
                    if (change.type === 'modified') {
                        updateTokenPosition(charId, charData.position);
                        renderCharacterInList(charId, charData);
                    }
                    if (change.type === 'removed') {
                        document.getElementById(charId)?.remove();
                        document.getElementById(`card-${charId}`)?.remove();
                    }
                });
            },
            (error) => {
                console.error("KRYTYCZNY: Błąd podczas słuchania zmian postaci. Sprawdź reguły Firestore.", error);
            }
        );

        function renderCharacterInventoryPreview(charId, inventoryContainer) {
            const inventoryRef = charactersRef.doc(charId).collection('inventory');
            inventoryRef.limit(5).get().then(snapshot => {
                if (snapshot.empty) {
                    inventoryContainer.innerHTML = '<p style="font-size: 0.8em; color: #888; font-style: italic;">Brak przedmiotów</p>';
                    return;
                }
                let html = '';
                snapshot.forEach(doc => {
                    const item = doc.data();
                    html += `
                        <div class="character-card-inventory-item">
                            <strong>${item.name || 'Bez nazwy'}${item.quantity ? `<span class="inventory-quantity"> (${item.quantity})</span>` : ''}</strong>
                            ${item.description ? `<div class="inventory-description">${item.description}</div>` : ''}
                        </div>
                    `;
                });
                if (snapshot.size >= 5) {
                    html += '<p style="font-size: 0.75em; color: #888; font-style: italic; margin-top: 5px;">...</p>';
                }
                inventoryContainer.innerHTML = html;
            }).catch(console.error);
        }

        // Funkcja renderująca postać w liście na panelu bocznym (dwukolumnowa struktura z ekwipunkiem)
        function renderCharacterInList(id, data) {
            const charactersOnMapList = document.getElementById('characters-on-map-list');
            let card = document.getElementById(`card-${id}`);
            
            // Jeśli karty jeszcze nie ma, tworzymy ją
            if (!card) {
                card = document.createElement('div');
                card.className = 'character-card';
                card.id = `card-${id}`;
                charactersOnMapList.appendChild(card);
            }
            
            // Dwukolumnowa struktura: lewa kolumna - podstawowe informacje, prawa kolumna - ekwipunek
            card.innerHTML = `
                <h4 class="character-name">${data.name || 'Postać'}</h4>
                <div class="character-card-content">
                    <div class="character-card-left">
                        <div class="creature-stats">
                        <span>HP:</span>
                            <label><p>${data.currentHp || 0}</p></label>
                            <p>/ ${data.maxHp || 0}</p>
                        </div>
                        <span>Notes/Status:</span>
                        <p class="notes-input character-notes" data-id="${id}"  rows="3">${data.notes || ''}</p>
                    </div>
                    <div class="character-card-right">
                        <h5>Inventory</h5>
                        <div class="character-card-inventory" id="inventory-preview-${id}">
                            <p style="font-size: 0.8em; color: #888; font-style: italic;">Ładowanie...</p>
                        </div>
                    </div>
                </div>
            `;
            
            // Renderuj podgląd ekwipunku
            const inventoryContainer = document.getElementById(`inventory-preview-${id}`);
            if (inventoryContainer) {
                renderCharacterInventoryPreview(id, inventoryContainer);
            }
        }


        // Funkcja renderująca listę przedmiotów w ekwipunku
        function renderInventoryList(charId, inventoryRef) {
            const inventoryListEl = document.getElementById('inventory-list');
            if (!inventoryListEl) return;
            
            inventoryRef.onSnapshot((snapshot) => {
                if (snapshot.empty) {
                    inventoryListEl.innerHTML = '<p style="color: #888; font-style: italic;">No items in inventory.</p>';
                    return;
                }
                
                inventoryListEl.innerHTML = '';
                snapshot.forEach(doc => {
                    const item = doc.data();
                    const itemEl = document.createElement('div');
                    itemEl.className = 'inventory-item';
                    itemEl.innerHTML = `
                        <div class="inventory-item-info">
                            <strong>${item.name || 'Without name'}</strong>
                            ${item.quantity ? `<span class="inventory-quantity"> (${item.quantity})</span>` : ''}
                            ${item.description ? `<p class="inventory-description">${item.description}</p>` : ''}
                        </div>
                        <button class="btn danger-btn small-btn delete-inventory-item-btn" data-item-id="${doc.id}">Delete</button>
                    `;
                    inventoryListEl.appendChild(itemEl);
                });
            }, console.error);
        }

        

        // 3. Słuchanie stworów na mapie (tylko do odczytu)
        creaturesOnMapRef.onSnapshot(
            (snapshot) => {
                // Synchronizacja: usuwanie z mapy/listy stworów, których już nie ma w bazie
                const currentCreatureIdsOnMap = snapshot.docs.map(doc => doc.id);
                document.querySelectorAll('.token[data-type="creature"]').forEach(token => {
                    if (!currentCreatureIdsOnMap.includes(token.id)) token.remove();
                });
                creaturesOnMapList.innerHTML = ''; // Czyszczenie listy na panelu bocznym

                // Przetwarzanie zmian
                snapshot.forEach(doc => {
                    const creatureId = doc.id;
                    const creatureData = doc.data();

                    // Wyświetlanie/aktualizacja tokenu na mapie
                    if (!document.getElementById(creatureId)) {
                        createToken(creatureId, creatureData, 'creature');
                    } else {
                        updateTokenPosition(creatureId, creatureData.position);
                    }
                    
                    // Wyświetlanie karty w liście na panelu bocznym
                    renderCreatureInList(creatureId, creatureData);
                });
            },
            (error) => {
                console.error("Błąd podczas słuchania stworów na mapie:", error);
            }
        );

        // 4. Słuchanie dziennika historii
        historyQueryRef.onSnapshot(
            (snapshot) => {
                if (snapshot.empty) {
                    historyLog.innerHTML = '<p class="log-entry system">Sesja rozpoczęta. Brak zdarzeń.</p>';
                    return;
                }
                historyLog.innerHTML = '';
                snapshot.forEach(doc => {
                    const entry = doc.data();
                    const p = document.createElement('p');
                    p.textContent = `${entry.author}: ${entry.content}`;
                    p.className = `log-entry ${entry.type}`;
                    historyLog.appendChild(p);
                });
                historyLog.scrollTop = historyLog.scrollHeight;
            },
            (error) => {
                console.error("KRYTYCZNY: Błąd podczas słuchania historii. Sprawdź reguły Firestore.", error);
            }
        );

        // Funkcja renderująca stwor w liście (tylko do odczytu)
        function renderCreatureInList(id, data) {
            let card = document.getElementById(`card-${id}`);
            if (!card) {
                card = document.createElement('div');
                card.className = 'creature-card';
                card.id = `card-${id}`;
                creaturesOnMapList.appendChild(card);
            }
            // Wersja tylko do odczytu dla gracza - bez pól edycji
            card.innerHTML = `<h4>${data.name || 'Stwór'}</h4><p>HP: ${data.currentHp || 0}/${data.maxHp || 0} | KP: ${data.armorClass || 10}</p>`;
        }

        // 5. Rzuty kostkami gracza
        diceRoller.addEventListener('click', event => {
            if (event.target.classList.contains('die-btn')) {
                const die = event.target.dataset.die;
                const sides = parseInt(die.substring(1));
                const result = Math.floor(Math.random() * sides) + 1;
                const authorName = myCharacterData ? myCharacterData.name : "Player";
                diceResult.textContent = `You rolled ${die}: ${result}`;
                historyCollectionRef.add({
                    author: authorName,
                    content: `rolled ${die} and got ${result}`,
                    type: 'roll',
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).catch(error => console.error("Błąd dodawania wpisu do historii:", error));
            }
        });

        // 6. Logika przeciągania i upuszczania (tylko dla własnego tokenu)
        let activeToken = null, offsetX, offsetY;
        
        function makeDraggable(token, isOwner) {
            if (isOwner) {
                token.style.touchAction = 'none';
                token.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    activeToken = token;
                    const rect = token.getBoundingClientRect();
                    offsetX = e.clientX - rect.left;
                    offsetY = e.clientY - rect.top;
                    try { token.setPointerCapture(e.pointerId); } catch (err) {}
                });
            } else { 
                token.style.cursor = 'default'; 
            }
        }

        document.addEventListener('pointermove', (e) => {
            if (!activeToken) return;
            e.preventDefault();
            const mapRect = mapContainer.getBoundingClientRect();
            let newX = e.clientX - mapRect.left - offsetX;
            let newY = e.clientY - mapRect.top - offsetY;
            newX = Math.max(0, Math.min(newX, mapRect.width - activeToken.offsetWidth));
            newY = Math.max(0, Math.min(newY, mapRect.height - activeToken.offsetHeight));
            activeToken.style.left = `${newX}px`;
            activeToken.style.top = `${newY}px`;
        });

        document.addEventListener('pointerup', (e) => {
            if (!activeToken) return;
            const mapRect = mapContainer.getBoundingClientRect();
            const finalXPercent = `${(activeToken.offsetLeft / mapRect.width) * 100}%`;
            const finalYPercent = `${(activeToken.offsetTop / mapRect.height) * 100}%`;
            const tokenId = activeToken.id;
            charactersRef.doc(tokenId).update({ position: { top: finalYPercent, left: finalXPercent } }).catch(console.error);
            try { activeToken.releasePointerCapture && activeToken.releasePointerCapture(e.pointerId); } catch (err) {}
            activeToken = null;
        });

        // Funkcja tworząca token na mapie
        function createToken(id, data, currentUserId) {
            const name = data && data.name ? data.name : 'Nieznane';
            const pos = (data && data.position) ? data.position : { top: '0%', left: '0%' };
            const tokenUrl = data && data.tokenUrl ? data.tokenUrl : '';
            const type = currentUserId === 'creature' ? 'creature' : 'character';

            let token = document.getElementById(id);
            if (!token) {
                if (type === 'creature') {
                    // Dla stworów nie sprawdzamy ownerPlayerId
                    token = document.createElement('div');
                    token.id = id;
                    token.className = 'token creature-token';
                    token.dataset.type = 'creature';
                } else {
                    if (!data.position || !data.name || !data.tokenUrl) {
                        console.warn(`Postać ${id} ('${data.name}') nie ma wymaganych pól (position, name, lub tokenUrl).`);
                        return;
                    }
                    const isOwner = data.ownerPlayerId === currentUserId;
                    token = document.createElement('div');
                    token.id = id;
                    token.className = 'token character-token';
                    token.dataset.type = 'character';
                }

                const img = document.createElement('div');
                img.className = 'token-image';
                if (tokenUrl) img.style.backgroundImage = `url('${tokenUrl}')`;
                token.appendChild(img);

                const nameEl = document.createElement('div');
                nameEl.className = 'token-name';
                nameEl.textContent = name;
                token.appendChild(nameEl);

                if (type === 'character') {
                    makeDraggable(token, data.ownerPlayerId === currentUserId);
                }
                mapContainer.appendChild(token);
            } else {
                token.dataset.type = type;
                token.classList.toggle('creature-token', type === 'creature');
                token.classList.toggle('character-token', type !== 'creature');
                const nameEl = token.querySelector('.token-name');
                if (nameEl) nameEl.textContent = name;
                const img = token.querySelector('.token-image');
                if (img && tokenUrl) img.style.backgroundImage = `url('${tokenUrl}')`;
            }

            token.style.top = pos.top;
            token.style.left = pos.left;
        }

        // Funkcja aktualizująca pozycję tokenu
        function updateTokenPosition(id, position) {
            const token = document.getElementById(id);
            if (token && position) {
                token.style.top = position.top;
                token.style.left = position.left;
            }
        }
    }
});