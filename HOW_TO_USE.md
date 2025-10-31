# 🎯 Habit Tracker - Complete Usage Guide

## ⚠️ IMPORTANT - How to Access Your App

### ✅ CORRECT Way:
**Open your browser and go to:** http://localhost:3000

This is your React frontend application where you can:
- Sign up / Login
- Create and manage habits
- View statistics
- See your profile

### ❌ WRONG Way:
**DO NOT go to:** http://localhost:5000

This is the backend API server and should NOT be accessed directly in the browser. It's only for API requests from the frontend.

---

## 🚀 How to Run Your Project

### Step 1: Start Backend Server
```bash
cd c:\Users\Dell\Downloads\habit\habit-backend
node server.js
```

**Expected Output:**
```
🟡 Connecting to MongoDB at: mongodb+srv://...
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
```

### Step 2: Start Frontend Server (in a NEW terminal)
```bash
cd c:\Users\Dell\Downloads\habit\habit-tracker
npm start
```

**Expected Output:**
```
Starting the development server...
Compiled successfully!
```

The app will automatically open at **http://localhost:3000**

---

## 📝 How to Use the App

### 1. Create an Account
1. Go to http://localhost:3000
2. Click **"Signup"** in the header
3. Fill in:
   - Username: (your username)
   - Email: (your email)
   - Password: (your password)
4. Click **"Signup"**
5. You'll see "Signup successful! ✅"

### 2. Login
1. After signup, click **"Login"**
2. Enter your email and password
3. Click **"Login"**
4. You'll be redirected to the Dashboard

### 3. Create Your First Habit
1. On the Dashboard, click **"+ New Habit"**
2. Fill in the form:
   - **Habit Name**: e.g., "Morning Exercise"
   - **Description**: e.g., "30 minutes workout"
   - **Category**: Choose from dropdown (Health, Fitness, etc.)
   - **Color**: Pick a color
   - **Frequency**: Daily/Weekly/Monthly
   - **Target Days**: Number of days per week
   - **Reminder Time**: Optional
3. Click **"Create Habit"**

### 4. Track Your Habits
- Click **"Mark as Done"** to complete a habit for today
- Click the **✏️ Edit** icon to modify a habit
- Click the **🗑️ Delete** icon to remove a habit

### 5. View Statistics
- Click **"Statistics"** in the header
- See your:
  - Total habits
  - Completed today
  - Total completions
  - Current streaks
  - Category breakdown
  - Completion rate

### 6. Check Your Profile
- Click **"Profile"** in the header
- View your:
  - User information
  - Progress statistics
  - Achievements (unlocked as you progress)

---

## 🔍 Verify Data in MongoDB Atlas

After creating habits:

1. Go to **MongoDB Atlas** website
2. Log in to your account
3. Click on your **Cluster0**
4. Click **"Browse Collections"**
5. Look for database: **habittracker**
6. You should see 2 collections:
   - **users** - Your user account
   - **habits** - Your habits data

---

## 🐛 Troubleshooting

### Problem: "Cannot GET /POST%20/api/..."
**Solution**: You're accessing http://localhost:5000 directly. 
**Fix**: Go to http://localhost:3000 instead!

### Problem: No data showing in MongoDB
**Solution**: 
1. Make sure both servers are running
2. Ensure you're logged in
3. Check browser console for errors (F12)
4. Check backend terminal for logs

### Problem: "Failed to fetch" errors
**Solution**:
1. Restart backend server
2. Clear browser cache and localStorage
3. Logout and login again

### Problem: Token expired
**Solution**:
1. Logout from the app
2. Login again with your credentials
3. Try creating habits again

---

## 📊 Features Available

✅ User Authentication (Signup/Login)
✅ Create Habits with categories and colors
✅ Edit existing habits
✅ Delete habits
✅ Mark habits as complete/incomplete
✅ Track daily streaks
✅ View statistics and insights
✅ Category filtering
✅ Search habits
✅ Achievement system
✅ Responsive design
✅ Cloud database (MongoDB Atlas)

---

## 🎯 Quick Start Commands

**Terminal 1 - Backend:**
```bash
cd c:\Users\Dell\Downloads\habit\habit-backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd c:\Users\Dell\Downloads\habit\habit-tracker
npm start
```

**Then open:** http://localhost:3000

---

## 💡 Tips

1. **Always access the app at http://localhost:3000**
2. Keep both terminal windows open while using the app
3. Check backend terminal to see API requests in real-time
4. Use F12 Developer Tools to debug frontend issues
5. Data is automatically saved to MongoDB Atlas
6. Logout and login to refresh your token if issues occur

---

## 📞 Need Help?

If you see errors:
1. Check if both servers are running
2. Look at backend terminal for error messages
3. Check browser console (F12) for frontend errors
4. Ensure MongoDB Atlas connection string is correct in .env file

---

**🎉 Your Habit Tracker is ready to use!**

Remember: **http://localhost:3000** is your app, **http://localhost:5000** is just the API!
