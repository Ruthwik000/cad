# Firebase Setup Checklist ✓

## Quick Setup (5 minutes)

### 1. Enable Email/Password Auth
- [ ] Go to: https://console.firebase.google.com/project/venus-bb5f3/authentication/providers
- [ ] Click "Email/Password"
- [ ] Toggle "Enable" to ON
- [ ] Click "Save"

### 2. Enable Google Sign-In
- [ ] Click "Google" in providers list
- [ ] Toggle "Enable" to ON
- [ ] Select support email
- [ ] Click "Save"

### 3. Create Firestore Database
- [ ] Go to: https://console.firebase.google.com/project/venus-bb5f3/firestore
- [ ] Click "Create database"
- [ ] Select "Start in production mode"
- [ ] Choose location: "us-central"
- [ ] Click "Enable"
- [ ] Wait ~30 seconds

### 4. Set Firestore Rules
- [ ] Click "Rules" tab in Firestore
- [ ] Delete all existing rules
- [ ] Copy rules from `FIRESTORE_RULES_COPY_PASTE.txt`
- [ ] Paste into rules editor
- [ ] Click "Publish"
- [ ] See "Rules published successfully"

### 5. Test It
- [ ] Restart dev server: `npm start`
- [ ] Open http://localhost:4000
- [ ] Click "Get started"
- [ ] Try Google Sign-In
- [ ] Try Email/Password signup
- [ ] Check user appears in Firebase Console

---

## Verification

### Check Authentication Works:
- [ ] Go to: https://console.firebase.google.com/project/venus-bb5f3/authentication/users
- [ ] See your user listed
- [ ] Shows email and UID

### Check Firestore Works:
- [ ] Go to: https://console.firebase.google.com/project/venus-bb5f3/firestore/data
- [ ] See "users" collection
- [ ] See your user document inside
- [ ] Has: uid, email, displayName, createdAt, lastLogin

### Check UI Works:
- [ ] Header shows your name/photo when logged in
- [ ] "Sign Out" button appears
- [ ] Can sign out successfully
- [ ] Can sign back in

---

## Common Issues

**"auth/configuration-not-found"**
→ Email/Password not enabled (Step 1)

**"Missing or insufficient permissions"**
→ Firestore rules not set (Step 4)

**"auth/popup-blocked"**
→ Allow popups or use Email/Password

**Google Sign-In doesn't work**
→ Check support email is selected (Step 2)

---

## Files to Reference

- `FIRESTORE_RULES_COPY_PASTE.txt` - Copy these rules exactly
- `FIX_AUTH_ISSUE.md` - Detailed troubleshooting
- `FIREBASE_QUICK_SETUP.md` - Full setup guide

---

**Total Time**: 5 minutes
**Difficulty**: Easy
**Status**: Ready to go! 🚀
