# 🎨 Frontend Setup Guide

## ✅ Backend is Live!
Your backend is successfully deployed at: **https://habit-u7uw.onrender.com**

## 🔧 Frontend Configuration

Your frontend has been updated to connect to the Render backend. The configuration is in:
- `habit-tracker/src/config.js`

## 🚀 Running Frontend Locally

### 1. Start the Frontend
```bash
cd c:\Users\Dell\Downloads\habit\habit-tracker
npm start
```

The app will open at **http://localhost:3000** and will now connect to your live Render backend!

### 2. Test the Connection
1. Go to http://localhost:3000
2. Click **Signup** to create an account
3. Create some habits
4. All data will be saved to your MongoDB Atlas database via the Render backend

## 🌐 Deploy Frontend (Optional)

You can deploy your frontend to one of these platforms:

### Option A: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Import `ramana692/habit`
5. Configure:
   - **Root Directory**: `habit-tracker`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://habit-u7uw.onrender.com`
7. Click **Deploy**

### Option B: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Select `ramana692/habit`
5. Configure:
   - **Base directory**: `habit-tracker`
   - **Build command**: `npm run build`
   - **Publish directory**: `habit-tracker/build`
6. Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://habit-u7uw.onrender.com`
7. Click **Deploy**

### Option C: Render
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Static Site"**
3. Connect `ramana692/habit`
4. Configure:
   - **Name**: `habit-tracker-frontend`
   - **Root Directory**: `habit-tracker`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `habit-tracker/build`
5. Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://habit-u7uw.onrender.com`
6. Click **Create Static Site**

## 🔄 Update Backend CORS

After deploying your frontend, update the backend's `FRONTEND_URL` environment variable:

1. Go to Render dashboard
2. Click on **habit-tracker-backend**
3. Go to **Environment** tab
4. Update `FRONTEND_URL` to your frontend URL (e.g., `https://your-app.vercel.app`)
5. Save changes (backend will auto-redeploy)

## 📝 Current Configuration

### Backend URL
```
https://habit-u7uw.onrender.com
```

### API Endpoints
- Health: `https://habit-u7uw.onrender.com/health`
- Signup: `https://habit-u7uw.onrender.com/api/signup`
- Login: `https://habit-u7uw.onrender.com/api/login`
- Habits: `https://habit-u7uw.onrender.com/api/habits`
- Stats: `https://habit-u7uw.onrender.com/api/habits/stats/overview`

## 🎯 What's Working

✅ Backend deployed on Render
✅ Frontend configured to use Render backend
✅ MongoDB Atlas connected
✅ All API endpoints functional
✅ CORS configured
✅ Authentication working

## 🧪 Testing Locally

1. Start frontend: `npm start` (in habit-tracker folder)
2. Open http://localhost:3000
3. Sign up with a new account
4. Create habits and test all features
5. Data is saved to your live MongoDB database!

## ⚠️ Important Notes

### Free Tier Behavior
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- This is normal for Render's free tier

### If Backend is Sleeping
- Just wait 30-60 seconds on the first request
- Subsequent requests will be fast
- Consider upgrading to paid tier to avoid sleep

## 🎉 You're All Set!

Your full-stack Habit Tracker is now live with:
- ✅ Backend on Render
- ✅ Database on MongoDB Atlas
- ✅ Frontend ready to deploy or run locally

Enjoy your Habit Tracker! 🚀
