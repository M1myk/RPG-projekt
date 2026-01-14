# Dynamic Homepage Statistics Setup Guide

## Overview
This document explains how the dynamic "Active campaigns" and "Online now" statistics are implemented on the homepage.

## What Was Changed

### 1. **index.html** - UI Elements Updated
- **Before:** Static hardcoded values
  ```html
  <span class="meta-pill">Active campaigns: <strong>1,248</strong></span>
  <span class="meta-pill">Online now: <strong>312</strong></span>
  ```

- **After:** Dynamic elements with loading state
  ```html
  <span class="meta-pill">Active campaigns: <strong id="active-campaigns-count">Loading...</strong></span>
  <span class="meta-pill">Online now: <strong id="online-users-count">Loading...</strong></span>
  <p id="meta-error" class="feedback feedback-error" style="display: none; margin-top: 10px;"></p>
  ```

### 2. **script.js** - Data Loading Logic
Added two main functions:

#### `loadHomepageStats()` - One-time Load
- Runs on page load
- Fetches campaigns count from `campaigns` collection
- Fetches online users count from `users` collection (where `isOnline === true`)
- Updates DOM with real values
- Handles errors gracefully with fallback "N/A" values

#### `setupRealtimeStatsListener()` - Real-time Updates (Optional)
- Sets up live listeners using Firestore's `onSnapshot()`
- Updates statistics automatically when data changes
- No page reload needed
- Can be enabled by uncommenting line in DOMContentLoaded

### 3. **auth.js** - User Tracking
Updated authentication logic to track user online status:

#### On Registration:
```javascript
db.collection('users').doc(userCredential.user.uid).set({
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    isOnline: true,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
});
```

#### On Login:
```javascript
db.collection('users').doc(userCredential.user.uid).update({
    isOnline: true,
    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
});
```

#### On Logout:
```javascript
db.collection('users').doc(user.uid).update({
    isOnline: false
});
```

## Firestore Collections Structure

### `campaigns` Collection
```
{
  name: string,
  system: string,
  sessionCode: string,
  currentPlayers: number,
  maxPlayers: number,
  ownerId: string,
  playerIds: array,
  image: string,
  description: string,
  createdAt: timestamp
  // ... other fields
}
```

### `users` Collection (NEW)
```
{
  uid: string,
  email: string,
  isOnline: boolean,
  createdAt: timestamp,
  lastLogin: timestamp
}
```

## How to Enable Real-time Updates

By default, statistics load once on page load. To enable automatic updates:

### Step 1: Open `script.js`
### Step 2: Find the DOMContentLoaded listener (around line 183)
### Step 3: Uncomment this line:
```javascript
setupRealtimeStatsListener();
```

### Result:
- Statistics will update in real-time
- When a new campaign is created, count increases instantly
- When a user logs in/out, online count updates automatically

## Error Handling

### States
1. **Loading** - "Loading..." displayed while fetching data
2. **Success** - Data displayed with proper formatting (e.g., "1,248" with locale-specific separators)
3. **Error** - "N/A" shown with error message in `#meta-error` element

### Error Message Display
If data fails to load, users see:
- "Unable to load statistics. Please try again later." in the error area
- "N/A" in place of actual counts

## Browser Console
The implementation logs useful information:
- ✅ Success: `Stats loaded: X active campaigns, Y online users`
- ❌ Errors: Detailed error messages for debugging

## Performance Considerations

### One-time Load (Default)
- Lightweight approach
- Suitable for most websites
- Single API call per page load

### Real-time Updates (Optional)
- More interactive experience
- Continuously listens for changes
- May impact performance with large user bases
- Consider implementing user idle detection to disconnect listeners

## Testing the Implementation

### Test 1: Check Initial Load
1. Open homepage
2. Should see "Loading..." briefly
3. Should display actual numbers

### Test 2: Create a Campaign
1. Log in
2. Create a new campaign
3. Go back to homepage
4. Verify campaign count increased (if real-time enabled)

### Test 3: Login/Logout
1. Open homepage
2. Log in from login page
3. Check "Online now" increases (if real-time enabled)
4. Log out
5. Check "Online now" decreases (if real-time enabled)

### Test 4: Error Handling
1. Temporarily disconnect internet
2. Visit homepage
3. Should see error message gracefully
4. Reconnect internet
5. Reload page - should display correct data

## Future Enhancements

1. **Active vs Inactive Campaigns**
   - Filter by campaign status field
   - Only count campaigns with sessions in last 30 days

2. **User Activity Tracking**
   - Implement automatic logout after inactivity
   - Update `lastActivity` timestamp on page interactions
   - Filter users based on activity within time window

3. **Caching**
   - Cache statistics with TTL
   - Reduce Firestore reads for high-traffic sites

4. **Regional Statistics**
   - Show stats filtered by region/server
   - Add location-based campaign counts

## Troubleshooting

### Statistics Not Loading
- Check Firebase config in `firebase-config.js`
- Verify Firestore is enabled in Firebase console
- Check browser console for error messages

### Incorrect Counts
- Ensure user records are created in `users` collection on registration
- Verify `isOnline` field is being set correctly
- Check Firestore security rules allow reads on these collections

### Performance Issues with Real-time
- Switch back to `loadHomepageStats()` (one-time load)
- Implement pagination for large collections
- Add indexes to Firestore for `isOnline` field

## Security & Privacy

⚠️ **Important:** Review Firestore security rules to ensure:
- Only authenticated users can read user online status (optional privacy)
- Public read access to campaigns collection is appropriate
- No sensitive user data is exposed

Example Firestore rule:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Campaigns - publicly readable
    match /campaigns/{document=**} {
      allow read: if true;
    }
    
    // Users - readable by authenticated users only
    match /users/{document=**} {
      allow read: if request.auth != null;
    }
  }
}
```

## Questions?

Refer to the inline comments in:
- `index.html` - DOM structure
- `script.js` - JavaScript logic
- `auth.js` - User tracking logic
