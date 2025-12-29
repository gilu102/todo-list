import React from 'react';
import './SearchAndFilter.css';

const SearchAndFilter = ({ searchTerm, setSearchTerm, filter, setFilter, sortBy, setSortBy }) => {
  return (
    <div className="search-filter-container">
      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Search todos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="filter-section">
        <div className="filter-group">
          <label className="filter-label">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Date Created</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;

