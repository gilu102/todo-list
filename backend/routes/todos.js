import express from 'express';
import Todo from '../models/Todo.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { filter, sortBy, search, listType } = req.query;
    let query = {};

    if (listType === 'personal') {
      query.userId = req.user._id;
    } else if (listType === 'public') {
      query.isPublic = true;
    } else {
      query.$or = [
        { userId: req.user._id },
        { isPublic: true },
      ];
    }

    if (search) {
      const searchQuery = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
        ],
      };
      
      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          searchQuery,
        ];
        delete query.$or;
      } else {
        Object.assign(query, searchQuery);
      }
    }

    if (filter === 'completed') {
      query.completed = true;
    } else if (filter === 'active') {
      query.completed = false;
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'priority') {
      sortOption = { priority: -1, createdAt: -1 };
    } else if (sortBy === 'dueDate') {
      sortOption = { dueDate: 1, createdAt: -1 };
    } else if (sortBy === 'title') {
      sortOption = { title: 1 };
    }

    const todos = await Todo.find(query)
      .populate('userId', 'username')
      .sort(sortOption);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats/summary', authenticate, async (req, res) => {
  try {
    const { listType } = req.query;
    let query = {};

    if (listType === 'personal') {
      query.userId = req.user._id;
    } else if (listType === 'public') {
      query.isPublic = true;
    } else {
      query.$or = [
        { userId: req.user._id },
        { isPublic: true },
      ];
    }

    const total = await Todo.countDocuments(query);
    const completed = await Todo.countDocuments({ ...query, completed: true });
    const active = await Todo.countDocuments({ ...query, completed: false });
    const highPriority = await Todo.countDocuments({ ...query, priority: 'high', completed: false });
    const overdue = await Todo.countDocuments({
      ...query,
      dueDate: { $lt: new Date() },
      completed: false,
    });

    res.json({
      total,
      completed,
      active,
      highPriority,
      overdue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id).populate('userId', 'username');
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    if (!todo.isPublic) {
      if (!todo.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      const todoUserId = typeof todo.userId === 'object' && todo.userId._id 
        ? todo.userId._id.toString() 
        : todo.userId.toString();
      if (todoUserId !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate, category, isPublic } = req.body;
    const todo = new Todo({
      title,
      description,
      completed: completed || false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      category: category || 'general',
      userId: req.user._id,
      isPublic: isPublic || false,
    });
    const savedTodo = await todo.save();
    await savedTodo.populate('userId', 'username');
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    if (!todo.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const todoUserId = todo.userId.toString();
    if (todoUserId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, completed, priority, dueDate, category, isPublic } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed, priority, dueDate, category, isPublic },
      { new: true, runValidators: true }
    ).populate('userId', 'username');
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    if (!todo.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const todoUserId = todo.userId.toString();
    if (todoUserId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

