document.addEventListener('DOMContentLoaded', () => {
    const joinForm = document.getElementById('joinGameForm');
    const codeInput = document.getElementById('sessionCodeInput');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const joinButton = document.getElementById('joinGameButton');

    joinForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            showFeedback('Musisz być zalogowany, aby dołączyć do kampanii.', 'error');
            setTimeout(() => { window.location.href = 'login.html'; }, 2000);
            return;
        }
        
        joinButton.disabled = true;
        joinButton.textContent = 'Szukanie...';

        const enteredCode = codeInput.value.trim().toUpperCase();
        if (enteredCode.length !== 6) {
            showFeedback('Wpisz 6-znakowy kod.', 'error');
            joinButton.disabled = false; joinButton.textContent = 'Dołącz do gry';
            return;
        }

        db.collection('campaigns').where('sessionCode', '==', enteredCode).get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                showFeedback('Kampania z tym kodem nie znaleziona.', 'error');
                joinButton.disabled = false; joinButton.textContent = 'Dołącz do gry';
            } else {
                const campaignDoc = querySnapshot.docs[0];
                const campaignId = campaignDoc.id;
                const campaignData = campaignDoc.data();

                // --- PRAWIDŁOWY PORZĄDEK SPRAWDZAŃ ---

                // 1. PIERWSZE SPRAWDZENIE: Czy użytkownik jest właścicielem (GM) tej kampanii?
                if (campaignData.ownerId === user.uid) {
                    showFeedback('Jesteś Mistrzem Gry tej kampanii. Przekierowywanie...', 'success');
                    setTimeout(() => {
                        window.location.href = `session.html?id=${campaignId}`;
                    }, 1500);
                    // Nie zwiększamy licznika, po prostu przekierowujemy
                    return; 
                }

                // 2. DRUGIE SPRAWDZENIE: Czy użytkownik (nie GM) już jest na liście graczy?
                if (campaignData.playerIds && campaignData.playerIds.includes(user.uid)) {
                    showFeedback('Dołączyłeś już do tej kampanii. Przekierowywanie...', 'success');
                    setTimeout(() => {
                        window.location.href = `session-player.html?id=${campaignId}`;
                    }, 1500);
                    // Nie zwiększamy licznika, po prostu przekierowujemy
                    return;
                }

                // 3. TRZECIE SPRAWDZENIE: Czy są wolne miejsca?
                if (campaignData.currentPlayers >= campaignData.maxPlayers) {
                    showFeedback('Ta kampania jest pełna.', 'error');
                    joinButton.disabled = false; joinButton.textContent = 'Dołącz do gry';
                    return;
                }

                // --- JEŚLI WSZYSTKIE SPRAWDZENIA PRZESZŁY, TO NOWY GRACZ ---
                db.collection('campaigns').doc(campaignId).update({
                    currentPlayers: firebase.firestore.FieldValue.increment(1),
                    playerIds: firebase.firestore.FieldValue.arrayUnion(user.uid)
                }).then(() => {
                    showFeedback('Kampania znaleziona! Dołączanie...', 'success');
                    setTimeout(() => {
                        window.location.href = `session-player.html?id=${campaignId}`;
                    }, 1000);
                }).catch(error => {
                    console.error("Błąd dołączania do kampanii: ", error);
                    showFeedback('Wystąpił błąd. Spróbuj ponownie.', 'error');
                    joinButton.disabled = false; joinButton.textContent = 'Dołącz do gry';
                });
            }
        }).catch(error => {
            console.error("Błąd podczas szukania kampanii: ", error);
            showFeedback('Wystąpił błąd. Spróbuj ponownie.', 'error');
            joinButton.disabled = false; joinButton.textContent = 'Dołącz do gry';
        });
    });

    function showFeedback(message, type) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = `feedback feedback-${type}`;
    }
});