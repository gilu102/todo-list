# Deployment Guide

This guide will help you deploy your MERN Todo App to production.

## Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string

2. **GitHub Account** (for version control and deployment)

---

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (choose free tier)
4. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose username/password authentication
   - Save the username and password
5. Whitelist IP addresses:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add specific IPs
6. Get your connection string:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/mern-todos?retryWrites=true&w=majority`
   - ⚠️ **Replace** `<username>` and `<password>` with your actual credentials

---

## Step 2: Deploy Backend

### Option A: Deploy to Render (Recommended - Free Tier)

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Sign up/login
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder
   - Configure:
     - **Name:** mern-todo-backend
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Root Directory:** `backend`
   - Add Environment Variables:
     - `MONGODB_URI` = Your MongoDB Atlas connection string
     - `FRONTEND_URL` = Your frontend URL (set after deploying frontend)
     - `NODE_ENV` = `production`
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://mern-todo-backend.onrender.com`)

### Option B: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up/login
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   - `MONGODB_URI`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
6. Railway will auto-detect Node.js and deploy
7. Copy your backend URL

### Option C: Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd backend
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `FRONTEND_URL`
   - `NODE_ENV=production`

---

## Step 3: Deploy Frontend

### Option A: Deploy to Vercel (Recommended - Free & Fast)

1. **Update API URL:**
   - Create `frontend/.env.production`:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com/api
     ```

2. **Deploy:**
   ```bash
   cd frontend
   npm install -g vercel
   vercel
   ```
   - Follow the prompts
   - Vercel will automatically detect React and build

3. **Or use Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable:
     - `REACT_APP_API_URL` = Your backend URL + `/api`
   - Deploy

### Option B: Deploy to Netlify

1. **Build locally first:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Drag and drop the `frontend/build` folder
   - Or connect GitHub repo and set:
     - **Base directory:** `frontend`
     - **Build command:** `npm run build`
     - **Publish directory:** `frontend/build`
   - Add environment variable:
     - `REACT_APP_API_URL` = Your backend URL + `/api`

### Option C: Deploy to GitHub Pages

1. Install gh-pages:
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. Update `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/mern-todo-app",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

---

## Step 4: Update Environment Variables

### Backend:
After deploying frontend, update backend's `FRONTEND_URL` environment variable:
- Go to your backend hosting platform (Render/Railway/Vercel)
- Update `FRONTEND_URL` to your frontend URL
- Redeploy backend

### Frontend:
Make sure `REACT_APP_API_URL` points to your deployed backend URL.

---

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try creating a todo
3. Check if it saves to MongoDB Atlas
4. Verify all features work (search, filter, etc.)

---

## Troubleshooting

### Backend Issues:
- **MongoDB Connection Error:** Check your `MONGODB_URI` and ensure IP is whitelisted
- **CORS Error:** Update `FRONTEND_URL` in backend environment variables
- **Port Error:** Most platforms set PORT automatically, don't hardcode it

### Frontend Issues:
- **API Not Found:** Check `REACT_APP_API_URL` environment variable
- **Build Fails:** Check Node version (should be 14+)
- **Blank Page:** Check browser console for errors

---

## Quick Deploy Commands

### Render (Backend):
```bash
# Push to GitHub first, then deploy via Render dashboard
```

### Vercel (Frontend):
```bash
cd frontend
vercel --prod
```

### Netlify (Frontend):
```bash
cd frontend
npm run build
# Then drag build folder to Netlify or use CLI
netlify deploy --prod --dir=build
```

---

## Free Hosting Options Summary

| Service | Backend | Frontend | Free Tier |
|---------|---------|----------|-----------|
| Render | ✅ | ✅ | Yes (with limits) |
| Vercel | ✅ | ✅ | Yes (generous) |
| Netlify | ❌ | ✅ | Yes (generous) |
| Railway | ✅ | ✅ | Yes (with limits) |
| Heroku | ✅ | ❌ | No (paid only) |

**Recommended:**
- **Backend:** Render or Railway
- **Frontend:** Vercel or Netlify

---

## Environment Variables Reference

### Backend (.env):
```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mern-todos
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```
⚠️ **Replace** `<username>` and `<password>` with your actual MongoDB Atlas credentials

### Frontend (.env.production):
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## Next Steps

1. Set up custom domain (optional)
2. Enable HTTPS (automatic on most platforms)
3. Set up monitoring and error tracking
4. Configure CI/CD for automatic deployments

Happy Deploying! 🚀

