# Backend Deployment Guide

## ⚠️ Important: Netlify Limitation

**Netlify is NOT suitable for Express.js backends.** Netlify is designed for:
- Static websites
- Serverless functions (short-lived, stateless)
- JAMstack applications

Your Express server needs to run continuously, which Netlify doesn't support well.

## ✅ Recommended Platforms for Express Backends

### Option 1: Render (Recommended - Easiest) ⭐

**Why Render:**
- Free tier available
- Automatic deployments from GitHub
- Built-in SSL certificates
- Easy environment variable management
- Perfect for Express apps

**Steps:**

1. **Create `render.yaml`** (already created in this repo)

2. **Push to GitHub:**
   ```bash
   git add backend/
   git commit -m "Add backend for deployment"
   git push origin main
   ```

3. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Sign up/login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select the `backend` folder
   - Settings:
     - **Name**: `shelf-backend`
     - **Environment**: `Node`
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Root Directory**: `backend`
   - Add environment variables (see below)
   - Click "Create Web Service"

4. **Environment Variables in Render:**
   - Go to your service → Environment
   - Add all variables from your `.env` file:
     ```
     SNOWFLAKE_ACCOUNT=...
     SNOWFLAKE_USER=...
     SNOWFLAKE_PRIVATE_KEY=...
     SNOWFLAKE_ROLE=...
     SNOWFLAKE_WAREHOUSE=...
     SNOWFLAKE_DATABASE=...
     SNOWFLAKE_SCHEMA=...
     PORT=3001
     ```

5. **Get Your Backend URL:**
   - Render will give you a URL like: `https://shelf-backend.onrender.com`
   - Update your Expo app's `EXPO_PUBLIC_API_BASE_URL` to this URL

---

### Option 2: Railway (Also Great)

**Why Railway:**
- Very easy setup
- Free tier with $5 credit/month
- Automatic deployments
- Great for Express apps

**Steps:**

1. **Create `railway.json`** (already created in this repo)

2. **Deploy:**
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repo
   - Railway will auto-detect it's Node.js
   - Add environment variables (same as Render)
   - Deploy!

3. **Get Your Backend URL:**
   - Railway gives you a URL like: `https://shelf-backend.up.railway.app`
   - Update your Expo app's `EXPO_PUBLIC_API_BASE_URL`

---

### Option 3: Fly.io (Good for Global Distribution)

**Why Fly.io:**
- Free tier available
- Global edge deployment
- Great performance worldwide

**Steps:**

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Create `fly.toml`** (already created in this repo)

3. **Deploy:**
   ```bash
   cd backend
   fly launch
   # Follow prompts
   fly secrets set SNOWFLAKE_ACCOUNT=...
   fly secrets set SNOWFLAKE_USER=...
   # ... add all env vars
   fly deploy
   ```

---

### Option 4: Heroku (Classic, but Paid)

**Why Heroku:**
- Well-established platform
- Easy to use
- **Note**: Free tier discontinued, costs ~$7/month

**Steps:**

1. **Create `Procfile`** (already created in this repo)

2. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

3. **Deploy:**
   ```bash
   cd backend
   heroku create shelf-backend
   heroku config:set SNOWFLAKE_ACCOUNT=...
   # ... add all env vars
   git push heroku main
   ```

---

## 🔧 If You Really Want Netlify (Not Recommended)

You'd need to convert your Express app to Netlify Functions, which is a significant refactor. Each endpoint becomes a separate serverless function. This is complex and not ideal for your use case.

**Better approach:** Use one of the platforms above (Render is easiest).

---

## 📝 Environment Variables Checklist

Make sure to set these in your deployment platform:

```
SNOWFLAKE_ACCOUNT=your-account
SNOWFLAKE_USER=SKINCARE_SERVICE
SNOWFLAKE_PRIVATE_KEY=your-private-key
SNOWFLAKE_ROLE=SKINCARE_APP_ROLE
SNOWFLAKE_WAREHOUSE=COMPUTE_WH
SNOWFLAKE_DATABASE=DAVID
SNOWFLAKE_SCHEMA=PUBLIC
PORT=3001
API_KEY=optional-api-key
```

---

## 🚀 Quick Start: Render (Recommended)

1. Push your code to GitHub
2. Go to render.com
3. Connect repo → New Web Service
4. Select `backend` folder
5. Add environment variables
6. Deploy!

Your backend will be live at: `https://your-app.onrender.com`

---

## 🔗 Update Your Expo App

After deployment, update your Expo app's `.env` or `app.json`:

```env
EXPO_PUBLIC_API_BASE_URL=https://your-backend.onrender.com
```

Then rebuild your Expo app.

---

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Fly.io Docs](https://fly.io/docs)
