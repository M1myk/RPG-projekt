document.addEventListener('DOMContentLoaded', () => {
    const joinForm = document.getElementById('joinGameForm');
    const codeInput = document.getElementById('sessionCodeInput');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const joinButton = document.getElementById('joinGameButton');

    joinForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            showFeedback('You must be logged in to join a campaign.', 'error');
            setTimeout(() => { window.location.href = 'login.html'; }, 2000);
            return;
        }
        
        joinButton.disabled = true;
        joinButton.textContent = 'Searching...';

        const enteredCode = codeInput.value.trim().toUpperCase();
        if (enteredCode.length !== 6) {
            showFeedback('Enter a 6-character code.', 'error');
            joinButton.disabled = false; joinButton.textContent = 'Join game';
            return;
        }

        db.collection('campaigns').where('sessionCode', '==', enteredCode).get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                showFeedback('Campaign with this code not found.', 'error');
                joinButton.disabled = false; joinButton.textContent = 'Join game';
            } else {
                const campaignDoc = querySnapshot.docs[0];
                const campaignId = campaignDoc.id;
                const campaignData = campaignDoc.data();

                // --- PRAWIDŁOWY PORZĄDEK SPRAWDZAŃ ---

                // 1. FIRST CHECK: Is the user the owner (GM) of this campaign?
                if (campaignData.ownerId === user.uid) {
                    showFeedback('You are the Game Master of this campaign. Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = `session.html?id=${campaignId}`;
                    }, 1500);
                    // We don't increase the counter, just redirect
                    return; 
                }

                // 2. SECOND CHECK: Is the user (not GM) already on the player list?
                if (campaignData.playerIds && campaignData.playerIds.includes(user.uid)) {
                    showFeedback('You have already joined this campaign. Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = `session-player.html?id=${campaignId}`;
                    }, 1500);
                    // We don't increase the counter, just redirect
                    return;
                }

                // 3. THIRD CHECK: Are there free slots?
                if (campaignData.currentPlayers >= campaignData.maxPlayers) {
                    showFeedback('This campaign is full.', 'error');
                    joinButton.disabled = false; joinButton.textContent = 'Join game';
                    return;
                }

                // --- IF ALL CHECKS PASSED, THIS IS A NEW PLAYER ---
                db.collection('campaigns').doc(campaignId).update({
                    currentPlayers: firebase.firestore.FieldValue.increment(1),
                    playerIds: firebase.firestore.FieldValue.arrayUnion(user.uid)
                }).then(() => {
                    showFeedback('Campaign found! Joining...', 'success');
                    setTimeout(() => {
                        window.location.href = `session-player.html?id=${campaignId}`;
                    }, 1000);
                }).catch(error => {
                    console.error("Error joining campaign: ", error);
                    showFeedback('An error occurred. Try again.', 'error');
                    joinButton.disabled = false; joinButton.textContent = 'Join game';
                });
            }
        }).catch(error => {
            console.error("Error searching for campaign: ", error);
            showFeedback('An error occurred. Try again.', 'error');
            joinButton.disabled = false; joinButton.textContent = 'Join game';
        });
    });

    function showFeedback(message, type) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = `feedback feedback-${type}`;
    }
});