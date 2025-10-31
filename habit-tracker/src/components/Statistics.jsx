import React, { useEffect, useState } from "react";
import "./Statistics.css";
import API_BASE_URL from "../config";

const Statistics = () => {
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    totalCompletions: 0,
    activeHabits: 0
  });
  const [habits, setHabits] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
    fetchHabits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/habits/stats/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchHabits = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHabits(data);
      }
    } catch (err) {
      console.error("Error fetching habits:", err);
    }
  };

  const calculateStreak = (completedDates) => {
    if (!completedDates || completedDates.length === 0) return 0;
    
    const sortedDates = completedDates
      .map(d => new Date(d))
      .sort((a, b) => b - a);
    
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

  const getCategoryStats = () => {
    const categoryCount = {};
    habits.forEach(habit => {
      const cat = habit.category || "General";
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    return categoryCount;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="statistics-container">
      <h2>📊 Statistics & Insights</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{stats.totalHabits}</div>
          <div className="stat-label">Total Habits</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.completedToday}</div>
          <div className="stat-label">Completed Today</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{stats.totalCompletions}</div>
          <div className="stat-label">Total Completions</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{stats.activeHabits}</div>
          <div className="stat-label">Active Habits</div>
        </div>
      </div>

      <div className="category-section">
        <h3>📁 Habits by Category</h3>
        <div className="category-list">
          {Object.entries(categoryStats).map(([category, count]) => (
            <div key={category} className="category-item">
              <span className="category-name">{category}</span>
              <span className="category-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="streak-section">
        <h3>🔥 Current Streaks</h3>
        <div className="streak-list">
          {habits.filter(h => h.isActive).map(habit => {
            const streak = calculateStreak(habit.completedDates);
            return (
              <div key={habit._id} className="streak-item">
                <div className="streak-habit-name" style={{ borderLeft: `4px solid ${habit.color}` }}>
                  {habit.name}
                </div>
                <div className="streak-value">{streak} days 🔥</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="completion-rate-section">
        <h3>📈 Completion Rate</h3>
        <div className="completion-rate">
          {stats.totalHabits > 0 ? (
            <>
              <div className="rate-percentage">
                {Math.round((stats.completedToday / stats.totalHabits) * 100)}%
              </div>
              <div className="rate-label">of today's habits completed</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(stats.completedToday / stats.totalHabits) * 100}%` }}
                ></div>
              </div>
            </>
          ) : (
            <p>No habits tracked yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
