// Skrypt dla sesji na żywo MG
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id');

    // Pobieranie elementów z DOM
    const campaignNameHeader = document.getElementById('campaign-name-header');
    const mapContainer = document.getElementById('map-container');
    const historyLog = document.getElementById('history-log');
    const storyForm = document.getElementById('story-form');
    const storyInput = document.getElementById('story-input');
    const diceRoller = document.getElementById('dice-roller');
    const diceResult = document.getElementById('dice-result');
    
    const addCreatureBtn = document.getElementById('add-creature-btn');
    const creatureTemplateSelect = document.getElementById('creature-template-select');
    const creaturesOnMapList = document.getElementById('creatures-on-map-list');
    const charactersOnMapList = document.getElementById('characters-on-map-list');

    const modal = document.getElementById('character-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBody = document.getElementById('modal-body');

    if (!campaignId) {
        document.body.innerHTML = '<h1>Błąd: ID kampanii nie znaleziono w URL.</h1>';
        return;
    }

    // Function to track user activity in game sessions
    function trackActivity(user) {
        if (user) {
            db.collection('users').doc(user.uid).update({
                lastActivity: firebase.firestore.FieldValue.serverTimestamp(),
                isOnline: true
            }).catch(err => console.error('Activity tracking error:', err));
        }
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            initializeApp(user);
            // Track initial activity when entering session
            trackActivity(user);
        } else {
            window.location.href = 'login.html';
        }
    });

    function initializeApp(user) {
        const campaignRef = db.collection('campaigns').doc(campaignId);
        const charactersRef = campaignRef.collection('characters');
        const historyCollectionRef = campaignRef.collection('history');
        const historyQueryRef = historyCollectionRef.orderBy('timestamp');
        const creatureTemplatesRef = campaignRef.collection('creatures'); 
        const creaturesOnMapRef = campaignRef.collection('creaturesOnMap');

        // Funkcje pomocnicze
        let activeTokenRef = null;
        let notesDebounceTimer, modalDebounceTimer; // Unikalne timery dla różnych funkcji

        // Funkcja ustawiająca tekst w elemencie
        function setText(node, text) {
            node.textContent = (text === undefined || text === null) ? '' : String(text);
        }

        // Funkcja tworząca token na mapie
        function createToken(id, data, type = 'character') {
            const name = data && data.name ? data.name : 'Unknown';
            const pos = (data && data.position) ? data.position : { top: '0%', left: '0%' };
            const tokenUrl = data && data.tokenUrl ? data.tokenUrl : '';

            let token = document.getElementById(id);
            if (!token) {
                token = document.createElement('div');
                token.id = id;
                token.className = 'token';
                token.classList.add(type === 'creature' ? 'creature-token' : 'character-token');
                token.dataset.type = type;

                const img = document.createElement('div');
                img.className = 'token-image';
                if (tokenUrl) img.style.backgroundImage = `url('${tokenUrl}')`;
                token.appendChild(img);

                const nameEl = document.createElement('div');
                nameEl.className = 'token-name';
                setText(nameEl, name);
                token.appendChild(nameEl);

                makeDraggable(token);
                mapContainer.appendChild(token);
            } else {
                token.dataset.type = type;
                token.classList.toggle('creature-token', type === 'creature');
                token.classList.toggle('character-token', type !== 'creature');
                const nameEl = token.querySelector('.token-name'); if (nameEl) setText(nameEl, name);
                const img = token.querySelector('.token-image'); if (img && tokenUrl) img.style.backgroundImage = `url('${tokenUrl}')`;
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

        // Funkcja renderująca podgląd ekwipunku w karcie postaci (tylko do odczytu, bez przycisków)
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
                            <label>HP: <input type="number" class="hp-input character-hp" data-id="${id}" value="${data.currentHp || 0}"></label>
                            <span>/ ${data.maxHp || 0}</span>
                        </div>
                        <textarea class="notes-input character-notes" data-id="${id}" placeholder="Status, np. Zatruty..." rows="3">${data.notes || ''}</textarea>
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
                    inventoryListEl.innerHTML = '<p style="color: #888; font-style: italic;">Brak przedmiotów w ekwipunku.</p>';
                    return;
                }
                
                inventoryListEl.innerHTML = '';
                snapshot.forEach(doc => {
                    const item = doc.data();
                    const itemEl = document.createElement('div');
                    itemEl.className = 'inventory-item';
                    itemEl.innerHTML = `
                        <div class="inventory-item-info">
                            <strong>${item.name || 'Bez nazwy'}</strong>
                            ${item.quantity ? `<span class="inventory-quantity"> (${item.quantity})</span>` : ''}
                            ${item.description ? `<p class="inventory-description">${item.description}</p>` : ''}
                        </div>
                        <button class="btn danger-btn small-btn delete-inventory-item-btn" data-item-id="${doc.id}">Usuń</button>
                    `;
                    inventoryListEl.appendChild(itemEl);
                });
            }, console.error);
        }

        // Funkcja otwierająca edytor postaci z sekcją ekwipunku
        function openCharacterEditor(charId) {
            charactersRef.doc(charId).get().then(doc => {
                if (!doc.exists) { return; }
                const data = doc.data();
                const inventoryRef = charactersRef.doc(charId).collection('inventory');

                modalBody.innerHTML = `
                    <div class="modal-section">
                        <h2>${data.name} - Full Character Card</h2>
                        <h3>${data.background} - Description</h3>
                    </div>
                    <div class="modal-section">
                        <h3>Basic Information</h3>
                        
                        <div class="modal-grid">
                            <div class="form-group"><label>Race: </label><div class="static-data">${data.race || 'Unknown'}</div></div>
                            <div class="form-group"><label>Level</label><input type="number" data-field="level" value="${data.level || 1}"></div>
                            <div class="form-group"><label>HP</label><input type="number" data-field="currentHp" value="${data.currentHp || 0}"></div>
                            <div class="form-group"><label>Tymczasowe HP</label><input type="number" data-field="tempHp" value="${data.tempHp || 0}"></div>
                            <div class="form-group"><label>Klasa Pancerza</label><input type="number" data-field="armorClass" value="${data.armorClass || 10}"></div>
                            <div class="form-group"><label>Inspiracja</label><input type="number" data-field="inspiration" value="${data.inspiration || 0}"></div>
                        </div>
                    </div>
                    <div class="modal-section">
                        <h3>Cechy</h3>
                        <div class="modal-grid">
                            ${Object.keys(data.stats || {}).map(stat => `
                                <div class="form-group">
                                    <label>${stat.charAt(0).toUpperCase() + stat.slice(1)}</label>
                                    <input type="number" data-field="stats.${stat}" value="${data.stats[stat]}">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-section">
                        <h3>Osobowość</h3>
                        <div class="form-group"><label>Cechy</label><textarea data-field="personality.traits" rows="3">${(data.personality && data.personality.traits) || ''}</textarea></div>
                        <div class="form-group"><label>Idee</label><textarea data-field="personality.ideals" rows="2">${(data.personality && data.personality.ideals) || ''}</textarea></div>
                        <div class="form-group"><label>Bonds</label><textarea data-field="personality.ideals" rows="2">${(data.personality && data.personality.bonds) || ''}</textarea></div>
                        <div class="form-group"><label>Flaws</label><textarea data-field="personality.ideals" rows="2">${(data.personality && data.personality.flaws) || ''}</textarea></div>
                    </div>
                    <div class="modal-section">
                        <h3>Inventory</h3>
                        <div id="inventory-list" class="inventory-list">
                            <p style="color: #888; font-style: italic;">Loading...</p>
                        </div>
                        <div class="inventory-add-form">
                            <h4>Add item</h4>
                            <div class="form-group">
                                <label>Item name</label>
                                <input type="text" id="inventory-item-name" placeholder="Item name">
                            </div>
                            <div class="form-group">
                                <label>Opis</label>
                                <textarea id="inventory-item-description" rows="2" placeholder="Item description"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Quantity</label>
                                <input type="number" id="inventory-item-quantity" value="1" min="1">
                            </div>
                            <button id="add-inventory-item-btn" class="btn primary-btn">Add item</button>
                        </div>
                    </div>
                `;
                
                // Renderuj listę ekwipunku
                renderInventoryList(charId, inventoryRef);
                
                // Obsługa dodawania przedmiotu do ekwipunku
                const addInventoryBtn = document.getElementById('add-inventory-item-btn');
                if (addInventoryBtn) {
                    addInventoryBtn.addEventListener('click', () => {
                        const name = document.getElementById('inventory-item-name').value.trim();
                        const description = document.getElementById('inventory-item-description').value.trim();
                        const quantity = parseInt(document.getElementById('inventory-item-quantity').value) || 1;
                        
                        if (!name) {
                            alert('Proszę podać nazwę przedmiotu.');
                            return;
                        }
                        
                        inventoryRef.add({
                            name: name,
                            description: description,
                            quantity: quantity
                        }).then(() => {
                            document.getElementById('inventory-item-name').value = '';
                            document.getElementById('inventory-item-description').value = '';
                            document.getElementById('inventory-item-quantity').value = '1';
                        }).catch(console.error);
                    });
                }
                
                // Obsługa usuwania przedmiotu z ekwipunku (delegacja zdarzeń)
                modalBody.addEventListener('click', (e) => {
                    if (e.target.classList.contains('delete-inventory-item-btn')) {
                        const itemId = e.target.dataset.itemId;
                        if (itemId && confirm('Czy na pewno chcesz usunąć ten przedmiot?')) {
                            inventoryRef.doc(itemId).delete().catch(console.error);
                        }
                    }
                });
                
                modal.style.display = 'flex';
            });
            
            modal.dataset.activeCharId = charId;
        }

        // Logika przeciągania tokenów (obsługa zdarzeń pointer)
        let activeToken = null, offsetX = 0, offsetY = 0;
        
        // Funkcja umożliwiająca przeciąganie tokenu
        function makeDraggable(token) {
            token.style.touchAction = 'none';
            token.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                activeToken = token;
                const rect = token.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                try { token.setPointerCapture(e.pointerId); } catch (err) {}
            });
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

            const isCreature = activeToken.dataset && activeToken.dataset.type === 'creature';
            const targetRef = isCreature ? creaturesOnMapRef : charactersRef;
            targetRef.doc(tokenId).update({ position: { top: finalYPercent, left: finalXPercent } }).catch(console.error);

            try { activeToken.releasePointerCapture && activeToken.releasePointerCapture(e.pointerId); } catch (err) {}
            activeToken = null;
        });

        // Listenery dla synchronizacji danych z Firestore
        // Synchronizacja postaci na mapie
        charactersRef.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(change => {
                const docId = change.doc.id;
                const docData = change.doc.data();
                if (change.type === 'added') {
                    createToken(docId, docData, 'character');
                    renderCharacterInList(docId, docData);
                }
                if (change.type === 'modified') {
                    if (docData.position) updateTokenPosition(docId, docData.position);
                    renderCharacterInList(docId, docData);
                }
                if (change.type === 'removed') {
                    document.getElementById(docId)?.remove();
                    document.getElementById(`card-${docId}`)?.remove();
                }
            });
        }, console.error);
        // Obsługa zmiany HP postaci
        charactersOnMapList.addEventListener('change', (event) => {
            if (event.target.classList.contains('character-hp')) {
                const charId = event.target.dataset.id;
                const newHp = parseInt(event.target.value);
                if (charId) {
                    trackActivity(user);
                    charactersRef.doc(charId).update({ currentHp: newHp });
                }
            }
        });

        // Obsługa zmiany notatek postaci (z debounce)
        charactersOnMapList.addEventListener('keyup', (event) => {
            if (event.target.classList.contains('character-notes')) {
                clearTimeout(notesDebounceTimer);
                notesDebounceTimer = setTimeout(() => {
                    const charId = event.target.dataset.id;
                    const newNotes = event.target.value;
                    if (charId) charactersRef.doc(charId).update({ notes: newNotes });
                }, 750);
            }
        });

        // Synchronizacja stworów na mapie
        creaturesOnMapRef.onSnapshot(snapshot => {
            creaturesOnMapList.innerHTML = '';
            const existingTokens = Array.from(document.querySelectorAll('.token')).filter(t => t.dataset && t.dataset.type === 'creature').map(t => t.id);
            const snapshotTokens = snapshot.docs.map(d => d.id);
            existingTokens.forEach(tokenId => {
                const el = document.getElementById(tokenId);
                if (!snapshotTokens.includes(tokenId) && el) el.remove();
            });
            snapshot.forEach(doc => {
                const id = doc.id; const data = doc.data() || {};
                createToken(id, data, 'creature');
                if (data.position) updateTokenPosition(id, data.position);
                // Renderowanie karty stwora w panelu bocznym
                const card = document.createElement('div');
                card.className = 'creature-card';
                card.id = `card-${id}`;
                card.innerHTML = `<h4>${data.name || 'Stwór'}</h4>
                    <div class="creature-stats">
                      <label>HP: <input class="hp-input" data-id="${id}" type="number" value="${data.currentHp || 0}"></label>
                      <span>/ ${data.maxHp || 0}</span>
                      <button class="btn danger-btn small-btn delete-creature-btn" data-id="${id}">X</button>
                    </div>`;
                creaturesOnMapList.appendChild(card);
            });
        }, console.error);

        // Kliknięcie na kartę postaci w panelu bocznym - otwiera edytor
        charactersOnMapList.addEventListener('click', (event) => {
            // Sprawdzamy, czy kliknięto na h4 z klasą character-name
            if (event.target.classList.contains('character-name')) {
                const card = event.target.closest('.character-card');
                const charId = card.id.replace('card-', '');
                openCharacterEditor(charId);
            }
        });

        // Zamykanie modala postaci
        closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
        modal.addEventListener('click', (event) => {
            if (event.target === modal) { modal.style.display = 'none'; }
        });

        // Zapis zmian z modala postaci (z debounce)
        modalBody.addEventListener('input', (event) => {
            clearTimeout(modalDebounceTimer);
            modalDebounceTimer = setTimeout(() => {
                const charId = modal.dataset.activeCharId;
                if (!charId || !event.target.dataset.field) return;

                const fieldPath = event.target.dataset.field;
                const value = event.target.type === 'number' ? parseInt(event.target.value) : event.target.value;

                // Używamy "dot notation" do aktualizacji zagnieżdżonych pól
                const updateData = {};
                updateData[fieldPath] = value;

                charactersRef.doc(charId).update(updateData)
                    .then(() => console.log(`Zaktualizowano ${fieldPath} dla ${charId}`))
                    .catch(console.error);
            }, 500);
        });

        

        // Synchronizacja historii sesji
        historyQueryRef.onSnapshot(snapshot => {
            historyLog.innerHTML = '';
            if (snapshot.empty) historyLog.innerHTML = '<p class="log-entry system">Sesja rozpoczęta. Brak zdarzeń.</p>';
            snapshot.forEach(doc => { 
                const e = doc.data() || {}; 
                const p = document.createElement('p'); 
                p.className = `log-entry ${e.type || ''}`; 
                p.textContent = `${e.author || 'System'}: ${e.content || ''}`; 
                historyLog.appendChild(p); 
            });
            historyLog.scrollTop = historyLog.scrollHeight;
        }, console.error);

        // Obsługa formularza historii (wpisy tekstowe)
        storyForm && storyForm.addEventListener('submit', ev => {
            ev.preventDefault(); 
            const content = (storyInput && storyInput.value || '').trim(); 
            if (!content) return;
            trackActivity(user);
            historyCollectionRef.add({ author: 'MG', content, type: 'story', timestamp: firebase.firestore.FieldValue.serverTimestamp() }).catch(console.error);
            storyInput.value = '';
        });

        // Obsługa rzutów kostkami
        diceRoller && diceRoller.addEventListener('click', ev => {
            if (ev.target.classList.contains('die-btn')) {
                trackActivity(user);
                const die = ev.target.dataset.die || 'd6'; 
                const sides = parseInt(die.substring(1)) || 6;
                const result = Math.floor(Math.random() * sides) + 1; 
                if (diceResult) diceResult.textContent = `You rolled ${die}: ${result}`;
                historyCollectionRef.add({ author: 'MG', content: `rolled ${die} and got ${result}`, type: 'roll', timestamp: firebase.firestore.FieldValue.serverTimestamp() }).catch(console.error);
            }
        });

        // Obsługa dodawania stworów z szablonu na mapę
        addCreatureBtn && addCreatureBtn.addEventListener('click', () => {
            trackActivity(user);
            const templateId = creatureTemplateSelect.value; 
            if (!templateId) return;
            creatureTemplatesRef.doc(templateId).get().then(doc => {
                if (!doc.exists) return; 
                const tpl = doc.data() || {};
                const newCreature = { 
                    ...tpl, 
                    position: tpl.position || { top: '50%', left: '50%' }, 
                    maxHp: tpl.maxHp || 10, 
                    currentHp: tpl.currentHp !== undefined ? tpl.currentHp : (tpl.maxHp || 10), 
                    tokenUrl: tpl.tokenUrl || '' 
                };
                creaturesOnMapRef.add(newCreature).catch(console.error);
            }).catch(console.error);
        });

        // Obsługa zmiany HP stwora
        creaturesOnMapList.addEventListener('change', ev => {
            if (ev.target.classList.contains('hp-input')) {
                trackActivity(user);
                const id = ev.target.dataset.id; 
                const hp = parseInt(ev.target.value) || 0; 
                if (id) creaturesOnMapRef.doc(id).update({ currentHp: hp }).catch(console.error);
            }
        });

        // Obsługa usuwania stwora z mapy
        creaturesOnMapList.addEventListener('click', ev => {
            if (ev.target.classList.contains('delete-creature-btn')) {
                trackActivity(user);
                const id = ev.target.dataset.id; 
                if (!id) return; 
                if (confirm('Usunąć tego stwora z mapy?')) creaturesOnMapRef.doc(id).delete().catch(console.error);
            }
        });

        // Ustawienie linku powrotu do panelu
        const backLink = document.getElementById('back-to-dashboard-link');
        if (backLink) {
            backLink.href = `session.html?id=${campaignId}`;
        }

        // Logika przełączania tabów
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Usuń aktywną klasę ze wszystkich przycisków i zawartości
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Dodaj aktywną klasę do klikniętego przycisku i odpowiedniej zawartości
                btn.classList.add('active');
                const targetContent = document.getElementById(`tab-${targetTab}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });

        // Ładowanie danych kampanii i sprawdzanie uprawnień
        campaignRef.get().then(doc => {
            if (!doc.exists || user.uid !== doc.data().ownerId) { 
                document.body.innerHTML = '<h1>Odmowa dostępu lub kampania nie znaleziona.</h1>'; 
                return; 
            }
            const camp = doc.data(); 
            if (campaignNameHeader) campaignNameHeader.textContent = camp.name || 'Kampania'; 
            if (camp.image && mapContainer) mapContainer.style.backgroundImage = `url('${camp.image}')`;
        }).catch(console.error);

        // Ładowanie szablonów stworów do listy rozwijanej
        creatureTemplatesRef.get().then(snapshot => {
            snapshot.forEach(doc => {
                const opt = document.createElement('option'); 
                opt.value = doc.id; 
                opt.textContent = (doc.data() && doc.data().name) ? doc.data().name : doc.id;
                creatureTemplateSelect && creatureTemplateSelect.appendChild(opt);
            });
        }).catch(console.error);
    }
});
