import React, { useState } from 'react';
import './TodoForm.css';

const TodoForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('general');
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        description: description.trim(),
        completed: false,
        priority,
        dueDate: dueDate || null,
        category: category.trim() || 'general',
        isPublic,
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setCategory('general');
      setIsPublic(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group form-group-full">
          <input
            type="text"
            placeholder="Enter todo title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group form-group-full">
          <textarea
            placeholder="Enter description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            rows="3"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="form-select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <input
            type="text"
            placeholder="e.g., Work, Personal"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="form-checkbox"
            />
            Make this todo public
          </label>
        </div>
      </div>
      <button type="submit" className="submit-btn">
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;

