---
id: 002
title: Phase II Full-Stack Constitution
stage: constitution
date: 2025-12-29
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: /sp.constitution
labels: ["constitution", "full-stack", "phase-ii", "architecture", "major-update"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

/sp.constitution CONSTITUTION.md - Phase II: Full-Stack Web Application
Purpose
This constitution defines the non-negotiable principles, architectural constraints, and quality standards for the Phase II Todo Web Application. All implementation decisions must align with these principles.

1. Architectural Principles
1.1 Separation of Concerns

Frontend (Next.js) handles UI/UX, client-side state, and user interactions
Backend (FastAPI) manages business logic, data validation, and database operations
Database (Neon PostgreSQL) serves as the single source of truth for all persistent data
No business logic in the frontend beyond UI state management
No UI rendering logic in the backend

1.2 API-First Design

RESTful API design with clear, predictable endpoints
All data access must flow through documented API endpoints
Frontend never directly accesses the database
API responses must be consistent and well-typed

1.3 Stateless Backend

Backend services must be stateless (session data in DB, not memory)
Horizontal scalability must be possible without code changes
JWT tokens for authentication (no server-side sessions)


2. Technology Stack Constraints
2.1 Required Technologies

Frontend: Next.js 15+ (App Router only, no Pages Router)
Backend: Python 3.13+ with FastAPI
ORM: SQLModel (not SQLAlchemy directly)
Database: Neon Serverless PostgreSQL
Authentication: Better Auth with JWT plugin
Package Manager: UV for Python, npm/pnpm for JavaScript

2.2 Forbidden Technologies

❌ No Class-based React components
❌ No localStorage/sessionStorage for authentication tokens
❌ No inline SQL queries (must use SQLModel)
❌ No Global state management libraries (Zustand, Redux) - use React Context if needed
❌ No custom authentication (must use Better Auth)


3. Code Quality Standards
3.1 TypeScript/JavaScript Standards

All frontend code must use TypeScript with strict mode
No any types except in unavoidable third-party integrations
React Server Components by default; Client Components only when needed
Async/await for all asynchronous operations (no .then() chains)
Tailwind CSS for styling (no inline styles, no CSS modules)

3.2 Python Standards

Type hints required for all function signatures
Pydantic models for all request/response schemas
Async/await for all I/O operations (database, external APIs)
No raw SQL - use SQLModel query builder
FastAPI dependency injection for database sessions

3.3 Error Handling

All API endpoints must return consistent error shapes:

json  {
    "error": "string",
    "detail": "string",
    "code": "ERROR_CODE"
  }

Frontend must handle all error states with user-friendly messages
No silent failures - log all errors appropriately


4. Security Principles
4.1 Authentication & Authorization

All API endpoints (except health checks) require valid JWT
JWT tokens expire after 7 days
Tokens stored in httpOnly cookies (not localStorage)
User ID from token must match user_id in URL path
No user can access another user's data

4.2 Input Validation

Backend validates ALL inputs (never trust the frontend)
SQL injection prevention through ORM (no raw SQL)
XSS prevention through React's built-in escaping
CORS properly configured (whitelist frontend URL)

4.3 Data Privacy

Passwords hashed with bcrypt (handled by Better Auth)
Environment variables for all secrets (no hardcoded credentials)
Database connection strings never exposed to frontend


5. Performance Standards
5.1 Frontend Performance

First Contentful Paint (FCP) < 1.5 seconds
Time to Interactive (TTI) < 3 seconds
Use Server Components for initial page loads
Lazy load Client Components when possible

5.2 Backend Performance

API response time < 200ms for CRUD operations
Database queries must use indexes on user_id
Connection pooling configured for Neon
No N+1 queries (use joins or batching)

5.3 Database Design

All tables must have:

Primary key (auto-incrementing integer or UUID)
created_at timestamp
updated_at timestamp (auto-updated)


Foreign keys enforced at database level
Indexes on frequently queried columns


6. Development Workflow Standards
6.1 Monorepo Structure
hackathon-todo/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── specs/             # Spec-Kit specifications
├── .spec-kit/         # Spec-Kit configuration
├── docker-compose.yml # Local development setup
└── README.md
6.2 Environment Management

.env.local for...

## Response snapshot

Updated constitution from v1.0.0 to v2.0.0 (MAJOR version bump) with:

**All 5 principles redefined:**
1. Separation of Concerns (Frontend/Backend/Database boundaries)
2. API-First Design (RESTful, documented endpoints)
3. Stateless Backend (JWT, horizontal scaling)
4. Security-First (Input validation, auth, CORS)
5. Performance Standards (FCP, TTI, API response budgets)

**New sections added:**
- Technology Stack Constraints (Required + Forbidden)
- Code Quality Standards (TypeScript/Python/Error Handling)
- Security Principles (Auth, Validation, Privacy)
- Database Design Standards
- Monorepo Structure
- Constitution Check Gates

## Outcome

- ✅ Impact: Complete architectural redesign from simple app to full-stack web application
- 🧪 Tests: N/A - constitution document
- 📁 Files: .specify/memory/constitution.md (major rewrite)
- 🔁 Next prompts: /sp.specify for feature specs, /sp.plan for implementation planning with new architecture
- 🧠 Reflection: Major version bump justified due to fundamental principle redefinition and breaking architectural changes

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Manual validation PASS - no unresolved placeholders, all principles declarative
- Prompt variant (if applicable): User-provided constitution content
- Next experiment: N/A
