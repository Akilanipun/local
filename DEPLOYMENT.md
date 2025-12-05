# Hyper-Local Verified News Platform - Deployment Guide

## Prerequisites

### 1. Install Dependencies
- Node.js 18+ and npm
- PostgreSQL 14+ with PostGIS extension
- Git (optional, for version control)

### 2. API Keys Required
- **Google Maps JavaScript API Key**: [Get it here](https://developers.google.com/maps/documentation/javascript/get-api-key)
- **Google Gemini API Key**: [Get it here](https://ai.google.dev/)

---

## Database Setup

### 1. Install PostgreSQL with PostGIS

**Windows:**
```powershell
# Download and install PostgreSQL from https://www.postgresql.org/download/windows/
# During installation, make sure to install the PostGIS extension via Stack Builder
```

**Linux/Mac:**
```bash
# Install PostgreSQL and PostGIS
sudo apt-get install postgresql postgis  # Ubuntu/Debian
brew install postgresql postgis          # macOS
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE hyperlocal_news;

# Connect to the database
\c hyperlocal_news

# Enable PostGIS extension
CREATE EXTENSION postgis;

# Exit
\q
```

### 3. Run Schema Migration

```bash
# From the project root
cd apps/api
psql -U postgres -d hyperlocal_news -f src/database/schema.sql
```

---

## Environment Configuration

### 1. Frontend (.env.local)

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 2. Backend (.env)

Create `apps/api/.env`:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/hyperlocal_news
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

---

## Installation & Running

### 1. Install Dependencies

```bash
# From project root
npm install

# Install frontend dependencies
cd apps/web
npm install

# Install backend dependencies
cd ../api
npm install
cd ../..
```

### 2. Run Development Servers

**Option A: Run both servers concurrently**
```bash
# From project root
npm run dev
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
cd apps/api
npm run dev
```

Terminal 2 (Frontend):
```bash
cd apps/web
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## Production Deployment

### 1. Build Applications

```bash
# Build frontend
cd apps/web
npm run build

# Build backend
cd ../api
npm run build
```

### 2. Deployment Options

#### Option A: Traditional VPS (DigitalOcean, AWS EC2, etc.)

1. Set up PostgreSQL with PostGIS on server
2. Upload code to server
3. Set production environment variables
4. Use PM2 to run Node.js apps:

```bash
npm install -g pm2

# Start backend
cd apps/api
pm2 start dist/index.js --name "hyperlocal-api"

# Start frontend
cd ../web
pm2 start npm --name "hyperlocal-web" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Option B: Cloud Platform (Vercel + Railway/Render)

**Frontend (Vercel):**
1. Connect GitHub repo to Vercel
2. Set root directory to `apps/web`
3. Add environment variables
4. Deploy

**Backend (Railway/Render):**
1. Create PostgreSQL database
2. Deploy Node.js app from `apps/api`
3. Add environment variables
4. Run migrations

---

## Creating Admin Users

```sql
-- Connect to database
psql -U postgres -d hyperlocal_news

-- Update user role to admin
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';

-- Or create verified user
UPDATE users SET role = 'verified' WHERE email = 'verified@email.com';
```

---

## Testing Location Features

1. Open browser DevTools (F12)
2. Go to Settings → Sensors (Chrome) or Responsive Design Mode (Firefox)
3. Set custom location (e.g., Colombo: 6.9271, 79.8612)
4. Refresh the page

---

## Troubleshooting

### Location Permission Denied
- Check browser settings allow location access
- Use HTTPS in production (required for geolocation)

### Database Connection Failed
- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Ensure PostGIS extension is installed

### AI Moderation Not Working
- Verify GOOGLE_GEMINI_API_KEY is set
- Check API quota limits

---

## Next Steps

1. Set up admin dashboard for content moderation
2. Implement push notifications for PWA
3. Add analytics and monitoring
4. Set up automated backups for database
5. Configure CDN for static assets

---

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL + PostGIS Guide](https://postgis.net/documentation/)
- [Google Gemini API Docs](https://ai.google.dev/docs)
