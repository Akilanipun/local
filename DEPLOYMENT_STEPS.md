# Quick Deployment Steps

## ✅ You've signed up for Vercel and Railway - Great!

Now follow these steps in order:

---

## Step 1: Push Code to GitHub

### 1.1 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click **"New repository"**
3. Name: `hyper-local-news` (or your preferred name)
4. Keep it **Public** (required for free tiers)
5. **Don't** initialize with README (we already have files)
6. Click **"Create repository"**

### 1.2 Push Your Code
Open terminal in your project folder and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Hyper-Local News Platform"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/hyper-local-news.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy on Railway (Backend + Database)

### 2.1 Create PostgreSQL Database
1. Go to [railway.app/new](https://railway.app/new)
2. Click **"Provision PostgreSQL"**
3. Wait for it to deploy (~30 seconds)

### 2.2 Add PostGIS Extension
1. Click on your **PostgreSQL** service
2. Click **"Data"** tab
3. Click **"Query"** button
4. Paste this and click **"Run"**:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 2.3 Run Database Schema
1. Still in the **"Query"** tab
2. Open `apps/api/src/database/schema.sql` from your project
3. Copy the **entire contents**
4. Paste in Railway query and click **"Run"**
5. You should see "Success" messages

### 2.4 Deploy Backend API
1. In the same Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Authorize Railway to access your GitHub
4. Select your `hyper-local-news` repository
5. Click **"Add variables"** and set:

```
Root Directory: apps/api
```

### 2.5 Set Environment Variables
Click on your backend service → **"Variables"** tab → **"+ New Variable"**:

```
DATABASE_URL = ${{Postgres.DATABASE_URL}}
JWT_SECRET = your_random_secret_key_12345
JWT_EXPIRES_IN = 7d
GOOGLE_GEMINI_API_KEY = (leave empty for now, we'll add later)
NODE_ENV = production
PORT = 5000
ALLOWED_ORIGINS = https://your-app.vercel.app
```

> **Note**: For `DATABASE_URL`, type exactly `${{Postgres.DATABASE_URL}}` - Railway will auto-connect

### 2.6 Configure Build Settings
1. Click **"Settings"** tab
2. Under **"Build"**, set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
3. Click **"Deploy"**

### 2.7 Get Your Backend URL
1. Go to **"Settings"** → **"Networking"**
2. Click **"Generate Domain"**
3. Copy the URL (e.g., `https://your-app.up.railway.app`)
4. **Save this URL** - you'll need it for Vercel!

---

## Step 3: Deploy on Vercel (Frontend)

### 3.1 Import Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your `hyper-local-news` repository
4. Click **"Import"**

### 3.2 Configure Project
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: Click **"Edit"** → Type `apps/web`
3. Click **"Continue"**

### 3.3 Add Environment Variables
Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_API_URL = https://your-app.up.railway.app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = (leave empty for now)
```

> Replace `https://your-app.up.railway.app` with your actual Railway URL from Step 2.7

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. You'll get a URL like `https://your-app.vercel.app`
4. **Copy this URL**

### 3.5 Update Railway CORS
1. Go back to **Railway**
2. Click on your **backend service**
3. Go to **"Variables"**
4. Update `ALLOWED_ORIGINS` to your Vercel URL:
```
ALLOWED_ORIGINS = https://your-app.vercel.app
```
5. Backend will auto-redeploy

---

## Step 4: Get API Keys

### 4.1 Google Gemini API Key (Required for AI)
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the key
4. Add to **Railway** → Backend → Variables:
```
GOOGLE_GEMINI_API_KEY = your_actual_key_here
```

### 4.2 Google Maps API Key (Required for Maps)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **"Maps JavaScript API"**
4. Go to **"Credentials"** → **"Create Credentials"** → **"API Key"**
5. Copy the key
6. Add to **Vercel** → Your Project → Settings → Environment Variables:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = your_actual_key_here
```
7. Click **"Redeploy"** in Vercel

---

## Step 5: Test Your App! 🎉

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Allow location permissions when prompted
3. You should see the app load!

### Create Your First Admin User
1. Register an account on your app
2. Go to Railway → PostgreSQL → Data → Query
3. Run this to make yourself admin:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 🎯 Checklist

- [ ] Push code to GitHub
- [ ] Create PostgreSQL on Railway
- [ ] Add PostGIS extension
- [ ] Run database schema
- [ ] Deploy backend on Railway
- [ ] Set backend environment variables
- [ ] Get backend URL
- [ ] Deploy frontend on Vercel
- [ ] Set frontend environment variables
- [ ] Get Vercel URL
- [ ] Update CORS in Railway
- [ ] Get Google Gemini API key
- [ ] Get Google Maps API key
- [ ] Test the app
- [ ] Create admin user

---

## ⚠️ Common Issues

**"Location permission denied"**
- Make sure you're using the HTTPS URL from Vercel
- Check browser settings allow location

**"Cannot connect to backend"**
- Verify `NEXT_PUBLIC_API_URL` in Vercel matches Railway URL
- Check `ALLOWED_ORIGINS` in Railway matches Vercel URL
- Check Railway backend logs for errors

**"Database connection failed"**
- Verify PostGIS extension is installed
- Check schema was run successfully
- Verify `DATABASE_URL` variable in Railway

---

## 🆘 Need Help?

Check the logs:
- **Railway**: Click service → "Deployments" → Click latest → "View Logs"
- **Vercel**: Click deployment → "Logs" tab

Both platforms have excellent documentation and support!
