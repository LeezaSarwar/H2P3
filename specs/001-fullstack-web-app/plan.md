# Implementation Plan: Phase II Full-Stack Web Application

**Branch**: `001-fullstack-web-app` | **Date**: 2025-12-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-fullstack-web-app/spec.md`

## Summary

Transform the Phase I console todo application into a modern, multi-user full-stack web application. The system will use Next.js 15 (App Router) for the frontend, FastAPI with Python 3.13+ for the backend, and Neon Serverless PostgreSQL for data persistence. Authentication will be handled by Better Auth with JWT tokens stored in httpOnly cookies.

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.x with Next.js 15+
- Backend: Python 3.13+ with FastAPI

**Primary Dependencies**:
- Frontend: Next.js 15, Better Auth (client), Tailwind CSS
- Backend: FastAPI, SQLModel, Better Auth (server), UV package manager

**Storage**: Neon Serverless PostgreSQL

**Testing**:
- Backend: pytest with FastAPI TestClient
- Frontend: Vitest + Testing Library (optional for Phase II)

**Target Platform**:
- Frontend: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Backend: Linux server (cloud deployment)

**Project Type**: Web application (frontend + backend monorepo)

**Performance Goals**:
- FCP < 1.5 seconds
- TTI < 3 seconds
- API response < 200ms for CRUD operations
- Task list render < 100ms for 100 tasks

**Constraints**:
- JWT tokens in httpOnly cookies (not localStorage)
- All API endpoints require JWT (except health)
- user_id in URL must match token user_id

**Scale/Scope**:
- Initial launch: free tier capacity
- Support for 100+ tasks per user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Implementation Gates (Constitution v2.0.0)

- [x] **Separation of Concerns**: Frontend (Next.js) / Backend (FastAPI) / Database (Neon) architecture
- [x] **API-First Design**: All data access through documented REST endpoints
- [x] **Stateless Backend**: JWT authentication, no server-side sessions
- [x] **Security-First**: JWT in httpOnly cookies, input validation, CORS whitelist
- [x] **Performance Standards**: FCP < 1.5s, API < 200ms defined
- [x] **Required Technologies**: Next.js 15+, FastAPI, SQLModel, Neon, Better Auth, UV
- [x] **Forbidden Technologies**: No class components, no localStorage for tokens, no Redux/Zustand, no raw SQL

**Gate Status**: ✅ PASS - All constitutional requirements satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-fullstack-web-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
│   └── api.yaml         # OpenAPI specification
├── checklists/          # Validation checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
hackathon-todo/
├── frontend/                    # Next.js 15 application
│   ├── app/
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Landing page
│   │   ├── (auth)/
│   │   │   ├── layout.tsx       # Auth layout (centered forms)
│   │   │   ├── signup/
│   │   │   │   └── page.tsx     # Signup form
│   │   │   └── signin/
│   │   │       └── page.tsx     # Signin form
│   │   └── (dashboard)/
│   │       ├── layout.tsx       # Dashboard layout (navbar)
│   │       └── tasks/
│   │           └── page.tsx     # Task list page
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── TaskList.tsx         # Task list container
│   │   ├── TaskItem.tsx         # Individual task card
│   │   ├── TaskForm.tsx         # Add/Edit task modal
│   │   └── ConfirmDialog.tsx    # Delete confirmation
│   ├── lib/
│   │   ├── api.ts               # API client (fetch wrapper)
│   │   ├── auth.ts              # Better Auth client config
│   │   └── utils.ts             # Utility functions
│   ├── hooks/
│   │   ├── useTasks.ts          # Task data fetching hook
│   │   └── useAuth.ts           # Auth state hook
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── config.py            # Environment configuration
│   │   ├── database.py          # Database connection (Neon)
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── task.py          # Task SQLModel
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py          # Auth routes (Better Auth)
│   │   │   └── tasks.py         # Task CRUD routes
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── task.py          # Pydantic request/response
│   │   │   └── common.py        # Error schemas
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   └── auth.py          # JWT verification middleware
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── jwt.py           # JWT helpers
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py          # Test fixtures
│   │   └── test_tasks.py        # Task endpoint tests
│   ├── alembic/                 # Database migrations
│   │   ├── versions/
│   │   └── env.py
│   ├── alembic.ini
│   ├── pyproject.toml
│   └── .python-version
│
├── specs/                       # Specification documents
├── .specify/                    # Specify configuration
├── history/                     # PHR and ADR records
├── .env.example                 # Environment template
├── docker-compose.yml           # Local development
└── README.md
```

**Structure Decision**: Web application monorepo with separate `frontend/` and `backend/` directories per constitution requirements. This enables independent deployment (Vercel for frontend, cloud platform for backend).

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Next.js 15 (App Router)                 │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐  │  │
│  │  │ Auth Pages │  │ Task Pages │  │    API Client       │  │  │
│  │  │(signup/in) │  │(dashboard) │  │  (fetch wrapper)    │  │  │
│  │  └────────────┘  └────────────┘  └─────────────────────┘  │  │
│  │                  Better Auth (Client SDK)                 │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS + JWT (httpOnly cookie)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   FastAPI (Python 3.13+)                  │  │
│  │  ┌──────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │ Auth Routes  │  │ Task Routes │  │  JWT Middleware │   │  │
│  │  │(Better Auth) │  │   (CRUD)    │  │ (verify token)  │   │  │
│  │  └──────────────┘  └─────────────┘  └─────────────────┘   │  │
│  │                   SQLModel (ORM Layer)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Connection Pooling
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                 NEON SERVERLESS POSTGRESQL                      │
│  ┌─────────────────────┐    ┌─────────────────────┐             │
│  │       users         │    │       tasks         │             │
│  │  (Better Auth)      │◄───│   (user_id FK)      │             │
│  └─────────────────────┘    └─────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow: Create Task

