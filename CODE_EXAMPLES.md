# Code Examples & API Reference

## Function Reference

### `loadHomepageStats()`

**Purpose:** Load statistics once on page load  
**Location:** script.js  
**Called:** Automatically on DOMContentLoaded  
**Returns:** void (updates DOM)

**Usage:**
```javascript
loadHomepageStats();
```

**What it does:**
1. Queries `db.collection('campaigns').get()`
2. Counts total documents → active campaigns count
3. Queries `db.collection('users').where('isOnline', '==', true).get()`
4. Counts matching documents → online users count
5. Updates `#active-campaigns-count` element
6. Updates `#online-users-count` element
7. Shows error message if it fails

**Error Handling:**
- Displays "Unable to load statistics. Please try again later."
- Shows "N/A" instead of numbers
- Logs error to console

**Example Console Output:**
```
Stats loaded: 42 active campaigns, 7 online users
```

---

### `setupRealtimeStatsListener()`

**Purpose:** Enable real-time automatic updates  
**Location:** script.js  
**Called:** Manually (uncomment in DOMContentLoaded)  
**Returns:** void (sets up listeners)

**Usage:**
```javascript
// In script.js, find DOMContentLoaded listener and uncomment:
setupRealtimeStatsListener();
```

**What it does:**
1. Sets up `onSnapshot()` listener for campaigns
   - Listens for any add/update/remove
   - Recounts on each change
   - Updates `#active-campaigns-count` instantly

2. Sets up `onSnapshot()` listener for online users
   - Listens for isOnline field changes
   - Recounts on each change
   - Updates `#online-users-count` instantly

**Advantages:**
- Real-time updates (no page refresh needed)
- Instant feedback when users join/leave
- Better user experience

**Disadvantages:**
- Higher Firestore usage
- More read operations per change
- Should disable for high-traffic sites

---

## DOM Elements Reference

### Active Campaigns Count
```html
<!-- HTML -->
<strong id="active-campaigns-count">Loading...</strong>

<!-- Updated by JavaScript -->
element.textContent = activeCampaignsCount.toLocaleString();
// Updates to: "42" or "1,248" etc.
```

### Online Users Count
```html
<!-- HTML -->
<strong id="online-users-count">Loading...</strong>

<!-- Updated by JavaScript -->
element.textContent = onlineUsersCount.toLocaleString();
// Updates to: "7" or "312" etc.
```

### Error Display
```html
<!-- HTML -->
<p id="meta-error" class="feedback feedback-error" style="display: none;"></p>

<!-- JavaScript shows/hides as needed -->
errorEl.textContent = "Unable to load statistics. Please try again later.";
errorEl.style.display = 'block'; // Show
errorEl.style.display = 'none';  // Hide
```

---

## Firestore Query Examples

### Count Active Campaigns
```javascript
// Query
const campaignsSnapshot = await db.collection('campaigns').get();

// Process
const activeCampaignsCount = campaignsSnapshot.size;

// Result: Number of campaign documents (e.g., 42)
```

### Count Online Users
```javascript
// Query
const usersSnapshot = await db.collection('users')
    .where('isOnline', '==', true)
    .get();

// Process
const onlineUsersCount = usersSnapshot.size;

// Result: Number of users with isOnline=true (e.g., 7)
```

### Create User Record (on registration)
```javascript
db.collection('users').doc(userCredential.user.uid).set({
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    isOnline: true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
}).catch(error => {
    console.error("Error creating user record:", error);
});
```

### Update User Status (on login)
```javascript
db.collection('users').doc(userCredential.user.uid).update({
    isOnline: true,
    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
}).catch(error => {
    console.error("Error updating user status:", error);
});
```

### Mark User Offline (on logout)
```javascript
db.collection('users').doc(user.uid).update({
    isOnline: false
}).catch(error => {
    console.error("Error marking user offline:", error);
});
```

---

## Real-time Listener Examples

### Listen to Campaigns Changes
```javascript
db.collection('campaigns').onSnapshot(
    (snapshot) => {
        const campaignsCount = snapshot.size;
        const activeCampaignsEl = document.getElementById('active-campaigns-count');
        if (activeCampaignsEl) {
            activeCampaignsEl.textContent = campaignsCount.toLocaleString();
        }
    },
    (error) => {
        console.error("Error setting up campaigns listener:", error);
    }
);
```

### Listen to Online Users Changes
```javascript
db.collection('users').where('isOnline', '==', true).onSnapshot(
    (snapshot) => {
        const onlineCount = snapshot.size;
        const onlineUsersEl = document.getElementById('online-users-count');
        if (onlineUsersEl) {
            onlineUsersEl.textContent = onlineCount.toLocaleString();
        }
    },
    (error) => {
        console.error("Error setting up real-time listener:", error);
    }
);
```

---

## Data Structure Examples

### Valid User Document
```javascript
{
    uid: "user_abc123",
    email: "player@example.com",
    isOnline: true,
    createdAt: Timestamp(2026, 01, 14, 10, 30, 0),
    lastLogin: Timestamp(2026, 01, 14, 15, 45, 30)
}
```

