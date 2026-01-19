document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id');

    // Sprawdzamy ID kampanii w URL
    if (!campaignId) {
        document.body.innerHTML = '<h1>Błąd: Brak ID kampanii w URL.</h1>';
        return;
    }

    // --- Listy umiejętności i charakterystyk do generowania ---
    const abilityNames = ["Siła", "Zręczność", "Wytrzymałość", "Inteligencja", "Mądrość", "Charyzma"];
    const skillNames = {
        "Akrobatyka": "Zręczność", "Postępowanie ze zwierzętami": "Mądrość", "Arkana": "Inteligencja", "Atletyka": "Siła",
        "Oszustwo": "Charyzma", "Historia": "Inteligencja", "Wgląd": "Mądrość", "Zastraszanie": "Charyzma",
        "Śledztwo": "Inteligencja", "Medycyna": "Mądrość", "Przyroda": "Inteligencja", "Percepcja": "Mądrość",
        "Występ": "Charyzma", "Perswazja": "Charyzma", "Religia": "Inteligencja", "Zwinne ręce": "Zręczność",
        "Ukrywanie się": "Zręczność", "Przetrwanie": "Mądrość"
    };

    // Generujemy HTML dla checkboxów (możemy to robić od razu)
    const savingThrowsList = document.getElementById('saving-throws-list');
    const skillsList = document.getElementById('skills-list');
    abilityNames.forEach(name => {
        savingThrowsList.innerHTML += `<div class="skill-item"><input type="checkbox" id="prof-st-${name.toLowerCase()}" data-type="st" data-name="${name.toLowerCase()}"><label for="prof-st-${name.toLowerCase()}">${name}</label></div>`;
    });
    Object.keys(skillNames).forEach(name => {
        skillsList.innerHTML += `<div class="skill-item"><input type="checkbox" id="prof-skill-${name}" data-type="skill" data-name="${name}"><label for="prof-skill-${name}">${name}</label></div>`;
    });
    
    // --- Główna logika ---
    auth.onAuthStateChanged(user => {
        if (user) {
            // Najpierw ładujemy reguły kampanii
            db.collection('campaigns').doc(campaignId).get().then(doc => {
                let campaignRules = { skillProficiencyLimit: 2 }; // Wartość domyślna
                if (doc.exists && doc.data().rules) {
                    campaignRules = doc.data().rules;
                }
                // Dopiero po załadowaniu reguł inicjalizujemy stronę
                initializeApp(user, campaignRules);
            });
        } else {
            window.location.href = 'login.html';
        }
    });

    function initializeApp(user, campaignRules) {
        // Pobieramy elementy formularza PO załadowaniu DOM
        const rollStatsBtn = document.getElementById('rollStatsBtn');
        const statsPoolDiv = document.getElementById('rolled-stats-pool');
        const createCharacterForm = document.getElementById('createCharacterForm');
        const saveCharBtn = document.getElementById('saveCharBtn');
        const validationMessage = document.getElementById('validation-message');
        
        let rolledStats = [];

        // --- LOGIKA RZUCANIA KOSTKAMI ---
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
            showFeedback('Cechy wyrzucone. Proszę przypisz je poniżej.', 'info');
        });

        // --- SŁUCHACZ DLA CHECKBOXÓW UMIEJĘTNOŚCI (Z LIMITEM) ---
        skillsList.addEventListener('change', () => {
            const checkedSkills = document.querySelectorAll('#skills-list input[type="checkbox"]:checked');
            const limit = campaignRules.skillProficiencyLimit;
            
            if (checkedSkills.length >= limit) {
                document.querySelectorAll('#skills-list input[type="checkbox"]:not(:checked)').forEach(cb => cb.disabled = true);
                showFeedback(`You selected maximum ${limit} skills.`, 'info');
            } else {
                document.querySelectorAll('#skills-list input[type="checkbox"]').forEach(cb => cb.disabled = false);
                showFeedback('', 'info'); // Clear message
            }
        });

        // --- LOGIKA ZAPISANIA POSTACI ---
        createCharacterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Walidacja cech
            if (rolledStats.length !== 6) { showFeedback('You must first roll your stats!', 'error'); return; }
            const statInputs = Array.from(document.querySelectorAll('.stat-input'));
            const inputValues = statInputs.map(input => parseInt(input.value) || 0).sort((a,b) => a-b);
            const rolledStatsSorted = [...rolledStats].sort((a,b) => a-b);
            if (JSON.stringify(inputValues) !== JSON.stringify(rolledStatsSorted)) {
                showFeedback('Stats you entered don\'t match rolled values.', 'error'); return;
            }

            // Walidacja umiejętności
            const checkedSkillsCount = document.querySelectorAll('#skills-list input[type="checkbox"]:checked').length;
            if (checkedSkillsCount > campaignRules.skillProficiencyLimit) {
                showFeedback(`You can select maximum ${campaignRules.skillProficiencyLimit} skills.`, 'error'); return;
            }
            
            showFeedback('Validation passed! Saving...', 'success');
            saveCharBtn.disabled = true;
            saveCharBtn.textContent = 'Saving...';

            const stats = { strength: parseInt(document.getElementById('strength').value), dexterity: parseInt(document.getElementById('dexterity').value), constitution: parseInt(document.getElementById('constitution').value), intelligence: parseInt(document.getElementById('intelligence').value), wisdom: parseInt(document.getElementById('wisdom').value), charisma: parseInt(document.getElementById('charisma').value) };
            const getModifier = (score) => Math.floor((score - 10) / 2);
            const modifiers = { strength: getModifier(stats.strength), dexterity: getModifier(stats.dexterity), constitution: getModifier(stats.constitution), intelligence: getModifier(stats.intelligence), wisdom: getModifier(stats.wisdom), charisma: getModifier(stats.charisma) };
            const savingThrowsProf = {};
            document.querySelectorAll('input[data-type="st"]:checked').forEach(el => savingThrowsProf[el.dataset.name] = true);
            const skillsProf = {};
            document.querySelectorAll('input[data-type="skill"]:checked').forEach(el => skillsProf[el.dataset.name.toLowerCase().replace(/ /g, '')] = true);

            const newCharacter = {
                name: document.getElementById('charName').value,
                class: document.getElementById('charClass').value,
                race: document.getElementById('charRace').value,
                background: document.getElementById('charBackground').value,
                alignment: document.getElementById('charAlignment').value,
                ownerPlayerId: user.uid, level: 1, experiencePoints: 0,
                stats: stats, modifiers: modifiers, proficiencyBonus: 2, inspiration: 0,
                armorClass: 10 + modifiers.dexterity, initiative: modifiers.dexterity, speed: "30ft",
                maxHp: 15 + modifiers.constitution, currentHp: 15 + modifiers.constitution, tempHp: 0, hitDice: "1d8",
                proficiencies: { savingThrows: savingThrowsProf, skills: skillsProf },
                personality: { traits: document.getElementById('personalityTraits').value, ideals: document.getElementById('ideals').value, bonds: document.getElementById('bonds').value, flaws: document.getElementById('flaws').value },
                equipment: [], featuresAndTraits: "", tokenUrl: '/token.png', position: { top: '10%', left: '10%' },
                notes: [],
            };

            // Zapisanie do Firestore
            db.collection('campaigns').doc(campaignId).collection('characters').add(newCharacter)
                .then(() => {
                    alert(`Character ${newCharacter.name} was successfully created!`);
                    window.location.href = `session-player.html?id=${campaignId}`;
                })
                .catch(error => {
                    console.error("Error creating character:", error);
                    alert("An error occurred.");
                    saveCharBtn.disabled = false; saveCharBtn.textContent = 'Save character';
                });
        });
    }

    function showFeedback(message, type) {
        const validationMessage = document.getElementById('validation-message');
        validationMessage.textContent = message;
        validationMessage.className = `feedback feedback-${type || 'info'}`;
    }
});