# Deploying Habit Tracker to Vercel

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Git repository (your code should be on GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Sign Up" or "Log In" (sign in with GitHub recommended)

3. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository `ramana692/habit`
   - Vercel will auto-detect it's a React app

4. **Configure Project**
   - **Framework Preset**: Create React App (auto-detected)
   - **Root Directory**: `habit-tracker`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `build` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

5. **Environment Variables** (if needed)
   - Add any environment variables (e.g., `REACT_APP_API_URL`)
   - For backend URL, you can add it later when backend is deployed

6. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - You'll get a URL like: `https://your-app.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend directory**
   ```bash
   cd habit-tracker
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select "yes" to set up and deploy
   - Project name: habit-tracker
   - Select your scope (your account)
   - Link to existing project or create new

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

## Deploying Backend to Vercel

Your backend can also be deployed to Vercel:

1. **Create `vercel.json` in `habit-backend` folder**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ],
     "env": {
       "MONGO_URI": "@mongo-uri",
       "JWT_SECRET": "@jwt-secret"
     }
   }
   ```

2. **Deploy Backend**
   ```bash
   cd ../habit-backend
   vercel
   ```

3. **Add Environment Variables in Vercel Dashboard**
   - Go to your backend project settings
   - Add `MONGO_URI` and `JWT_SECRET`

## Updating Frontend to Use Production Backend

1. **Update API calls in frontend**
   - Replace `http://localhost:5000` with your Vercel backend URL
   - Or use environment variables

2. **Add environment variable**
   - In Vercel dashboard → Your frontend project → Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend.vercel.app`

3. **Redeploy**
   - Vercel auto-deploys on git push
   - Or manually trigger deployment in dashboard

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch triggers production deployment
- Every pull request gets a preview deployment
- You get unique URLs for each deployment

## Custom Domain (Optional)

1. Go to your project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel handles SSL certificates automatically

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Environment Variables Not Working
- Make sure they're prefixed with `REACT_APP_`
- Redeploy after adding new variables

### API Calls Failing
- Check CORS settings on backend
- Verify backend URL is correct
- Check browser console for errors

## Important Notes

- **Build Output**: Vercel uses the `build` folder created by `npm run build`
- **SPA Routing**: The `vercel.json` config ensures React Router works correctly
- **Free Tier**: Vercel's free tier is generous for personal projects
- **Performance**: Vercel has global CDN and automatic optimizations

## Files Added for Vercel

✅ `vercel.json` - Vercel configuration
✅ `.vercelignore` - Files to ignore during deployment  
✅ Updated `package.json` with `vercel-build` script

You're all set! 🚀