### Valid Campaign Document
```javascript
{
    name: "Dragon's Hoard",
    system: "D&D 5e",
    description: "An epic adventure",
    maxPlayers: 6,
    currentPlayers: 4,
    sessionCode: "ABC123",
    ownerId: "user_abc123",
    playerIds: ["user_xyz789", "user_def456"],
    image: "https://example.com/image.jpg",
    createdAt: Timestamp(2025, 12, 01, 14, 0, 0)
}
```

---

## Error Handling Examples

### Try-Catch Block
```javascript
async function loadHomepageStats() {
    try {
        // Get campaigns
        const campaignsSnapshot = await db.collection('campaigns').get();
        const campaignsCount = campaignsSnapshot.size;

        // Get online users
        const usersSnapshot = await db.collection('users')
            .where('isOnline', '==', true)
            .get();
        const onlineCount = usersSnapshot.size;

        // Success - update DOM
        updateDOM(campaignsCount, onlineCount);

    } catch (error) {
        // Error - show fallback
        console.error("Error loading stats:", error);
        showError("Unable to load statistics. Please try again later.");
        setFallbackValues();
    }
}
```

### Network Error Detection
```javascript
// Check if Firebase is connected
firebase.database().ref('.info/connected').on('value', (snapshot) => {
    if (snapshot.val() === true) {
        console.log('Firebase is connected');
        loadHomepageStats(); // Load stats when connected
    } else {
        console.log('Firebase is disconnected');
        showError('Connection lost. Using cached data.');
    }
});
```

---

## Firestore Index Requirements

### Create this index for optimal performance:

**Collection:** users  
**Fields to index:**
- `isOnline` (Ascending)

**Why:** The query `where('isOnline', '==', true)` is faster with an index

**How to create in Firebase Console:**
1. Go to Firestore Database
2. Click "Indexes"
3. Create composite index
4. Collection: users
5. Field: isOnline (Ascending)

---

## Locale String Formatting

### How Numbers are Formatted
```javascript
const count = 1248;

// US English
count.toLocaleString('en-US');  // "1,248"

// German
count.toLocaleString('de-DE');  // "1.248"

// French
count.toLocaleString('fr-FR');  // "1 248"

// Default (Browser's locale)
count.toLocaleString();          // Depends on user's browser
```

**Used in code:**
```javascript
activeCampaignsEl.textContent = activeCampaignsCount.toLocaleString();
// 42 → "42"
// 1248 → "1,248" (in US)
```

---

## Testing Code Snippets

### Test Query 1: Count Campaigns (in Browser Console)
```javascript
db.collection('campaigns').get().then(snapshot => {
    console.log('Total campaigns:', snapshot.size);
});
```

### Test Query 2: Count Online Users (in Browser Console)
```javascript
db.collection('users').where('isOnline', '==', true).get().then(snapshot => {
    console.log('Online users:', snapshot.size);
});
```

### Test Real-time Updates (in Browser Console)
```javascript
// Start listening
const unsubscribe = db.collection('users')
    .where('isOnline', '==', true)
    .onSnapshot((snapshot) => {
        console.log('Current online users:', snapshot.size);
    });

// Later, stop listening
unsubscribe();
```

### Create Test User (in Browser Console)
```javascript
db.collection('users').add({
    uid: 'test_user_123',
    email: 'test@example.com',
    isOnline: true,
    createdAt: new Date(),
    lastLogin: new Date()
}).then(() => console.log('Test user created'));
```

---

## Performance Monitoring

### Check Read Usage (in Browser Console)
```javascript
// Count reads in last 5 seconds
let readCount = 0;
const startTime = Date.now();

db.collection('campaigns').onSnapshot(() => {
    readCount++;
    console.log(`Reads in ${(Date.now() - startTime)/1000}s: ${readCount}`);
});
```

### Monitor Query Time
```javascript
const start = performance.now();

db.collection('campaigns').get().then(snapshot => {
    const end = performance.now();
    console.log(`Query took ${end - start}ms`);
    console.log(`Retrieved ${snapshot.size} documents`);
});
```

---

## Fallback & Degradation

### When Everything Fails
```javascript
function showFallback() {
    // Show N/A instead of numbers
    document.getElementById('active-campaigns-count').textContent = 'N/A';
    document.getElementById('online-users-count').textContent = 'N/A';
    
    // Show error message
    const errorEl = document.getElementById('meta-error');
    errorEl.textContent = 'Unable to load statistics. Please try again later.';
    errorEl.style.display = 'block';
    
    // Log for debugging
    console.error('Stats unavailable - showing fallback');
}
```

---

## Production Checklist

```javascript
// ✅ BEFORE DEPLOYING - Verify:

// 1. Can create user records
db.collection('users').doc('test-id').set({ /* test data */ });

// 2. Can query campaigns count
db.collection('campaigns').get();

// 3. Can query online users
db.collection('users').where('isOnline', '==', true).get();

// 4. Loading state works
// (Check "Loading..." appears briefly)

// 5. Error handling works
// (Disconnect internet and test)

// 6. Real-time listeners work (if enabled)
// (Create campaign and watch count update)

// 7. User online/offline tracking works
// (Register user and watch count change)

// 8. Numbers format correctly
// (Check for locale-specific separators)

// ✅ All tests pass? Ready to deploy!
```
