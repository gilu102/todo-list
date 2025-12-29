# MERN Stack Todo Application

A full-stack Todo application built with MongoDB, Express.js, React, and Node.js.

## Features

### Core Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Edit todos inline
- ✅ Beautiful and modern UI
- ✅ Responsive design
- ✅ RESTful API backend

### Advanced Features

- 🎯 **Priority Levels** - Set todos as High, Medium, or Low priority
- 📅 **Due Dates** - Add due dates to todos with overdue indicators
- 🏷️ **Categories** - Organize todos with custom categories
- 🔍 **Search** - Search todos by title, description, or category
- 🔽 **Filtering** - Filter by All, Active, or Completed todos
- 📊 **Sorting** - Sort by Date, Priority, Due Date, or Title
- 📈 **Statistics Dashboard** - View completion rates, high priority count, and overdue todos
- 🌙 **Dark Mode** - Toggle between light and dark themes
- ⚠️ **Overdue Alerts** - Visual indicators for overdue todos

## Project Structure

```
.
├── backend/          # Express.js backend
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── server.js     # Entry point
├── frontend/         # React frontend
│   ├── public/       # Static files
│   └── src/          # React components
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation & Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-todos
```

For MongoDB Atlas, use:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-todos
```

### 4. Start MongoDB

Make sure MongoDB is running on your system. If using MongoDB locally:

**Windows:**

```bash
# MongoDB should start automatically as a service
# Or start it manually:
mongod
```

**macOS:**

```bash
brew services start mongodb-community
```

**Linux:**

```bash
sudo systemctl start mongod
```

### 5. Run the Application

**Terminal 1 - Start Backend:**

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**

```bash
cd frontend
npm start
```

The frontend will open automatically at `http://localhost:3000`

## API Endpoints

### Todo Endpoints

- `GET /api/todos` - Get all todos (supports query params: `filter`, `sortBy`, `search`)
- `GET /api/todos/:id` - Get a single todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

### Statistics Endpoint

- `GET /api/todos/stats/summary` - Get todo statistics

### Health Check

- `GET /api/health` - Health check

### Query Parameters

- `filter`: `all`, `active`, `completed`
- `sortBy`: `date`, `priority`, `dueDate`, `title`
- `search`: Search term for title, description, or category

## Technologies Used

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend

- **React** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling

## Development

### Backend Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Troubleshooting

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check your `MONGODB_URI` in `.env`
   - Verify MongoDB port (default: 27017)

2. **Port Already in Use**

   - Change `PORT` in backend `.env`
   - Or kill the process using the port

3. **CORS Errors**
   - Ensure backend CORS is configured
   - Check that API URL matches backend port

## Deployment

### ⭐ Recommended Platform: Render (Backend) + Vercel (Frontend)

**Best for:** Ease of use, reliability, and free tier

**Quick Start:**

1. Set up MongoDB Atlas (free)
2. Deploy backend to [Render.com](https://render.com)
3. Deploy frontend to [Vercel.com](https://vercel.com)
4. Update environment variables

**📖 Guides:**

- **[BEST_DEPLOYMENT.md](./BEST_DEPLOYMENT.md)** - ⭐ Step-by-step guide (recommended)
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick reference
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete guide with all options

## License

ISC
