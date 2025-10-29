import React from "react";
import "./Profile.css";

const Profile = ({ user }) => {
  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Profile</h2>
        <div className="profile-details">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
