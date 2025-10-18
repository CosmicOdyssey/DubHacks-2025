// Sample JavaScript code for demonstration
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// User authentication service
class AuthService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.token = localStorage.getItem('auth_token');
  }

  async login(username, password) {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, {
        username,
        password
      });
      
      this.token = response.data.token;
      localStorage.setItem('auth_token', this.token);
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
    return { success: true };
  }

  isAuthenticated() {
    return !!this.token && this.token !== 'undefined';
  }

  getToken() {
    return this.token;
  }
}

// Data fetching hook
const useApiData = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const authService = new AuthService(process.env.REACT_APP_API_URL);
        
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${authService.getToken()}`
          }
        });
        
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};

// User profile component
const UserProfile = ({ userId }) => {
  const { data: user, loading, error } = useApiData(`/api/users/${userId}`, [userId]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const authService = new AuthService(process.env.REACT_APP_API_URL);
      
      await axios.put(`/api/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`
        }
      });
      
      setEditing(false);
    } catch (err) {
      console.error('Failed to save user profile:', err);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (loading) return <div>Loading user profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img 
          src={user.avatar || '/default-avatar.png'} 
          alt={`${user.name}'s avatar`}
          className="avatar"
        />
        <h1>{user.name}</h1>
      </div>

      {editing ? (
        <div className="edit-form">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Full Name"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Email Address"
            className={validateEmail(formData.email) ? 'valid' : 'invalid'}
          />
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Bio"
            rows={4}
          />
          <div className="form-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="profile-content">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Bio:</strong> {user.bio}</p>
          <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

// Utility functions
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Main exports
export { AuthService, useApiData, UserProfile };
export default UserProfile;