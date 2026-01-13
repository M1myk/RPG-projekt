document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id');
    
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const notesEditor = document.getElementById('notes-editor');
    const saveStatus = document.getElementById('save-status');

    

    auth.onAuthStateChanged(user => {
        if (user) {
            // Використовуємо окрему кореневу колекцію для нотаток, щоб правила були простішими
            const notesRef = db.collection('gm-notes').doc(`${user.uid}_${campaignId}`);

            let debounceTimer;

            // Завантажуємо існуючі нотатки
            notesRef.get().then(doc => {
                if (doc.exists) {
                    notesEditor.value = doc.data().content;
                }
            });

            // Слухаємо зміни в полі вводу
            notesEditor.addEventListener('keyup', () => {
                saveStatus.textContent = 'Saving...';
                clearTimeout(debounceTimer);
                
                // "Debounce" - зберігаємо через 1.5 секунди після останнього натискання клавіші
                debounceTimer = setTimeout(() => {
                    notesRef.set({
                        content: notesEditor.value,
                        ownerId: user.uid,
                        campaignId: campaignId
                    }, { merge: true }).then(() => { // .set з merge:true створює або оновлює документ
                        saveStatus.textContent = 'All changes saved.';
                    });
                }, 1500);
            });
        }
    });
    const backLink = document.getElementById('back-to-dashboard-link');
        if (backLink) {
            backLink.href = `session.html?id=${campaignId}`;
        }
});