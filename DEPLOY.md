# 🚀 Deploy to Render

## Prerequisites
1. **MongoDB Atlas** account (free tier): https://mongodb.com/cloud/atlas
   - Create a cluster and get connection string
   - Whitelist IP: `0.0.0.0/0` (allow from anywhere)
2. **Render** account (free tier): https://render.com

## Deploy Steps

### 1. Prepare MongoDB
- Go to MongoDB Atlas → Create Database → Get connection string
- Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bicycle-negotiation-game`

### 2. Push to GitHub
```cmd
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3. Deploy on Render
1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically
5. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `CLIENT_URL`: Leave empty initially (will set after first deploy)
   - `NODE_ENV`: `production` (already set in render.yaml)
   - `PORT`: `5000` (already set in render.yaml)
6. Click **Create Web Service**

### 4. Update CLIENT_URL
After first deploy, Render gives you a URL like `https://bicycle-negotiation-game.onrender.com`
1. Go to **Environment** tab in Render dashboard
2. Set `CLIENT_URL` to your app URL
3. Click **Save Changes** (this will trigger a redeploy)

### 5. Test
- Open your Render URL
- Open 2 browser tabs (or incognito)
- Both join the same group (e.g., Group 1)
- Test negotiation flow

## Local Production Test (Optional)

Test production build locally before deploying:

```cmd
REM Build client
cd client
npm install
npm run build

REM Set env vars and start server
cd ..\server
set NODE_ENV=production
set PORT=5000
set MONGODB_URI=mongodb://localhost:27017/bicycle-negotiation-game
set CLIENT_URL=http://localhost:5000
npm start
```

Open http://localhost:5000

## Troubleshooting

**Build fails on Render:**
- Check build logs
- Ensure `package.json` exists in both `/client` and `/server`
- Verify Node version compatibility

**Socket connection fails:**
- Ensure `CLIENT_URL` is set correctly in Render
- Check browser console for WebSocket errors

**Database connection fails:**
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Ensure database user has read/write permissions

**App loads but blank page:**
- Check Render logs: `Serving static client from...`
- Verify `NODE_ENV=production` is set
- Clear browser cache

## Free Tier Limits
- Render free tier: App sleeps after 15 min inactivity (first request takes ~30s to wake)
- MongoDB Atlas free tier: 512MB storage, sufficient for this app

## Next Steps
- Add custom domain in Render dashboard
- Enable auto-deploy from GitHub
- Set up monitoring/alerts
