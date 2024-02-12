import React from 'react';
import Navbar from '../Components/Navbar';
import './Profile.css'; // Import your CSS file for profile styling

function Profile() {
  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <div className="profile-header">
          <h1>Welcome Back, User!</h1>
          <p>Your Personalized Profile</p>
        </div>
        <div className="profile-info">
          <div className="profile-section">
            <h2>Username:</h2>
            <p>User123</p>
          </div>
          <div className="profile-section">
            <h2>Email:</h2>
            <p>user123@example.com</p>
          </div>
          <div className="profile-section">
            <h2>Therapist:</h2>
            <p>Dr. Therapist</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
