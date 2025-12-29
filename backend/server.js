import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/todos', todoRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-todos')
  .then(() => {
    app.listen(PORT);
  })
  .catch(() => {
    process.exit(1);
  });

