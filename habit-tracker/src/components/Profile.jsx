import React, { useState, useEffect } from "react";
import "./Profile.css";
import API_BASE_URL from "../config";

const Profile = ({ user }) => {
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    totalCompletions: 0,
    activeHabits: 0
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
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

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h2>{user.username}</h2>
        </div>
        
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">📧 Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">👤 Username</span>
            <span className="detail-value">{user.username}</span>
          </div>
        </div>

        <div className="profile-stats">
          <h3>Your Progress</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">{stats.totalHabits}</div>
              <div className="stat-name">Total Habits</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{stats.activeHabits}</div>
              <div className="stat-name">Active</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{stats.completedToday}</div>
              <div className="stat-name">Today</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{stats.totalCompletions}</div>
              <div className="stat-name">All Time</div>
            </div>
          </div>
        </div>

        <div className="profile-achievements">
          <h3>🏆 Achievements</h3>
          <div className="achievement-list">
            {stats.totalHabits >= 1 && (
              <div className="achievement">
                <span className="achievement-icon">🌱</span>
                <span className="achievement-name">First Habit Created</span>
              </div>
            )}
            {stats.totalCompletions >= 10 && (
              <div className="achievement">
                <span className="achievement-icon">⭐</span>
                <span className="achievement-name">10 Completions</span>
              </div>
            )}
            {stats.totalCompletions >= 50 && (
              <div className="achievement">
                <span className="achievement-icon">💪</span>
                <span className="achievement-name">50 Completions</span>
              </div>
            )}
            {stats.totalCompletions >= 100 && (
              <div className="achievement">
                <span className="achievement-icon">🔥</span>
                <span className="achievement-name">Century!</span>
              </div>
            )}
            {stats.totalHabits >= 5 && (
              <div className="achievement">
                <span className="achievement-icon">🎯</span>
                <span className="achievement-name">Habit Master</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
