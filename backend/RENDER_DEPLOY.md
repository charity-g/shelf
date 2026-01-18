# Render Deployment - Step by Step Guide

## Prerequisites

1. ✅ Your code is ready (backend folder with server.js)
2. ✅ Your code is pushed to GitHub
3. ✅ You have a Render account (or can create one)

## Step-by-Step Deployment

### Step 1: Push Your Code to GitHub

Make sure all your backend files are committed and pushed:

```bash
# Add deployment files
git add backend/render.yaml backend/DEPLOYMENT.md backend/server.js

# Commit
git commit -m "Add Render deployment configuration"

# Push to GitHub
git push origin main  # or your branch name
```

### Step 2: Sign Up / Log In to Render

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with your **GitHub account** (recommended for easy repo access)

### Step 3: Create a New Web Service

1. Once logged in, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your GitHub account if prompted
4. Select your repository (`shelf` or whatever your repo is named)
5. Click **"Connect"**

### Step 4: Configure Your Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `shelf-backend` (or any name you prefer)
- **Region**: Choose closest to you (e.g., `Oregon (US West)` or `Frankfurt (EU)`)
- **Branch**: `main` (or `database` if that's your branch)
- **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this to `backend`**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Advanced Settings (click to expand):**
- **Environment**: `Node`
- **Node Version**: `18` or `20` (Render will auto-detect)

### Step 5: Add Environment Variables

⚠️ **CRITICAL**: Add all your Snowflake credentials here!

Click **"Environment"** tab and add these variables:

```
SNOWFLAKE_ACCOUNT=your-account-here
SNOWFLAKE_USER=SKINCARE_SERVICE
SNOWFLAKE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...your full key...\n-----END PRIVATE KEY-----
SNOWFLAKE_ROLE=SKINCARE_APP_ROLE
SNOWFLAKE_WAREHOUSE=COMPUTE_WH
SNOWFLAKE_DATABASE=DAVID
SNOWFLAKE_SCHEMA=PUBLIC
PORT=3001
NODE_ENV=production
```

**Important Notes:**
- For `SNOWFLAKE_PRIVATE_KEY`: Paste the ENTIRE key including headers
- Keep newlines as `\n` in the private key
- Or use Render's multi-line environment variable feature
- Don't add quotes around values

### Step 6: Deploy!

1. Scroll down and click **"Create Web Service"**
2. Render will start building and deploying
3. Watch the logs - you'll see:
   - Installing dependencies
   - Building...
   - Starting server...
4. Wait 2-3 minutes for first deployment

### Step 7: Get Your Backend URL

Once deployed, Render will give you a URL like:
```
https://shelf-backend.onrender.com
```

**Save this URL!** You'll need it for your Expo app.

### Step 8: Test Your Deployment

Test your endpoints:

```bash
# Health check
curl https://shelf-backend.onrender.com/health

# Get categories
curl https://shelf-backend.onrender.com/categories

# Get tables
curl https://shelf-backend.onrender.com/tables
```

### Step 9: Update Your Expo App

Update your Expo app's environment variable:

**Option 1: In `.env` file (if using dotenv):**
```env
EXPO_PUBLIC_API_BASE_URL=https://shelf-backend.onrender.com
```

**Option 2: In `app.json` or `app.config.js`:**
```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://shelf-backend.onrender.com"
    }
  }
}
```

## Troubleshooting

### Build Fails

**Problem**: Build command fails
- **Solution**: Check that `backend/package.json` exists
- **Solution**: Make sure Root Directory is set to `backend`

### Server Won't Start

**Problem**: Application error or crashes
- **Solution**: Check logs in Render dashboard
- **Solution**: Verify all environment variables are set correctly
- **Solution**: Check that `SNOWFLAKE_PRIVATE_KEY` includes full key with headers

### Connection Timeout

**Problem**: Requests timeout
- **Solution**: Render free tier spins down after 15 minutes of inactivity
- **Solution**: First request after spin-down takes ~30 seconds (cold start)
- **Solution**: Consider upgrading to paid plan for always-on service

### Snowflake Connection Errors

**Problem**: "A password must be specified" or connection errors
- **Solution**: Double-check `SNOWFLAKE_ACCOUNT` format (may need region)
- **Solution**: Verify `SNOWFLAKE_PRIVATE_KEY` is complete and properly formatted
- **Solution**: Check Render logs for detailed error messages

## Render Free Tier Limitations

- ⚠️ **Spins down after 15 minutes** of inactivity
- ⚠️ **Cold start** takes ~30 seconds after spin-down
- ⚠️ **750 hours/month** free (enough for always-on if you use it)
- ✅ **Unlimited bandwidth**
- ✅ **Free SSL certificate**

## Upgrading (Optional)

If you need always-on service:
- Go to your service → Settings → Plan
- Upgrade to **Starter Plan** ($7/month)
- Service stays running 24/7

## Monitoring

- **Logs**: View real-time logs in Render dashboard
- **Metrics**: See CPU, memory, request metrics
- **Events**: View deployment history

## Auto-Deploy

Render automatically deploys when you push to your connected branch:
1. Push to GitHub
2. Render detects changes
3. Automatically rebuilds and redeploys
4. Your backend updates! 🚀

## Next Steps

1. ✅ Deploy on Render
2. ✅ Test endpoints
3. ✅ Update Expo app with new URL
4. ✅ Test from Expo app
5. ✅ Celebrate! 🎉

---

**Need Help?**
- Render Docs: https://render.com/docs
- Render Support: support@render.com
- Check logs in Render dashboard for errors