```
1. USER ACTION
   User clicks "Add Task" → fills form → clicks "Save"

2. FRONTEND (Next.js Client Component)
   - Captures form data (title, description)
   - Validates title length (1-200 chars)
   - Shows optimistic UI (task appears immediately)
   - Retrieves JWT from Better Auth

3. API CLIENT
   POST /api/{user_id}/tasks
   Headers: { Authorization: Bearer <jwt> }
   Body: { "title": "...", "description": "..." }

4. BACKEND (FastAPI)
   - JWT middleware verifies token
   - Extracts user_id, validates URL match
   - Pydantic validates request body

5. DATABASE (SQLModel → Neon)
   - Creates Task instance
   - session.add(task) → session.commit()
   - Returns task with generated ID

6. RESPONSE
   201 Created
   { "id": 1, "title": "...", "completed": false, ... }

7. FRONTEND UPDATE
   - Updates task list state
   - Shows success toast
   - Hides loading state
```

## API Design

### Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/signin` | No | Sign in |
| POST | `/api/auth/signout` | Yes | Sign out |
| GET | `/api/{user_id}/tasks` | Yes | List all tasks |
| POST | `/api/{user_id}/tasks` | Yes | Create task |
| GET | `/api/{user_id}/tasks/{id}` | Yes | Get single task |
| PUT | `/api/{user_id}/tasks/{id}` | Yes | Update task |
| DELETE | `/api/{user_id}/tasks/{id}` | Yes | Delete task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Yes | Toggle completion |
| GET | `/health` | No | Health check |

### Error Response Format

All errors return consistent JSON shape:

```json
{
  "error": "ValidationError",
  "detail": "Title must be between 1 and 200 characters",
  "code": "INVALID_TITLE_LENGTH"
}
```

### HTTP Status Codes

- `200 OK`: Successful GET/PUT/PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing/invalid JWT
- `403 Forbidden`: User ID mismatch
- `404 Not Found`: Task not found
- `500 Internal Server Error`: Server error

## Security Implementation

### Authentication Flow (Better Auth + JWT)

```
SIGNUP:
1. User submits email + password
2. Better Auth creates user in DB
3. Password hashed with bcrypt
4. JWT issued, set in httpOnly cookie
5. Redirect to dashboard

SIGNIN:
1. User submits credentials
2. Better Auth verifies
3. JWT issued, set in httpOnly cookie
4. Redirect to dashboard

API REQUEST:
1. Frontend sends request
2. JWT extracted from cookie
3. Backend verifies signature + expiry
4. user_id from token matched against URL
5. Request processed or 403 returned
```

### Security Checklist

- [x] JWT tokens in httpOnly cookies (not localStorage)
- [x] BETTER_AUTH_SECRET in environment variables
- [x] Token expiry: 7 days
- [x] CORS whitelist: frontend domain only
- [x] user_id URL validation against token
- [x] All endpoints (except /health) require JWT
- [x] Passwords hashed with bcrypt
- [x] No raw SQL (SQLModel ORM only)

## Performance Optimization

### Frontend

- React Server Components for initial page loads
- Client Components only for interactive elements
- Skeleton UI during data fetching
- Optimistic updates for instant feedback
- Debounced actions to prevent duplicates

### Backend

- Connection pooling for Neon
- Index on `tasks.user_id` and `tasks.completed`
- Async/await for all I/O operations
- No N+1 queries (single query with joins)

### Database

```sql
-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

## Environment Configuration

### Required Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
```

## Development Workflow

### Local Setup

```bash
# Terminal 1: Backend
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

### Testing

```bash
# Backend tests
cd backend
uv run pytest

# Frontend tests (optional)
cd frontend
npm test
```

## Deployment Strategy

### Frontend (Vercel)

1. Connect GitHub repo to Vercel
2. Set root directory to `frontend/`
3. Configure environment variables
4. Deploy on push to main

### Backend (Railway/Render/Fly.io)

1. Connect GitHub repo
2. Set root directory to `backend/`
3. Configure environment variables
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Database (Neon)

1. Create project in Neon console
2. Copy connection string
3. Run migrations: `alembic upgrade head`

## Complexity Tracking

No constitutional violations requiring justification. Architecture follows all requirements.

## Next Steps

1. **`/sp.tasks`**: Generate actionable task list from this plan
2. **Setup**: Initialize frontend and backend projects
3. **Database**: Create Neon project, run migrations
4. **Implement**: Execute tasks in dependency order
5. **Test**: Manual testing after each task
6. **Deploy**: Frontend to Vercel, backend to cloud platform
7. **Demo**: Record workflow video (< 90 seconds)
