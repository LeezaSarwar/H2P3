# Quickstart: Phase II Full-Stack Web Application

**Feature**: 001-fullstack-web-app
**Date**: 2025-12-29

## Prerequisites

Before starting, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Python 3.13+ installed
- [ ] UV package manager installed (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
- [ ] Git configured
- [ ] Neon account created (https://neon.tech)
- [ ] Code editor (VS Code recommended)

## 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd hackathon-todo

# Checkout the feature branch
git checkout 001-fullstack-web-app
```

## 2. Database Setup (Neon)

1. Go to https://console.neon.tech
2. Create a new project (e.g., "hackathon-todo")
3. Copy the connection string from the dashboard
4. Save it for the backend `.env` file

## 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment and install dependencies
uv sync

# Create .env file
cp .env.example .env

# Edit .env with your values:
# DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
# BETTER_AUTH_SECRET=your-secret-key-min-32-chars
# FRONTEND_URL=http://localhost:3000
# CORS_ORIGINS=http://localhost:3000

# Run database migrations
uv run alembic upgrade head

# Start the development server
uv run uvicorn app.main:app --reload --port 8000
```

**Verify**: Open http://localhost:8000/health - should return `{"status": "healthy"}`

## 4. Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# BETTER_AUTH_SECRET=your-secret-key-min-32-chars

# Start the development server
npm run dev
```

**Verify**: Open http://localhost:3000 - should see the landing page

## 5. Verify Full Stack

1. **Health Check**:
   - Backend: http://localhost:8000/health
   - Frontend: http://localhost:3000

2. **Create Account**:
   - Click "Sign Up"
   - Enter email and password
   - Should redirect to dashboard

3. **Create Task**:
   - Click "Add Task"
   - Enter title and description
   - Task should appear in list

4. **Refresh Test**:
   - Refresh the page
   - Task should still be visible (persisted)

## Development Commands

### Backend

```bash
cd backend

# Run server with hot reload
uv run uvicorn app.main:app --reload --port 8000

# Run tests
uv run pytest

# Run migrations
uv run alembic upgrade head

# Create new migration
uv run alembic revision --autogenerate -m "description"

# Format code
uv run black .
uv run isort .

# Type check
uv run mypy .
```

### Frontend

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint code
npm run lint

# Type check
npm run type-check

# Run tests (if configured)
npm test
```

## Environment Variables Reference

### Backend (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | Neon PostgreSQL connection string |
| BETTER_AUTH_SECRET | Yes | Secret key (min 32 chars) |
| FRONTEND_URL | Yes | Frontend URL for CORS |
| CORS_ORIGINS | Yes | Allowed CORS origins |

### Frontend (.env.local)

| Variable | Required | Description |
|----------|----------|-------------|
| NEXT_PUBLIC_API_URL | Yes | Backend API URL |
| BETTER_AUTH_SECRET | Yes | Same secret as backend |

## Troubleshooting

### Backend won't start

1. Check Python version: `python --version` (needs 3.13+)
2. Check UV is installed: `uv --version`
3. Verify DATABASE_URL is correct
4. Run `uv sync` to reinstall dependencies

### Frontend won't start

1. Check Node version: `node --version` (needs 18+)
2. Delete `node_modules` and run `npm install`
3. Check `.env.local` exists with correct values

### Database connection errors

1. Verify connection string in Neon dashboard
2. Ensure `?sslmode=require` is in the URL
3. Check Neon project is active (free tier pauses after inactivity)

### Authentication issues

1. Verify `BETTER_AUTH_SECRET` is same on frontend and backend
2. Check browser cookies are enabled
3. Clear cookies and try again

### CORS errors

1. Check `CORS_ORIGINS` matches frontend URL exactly
2. Verify `FRONTEND_URL` is set correctly
3. Restart backend after changing env vars

## Project Structure

```
hackathon-todo/
├── frontend/           # Next.js 15 application
│   ├── app/           # App Router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities and API client
│   └── types/         # TypeScript types
│
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── models/    # SQLModel definitions
│   │   ├── routes/    # API endpoints
│   │   ├── schemas/   # Pydantic schemas
│   │   └── middleware/# JWT verification
│   ├── tests/         # pytest tests
│   └── alembic/       # Database migrations
│
├── specs/             # Feature specifications
│   └── 001-fullstack-web-app/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md   # This file
│       └── contracts/
│           └── api.yaml
│
└── .env.example       # Environment template
```

## Next Steps

After setup is complete:

1. Run `/sp.tasks` to generate implementation tasks
2. Follow tasks in dependency order
3. Test each feature as you implement
4. Commit after each logical change
5. Deploy when ready (Vercel + Railway/Render)
