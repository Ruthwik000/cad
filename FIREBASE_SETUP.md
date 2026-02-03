# Firebase Setup Guide

This guide will help you set up Firebase Authentication and Firestore for Venus CAD.

## Prerequisites

- A Google account
- Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "venus-cad")
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Enable the following sign-in methods:
   - **Email/Password**: Click "Email/Password" → Enable → Save
   - **Google**: Click "Google" → Enable → Save

## Step 3: Create Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose a location (closest to your users)
5. Click "Enable"

## Step 4: Set Up Firestore Security Rules

1. In Firestore, click the "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sessions collection
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

## Step 5: Get Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon `</>`
5. Register your app with a nickname (e.g., "Venus CAD Web")
6. Copy the Firebase configuration object

## Step 6: Configure Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`)
2. Add your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## Step 7: Test the Integration

1. Restart your development server:
   ```bash
   npm start
   ```

2. Click "Log in" or "Get started" on the landing page
3. Try signing up with email/password or Google

## Features Enabled

✅ **User Authentication**
- Email/Password sign up and login
- Google OAuth sign in
- Secure session management

✅ **Session Management**
- Save chat conversations
- Store 3D model code
- Organize projects by user
- Delete old sessions

✅ **Data Persistence**
- All chats saved to Firestore
- Models synced across devices
- Automatic backup

## Firestore Data Structure

```
users/
  {userId}/
    - uid: string
    - email: string
    - displayName: string
    - photoURL: string
    - createdAt: timestamp
    - lastLogin: timestamp

sessions/
  {sessionId}/
    - userId: string
    - title: string
    - createdAt: timestamp
    - updatedAt: timestamp
    - messages: array
      - role: 'user' | 'assistant'
      - content: string
      - timestamp: timestamp
      - image?: string
    - modelCode: string
    - thumbnail?: string
```

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure your `.env` file has all Firebase variables
- Restart the development server after adding environment variables

### "Missing or insufficient permissions"
- Check Firestore security rules
- Make sure you're signed in
- Verify the user ID matches the document owner

### Google Sign-In not working
- Add your domain to authorized domains in Firebase Console
- For localhost, add `localhost` to authorized domains

## Next Steps

- Implement session restoration on page load
- Add session search and filtering
- Implement model thumbnails
- Add collaborative features
- Set up Firebase Storage for 3D model files

## Support

For issues or questions, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
