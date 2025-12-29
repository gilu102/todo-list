import React, { useState, useEffect } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import SearchAndFilter from './components/SearchAndFilter';
import Statistics from './components/Statistics';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, [filter, sortBy]);

  useEffect(() => {
    filterTodos();
  }, [todos, searchTerm]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('filter', filter);
      if (sortBy !== 'date') params.append('sortBy', sortBy);
      
      const response = await axios.get(`${API_URL}/todos?${params.toString()}`);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const filterTodos = () => {
    let filtered = [...todos];
    
    if (searchTerm) {
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          todo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          todo.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTodos(filtered);
  };

  const addTodo = async (todo) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, todo);
      await fetchTodos();
      setError(null);
    } catch (err) {
      setError('Failed to add todo.');
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      await axios.put(`${API_URL}/todos/${id}`, updatedTodo);
      await fetchTodos();
      setError(null);
    } catch (err) {
      setError('Failed to update todo.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      await fetchTodos();
      setError(null);
    } catch (err) {
      setError('Failed to delete todo.');
    }
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <header className="app-header">
          <div className="header-content">
            <div>
              <h1>📝 MERN Todo App</h1>
              <p>Full-stack application with MongoDB, Express, React, and Node.js</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="dark-mode-toggle"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <Statistics />

        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <TodoForm onAdd={addTodo} />

        {loading ? (
          <div className="loading">Loading todos...</div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        )}
      </div>
    </div>
  );
}

export default App;

