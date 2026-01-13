// Uniwersalny formularz postaci - tryb tworzenia i edycji
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id');
    const charId = urlParams.get('charId');
    const isEditMode = !!charId; // Tryb edycji jeśli charId istnieje

    // Sprawdzanie ID kampanii w URL
    if (!campaignId) {
        document.body.innerHTML = '<h1>Błąd: Brak ID kampanii w URL.</h1>';
        return;
    }

    // Listy umiejętności i cech
    const abilityNames = ["Siła", "Zręczność", "Wytrzymałość", "Inteligencja", "Mądrość", "Charyzma"];
    const skillNames = {
        "Akrobatyka": "Zręczność", "Postępowanie ze zwierzętami": "Mądrość", "Arkana": "Inteligencja", "Atletyka": "Siła",
        "Oszustwo": "Charyzma", "Historia": "Inteligencja", "Wgląd": "Mądrość", "Zastraszanie": "Charyzma",
        "Śledztwo": "Inteligencja", "Medycyna": "Mądrość", "Przyroda": "Inteligencja", "Percepcja": "Mądrość",
        "Występ": "Charyzma", "Perswazja": "Charyzma", "Religia": "Inteligencja", "Zwinne ręce": "Zręczność",
        "Ukrywanie się": "Zręczność", "Przetrwanie": "Mądrość"
    };

    // Generowanie HTML dla checkboxów
    const savingThrowsList = document.getElementById('saving-throws-list');
    const skillsList = document.getElementById('skills-list');
    abilityNames.forEach(name => {
        savingThrowsList.innerHTML += `<div class="skill-item"><input type="checkbox" id="prof-st-${name.toLowerCase()}" data-type="st" data-name="${name.toLowerCase()}"><label for="prof-st-${name.toLowerCase()}">${name}</label></div>`;
    });
    Object.keys(skillNames).forEach(name => {
        skillsList.innerHTML += `<div class="skill-item"><input type="checkbox" id="prof-skill-${name}" data-type="skill" data-name="${name}"><label for="prof-skill-${name}">${name}</label></div>`;
    });
    
    // Główna logika
    auth.onAuthStateChanged(user => {
        if (user) {
            // Najpierw ładujemy zasady kampanii
            db.collection('campaigns').doc(campaignId).get().then(doc => {
                let campaignRules = { skillProficiencyLimit: 2 }; // Domyślna wartość
                if (doc.exists && doc.data().rules) {
                    campaignRules = doc.data().rules;
                }
                // Po załadowaniu zasad inicjalizujemy stronę
                initializeApp(user, campaignRules);
            });
        } else {
            window.location.href = 'login.html';
        }
    });

    function initializeApp(user, campaignRules) {
        // Pobieranie elementów formularza
        const rollStatsBtn = document.getElementById('rollStatsBtn');
        const statsPoolDiv = document.getElementById('rolled-stats-pool');
        const createCharacterForm = document.getElementById('createCharacterForm');
        const saveCharBtn = document.getElementById('saveCharBtn');
        const validationMessage = document.getElementById('validation-message');
        const pageTitle = document.querySelector('h1');
        
        let rolledStats = [];
        let characterData = null;

        // Aktualizacja tytułu i przycisku dla trybu edycji
        if (isEditMode) {
            if (pageTitle) pageTitle.textContent = 'Edit Character';
            if (saveCharBtn) saveCharBtn.textContent = 'Update Character';
            
            // Pobieranie danych postaci z Firestore
            db.collection('campaigns').doc(campaignId).collection('characters').doc(charId).get()
                .then(doc => {
                    if (!doc.exists) {
                        alert('Character not found!');
                        window.location.href = `session-player.html?id=${campaignId}`;
                        return;
                    }
                    characterData = doc.data();
                    
                    // Wypełnianie formularza danymi postaci
                    document.getElementById('charName').value = characterData.name || '';
                    document.getElementById('charClass').value = characterData.class || '';
                    document.getElementById('charRace').value = characterData.race || '';
                    document.getElementById('charBackground').value = characterData.background || '';
                    document.getElementById('charAlignment').value = characterData.alignment || '';
                    
                    // Wypełnianie statystyk
                    if (characterData.stats) {
                        document.getElementById('strength').value = characterData.stats.strength || '';
                        document.getElementById('dexterity').value = characterData.stats.dexterity || '';
                        document.getElementById('constitution').value = characterData.stats.constitution || '';
                        document.getElementById('intelligence').value = characterData.stats.intelligence || '';
                        document.getElementById('wisdom').value = characterData.stats.wisdom || '';
                        document.getElementById('charisma').value = characterData.stats.charisma || '';
                    }
                    
                    // Wypełnianie umiejętności i rzutów obronnych
                    if (characterData.proficiencies) {
                        // Saving throws
                        if (characterData.proficiencies.savingThrows) {
                            Object.keys(characterData.proficiencies.savingThrows).forEach(st => {
                                const checkbox = document.getElementById(`prof-st-${st}`);
                                if (checkbox) checkbox.checked = true;
                            });
                        }
                        // Skills
                        if (characterData.proficiencies.skills) {
                            Object.keys(characterData.proficiencies.skills).forEach(skill => {
                                const skillKey = skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1').trim();
                                const checkbox = document.getElementById(`prof-skill-${skillKey}`);
                                if (checkbox) checkbox.checked = true;
                            });
                        }
                    }
                    
                    // Wypełnianie osobowości
                    if (characterData.personality) {
                        document.getElementById('personalityTraits').value = characterData.personality.traits || '';
                        document.getElementById('ideals').value = characterData.personality.ideals || '';
                        document.getElementById('bonds').value = characterData.personality.bonds || '';
                        document.getElementById('flaws').value = characterData.personality.flaws || '';
                    }
                    
                    // Ukrywanie przycisku rzutów w trybie edycji
                    if (rollStatsBtn) rollStatsBtn.style.display = 'none';
                    if (statsPoolDiv) statsPoolDiv.style.display = 'none';
                })
                .catch(error => {
                    console.error('Błąd podczas ładowania postaci:', error);
                    alert('Error loading character data.');
                });
        }

        // Logika rzutów kostkami (tylko w trybie tworzenia)
        if (rollStatsBtn && !isEditMode) {
            rollStatsBtn.addEventListener('click', () => {
                rolledStats = [];
                statsPoolDiv.innerHTML = '';
                for (let i = 0; i < 6; i++) {
                    let rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
                    rolls.sort((a, b) => b - a);
                    rolledStats.push(rolls[0] + rolls[1] + rolls[2]);
                }
                rolledStats.forEach(stat => {
                    const bubble = document.createElement('div');
                    bubble.className = 'stat-bubble';
                    bubble.textContent = stat;
                    statsPoolDiv.appendChild(bubble);
                });
                showFeedback('Statystyki wylosowane. Przypisz je poniżej.', 'info');
            });
        }

        // Słuchacz dla checkboxów umiejętności (z ograniczeniem)
        skillsList.addEventListener('change', () => {
            const checkedSkills = document.querySelectorAll('#skills-list input[type="checkbox"]:checked');
            const limit = campaignRules.skillProficiencyLimit;
            
            if (checkedSkills.length >= limit) {
                document.querySelectorAll('#skills-list input[type="checkbox"]:not(:checked)').forEach(cb => cb.disabled = true);
                showFeedback(`Wybrano maksymalną liczbę ${limit} umiejętności.`, 'info');
            } else {
                document.querySelectorAll('#skills-list input[type="checkbox"]').forEach(cb => cb.disabled = false);
                showFeedback('', 'info');
            }
        });

        // Logika zapisywania postaci
        createCharacterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Walidacja (tylko w trybie tworzenia)
            if (!isEditMode) {
                if (rolledStats.length !== 6) {
                    showFeedback('Musisz najpierw rzucić statystykami!', 'error');
                    return;
                }
                const statInputs = Array.from(document.querySelectorAll('.stat-input'));
                const inputValues = statInputs.map(input => parseInt(input.value) || 0).sort((a,b) => a-b);
                const rolledStatsSorted = [...rolledStats].sort((a,b) => a-b);
                if (JSON.stringify(inputValues) !== JSON.stringify(rolledStatsSorted)) {
                    showFeedback('Wprowadzone statystyki nie pasują do wylosowanych wartości.', 'error');
                    return;
                }
            }

            // Walidacja umiejętności
            const checkedSkillsCount = document.querySelectorAll('#skills-list input[type="checkbox"]:checked').length;
            if (checkedSkillsCount > campaignRules.skillProficiencyLimit) {
                showFeedback(`Można wybrać maksymalnie ${campaignRules.skillProficiencyLimit} umiejętności.`, 'error');
                return;
            }
            
            showFeedback(isEditMode ? 'Zapisywanie zmian...' : 'Walidacja udana! Zapisywanie...', 'success');
            saveCharBtn.disabled = true;
            saveCharBtn.textContent = 'Zapisywanie...';

            // Obliczanie wszystkich statystyk
            const stats = {
                strength: parseInt(document.getElementById('strength').value),
                dexterity: parseInt(document.getElementById('dexterity').value),
                constitution: parseInt(document.getElementById('constitution').value),
                intelligence: parseInt(document.getElementById('intelligence').value),
                wisdom: parseInt(document.getElementById('wisdom').value),
                charisma: parseInt(document.getElementById('charisma').value)
            };
            const getModifier = (score) => Math.floor((score - 10) / 2);
            const modifiers = {
                strength: getModifier(stats.strength),
                dexterity: getModifier(stats.dexterity),
                constitution: getModifier(stats.constitution),
                intelligence: getModifier(stats.intelligence),
                wisdom: getModifier(stats.wisdom),
                charisma: getModifier(stats.charisma)
            };
            const savingThrowsProf = {};
            document.querySelectorAll('input[data-type="st"]:checked').forEach(el => savingThrowsProf[el.dataset.name] = true);
            const skillsProf = {};
            document.querySelectorAll('input[data-type="skill"]:checked').forEach(el => skillsProf[el.dataset.name.toLowerCase().replace(/ /g, '')] = true);

            const characterDataToSave = {
                name: document.getElementById('charName').value,
                class: document.getElementById('charClass').value,
                race: document.getElementById('charRace').value,
                background: document.getElementById('charBackground').value,
                alignment: document.getElementById('charAlignment').value,
                stats: stats,
                modifiers: modifiers,
                proficiencies: { savingThrows: savingThrowsProf, skills: skillsProf },
                personality: {
                    traits: document.getElementById('personalityTraits').value,
                    ideals: document.getElementById('ideals').value,
                    bonds: document.getElementById('bonds').value,
                    flaws: document.getElementById('flaws').value
                }
            };

            // Zapisywanie w Firestore
            const charactersRef = db.collection('campaigns').doc(campaignId).collection('characters');
            
            if (isEditMode) {
                // Tryb edycji - aktualizacja
                charactersRef.doc(charId).update(characterDataToSave)
                    .then(() => {
                        alert(`${characterDataToSave.name} zaktualizowano pomyślnie!`);
                        window.location.href = `session-player.html?id=${campaignId}`;
                    })
                    .catch(error => {
                        console.error("Błąd podczas aktualizacji postaci:", error);
                        alert("Wystąpił błąd podczas aktualizacji.");
                        saveCharBtn.disabled = false;
                        saveCharBtn.textContent = 'Update Character';
                    });
            } else {
                // Tryb tworzenia - dodanie nowej postaci
                const newCharacter = {
                    ...characterDataToSave,
                    ownerPlayerId: user.uid,
                    level: 1,
                    experiencePoints: 0,
                    proficiencyBonus: 2,
                    inspiration: 0,
                    armorClass: 10 + modifiers.dexterity,
                    initiative: modifiers.dexterity,
                    speed: "30ft",
                    maxHp: 15 + modifiers.constitution,
                    currentHp: 8 + modifiers.constitution,
                    tempHp: 0,
                    hitDice: "1d8",
                    equipment: [],
                    featuresAndTraits: "",
                    tokenUrl: '/token.png',
                    position: { top: '10%', left: '10%' },
                    notes: ''
                };

                charactersRef.add(newCharacter)
                    .then(() => {
                        alert(`${newCharacter.name} utworzono pomyślnie!`);
                        window.location.href = `session-player.html?id=${campaignId}`;
                    })
                    .catch(error => {
                        console.error("Błąd podczas tworzenia postaci:", error);
                        alert("Wystąpił błąd.");
                        saveCharBtn.disabled = false;
                        saveCharBtn.textContent = 'Save Character';
                    });
            }
        });
    }

    function showFeedback(message, type) {
        const validationMessage = document.getElementById('validation-message');
        if (validationMessage) {
            validationMessage.textContent = message;
            validationMessage.className = `feedback feedback-${type || 'info'}`;
        }
    }
});

