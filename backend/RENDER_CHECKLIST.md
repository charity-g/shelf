# Render Deployment Checklist

## Pre-Deployment Checklist

- [x] ✅ `.gitignore` created to prevent committing sensitive files
- [x] ✅ `render.yaml` configured with proper settings
- [x] ✅ Server listens on `0.0.0.0` (required for Render)
- [x] ✅ Graceful shutdown handling implemented
- [x] ✅ Health check endpoint at `/health`
- [x] ✅ Environment variables documented

## Required Environment Variables in Render Dashboard

Add these in Render Dashboard → Your Service → Environment:

### Required Snowflake Variables:
```
SNOWFLAKE_ACCOUNT=your-account-here
SNOWFLAKE_USER=SKINCARE_SERVICE
SNOWFLAKE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...full key...\n-----END PRIVATE KEY-----
SNOWFLAKE_ROLE=SKINCARE_APP_ROLE
SNOWFLAKE_WAREHOUSE=COMPUTE_WH
SNOWFLAKE_DATABASE=DAVID
SNOWFLAKE_SCHEMA=PUBLIC
```

### Server Variables (already in render.yaml):
```
PORT=3001
NODE_ENV=production
```

### Optional:
```
API_KEY=your-secret-api-key-here
```

## Deployment Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Create Render Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Select repository and branch

3. **Configure Service**
   - **Name**: `shelf-backend`
   - **Root Directory**: `backend` ⚠️ IMPORTANT
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or upgrade for always-on)

4. **Add Environment Variables**
   - Go to Environment tab
   - Add all Snowflake credentials listed above
   - ⚠️ For `SNOWFLAKE_PRIVATE_KEY`: Paste entire key including headers
   - Use `\n` for newlines or Render's multi-line editor

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (2-3 minutes)
   - Check logs for any errors

6. **Test Deployment**
   ```bash
   # Health check
   curl https://your-service.onrender.com/health
   
   # Test endpoints
   curl https://your-service.onrender.com/categories
   curl https://your-service.onrender.com/tables
   ```

## Troubleshooting

### Build Fails
- ✅ Check Root Directory is set to `backend`
- ✅ Verify `package.json` exists in backend folder
- ✅ Check build logs for specific errors

### Server Won't Start
- ✅ Verify all environment variables are set
- ✅ Check `SNOWFLAKE_PRIVATE_KEY` includes full PEM format
- ✅ Review server logs in Render dashboard

### Connection Timeout
- ⚠️ Free tier spins down after 15 min inactivity
- ⚠️ First request after spin-down takes ~30 seconds (cold start)
- 💡 Consider upgrading to paid plan for always-on

### Snowflake Connection Errors
- ✅ Verify account format (may need region: `account.region`)
- ✅ Check private key is complete and properly formatted
- ✅ Ensure public key is set in Snowflake for the user
- ✅ Review connection logs in Render dashboard

## Post-Deployment

1. ✅ Save your Render URL (e.g., `https://shelf-backend.onrender.com`)
2. ✅ Update your frontend app with the new API URL
3. ✅ Test all endpoints from your application
4. ✅ Monitor logs for any issues
5. ✅ Set up auto-deploy (enabled by default on push to main)

## Render Free Tier Notes

- ⚠️ Service spins down after 15 minutes of inactivity
- ⚠️ Cold start takes ~30 seconds
- ✅ 750 hours/month free (enough for always-on if used)
- ✅ Free SSL certificate included
- ✅ Unlimited bandwidth

## Next Steps

After successful deployment:
1. Update frontend environment variables
2. Test all API endpoints
3. Monitor performance and errors
4. Consider upgrading to paid plan if needed
