<!--
Sync Impact Report
==================
Version change: 1.0.0 → 2.0.0 (MAJOR - Full-Stack Architecture Redesign)

Modified principles:
- "I. User-Centric Design" → "I. Separation of Concerns" (redefined)
- "II. Clean Data Model" → "II. API-First Design" (redefined)
- "III. Modular Architecture" → "III. Stateless Backend" (redefined)
- "IV. Pragmatic Testing" → "IV. Security-First" (redefined)
- "V. Incremental Delivery" → "V. Performance Standards" (redefined)

Added sections:
- Technology Stack Constraints (Required + Forbidden technologies)
- Code Quality Standards (TypeScript/Python/Error Handling)
- Security Principles (Auth, Validation, Privacy)
- Performance Standards (Frontend/Backend/Database)
- Monorepo Structure

Removed sections:
- Generic "Technology Standards" replaced with specific stack constraints

Templates requiring updates:
- .specify/templates/plan-template.md: ⚠ Review needed (Constitution Check gates changed)
- .specify/templates/spec-template.md: ✅ Compatible (User Stories still required)
- .specify/templates/tasks-template.md: ⚠ Review needed (Web app structure now required)

Follow-up TODOs: None
-->

# Todo Web Application Constitution - Phase II

## Purpose

This constitution defines the non-negotiable principles, architectural constraints, and quality standards for the Phase II Todo Web Application. All implementation decisions MUST align with these principles.

## Core Principles

### I. Separation of Concerns

The application MUST maintain strict boundaries between frontend, backend, and data layers.

- **Frontend (Next.js)**: Handles UI/UX, client-side state, and user interactions ONLY
- **Backend (FastAPI)**: Manages business logic, data validation, and database operations ONLY
- **Database (Neon PostgreSQL)**: Serves as the single source of truth for all persistent data
- No business logic in the frontend beyond UI state management
- No UI rendering logic in the backend

**Rationale**: Clear separation enables independent scaling, testing, and deployment of each layer.

### II. API-First Design

All data access MUST flow through well-defined API contracts.

- RESTful API design with clear, predictable endpoints
- All data access MUST flow through documented API endpoints
- Frontend MUST NEVER directly access the database
- API responses MUST be consistent and well-typed
- API contracts MUST be defined before implementation

**Rationale**: API-first ensures frontend and backend can evolve independently with clear integration points.

### III. Stateless Backend

Backend services MUST be stateless to enable horizontal scaling.

- Session data MUST be stored in database, not in memory
- Horizontal scalability MUST be possible without code changes
- JWT tokens for authentication (no server-side sessions)
- No request-scoped global state
- Each request MUST be self-contained

**Rationale**: Stateless architecture enables load balancing and zero-downtime deployments.

### IV. Security-First

Security MUST be built into every layer, not added as an afterthought.

- All API endpoints (except health checks) MUST require valid JWT
- Backend MUST validate ALL inputs (never trust the frontend)
- SQL injection prevention through ORM (no raw SQL)
- XSS prevention through React's built-in escaping
- CORS properly configured (whitelist frontend URL only)
- No user can access another user's data

**Rationale**: A todo app contains personal data; security breaches destroy user trust permanently.

### V. Performance Standards

The application MUST meet defined performance budgets.

- Frontend: First Contentful Paint (FCP) < 1.5 seconds
- Frontend: Time to Interactive (TTI) < 3 seconds
- Backend: API response time < 200ms for CRUD operations
- Database: Queries MUST use indexes on user_id
- No N+1 queries (use joins or batching)

**Rationale**: Performance directly impacts user experience and retention.

## Technology Stack Constraints

### Required Technologies

| Layer | Technology | Version/Notes |
|-------|------------|---------------|
| Frontend | Next.js | 15+ (App Router ONLY, no Pages Router) |
| Backend | Python + FastAPI | Python 3.13+ |
| ORM | SQLModel | NOT SQLAlchemy directly |
| Database | Neon Serverless PostgreSQL | - |
| Authentication | Better Auth | With JWT plugin |
| Python Package Manager | UV | - |
| JS Package Manager | npm or pnpm | - |

### Forbidden Technologies

The following are explicitly FORBIDDEN in this project:

- ❌ Class-based React components
- ❌ localStorage/sessionStorage for authentication tokens
- ❌ Inline SQL queries (MUST use SQLModel)
- ❌ Global state management libraries (Zustand, Redux) - use React Context if needed
- ❌ Custom authentication implementations (MUST use Better Auth)
- ❌ Pages Router in Next.js
- ❌ CSS Modules or inline styles (use Tailwind CSS)
- ❌ `.then()` chains (use async/await)

