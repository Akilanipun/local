# Hyper-Local Verified News Platform

A mobile-first, responsive Web Application (PWA) that serves as a trusted source for hyper-local news in Sri Lanka.

## Features

- 🌍 **Geo-Fenced Content**: All content restricted to 10km radius zones
- 🤖 **AI-Powered Moderation**: Google Gemini API for content verification
- 🗣️ **Tri-lingual Support**: English, Sinhala, and Tamil
- 💬 **Key & Peele Comments**: Users must contribute before viewing comments
- 📊 **Utility Features**: Price tracker, fuel status, power outages, daily polls

## Tech Stack

- **Frontend**: Next.js 14+ (React), Tailwind CSS, PWA
- **Backend**: Node.js, Express, PostgreSQL with PostGIS
- **AI**: Google Gemini API
- **Maps**: Google Maps JavaScript API

## Project Structure

```
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Node.js backend
├── packages/         # Shared packages
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ with PostGIS extension
- Google Maps API Key
- Google Gemini API Key

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Run development servers
npm run dev
```

## Development

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## License

MIT
