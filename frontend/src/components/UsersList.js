import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './UsersList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UsersList = ({ onSelectUser }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="users-list-loading">Loading users...</div>;
  }

  return (
    <div className="users-list">
      <h3>Users</h3>
      <div className="users-container">
        {users.length === 0 ? (
          <div className="no-users">No other users found</div>
        ) : (
          users.map((u) => (
            <div
              key={u._id}
              className="user-item"
              onClick={() => onSelectUser(u._id)}
            >
              <div className={`user-status ${u.isOnline ? 'online' : 'offline'}`}></div>
              <span className="user-name">{u.username}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UsersList;

