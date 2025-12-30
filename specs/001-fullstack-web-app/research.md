# Research: Phase II Full-Stack Web Application

**Feature**: 001-fullstack-web-app
**Date**: 2025-12-29
**Status**: Complete

## Overview

This document captures technology decisions, best practices research, and alternatives considered for the Phase II full-stack implementation.

## Technology Decisions

### 1. Frontend Framework: Next.js 15 (App Router)

**Decision**: Use Next.js 15 with App Router exclusively

**Rationale**:
- Constitution mandates Next.js 15+ with App Router only (no Pages Router)
- Server Components reduce client-side JavaScript
- Built-in routing, layouts, and loading states
- Excellent TypeScript support
- Seamless Vercel deployment

**Alternatives Considered**:
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| Vite + React | Faster dev server | No SSR/SSG built-in, manual routing | Constitution requires Next.js |
| Remix | Great data loading | Smaller ecosystem | Constitution requires Next.js |
| Pages Router | More examples | Deprecated patterns | Constitution forbids |

**Best Practices**:
- Use Server Components by default
- Client Components only for interactivity (`"use client"`)
- Leverage `loading.tsx` for streaming
- Use route groups `(auth)`, `(dashboard)` for layouts

### 2. Backend Framework: FastAPI

**Decision**: Use FastAPI with Python 3.13+

**Rationale**:
- Constitution mandates FastAPI
- Async-first design matches Neon's serverless model
- Built-in OpenAPI documentation
- Pydantic for request/response validation
- Excellent performance for I/O-bound tasks

**Alternatives Considered**:
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| Django | Batteries included | Sync-first, heavier | Constitution requires FastAPI |
| Flask | Simple | Manual async, no validation | Constitution requires FastAPI |
| Express.js | Same language as frontend | Different ecosystem | Constitution requires Python |

**Best Practices**:
- Dependency injection for database sessions
- Pydantic models for all schemas
- Async/await for all database operations
- Router-based organization

### 3. ORM: SQLModel

**Decision**: Use SQLModel (not SQLAlchemy directly)

**Rationale**:
- Constitution mandates SQLModel
- Combines SQLAlchemy + Pydantic
- Single model definition for DB and API
- Type hints throughout

**Alternatives Considered**:
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| SQLAlchemy | More mature | Separate Pydantic models needed | Constitution requires SQLModel |
| Tortoise ORM | Async-native | Less SQLAlchemy compatibility | Constitution requires SQLModel |
| Raw SQL | Full control | SQL injection risk, no types | Constitution forbids |

**Best Practices**:
- Define models with `table=True`
- Use `Field()` for constraints
- Async session management
- Alembic for migrations

### 4. Database: Neon Serverless PostgreSQL

**Decision**: Use Neon for database hosting

**Rationale**:
- Constitution mandates Neon
- Serverless = auto-scaling, no cold starts
- PostgreSQL compatibility
- Free tier for development
- Connection pooling built-in

**Alternatives Considered**:
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| Supabase | More features | Different API patterns | Constitution requires Neon |
| PlanetScale | MySQL serverless | Not PostgreSQL | Constitution requires Neon |
| Self-hosted | Full control | Ops overhead | Not suitable for hackathon |

**Best Practices**:
- Use connection pooling endpoint
- Add `?sslmode=require` to connection string
- Index on `user_id` for all user-owned tables
- Use `created_at DESC` index for sorting

### 5. Authentication: Better Auth

**Decision**: Use Better Auth with JWT plugin

**Rationale**:
- Constitution mandates Better Auth
- Open source, well-documented
- JWT support with httpOnly cookies
- Works with both Next.js and FastAPI
- Handles password hashing (bcrypt)

**Alternatives Considered**:
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| NextAuth/Auth.js | Popular | Complex setup for custom backend | Constitution requires Better Auth |
| Clerk | Great UX | Paid, vendor lock-in | Constitution requires Better Auth |
| Custom JWT | Full control | Security risks | Constitution forbids custom auth |

**Best Practices**:
- Same `BETTER_AUTH_SECRET` on frontend and backend
- httpOnly cookies for token storage
- 7-day expiry as per constitution
- Validate user_id in URL matches token

### 6. Styling: Tailwind CSS

**Decision**: Use Tailwind CSS for all styling

**Rationale**:
- Constitution mandates Tailwind (forbids CSS Modules, inline styles)
- Utility-first enables rapid development
- Built-in responsive design
- Works with Server Components

**Alternatives Considered**:
| Option | Pros | Cons | Why Rejected |
|--------|------|------|--------------|
| CSS Modules | Scoped styles | Constitution forbids |
| Styled Components | CSS-in-JS | Not compatible with RSC | Constitution forbids |
| Inline styles | Quick | Constitution forbids |

**Best Practices**:
- Use `@apply` sparingly
- Leverage component composition
- Use Tailwind's color palette
- Configure custom colors in `tailwind.config.ts`

### 7. Package Management

**Decision**: UV for Python, npm/pnpm for JavaScript

**Rationale**:
- Constitution mandates UV for Python
- UV is fast (Rust-based)
- npm/pnpm both allowed by constitution

**Best Practices**:
- Lock files committed (`uv.lock`, `package-lock.json`)
- Pin major versions
- Use `uv sync` for reproducible installs

## Integration Patterns

### Frontend-Backend Communication

**Pattern**: REST API with JWT in httpOnly cookies

```typescript
// Frontend API client pattern
async function fetchTasks(userId: string): Promise<Task[]> {
  const response = await fetch(`${API_URL}/api/${userId}/tasks`, {
    credentials: 'include', // Include cookies
  });
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
}
```

### Error Handling

**Pattern**: Consistent error shape across all endpoints

```python
# Backend error handler
@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={
            "error": "ValidationError",
            "detail": str(exc),
            "code": "VALIDATION_FAILED"
        }
    )
```

### Optimistic Updates

**Pattern**: Update UI before server confirmation

```typescript
// Optimistic update pattern
function toggleComplete(taskId: number) {
  // 1. Optimistically update local state
  setTasks(prev => prev.map(t =>
    t.id === taskId ? { ...t, completed: !t.completed } : t
  ));

  // 2. Send request to server
  api.toggleComplete(taskId).catch(() => {
    // 3. Rollback on error
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
    toast.error('Failed to update task');
  });
}
```

## Security Considerations

### JWT Token Handling

- **Storage**: httpOnly cookies only (never localStorage)
- **Expiry**: 7 days as per constitution
- **Validation**: Every request validates signature + expiry
- **User Matching**: URL user_id must match token user_id

### Input Validation

- **Frontend**: Basic validation for UX (title length)
- **Backend**: Full validation with Pydantic (never trust frontend)
- **Database**: Constraints at DB level (VARCHAR(200), NOT NULL)

### CORS Configuration

```python
# Backend CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],  # Whitelist only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Performance Considerations

### Database Indexing

```sql
-- Required indexes per constitution
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
```

### Connection Pooling

- Neon provides built-in pooling
- Use pooling endpoint in connection string
- Configure max connections based on tier

### Frontend Optimization

- Server Components for initial render
- Streaming with `loading.tsx`
- Image optimization with `next/image`
- Code splitting automatic with App Router

## Unresolved Questions

None - all technology decisions are mandated by constitution.

## References

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com)
- [Better Auth Documentation](https://better-auth.com)
- [Neon Documentation](https://neon.tech/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
