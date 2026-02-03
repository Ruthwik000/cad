# Firebase Quick Setup - Venus CAD

Your Firebase project is already configured! Just need to enable authentication methods.

## Project Details
- **Project ID**: venus-bb5f3
- **Project Name**: Venus
- **Console**: https://console.firebase.google.com/project/venus-bb5f3

## Step 1: Enable Authentication (2 minutes)

1. Go to: https://console.firebase.google.com/project/venus-bb5f3/authentication/providers

2. **Enable Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

3. **Enable Google Sign-In**:
   - Click on "Google"
   - Toggle "Enable"
   - Select a support email (your email)
   - Click "Save"

## Step 2: Create Firestore Database (2 minutes)

1. Go to: https://console.firebase.google.com/project/venus-bb5f3/firestore

2. Click "Create database"

3. Select "Start in production mode"

4. Choose location: **us-central** (or closest to your users)

5. Click "Enable"

## Step 3: Set Firestore Security Rules (1 minute)

1. In Firestore, click the "Rules" tab

2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read any profile but only write their own
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sessions collection - users can only access their own sessions
    match /sessions/{sessionId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

## Step 4: Add Authorized Domains (1 minute)

1. Go to: https://console.firebase.google.com/project/venus-bb5f3/authentication/settings

2. Scroll to "Authorized domains"

3. Add your domains:
   - `localhost` (already added)
   - Your production domain (e.g., `venus-cad.com`)

## Step 5: Test It! 🚀

1. Start your dev server:
   ```bash
   npm start
   ```

2. Open http://localhost:4000

3. Click "Get started" or "Log in"

4. Try signing up with:
   - Google (instant)
   - Email/Password (create account)

5. Check Firestore console - you should see:
   - `users` collection with your profile
   - `sessions` collection (after creating a session)

## ✅ What's Working Now

- ✅ Firebase credentials configured
- ✅ AuthProvider wrapping the app
- ✅ Login/Signup UI ready
- ✅ User profile creation
- ✅ Session management ready
- ✅ Firestore database operations

## 🎯 Next: Connect to AI Chat

Once authentication is working, you can:

1. **Save chat messages** to Firestore
2. **Create sessions** for each project
3. **Load previous sessions** from sidebar
4. **Sync across devices**

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you enabled Email/Password in Authentication

### "Missing or insufficient permissions"
- Check that Firestore security rules are published
- Make sure you're signed in

### Google Sign-In popup blocked
- Allow popups for localhost
- Or use redirect mode instead of popup

## Support Links

- [Firebase Console](https://console.firebase.google.com/project/venus-bb5f3)
- [Authentication Settings](https://console.firebase.google.com/project/venus-bb5f3/authentication)
- [Firestore Database](https://console.firebase.google.com/project/venus-bb5f3/firestore)
- [Firebase Documentation](https://firebase.google.com/docs)

---

**Total Setup Time**: ~5 minutes
**Status**: Ready to test! 🎉
