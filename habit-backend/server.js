// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Habit from "./models/Habit.js";

dotenv.config();
const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// 🔍 Log all incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  console.log(`📨 Headers:`, req.headers.authorization ? "Auth header present" : "No auth header");
  console.log(`📨 Body:`, req.body);
  next();
});

// ✅ Connect MongoDB
console.log("🟡 Connecting to MongoDB at:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed!", err);
    process.exit(1);
  });

mongoose.connection.on("error", (err) => console.error("⚠️ MongoDB error:", err));

app.get("/", (req, res) => res.send("🚀 Habit Tracker API is running..."));

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// 🧪 Test route to verify API is working
app.get("/api/test", (req, res) => {
  res.json({ 
    msg: "API is working!", 
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// 🧪 Test database write
app.post("/api/test-write", async (req, res) => {
  try {
    const testUser = new User({
      username: "test",
      email: `test${Date.now()}@example.com`,
      password: "hashedpassword"
    });
    await testUser.save();
    
    const testHabit = new Habit({
      userId: testUser._id,
      name: "Test Habit",
      description: "Test Description"
    });
    await testHabit.save();
    
    res.json({ 
      msg: "Database write test successful!", 
      user: testUser._id,
      habit: testHabit._id
    });
  } catch (err) {
    res.status(500).json({ msg: "Database write test failed", error: err.message });
  }
});

// ✅ Signup Route
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("📩 Received signup:", { username, email });
    console.log("📩 MongoDB connection state:", mongoose.connection.readyState);

    if (!username || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    
    console.log("💾 Saving new user...");
    const savedUser = await newUser.save();
    console.log("✅ New user saved with ID:", savedUser._id);

    res.status(201).json({ msg: "Signup successful" });
  } catch (err) {
    console.error("❌ Signup error:", err);
    console.error("❌ Error stack:", err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      msg: "Login successful",
      token,
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// 🧠 Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("🔐 Auth middleware - Token received:", token ? "Yes" : "No");
  
  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.userId = decoded.id;
    console.log("✅ Token verified - User ID:", req.userId);
    next();
  } catch (err) {
    console.log("❌ Invalid token:", err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

// ✅ Create Habit
app.post("/api/habits", authMiddleware, async (req, res) => {
  try {
    console.log("📥 Creating habit - Request body:", req.body);
    console.log("📥 User ID:", req.userId);
    console.log("📥 MongoDB connection state:", mongoose.connection.readyState);
    
    const { name, description, category, color, frequency, targetDays, reminderTime } = req.body;
    if (!name) {
      console.log("⚠️ No habit name provided");
      return res.status(400).json({ msg: "Habit name is required" });
    }

    const habitData = { 
      userId: req.userId, 
      name,
      description: description || "",
      category: category || "General",
      color: color || "#4CAF50",
      frequency: frequency || "daily",
      targetDays: targetDays || 7,
      reminderTime: reminderTime || "",
      completedDates: []
    };
    
    console.log("💾 Creating new habit with data:", habitData);
    const newHabit = new Habit(habitData);
    
    console.log("💾 Saving habit to database...");
    const savedHabit = await newHabit.save();
    console.log("✅ Habit saved successfully with ID:", savedHabit._id);
    
    // Verify it was saved
    const verifyHabit = await Habit.findById(savedHabit._id);
    console.log("🔍 Verification - Habit found in DB:", verifyHabit ? "YES" : "NO");
    
    res.status(201).json({ msg: "Habit created", habit: savedHabit });
  } catch (err) {
    console.error("❌ Habit creation error:", err);
    console.error("❌ Error stack:", err.stack);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ Get All Habits for User
app.get("/api/habits", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ dateAdded: -1 });
    res.json(habits);
  } catch (err) {
    console.error("❌ Fetch habits error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ Update Habit
app.put("/api/habits/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, category, color, frequency, targetDays, reminderTime, notes, isActive } = req.body;
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!habit) return res.status(404).json({ msg: "Habit not found" });

    if (name) habit.name = name;
    if (description !== undefined) habit.description = description;
    if (category) habit.category = category;
    if (color) habit.color = color;
    if (frequency) habit.frequency = frequency;
    if (targetDays) habit.targetDays = targetDays;
    if (reminderTime !== undefined) habit.reminderTime = reminderTime;
    if (notes !== undefined) habit.notes = notes;
    if (isActive !== undefined) habit.isActive = isActive;

    await habit.save();
    res.json({ msg: "Habit updated", habit });
  } catch (err) {
    console.error("❌ Update habit error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ Toggle Habit Completion for a Date
app.post("/api/habits/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const { date } = req.body; // Expected format: YYYY-MM-DD
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!habit) return res.status(404).json({ msg: "Habit not found" });

    const dateObj = date ? new Date(date) : new Date();
    dateObj.setHours(0, 0, 0, 0);

    const dateIndex = habit.completedDates.findIndex(d => {
      const completedDate = new Date(d);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === dateObj.getTime();
    });

    if (dateIndex > -1) {
      habit.completedDates.splice(dateIndex, 1);
    } else {
      habit.completedDates.push(dateObj);
    }

    await habit.save();
    res.json({ msg: "Habit toggled", habit });
  } catch (err) {
    console.error("❌ Toggle habit error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ Get Habit Statistics
app.get("/api/habits/stats/overview", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId, isActive: true });
    
    const totalHabits = habits.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let completedTodayCount = 0;
    let totalCompletions = 0;
    
    habits.forEach(habit => {
      totalCompletions += habit.completedDates.length;
      const isCompletedToday = habit.completedDates.some(d => {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === today.getTime();
      });
      if (isCompletedToday) completedTodayCount++;
    });

    res.json({
      totalHabits,
      completedToday: completedTodayCount,
      totalCompletions,
      activeHabits: habits.filter(h => h.isActive).length
    });
  } catch (err) {
    console.error("❌ Stats error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ Delete Habit
app.delete("/api/habits/:id", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ msg: "Habit not found" });

    res.json({ msg: "Habit deleted" });
  } catch (err) {
    console.error("❌ Delete habit error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// 🧪 Test Database Write Endpoint
app.post("/api/test-write", async (req, res) => {
  try {
    console.log("🧪 Testing database write...");
    console.log("📩 MongoDB connection state:", mongoose.connection.readyState);
    
    // Create a test collection and document
    const TestModel = mongoose.model('Test', new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    }));
    
    const testDoc = new TestModel({
      message: "Database write test successful!"
    });
    
    const saved = await testDoc.save();
    console.log("✅ Test document saved:", saved);
    
    res.json({ 
      success: true, 
      message: "Database write successful!", 
      documentId: saved._id,
      timestamp: saved.timestamp
    });
  } catch (err) {
    console.error("❌ Database write test failed:", err);
    res.status(500).json({ 
      success: false, 
      message: "Database write failed", 
      error: err.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
