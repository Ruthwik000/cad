# Vercel Deployment Guide

## Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed (optional): `npm i -g vercel`

## Environment Variables
Before deploying, you need to set up environment variables in Vercel:

### Required Environment Variables:
1. **Firebase Configuration** (from your Firebase Console):
   - `REACT_APP_FIREBASE_API_KEY`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `REACT_APP_FIREBASE_PROJECT_ID`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET`
   - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
   - `REACT_APP_FIREBASE_APP_ID`

2. **Optional - Groq API** (for faster AI responses):
   - `REACT_APP_GROQ_API_KEY`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)
1. Go to https://vercel.com/new
2. Import your Git repository (GitHub, GitLab, or Bitbucket)
3. Configure your project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add all environment variables in the "Environment Variables" section
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Post-Deployment Configuration

### Firebase Configuration
After deployment, update your Firebase project settings:

1. **Authentication**:
   - Go to Firebase Console > Authentication > Settings
   - Add your Vercel domain to "Authorized domains"
   - Example: `your-app.vercel.app`

2. **Firestore Security Rules**:
   - Deploy your firestore.rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Firestore Indexes**:
   - Deploy your indexes:
   ```bash
   firebase deploy --only firestore:indexes
   ```

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (requires >= 18.12.0)
- Check build logs in Vercel dashboard

### WASM Files Not Loading
- Ensure CORS headers are properly set in `vercel.json`
- Check that `.wasm` files are in the `public` folder

### Environment Variables Not Working
- Make sure all env vars start with `REACT_APP_`
- Redeploy after adding/changing environment variables
- Check that `.env` is not committed to Git

### Firebase Authentication Issues
- Verify your domain is added to Firebase authorized domains
- Check that Firebase config environment variables are correct
- Ensure Firebase project is in production mode (not test mode)

## Custom Domain
To add a custom domain:
1. Go to your project in Vercel Dashboard
2. Click "Settings" > "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Add the custom domain to Firebase authorized domains

## Monitoring
- View deployment logs: Vercel Dashboard > Deployments
- Check analytics: Vercel Dashboard > Analytics
- Monitor errors: Check browser console and Vercel logs

## Continuous Deployment
Once connected to Git:
- Every push to `main` branch triggers a production deployment
- Pull requests create preview deployments
- Rollback to previous deployments anytime from Vercel Dashboard