## Code Quality Standards

### TypeScript/JavaScript Standards

- All frontend code MUST use TypeScript with strict mode enabled
- No `any` types except in unavoidable third-party integrations
- React Server Components by default; Client Components ONLY when needed
- Async/await for all asynchronous operations
- Tailwind CSS for all styling

### Python Standards

- Type hints REQUIRED for all function signatures
- Pydantic models for all request/response schemas
- Async/await for all I/O operations (database, external APIs)
- No raw SQL - MUST use SQLModel query builder
- FastAPI dependency injection for database sessions

### Error Handling

All API endpoints MUST return consistent error shapes:

```json
{
  "error": "string",
  "detail": "string",
  "code": "ERROR_CODE"
}
```

- Frontend MUST handle all error states with user-friendly messages
- No silent failures - log all errors appropriately
- Errors MUST NOT expose internal implementation details

## Security Principles

### Authentication & Authorization

- All API endpoints (except health checks) MUST require valid JWT
- JWT tokens MUST expire after 7 days
- Tokens MUST be stored in httpOnly cookies (NOT localStorage)
- User ID from token MUST match user_id in URL path
- No user can access another user's data

### Input Validation

- Backend MUST validate ALL inputs (never trust the frontend)
- SQL injection prevention through ORM (no raw SQL)
- XSS prevention through React's built-in escaping
- CORS MUST be configured to whitelist frontend URL only

### Data Privacy

- Passwords hashed with bcrypt (handled by Better Auth)
- Environment variables for ALL secrets (no hardcoded credentials)
- Database connection strings MUST NEVER be exposed to frontend

## Database Design Standards

All tables MUST have:

- Primary key (auto-incrementing integer or UUID)
- `created_at` timestamp (auto-set on creation)
- `updated_at` timestamp (auto-updated on modification)

Additional requirements:

- Foreign keys MUST be enforced at database level
- Indexes REQUIRED on frequently queried columns
- `user_id` MUST be indexed on all user-owned tables

## Development Workflow

### Monorepo Structure

```
hackathon-todo/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── specs/             # Spec-Kit specifications
├── .specify/          # Specify configuration
├── docker-compose.yml # Local development setup
└── README.md
```

### Environment Management

- `.env.local` for local development (git-ignored)
- `.env.example` MUST be maintained with all required variables (no values)
- Production secrets via deployment platform environment variables

### Change Process

1. **Specification**: Document user story with acceptance criteria before implementation
2. **Design**: For non-trivial changes, create implementation plan in `specs/<feature>/plan.md`
3. **Implementation**: Follow the plan; commit in logical increments
4. **Verification**: Run tests and manual verification against acceptance criteria
5. **Review**: Code review required for shared/production branches

### Branch Strategy

- `main`: Production-ready code only
- Feature branches: `<issue-number>-<brief-description>`
- Keep branches short-lived; merge frequently

## Governance

### Constitutional Authority

This constitution establishes the foundational principles for the Phase II Todo Web Application. All development decisions, code reviews, and architectural choices MUST align with these principles.

### Amendment Process

1. Propose amendment with rationale in a pull request modifying this file
2. Document impact on existing code and templates
3. Obtain team consensus (or owner approval for solo projects)
4. Update version according to semantic versioning:
   - **MAJOR**: Principle removal, fundamental redefinition, or breaking architectural change
   - **MINOR**: New principle or section added, materially expanded guidance
   - **PATCH**: Clarifications, wording improvements, typo fixes

### Compliance Review

- Code reviews MUST verify alignment with constitutional principles
- Violations require either code change or documented exception with justification
- Repeated violations indicate need for constitution review or training

### Constitution Check Gates

Before implementation, verify:

- [ ] Architecture follows Separation of Concerns (Frontend/Backend/Database)
- [ ] All data access flows through API endpoints
- [ ] Backend is stateless (no in-memory session data)
- [ ] Security requirements met (JWT, input validation, CORS)
- [ ] Performance budgets defined and achievable
- [ ] Required technologies used (no forbidden technologies)
- [ ] Code quality standards met (TypeScript strict, Python type hints)

**Version**: 2.0.0 | **Ratified**: 2025-12-29 | **Last Amended**: 2025-12-29
