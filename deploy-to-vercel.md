# Quick Deploy to Vercel

## Step 1: Prepare Your Environment Variables
Copy your `.env` file values. You'll need these for Vercel.

## Step 2: Deploy to Vercel

### Using Vercel Dashboard (Easiest):
1. Visit: https://vercel.com/new
2. Click "Import Project"
3. Connect your Git repository (GitHub/GitLab/Bitbucket)
4. Configure:
   - Framework: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Add Environment Variables (click "Environment Variables"):
   ```
   REACT_APP_FIREBASE_API_KEY=your-value
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-value
   REACT_APP_FIREBASE_PROJECT_ID=your-value
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-value
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-value
   REACT_APP_FIREBASE_APP_ID=your-value
   REACT_APP_GROQ_API_KEY=your-value (optional)
   ```

6. Click **Deploy**

## Step 3: Update Firebase Settings
After deployment, get your Vercel URL (e.g., `your-app.vercel.app`)

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Click **Add domain**
5. Add your Vercel domain: `your-app.vercel.app`
6. Click **Add**

## Step 4: Test Your Deployment
1. Visit your Vercel URL
2. Try signing in with Google
3. Create a test project
4. Verify everything works

## Troubleshooting

### "Unauthorized domain" error:
- Make sure you added your Vercel domain to Firebase authorized domains
- Wait a few minutes for changes to propagate

### Build fails:
- Check Vercel build logs
- Verify all environment variables are set
- Make sure Node.js version is >= 18.12.0

### WASM not loading:
- Check browser console for errors
- Verify CORS headers in vercel.json
- Clear browser cache and try again

## Custom Domain (Optional)
1. In Vercel Dashboard, go to Settings > Domains
2. Add your custom domain
3. Update DNS records as shown
4. Add custom domain to Firebase authorized domains

## Done! 🎉
Your app is now live on Vercel with automatic deployments on every Git push.
