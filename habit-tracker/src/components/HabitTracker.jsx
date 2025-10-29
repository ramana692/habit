import React, { useState } from "react";
import "../App.css";

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");

  const addHabit = () => {
    if (newHabit.trim() === "") return;
    setHabits([...habits, { text: newHabit, completed: false }]);
    setNewHabit("");
  };

  const toggleHabit = (index) => {
    const updated = habits.map((h, i) =>
      i === index ? { ...h, completed: !h.completed } : h
    );
    setHabits(updated);
  };

  const deleteHabit = (index) => {
    setHabits(habits.filter((_, i) => i !== index));
  };

  const completed = habits.filter((h) => h.completed).length;
  const progress = habits.length ? (completed / habits.length) * 100 : 0;

  return (
    <div className="page">
      <h1>🌱 My Habit Tracker</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a new habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <button onClick={addHabit}>Add</button>
      </div>

      <ul>
        {habits.length === 0 ? (
          <p>No habits yet — add one!</p>
        ) : (
          habits.map((habit, index) => (
            <li key={index} className={habit.completed ? "done" : ""}>
              <span onClick={() => toggleHabit(index)}>{habit.text}</span>
              <button onClick={() => deleteHabit(index)}>❌</button>
            </li>
          ))
        )}
      </ul>

      {habits.length > 0 && (
        <div className="progress">
          <p>Progress: {Math.round(progress)}%</p>
          <div className="bar">
            <div className="fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitTracker;
