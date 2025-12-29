import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { filter, sortBy, search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
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

    const todos = await Todo.find(query).sort(sortOption);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Todo.countDocuments();
    const completed = await Todo.countDocuments({ completed: true });
    const active = await Todo.countDocuments({ completed: false });
    const highPriority = await Todo.countDocuments({ priority: 'high', completed: false });
    const overdue = await Todo.countDocuments({
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

router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate, category } = req.body;
    const todo = new Todo({
      title,
      description,
      completed: completed || false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      category: category || 'general',
    });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate, category } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed, priority, dueDate, category },
      { new: true, runValidators: true }
    );
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

