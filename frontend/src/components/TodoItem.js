import React, { useState } from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, onUpdate, onDelete, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [priority, setPriority] = useState(todo.priority || 'medium');
  const [dueDate, setDueDate] = useState(todo.dueDate ? todo.dueDate.split('T')[0] : '');
  const [category, setCategory] = useState(todo.category || 'general');

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return '🔴 High';
      case 'medium': return '🟡 Medium';
      case 'low': return '🟢 Low';
      default: return 'Medium';
    }
  };

  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleToggleComplete = () => {
    onUpdate(todo._id, {
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleSave = () => {
    if (title.trim()) {
      onUpdate(todo._id, {
        ...todo,
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
        category: category.trim() || 'general',
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setPriority(todo.priority || 'medium');
    setDueDate(todo.dueDate ? todo.dueDate.split('T')[0] : '');
    setCategory(todo.category || 'general');
    setIsEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${getPriorityClass(priority)} ${isOverdue() ? 'overdue' : ''}`}>
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="edit-input"
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="edit-textarea"
            rows="2"
          />
          <div className="edit-row">
            <div className="edit-field">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="edit-select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="edit-field">
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="edit-input" />
            </div>
            <div className="edit-field">
              <label>Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="edit-input" />
            </div>
          </div>
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">
              Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="todo-content">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggleComplete}
              className="todo-checkbox"
            />
            <div className="todo-text">
              <div className="todo-header">
                <h3 className="todo-title">{todo.title}</h3>
                <span className={`priority-badge ${getPriorityClass(priority)}`}>
                  {getPriorityLabel(priority)}
                </span>
              </div>
              {todo.description && (
                <p className="todo-description">{todo.description}</p>
              )}
              <div className="todo-meta">
                {todo.category && todo.category !== 'general' && (
                  <span className="todo-category">🏷️ {todo.category}</span>
                )}
                {todo.dueDate && (
                  <span className={`todo-due-date ${isOverdue() ? 'overdue-date' : ''}`}>
                    📅 {formatDate(todo.dueDate)}
                    {isOverdue() && ' ⚠️ Overdue'}
                  </span>
                )}
                {todo.userId && (
                  <span className="todo-owner">
                    {typeof todo.userId === 'object' && todo.userId && todo.userId.username ? `👤 ${todo.userId.username}` : ''}
                    {todo.isPublic ? ' 🌐 Public' : ' 🔒 Private'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="todo-actions">
            {currentUserId && todo.userId && (() => {
              const userId = typeof todo.userId === 'object' 
                ? (todo.userId && todo.userId._id ? todo.userId._id.toString() : null)
                : (todo.userId ? todo.userId.toString() : null);
              return userId === currentUserId;
            })() && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-btn"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(todo._id)}
                  className="delete-btn"
                  title="Delete"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;

