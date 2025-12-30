import React, { useState, useEffect } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import SearchAndFilter from './components/SearchAndFilter';
import Statistics from './components/Statistics';
import Auth from './components/Auth';
import Chat from './components/Chat';
import UsersList from './components/UsersList';
import { useAuth } from './context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const { user, loading: authLoading, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [listType, setListType] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user, filter, sortBy, listType]);

  useEffect(() => {
    filterTodos();
  }, [todos, searchTerm]);

  const fetchTodos = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('filter', filter);
      if (sortBy !== 'date') params.append('sortBy', sortBy);
      if (listType !== 'all') params.append('listType', listType);
      
      const response = await axios.get(`${API_URL}/todos?${params.toString()}`);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos.');
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
      await axios.post(`${API_URL}/todos`, todo);
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

  if (authLoading) {
    return (
      <div className="App">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <header className="app-header">
          <div className="header-content">
            <div>
              <h1>📝 MERN Todo App</h1>
              <p>Welcome, {user.username}!</p>
            </div>
            <div className="header-actions">
              <button
                onClick={() => setShowUsers(!showUsers)}
                className="header-button"
                title="Users & Chat"
              >
                💬
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="dark-mode-toggle"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button onClick={logout} className="logout-button" title="Logout">
                Logout
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="list-type-selector">
          <button
            className={listType === 'all' ? 'active' : ''}
            onClick={() => setListType('all')}
          >
            All Lists
          </button>
          <button
            className={listType === 'personal' ? 'active' : ''}
            onClick={() => setListType('personal')}
          >
            My Lists
          </button>
          <button
            className={listType === 'public' ? 'active' : ''}
            onClick={() => setListType('public')}
          >
            Public Lists
          </button>
        </div>

        <Statistics listType={listType} />

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
            currentUserId={user.id}
          />
        )}

        {showUsers && (
          <div className="users-chat-container">
            <UsersList
              onSelectUser={(userId) => {
                setSelectedUserId(userId);
                setShowChat(true);
                setShowUsers(false);
              }}
            />
          </div>
        )}

        {showChat && selectedUserId && (
          <div className="chat-overlay">
            <Chat
              selectedUserId={selectedUserId}
              onClose={() => {
                setShowChat(false);
                setSelectedUserId(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
