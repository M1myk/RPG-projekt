document.addEventListener('DOMContentLoaded', () => {
    const campaignsListContainer = document.getElementById('campaignsList');
    const navList = document.querySelector('.main-nav ul');
    // ... (інші елементи)

    auth.onAuthStateChanged(user => {
        if (user) {
            // ... (ваш код для кнопки Logout)
            loadAllUserCampaigns(user.uid);
        } else {
            // ... (повідомлення з проханням увійти)
        }
    });

    function loadAllUserCampaigns(userId) {
        campaignsListContainer.innerHTML = '<p class="loading-message">Loading your campaigns...</p>';

        // --- НОВА ЛОГІКА З ДВОМА ЗАПИТАМИ ---

        // 1. Запит для кампаній, де користувач є ВЛАСНИКОМ (GM)
        const ownedCampaignsQuery = db.collection('campaigns')
            .where('ownerId', '==', userId)
            .get();

        // 2. Запит для кампаній, де ID користувача є в масиві гравців
        const joinedCampaignsQuery = db.collection('campaigns')
            .where('playerIds', 'array-contains', userId)
            .get();

        // 3. Виконуємо обидва запити паралельно
        Promise.all([ownedCampaignsQuery, joinedCampaignsQuery]).then(([ownedSnapshot, joinedSnapshot]) => {
            
            const allCampaigns = {}; // Використовуємо об'єкт, щоб уникнути дублікатів

            // Додаємо кампанії, де користувач є власником
            ownedSnapshot.forEach(doc => {
                allCampaigns[doc.id] = { ...doc.data(), id: doc.id, isOwner: true };
            });

            // Додаємо кампанії, до яких користувач долучився
            joinedSnapshot.forEach(doc => {
                // Додаємо тільки якщо це не кампанія, де він є власником (уникнення дублікату)
                if (!allCampaigns[doc.id]) {
                    allCampaigns[doc.id] = { ...doc.data(), id: doc.id, isOwner: false };
                }
            });

            // Перетворюємо об'єкт назад у масив і сортуємо
            const campaignsArray = Object.values(allCampaigns).sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

            // 4. Відображаємо результат
            renderCampaigns(campaignsArray);

        }).catch(error => {
            console.error("Błąd przy pobieraniu kampanii: ", error);
            campaignsListContainer.innerHTML = '<p class="error-message">Failed to load campaigns.</p>';
        });
    }

    function renderCampaigns(campaigns) {
        campaignsListContainer.innerHTML = '';

        if (campaigns.length === 0) {
            campaignsListContainer.innerHTML = `
                <div class="no-campaigns-message">
                    <p>You haven't created or joined any campaigns yet.</p>
                    <a href="create-campaign.html" class="btn primary-btn" style="margin-top: 20px; width: auto;">Create Your First Campaign</a>
                </div>`;
            return;
        }

        campaigns.forEach(campaign => {
            // Визначаємо, куди вести користувача
            const destination = campaign.isOwner ? 'session.html' : 'session-player.html';

            const campaignCard = document.createElement('a');
            campaignCard.href = `${destination}?id=${campaign.id}`;
            campaignCard.className = 'campaign-card';

            // Додаємо мітку "GM" для кампаній, де користувач є власником
            const ownerBadge = campaign.isOwner ? '<span class="gm-badge">GM</span>' : '';

            campaignCard.innerHTML = `
                <div class="card-image-container">
                    <img src="${campaign.image}" alt="${campaign.name} Banner">
                    ${ownerBadge}
                </div>
                <div class="card-content">
                    <h4>${campaign.name}</h4>
                    <p><strong>System:</strong> ${campaign.system}</p>
                    <p><strong>Players:</strong> ${campaign.currentPlayers}/${campaign.maxPlayers}</p>
                </div>
            `;
            campaignsListContainer.appendChild(campaignCard);
        });
    }
})