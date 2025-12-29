# Quick Deployment Guide

## 🚀 Fastest Way to Deploy (5 minutes)

### 1. MongoDB Atlas Setup (2 min)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free)
3. Create cluster → Free tier
4. Database Access → Add user (save password!)
5. Network Access → Allow from anywhere
6. Database → Connect → Copy connection string
7. Replace `<password>` in connection string

### 2. Deploy Backend to Render (2 min)
1. Go to [render.com](https://render.com) → Sign up
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build:** `npm install`
   - **Start:** `npm start`
5. Environment Variables:
   ```
   MONGODB_URI = your-atlas-connection-string
   FRONTEND_URL = (set after frontend deploy)
   NODE_ENV = production
   ```
6. Deploy → Copy backend URL

### 3. Deploy Frontend to Vercel (1 min)
1. Go to [vercel.com](https://vercel.com) → Sign up
2. Import Git Repository
3. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
4. Environment Variable:
   ```
   REACT_APP_API_URL = https://your-backend.onrender.com/api
   ```
5. Deploy → Copy frontend URL

### 4. Update Backend CORS (30 sec)
1. Go back to Render dashboard
2. Update `FRONTEND_URL` = your Vercel URL
3. Redeploy backend

### ✅ Done! Your app is live!

---

## Alternative: Deploy Both to Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add two services:
   - **Backend:** Root = `backend`
   - **Frontend:** Root = `frontend`
4. Add environment variables to each
5. Deploy!

---

## Environment Variables Cheat Sheet

### Backend:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mern-todos
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```
⚠️ **Replace** `<username>` and `<password>` with your actual MongoDB Atlas credentials

### Frontend:
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions and troubleshooting.

