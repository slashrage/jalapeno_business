import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import '../styles/ProfileSettings.css';

const ProfileSettings = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // User details form
  const [userDetails, setUserDetails] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUserDetailsChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.updateUser(userDetails);

      // Update user context
      setUser(response.data);

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      // Update token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      toast.success('Password updated successfully');

      // Clear password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-container">
        {/* User Details Section */}
        <div className="settings-section">
          <h2>Account Details</h2>
          <form onSubmit={handleUpdateDetails} className="settings-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userDetails.name}
                onChange={handleUserDetailsChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userDetails.email}
                onChange={handleUserDetailsChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={user?.role || ''}
                disabled
                className="disabled-input"
              />
              <small className="form-hint">Your role cannot be changed</small>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Details'}
            </button>
          </form>
        </div>

        {/* Password Update Section */}
        <div className="settings-section">
          <h2>Change Password</h2>
          <form onSubmit={handleUpdatePassword} className="settings-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
              <small className="form-hint">Must be at least 6 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
