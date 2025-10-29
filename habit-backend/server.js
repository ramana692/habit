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

app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
console.log("🟡 Connecting to MongoDB at:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed!", err);
    process.exit(1);
  });

mongoose.connection.on("error", (err) => console.error("⚠️ MongoDB error:", err));

app.get("/", (req, res) => res.send("🚀 Habit Tracker API is running..."));

// ✅ Signup Route
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("📩 Received signup:", { username, email });

    if (!username || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("✅ New user saved:", newUser);
    res.status(201).json({ msg: "Signup successful" });
  } catch (err) {
    console.error("❌ Signup error:", err);
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
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// ✅ Create Habit
app.post("/api/habits", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: "Habit name is required" });

    const newHabit = new Habit({ userId: req.userId, name });
    await newHabit.save();
    res.status(201).json({ msg: "Habit created", habit: newHabit });
  } catch (err) {
    console.error("❌ Habit creation error:", err);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
