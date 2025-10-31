// models/Habit.js
import mongoose from "mongoose";

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "General" },
  color: { type: String, default: "#4CAF50" },
  frequency: { type: String, default: "daily", enum: ["daily", "weekly", "monthly"] },
  targetDays: { type: Number, default: 7 }, // Weekly goal
  completedDates: [{ type: Date }],
  notes: { type: String, default: "" },
  reminderTime: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  dateAdded: { type: Date, default: Date.now },
});

export default mongoose.model("Habit", HabitSchema);
