# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Verify Build Works Locally
```bash
npm install
npm run build
```
- ✅ Build should complete without errors
- ✅ Check that `dist` folder is created with all files

### 2. Verify Environment Variables
Create a `.env` file (if not exists) with all required variables:
```bash
# Copy from .env.example
cp .env.example .env
```

Then fill in your actual values:
- `REACT_APP_GROQ_API_KEY` - Get from https://console.groq.com
- `REACT_APP_GEMINI_API_KEY` - (Optional) Get from https://makersuite.google.com/app/apikey
- `REACT_APP_FIREBASE_API_KEY` - From Firebase Console
- `REACT_APP_FIREBASE_AUTH_DOMAIN` - From Firebase Console
- `REACT_APP_FIREBASE_PROJECT_ID` - From Firebase Console
- `REACT_APP_FIREBASE_STORAGE_BUCKET` - From Firebase Console
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` - From Firebase Console
- `REACT_APP_FIREBASE_APP_ID` - From Firebase Console
- `REACT_APP_FIREBASE_MEASUREMENT_ID` - From Firebase Console

### 3. Commit Your Changes
```bash
git add .
git commit -m "Fix deployment configuration"
git push origin main
```

## 🚀 Deployment Steps

### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit https://vercel.com/new
   - Sign in with GitHub/GitLab/Bitbucket

2. **Import Repository**
   - Click "Import Project"
   - Select your Git repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Select "Other"
   - **Root Directory**: Leave as `./`
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

4. **Add Environment Variables**
   Click "Environment Variables" and add each one:
   ```
   REACT_APP_GROQ_API_KEY = your_actual_key
   REACT_APP_GEMINI_API_KEY = your_actual_key
   REACT_APP_FIREBASE_API_KEY = your_actual_key
   REACT_APP_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID = your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID = 123456789
   REACT_APP_FIREBASE_APP_ID = your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID = your-measurement-id
   ```
   
   **Important**: 
   - Select "Production", "Preview", and "Development" for each variable
   - Don't include quotes around values

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (5-10 minutes)
   - You'll get a URL like `https://your-app.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Link to existing project or create new one

4. **Add Environment Variables**
   ```bash
   vercel env add REACT_APP_GROQ_API_KEY
   vercel env add REACT_APP_FIREBASE_API_KEY
   # ... add all other variables
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🔧 Post-Deployment Configuration

### 1. Update Firebase Settings

**Add Vercel Domain to Firebase:**
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Click "Add domain"
5. Add your Vercel domain: `your-app.vercel.app`
6. If using custom domain, add that too

**Deploy Firestore Rules:**
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### 2. Test Your Deployment

Visit your Vercel URL and test:
- ✅ Page loads without errors
- ✅ 3D viewer displays
- ✅ Can sign in with Google
- ✅ AI chat works
- ✅ Import function works
- ✅ Loading.gif shows when rendering

### 3. Check Browser Console
- Open DevTools (F12)
- Look for any errors
- Common issues:
  - CORS errors → Check vercel.json headers
  - Firebase auth errors → Check authorized domains
  - API key errors → Check environment variables

## 🐛 Troubleshooting

### Build Fails with "openscad.js not found"
✅ **FIXED** - The webpack.config.js now includes an alias for this import

### Environment Variables Not Working
- Make sure they all start with `REACT_APP_`
- Redeploy after adding variables
- Check spelling and values in Vercel dashboard

### WASM Files Not Loading
- Check that CORS headers are set in vercel.json
- Verify openscad.wasm is in dist folder after build
- Check Content-Type header for .wasm files

### Firebase Authentication Fails
- Verify domain is in Firebase authorized domains
- Check that all Firebase env vars are correct
- Make sure Firebase project is in production mode

### White Screen / Nothing Loads
- Check browser console for errors
- Verify all files are in dist folder
- Check that index.html is being served
- Verify rewrites in vercel.json

### Import Function Not Working
✅ **FIXED** - Updated to use BrowserFS Buffer correctly

### Loading GIF Not Showing
✅ **FIXED** - Added loading.gif to ViewerPanel component

## 📊 Monitoring

### View Logs
- Vercel Dashboard > Your Project > Deployments
- Click on a deployment to see build logs
- Check "Functions" tab for runtime logs

### Check Performance
- Vercel Dashboard > Analytics
- Monitor page load times
- Check for errors

### Rollback if Needed
- Vercel Dashboard > Deployments
- Find a working deployment
- Click "..." > "Promote to Production"

## 🔄 Continuous Deployment

Once connected to Git:
- **Main branch** → Automatic production deployment
- **Pull requests** → Automatic preview deployments
- **Other branches** → Preview deployments

## 🌐 Custom Domain (Optional)

1. Go to Vercel Dashboard > Your Project > Settings > Domains
2. Click "Add"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Add custom domain to Firebase authorized domains

## ✨ Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Vercel URL loads the application
- ✅ No console errors in browser
- ✅ Can sign in with Google
- ✅ AI chat responds
- ✅ 3D models render
- ✅ Import function works
- ✅ Loading animations show

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- Check GitHub Issues
- Vercel Support: https://vercel.com/support
