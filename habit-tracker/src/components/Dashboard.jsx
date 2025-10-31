import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = ({ user }) => {
  const [habits, setHabits] = useState([]);
  const [filteredHabits, setFilteredHabits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [viewMode, setViewMode] = useState("list"); // list or calendar
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Health",
    color: "#4CAF50",
    frequency: "daily",
    targetDays: 7,
    reminderTime: ""
  });

  const token = localStorage.getItem("token");
  const categories = ["All", "Health", "Fitness", "Learning", "Work", "Personal", "Finance", "General"];
  const colors = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0", "#00BCD4", "#FF5722", "#607D8B"];

  useEffect(() => {
    console.log("🔍 Dashboard Component Loaded");
    console.log("🔍 Token exists:", token ? "YES ✅" : "NO ❌");
    console.log("🔍 Token:", token);
    console.log("🔍 User:", user);
    
    if (!token) {
      console.error("❌ NO TOKEN FOUND! Please login first.");
      alert("Please login first to use the app!");
    }
    
    fetchHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habits, searchTerm, filterCategory]);

  const fetchHabits = async () => {
    try {
      const res = await fetch("/api/habits", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("⚠️ Fetch error:", errorData.msg);
        return;
      }

      const data = await res.json();
      setHabits(data);
    } catch (err) {
      console.error("❌ Fetch habits error:", err);
    }
  };

  const filterHabits = () => {
    let filtered = [...habits];
    
    if (searchTerm) {
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.description && h.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterCategory !== "All") {
      filtered = filtered.filter(h => h.category === filterCategory);
    }
    
    setFilteredHabits(filtered);
  };

  const openModal = (habit = null) => {
    if (habit) {
      setEditingHabit(habit);
      setFormData({
        name: habit.name,
        description: habit.description || "",
        category: habit.category || "Health",
        color: habit.color || "#4CAF50",
        frequency: habit.frequency || "daily",
        targetDays: habit.targetDays || 7,
        reminderTime: habit.reminderTime || ""
      });
    } else {
      setEditingHabit(null);
      setFormData({
        name: "",
        description: "",
        category: "Health",
        color: "#4CAF50",
        frequency: "daily",
        targetDays: 7,
        reminderTime: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingHabit(null);
  };

  const saveHabit = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a habit name");
      return;
    }

    try {
      const url = editingHabit ? `/api/habits/${editingHabit._id}` : "/api/habits";
      const method = editingHabit ? "PUT" : "POST";

      console.log("Sending request to:", url);
      console.log("Method:", method);
      console.log("Data:", formData);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      console.log("Content-Type:", contentType);
      
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        alert("Server error: Invalid response format. Backend returned: " + text.substring(0, 200));
        return;
      }

      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok) {
        fetchHabits();
        closeModal();
      } else {
        alert(data.msg || "Failed to save habit");
      }
    } catch (err) {
      console.error("❌ Save habit error:", err);
      alert("Error saving habit: " + err.message);
    }
  };

  const toggleHabitCompletion = async (habitId, date = null) => {
    try {
      const res = await fetch(`/api/habits/${habitId}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: date || new Date().toISOString().split('T')[0] }),
      });

      if (res.ok) {
        fetchHabits();
      }
    } catch (err) {
      console.error("❌ Toggle habit error:", err);
    }
  };

  const deleteHabit = async (id) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;

    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setHabits(habits.filter((h) => h._id !== id));
      }
    } catch (err) {
      console.error("❌ Delete habit error:", err);
    }
  };

  const isCompletedToday = (habit) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return habit.completedDates?.some(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });
  };

  const calculateStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;
    
    const sortedDates = completedDates.map(d => new Date(d)).sort((a, b) => b - a);
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);
      
      const hasCompletion = sortedDates.some(d => {
        d.setHours(0, 0, 0, 0);
        return d.getTime() === checkDate.getTime();
      });
      
      if (hasCompletion) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>🎯 My Habits</h2>
        <button className="add-habit-btn" onClick={() => openModal()}>
          + New Habit
        </button>
      </div>

      <div className="controls-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search habits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="view-toggle">
          <button 
            className={viewMode === "list" ? "active" : ""} 
            onClick={() => setViewMode("list")}
          >
            📋 List
          </button>
          <button 
            className={viewMode === "calendar" ? "active" : ""} 
            onClick={() => setViewMode("calendar")}
          >
            📅 Calendar
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="habits-grid">
          {filteredHabits.length > 0 ? (
            filteredHabits.map((habit) => (
              <div key={habit._id} className="habit-card" style={{ borderLeft: `5px solid ${habit.color}` }}>
                <div className="habit-header">
                  <h3>{habit.name}</h3>
                  <div className="habit-actions">
                    <button className="edit-btn" onClick={() => openModal(habit)}>✏️</button>
                    <button className="delete-btn" onClick={() => deleteHabit(habit._id)}>🗑️</button>
                  </div>
                </div>
                
                {habit.description && <p className="habit-description">{habit.description}</p>}
                
                <div className="habit-meta">
                  <span className="category-badge">{habit.category}</span>
                  <span className="frequency-badge">{habit.frequency}</span>
                </div>

                <div className="habit-stats">
                  <div className="stat">
                    <span className="stat-label">Streak</span>
                    <span className="stat-value">{calculateStreak(habit.completedDates)} 🔥</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Total</span>
                    <span className="stat-value">{habit.completedDates?.length || 0}</span>
                  </div>
                </div>

                <button 
                  className={`complete-btn ${isCompletedToday(habit) ? "completed" : ""}`}
                  onClick={() => toggleHabitCompletion(habit._id)}
                >
                  {isCompletedToday(habit) ? "✅ Completed Today" : "Mark as Done"}
                </button>
              </div>
            ))
          ) : (
            <div className="no-habits">
              <p>No habits found. Create your first habit to get started! 🚀</p>
            </div>
          )}
        </div>
      ) : (
        <div className="calendar-view">
          <p className="coming-soon">📅 Calendar view coming soon!</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingHabit ? "Edit Habit" : "Create New Habit"}</h3>
            
            <div className="form-group">
              <label>Habit Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Morning Exercise"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Add details about this habit..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.filter(c => c !== "All").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  {colors.map(color => (
                    <div
                      key={color}
                      className={`color-option ${formData.color === color ? "selected" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({...formData, color})}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Frequency</label>
                <select 
                  value={formData.frequency} 
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="form-group">
                <label>Target Days (per week)</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={formData.targetDays}
                  onChange={(e) => setFormData({...formData, targetDays: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Reminder Time (optional)</label>
              <input
                type="time"
                value={formData.reminderTime}
                onChange={(e) => setFormData({...formData, reminderTime: e.target.value})}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="save-btn" onClick={saveHabit}>
                {editingHabit ? "Update" : "Create"} Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
