import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Statistics.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Statistics = ({ listType = 'all' }) => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    highPriority: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [listType]);

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      if (listType !== 'all') params.append('listType', listType);
      const response = await axios.get(`${API_URL}/todos/stats/summary?${params.toString()}`);
      setStats(response.data);
    } catch (error) {
      // Error handling
    }
  };

  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return (
    <div className="statistics-container">
      <h3 className="statistics-title">📊 Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Todos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completionPercentage}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
        <div className="stat-card stat-card-warning">
          <div className="stat-value">{stats.highPriority}</div>
          <div className="stat-label">High Priority</div>
        </div>
        <div className="stat-card stat-card-danger">
          <div className="stat-value">{stats.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

