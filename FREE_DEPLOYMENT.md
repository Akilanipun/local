# Free Deployment Guide - Vercel + Railway

This guide shows you how to deploy the Hyper-Local News Platform completely **FREE** using:
- **Vercel** for the Next.js frontend (Free tier)
- **Railway** for the Node.js backend + PostgreSQL database (Free $5/month credit)

---

## 🎯 Option 1: Vercel + Railway (Recommended)

### Step 1: Deploy Database & Backend on Railway

#### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (free $5/month credit, no credit card required)

#### 1.2 Create New Project
1. Click **"New Project"**
2. Select **"Provision PostgreSQL"**
3. Railway will create a PostgreSQL database

#### 1.3 Add PostGIS Extension
1. Click on your PostgreSQL service
2. Go to **"Data"** tab
3. Click **"Query"** and run:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

#### 1.4 Deploy Backend
1. In the same project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Connect your repository
4. Set **Root Directory**: `apps/api`
5. Railway will auto-detect Node.js

#### 1.5 Configure Backend Environment Variables
In Railway, go to your backend service → **Variables** tab:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your_random_secret_key_here_change_this
JWT_EXPIRES_IN=7d
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-app.vercel.app
```

> **Note**: `${{Postgres.DATABASE_URL}}` automatically references your PostgreSQL database

#### 1.6 Run Database Migration
1. In Railway, click on your backend service
2. Go to **"Settings"** → **"Deploy"**
3. Add a **"Build Command"**:
```bash
npm install && npm run build
```
4. Add a **"Start Command"**:
```bash
node dist/index.js
```

5. To run the schema, use Railway's **"Query"** feature in PostgreSQL:
   - Copy contents of `apps/api/src/database/schema.sql`
   - Paste and execute in Railway's PostgreSQL Query tab

#### 1.7 Get Backend URL
- Railway will give you a URL like: `https://your-app.up.railway.app`
- Copy this URL for the next step

---

### Step 2: Deploy Frontend on Vercel

#### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (completely free)

#### 2.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### 2.3 Set Environment Variables
In Vercel project settings → **Environment Variables**:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
```

#### 2.4 Deploy
- Click **"Deploy"**
- Vercel will build and deploy your app
- You'll get a URL like: `https://your-app.vercel.app`

#### 2.5 Update Backend CORS
Go back to Railway → Backend service → Variables:
- Update `ALLOWED_ORIGINS` to your Vercel URL:
```env
ALLOWED_ORIGINS=https://your-app.vercel.app
```

---

## 🎯 Option 2: Vercel + Render (Alternative)

### Backend on Render (Free Tier)

#### 1. Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (free tier available)

#### 2. Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**
2. Name: `hyperlocal-db`
3. Select **Free** tier
4. Click **"Create Database"**

#### 3. Add PostGIS Extension
1. Go to your database → **"Info"** tab
2. Copy the **"PSQL Command"**
3. Run locally or use Render's shell:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

#### 4. Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `hyperlocal-api`
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Plan**: Free

#### 5. Environment Variables
```env
DATABASE_URL=<from_render_postgres_internal_url>
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-app.vercel.app
```

> **Note**: Free tier on Render spins down after 15 minutes of inactivity (cold starts ~30 seconds)

---

## 🔑 Getting API Keys (Free)

### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **"Maps JavaScript API"**
4. Create credentials → API Key
5. Restrict key to your Vercel domain

**Free Tier**: $200 credit/month (more than enough for MVP)

### Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Get API Key"**
3. Create new key

**Free Tier**: 60 requests/minute (sufficient for testing)

---

## 📊 Free Tier Limits

### Vercel (Frontend)
- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ 100 GB-hours/month
- ✅ Custom domains

### Railway (Backend + DB)
- ✅ $5 credit/month (no credit card)
- ✅ ~500 hours runtime
- ✅ 1GB PostgreSQL storage
- ⚠️ Credit expires after trial

### Render (Alternative)
- ✅ 750 hours/month free
- ✅ 1GB PostgreSQL storage
- ⚠️ Spins down after inactivity
- ⚠️ Slower cold starts

---

## 🚀 Quick Deploy Checklist

- [ ] Create Railway/Render account
- [ ] Deploy PostgreSQL database
- [ ] Add PostGIS extension
- [ ] Run database schema migration
- [ ] Deploy backend service
- [ ] Set backend environment variables
- [ ] Get backend URL
- [ ] Create Vercel account
- [ ] Deploy frontend
- [ ] Set frontend environment variables
- [ ] Get Google Maps API key
- [ ] Get Google Gemini API key
- [ ] Update CORS in backend
- [ ] Test the app!

---

## 🔧 Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Check `ALLOWED_ORIGINS` in Railway/Render
- Ensure backend is running (check Railway/Render logs)

### Database connection failed
- Verify `DATABASE_URL` is set correctly
- Check PostGIS extension is installed
- Ensure schema has been migrated

### Location not working
- Vercel automatically provides HTTPS (required for geolocation)
- Check browser console for permission errors

### AI moderation not working
- Verify `GOOGLE_GEMINI_API_KEY` is set
- Check API quota in Google AI Studio
- Review backend logs for errors

---

## 💰 Cost Estimate

**Monthly Cost: $0** (within free tiers)

- Vercel: Free forever
- Railway: $5 credit/month (trial)
- Google Maps: $200 credit/month
- Google Gemini: Free tier (60 req/min)

**After Railway trial ends**, you can:
1. Switch to Render (free tier)
2. Upgrade Railway ($5/month for hobby plan)
3. Self-host on a VPS

---

## 🎉 You're Done!

Your app is now live and accessible worldwide! Share your Vercel URL with users and start building your community.

**Next Steps**:
- Set up custom domain on Vercel (free)
- Monitor usage in Railway/Render dashboard
- Create admin account for content moderation
- Invite verified users to start posting

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [PostGIS Documentation](https://postgis.net/documentation/)
