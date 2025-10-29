import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = ({ user }) => {
  const [habits, setHabits] = useState([]);
  const [habitInput, setHabitInput] = useState("");
  const token = localStorage.getItem("token");

  // ✅ Fetch all habits
  const fetchHabits = async () => {
    try {
      const res = await fetch("/api/habits", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("⚠️ Fetch error:", errorData.msg);
        alert(errorData.msg || "Failed to fetch habits");
        return;
      }

      const data = await res.json();
      console.log("✅ Habits fetched:", data);
      setHabits(data);
    } catch (err) {
      console.error("❌ Fetch habits error:", err);
      alert("Error fetching habits: " + err.message);
    }
  };

  // ✅ Fetch habits when component loads
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchHabits();
  }, []);

  // ✅ Add a new habit
  const addHabit = async () => {
    console.log("🟡 Add button clicked");

    if (!habitInput.trim()) {
      alert("Please enter a habit name");
      return;
    }

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: habitInput }),
      });

      const data = await res.json();
      console.log("🟢 Server response:", data);

      if (res.ok) {
        setHabits([data.habit, ...habits]);
        setHabitInput("");
      } else {
        alert(data.msg || "Failed to add habit");
      }
    } catch (err) {
      console.error("❌ Add habit error:", err);
      alert("Error adding habit: " + err.message);
    }
  };

  // ✅ Delete a habit
  const deleteHabit = async (id) => {
    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setHabits(habits.filter((h) => h._id !== id));
      } else {
        alert(data.msg || "Failed to delete habit");
      }
    } catch (err) {
      console.error("❌ Delete habit error:", err);
      alert("Error deleting habit: " + err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Your Habits</h2>

      <div className="input-area">
        <input
          type="text"
          placeholder="Enter a new habit"
          value={habitInput}
          onChange={(e) => setHabitInput(e.target.value)}
        />
        <button onClick={addHabit}>Add Habit</button>
      </div>

      <ul>
        {habits.length > 0 ? (
          habits.map((habit) => (
            <li key={habit._id}>
              {habit.name}
              <button onClick={() => deleteHabit(habit._id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No habits yet — add one above!</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
