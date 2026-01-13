document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id');

    const sessionDetailsContainer = document.getElementById('sessionDetails');
    if (!sessionDetailsContainer) {
        console.error('Brakuje kontenera #sessionDetails w HTML');
        return;
    }

    // Funkcja pomocnicza do pobierania element\u00f3w z logowaniem b\u0142\u0119du
    const getEl = (id) => {
        const el = document.getElementById(id);
        if (!el) console.error(`Brakuje elementu w DOM: #${id}`);
        return el;
    };

    // Pobieramy elementy raz i sprawdzamy
    const campaignNameEl = getEl('campaign-name');
    const campaignSystemEl = getEl('campaign-system');
    const campaignPlayersEl = getEl('campaign-players');
    const sessionCodeEl = getEl('session-code');
    const campaignDescriptionEl = getEl('campaign-description');
    const deleteCampaignBtn = getEl('deleteCampaignBtn');
    const startSessionBtn = getEl('startSessionBtn');
    const manageCreaturesLink = getEl('manage-creatures-link');
    const gmNotesLink = getEl('gm-notes-link');

    if (!campaignId) {
        sessionDetailsContainer.innerHTML = '<h1>Błąd: ID kampanii nie znaleziono w URL.</h1>';
        return;
    }

    // --- Ładowanie danych z Firestore ---
    db.collection('campaigns').doc(campaignId).get()
      .then((doc) => {
        if (!doc.exists) {
            sessionDetailsContainer.innerHTML = '<h1>Kampania nie znaleziona</h1>';
            return;
        }

        const campaign = doc.data();
        console.log('Dane kampanii z Firestore:', campaign);

        const user = auth.currentUser;
        // Je\u015bli chcesz debugowa\u0107 auth, rozwa\u017c dorzuci\u0107: console.log('Auth currentUser', user);
        if (!user || user.uid !== campaign.ownerId) {
            sessionDetailsContainer.innerHTML = '<h1>Dostęp zabroniony</h1><p>Nie masz uprawnień do zarządzania tą kampanią.</p>';
            return;
        }

        // Bezpieczne ustawianie pól - tylko jeżeli elementy istnieją
        if (campaignNameEl) campaignNameEl.textContent = campaign.name ?? 'Unnamed Campaign';
        if (campaignSystemEl) campaignSystemEl.textContent = campaign.system ?? 'Unknown system';
        if (campaignPlayersEl) campaignPlayersEl.textContent = `${campaign.currentPlayers ?? 0}/${campaign.maxPlayers ?? 0}`;
        if (sessionCodeEl) sessionCodeEl.textContent = campaign.sessionCode ?? '';
        if (campaignDescriptionEl) campaignDescriptionEl.textContent = campaign.description ?? 'No description provided.';
        if (campaign && campaign.name) document.title = `${campaign.name} - Campaign Dashboard`;

        // Link do sesji na żywo (tylko jeśli element istnieje i jest linkiem)
        if (startSessionBtn && startSessionBtn.tagName === 'A') {
            startSessionBtn.href = `live-session.html?id=${campaignId}`;
        } else if (startSessionBtn) {
            console.warn('Element #startSessionBtn istnieje, ale nie jest linkiem <a>.');
        }

        // Przycisk usuwania
        if (deleteCampaignBtn) {
            deleteCampaignBtn.style.display = 'block';
            deleteCampaignBtn.addEventListener('click', () => {
                if (confirm('Czy na pewno chcesz TRWALE USUNĄĆ tę kampanię? Tej czynności nie można cofnąć.')) {
                    db.collection('campaigns').doc(campaignId).delete().then(() => {
                        alert('Kampania została usunięta pomyślnie.');
                        window.location.href = 'campaign-panel.html';
                    }).catch(error => {
                        console.error("Błąd podczas usuwania kampanii: ", error);
                        alert("Nie udało się usunąć kampanię.");
                    });
                }
            });
        }

        if (manageCreaturesLink) manageCreaturesLink.href = `creatures.html?id=${campaignId}`;
        if (gmNotesLink) gmNotesLink.href = `gm-notes.html?id=${campaignId}`;

        // Obsługa modala ustawień kampanii
        const campaignSettingsLink = document.getElementById('campaign-settings-link');
        const campaignSettingsModal = document.getElementById('campaign-settings-modal');
        const closeCampaignSettingsModal = document.getElementById('close-campaign-settings-modal');
        const cancelCampaignSettings = document.getElementById('cancel-campaign-settings');
        const campaignSettingsForm = document.getElementById('campaign-settings-form');
        const campaignSettingsName = document.getElementById('campaign-settings-name');
        const campaignSettingsDescription = document.getElementById('campaign-settings-description');
        const campaignSettingsImage = document.getElementById('campaign-settings-image');

        function openCampaignSettingsModal() {
            if (campaignSettingsModal && campaignSettingsName && campaignSettingsDescription && campaignSettingsImage) {
                campaignSettingsName.value = campaign.name || '';
                campaignSettingsDescription.value = campaign.description || '';
                campaignSettingsImage.value = campaign.image || '';
                campaignSettingsModal.style.display = 'flex';
            }
        }

        function closeCampaignSettingsModalFunc() {
            if (campaignSettingsModal) {
                campaignSettingsModal.style.display = 'none';
            }
        }

        if (campaignSettingsLink) {
            campaignSettingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                openCampaignSettingsModal();
            });
        }

        if (closeCampaignSettingsModal) {
            closeCampaignSettingsModal.addEventListener('click', closeCampaignSettingsModalFunc);
        }

        if (cancelCampaignSettings) {
            cancelCampaignSettings.addEventListener('click', closeCampaignSettingsModalFunc);
        }

        if (campaignSettingsModal) {
            campaignSettingsModal.addEventListener('click', (e) => {
                if (e.target === campaignSettingsModal) {
                    closeCampaignSettingsModalFunc();
                }
            });
        }

        if (campaignSettingsForm) {
            campaignSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const updateData = {
                    name: campaignSettingsName.value.trim(),
                    description: campaignSettingsDescription.value.trim(),
                    image: campaignSettingsImage.value.trim()
                };

                db.collection('campaigns').doc(campaignId).update(updateData)
                    .then(() => {
                        alert('Ustawienia kampanii zostały pomyślnie zaktualizowane!');
                        closeCampaignSettingsModalFunc();
                        // Odśwież stronę aby pokazać zaktualizowane dane
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.error('Błąd podczas aktualizacji ustawień kampanii:', error);
                        alert('Nie udało się zaktualizować ustawień kampanii.');
                    });
            });
        }

    }).catch((error) => {
        console.error("Błąd podczas pobierania szczegółów kampanii: ", error);
        if (sessionDetailsContainer) sessionDetailsContainer.innerHTML = '<h1>Błąd</h1><p>Nie udało się załadować szczegółów kampanii.</p>';
    });
});
