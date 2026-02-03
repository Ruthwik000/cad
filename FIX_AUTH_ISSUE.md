# Fix Authentication Issue - Step by Step

## Issue: Sign up and Login not working

This is likely because Firebase Authentication and Firestore are not enabled yet. Follow these exact steps:

---

## Step 1: Enable Email/Password Authentication

1. Go to Firebase Console: https://console.firebase.google.com/project/venus-bb5f3/authentication/providers

2. Click on **"Email/Password"** in the Sign-in providers list

3. Toggle the **"Enable"** switch to ON

4. Click **"Save"**

---

## Step 2: Enable Google Sign-In

1. Still in the Authentication providers page

2. Click on **"Google"** in the Sign-in providers list

3. Toggle the **"Enable"** switch to ON

4. Select your email from the "Project support email" dropdown

5. Click **"Save"**

---

## Step 3: Create Firestore Database

1. Go to: https://console.firebase.google.com/project/venus-bb5f3/firestore

2. Click **"Create database"** button

3. Select **"Start in production mode"** (we'll add rules next)

4. Choose location: **"us-central"** (or closest to you)

5. Click **"Enable"**

6. Wait for database to be created (takes ~30 seconds)

---

## Step 4: Set Firestore Security Rules

1. In Firestore, click the **"Rules"** tab at the top

2. You'll see default rules. **DELETE ALL** the existing rules

3. Copy and paste these EXACT rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sessions collection
    match /sessions/{sessionId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

4. Click **"Publish"** button

5. You should see "Rules published successfully"

---

## Step 5: Verify Authorized Domains

1. Go to: https://console.firebase.google.com/project/venus-bb5f3/authentication/settings

2. Scroll down to **"Authorized domains"** section

3. Make sure these domains are listed:
   - `localhost` ✓
   - `venus-bb5f3.firebaseapp.com` ✓

4. If you have a custom domain, add it here

---

## Step 6: Test Authentication

1. **Restart your development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm start
   ```

2. Open browser: http://localhost:4000

3. Open browser console (F12) to see any errors

4. Click **"Get started"** button

5. Try **Google Sign-In**:
   - Click "Continue with Google"
   - Select your Google account
   - Should redirect back and show your profile

6. Try **Email/Password**:
   - Click "Sign Up" at bottom
   - Enter email and password
   - Click "Create Account"
   - Should create account and log you in

---

## Troubleshooting

### Error: "Firebase: Error (auth/configuration-not-found)"
**Solution**: Email/Password authentication is not enabled
- Go back to Step 1 and enable it

### Error: "Firebase: Error (auth/unauthorized-domain)"
**Solution**: Domain not authorized
- Go to Step 5 and add your domain

### Error: "Missing or insufficient permissions"
**Solution**: Firestore rules not set correctly
- Go back to Step 4 and copy the rules EXACTLY

### Error: "Firebase: Error (auth/popup-blocked)"
**Solution**: Browser blocked the popup
- Allow popups for localhost
- Or try Email/Password instead

### Google Sign-In opens but doesn't work
**Solution**: 
1. Check browser console for errors
2. Make sure Google provider is enabled (Step 2)
3. Make sure support email is selected

### Sign up works but no user profile created
**Solution**: Firestore rules might be wrong
- Check Step 4 rules are exactly as shown
- Check Firestore database is created (Step 3)

---

## Verify It's Working

### Check Authentication:
1. Go to: https://console.firebase.google.com/project/venus-bb5f3/authentication/users
2. After signing up, you should see your user listed here
3. Shows email, UID, creation date

### Check Firestore:
1. Go to: https://console.firebase.google.com/project/venus-bb5f3/firestore/data
2. You should see a `users` collection
3. Click on it to see your user document
4. Should have: uid, email, displayName, createdAt, lastLogin

---

## Quick Checklist

- [ ] Email/Password authentication enabled
- [ ] Google Sign-In enabled
- [ ] Firestore database created
- [ ] Security rules published
- [ ] Authorized domains verified
- [ ] Dev server restarted
- [ ] Browser console open (F12)
- [ ] Tested sign up
- [ ] User appears in Authentication tab
- [ ] User profile appears in Firestore

---

## Still Not Working?

1. **Check browser console** (F12) for error messages
2. **Check Firebase Console** > Authentication > Users (should see new users)
3. **Check Firestore** > Data (should see users collection)
4. **Try incognito/private window** (clears cache)
5. **Clear browser cache** and reload

---

## Success Indicators

✅ **Sign Up Works**: 
- No errors in console
- User appears in Firebase Authentication
- User profile created in Firestore
- Header shows user name/photo

✅ **Login Works**:
- Can log in with created account
- Header shows user info
- No permission errors

✅ **Sign Out Works**:
- Header changes back to "Log in" / "Get started"
- User state cleared

---

## Need Help?

If you're still having issues, check:
1. Browser console errors (F12)
2. Firebase Console > Authentication > Users
3. Firebase Console > Firestore > Data
4. Network tab (F12) for failed requests

Copy any error messages and we can debug further!
