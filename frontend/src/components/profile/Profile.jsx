import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if a user is logged in
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        
        if (!loggedInUser) {
          navigate('/loginpage');
          return;
        }
        
        // Determine which ID to use
        const userId = id || loggedInUser._id;
        
        // Check if viewing own profile
        setIsCurrentUser(loggedInUser._id === userId);
        
        // Fetch user data
        const response = await axios.get(`http://localhost:9000/users/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user profile');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="profile-container loading">
        <div className="loader"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container error">
        <h2>User Not Found</h2>
        <p>The user profile you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.username ? user.username.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-date">Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="profile-details">
            <div className="profile-detail-item">
              <span className="detail-label">Username:</span>
              <span className="detail-value">{user.username}</span>
            </div>
            <div className="profile-detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user.email}</span>
            </div>
            <div className="profile-detail-item">
              <span className="detail-label">Account Status:</span>
              <span className="detail-value status-active">Active</span>
            </div>
          </div>
        </div>

        {isCurrentUser && (
          <div className="profile-actions">
            <button className="edit-profile-btn">Edit Profile</button>
            <button className="change-password-btn">Change Password</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;