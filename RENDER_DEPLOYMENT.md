# 🚀 Deploy Backend to Render

## Quick Deploy Steps

### 1. Push Code to GitHub
Make sure your code is pushed to GitHub: https://github.com/ramana692/habit.git

### 2. Create Render Account
- Go to [Render.com](https://render.com)
- Sign up or log in with your GitHub account

### 3. Deploy Backend

#### Option A: Using render.yaml (Recommended)
1. Click **"New +"** → **"Blueprint"**
2. Connect your GitHub repository: `ramana692/habit`
3. Render will automatically detect the `render.yaml` file
4. Click **"Apply"**

#### Option B: Manual Setup
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `ramana692/habit`
3. Configure the service:
   - **Name**: `habit-tracker-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `habit-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 4. Add Environment Variables
In the Render dashboard, go to **Environment** tab and add:

```
MONGO_URI=mongodb+srv://habit:root@cluster0.fztxyll.mongodb.net/habittracker?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=mysecretkey
PORT=10000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

**Important**: Update `FRONTEND_URL` later when you deploy your frontend!

### 5. Deploy
- Click **"Create Web Service"**
- Wait for deployment (takes 2-5 minutes)
- Your backend will be live at: `https://habit-tracker-backend.onrender.com`

### 6. Test Your API
Once deployed, test these endpoints:

```bash
# Health check
https://your-app-name.onrender.com/health

# API test
https://your-app-name.onrender.com/api/test

# Root endpoint
https://your-app-name.onrender.com/
```

### 7. Update Frontend
Update your React frontend to use the Render backend URL:

In `habit-tracker/src/` files, replace:
```javascript
// Old
const API_URL = 'http://localhost:5000';

// New
const API_URL = 'https://your-app-name.onrender.com';
```

### 8. Update CORS Settings
After deploying frontend, update the `FRONTEND_URL` environment variable in Render to your frontend URL.

## 📝 Important Notes

### Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds (cold start)
- 750 hours/month free

### MongoDB Atlas
- Make sure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Or add Render's IP addresses to the whitelist

### Logs
- View logs in Render dashboard under **"Logs"** tab
- Useful for debugging deployment issues

## 🐛 Troubleshooting

### Build Failed
- Check if `package.json` has correct dependencies
- Verify Node version compatibility

### MongoDB Connection Failed
- Check MongoDB Atlas network access settings
- Verify MONGO_URI is correct in environment variables

### API Not Responding
- Check logs for errors
- Verify the service is running (not sleeping)
- Test health endpoint: `/health`

## 🔄 Automatic Deployments
Render automatically redeploys when you push to the `main` branch on GitHub!

## 📞 Support
If you encounter issues, check:
1. Render dashboard logs
2. MongoDB Atlas connection
3. Environment variables are set correctly
