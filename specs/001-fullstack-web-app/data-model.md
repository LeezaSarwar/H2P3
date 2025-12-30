# Data Model: Phase II Full-Stack Web Application

**Feature**: 001-fullstack-web-app
**Date**: 2025-12-29
**Status**: Complete

## Entity Relationship Diagram

```
┌─────────────────────────┐         ┌─────────────────────────┐
│         users           │         │         tasks           │
├─────────────────────────┤         ├─────────────────────────┤
│ id (TEXT, PK)           │◄───────►│ id (SERIAL, PK)         │
│ email (TEXT, UNIQUE)    │   1:N   │ user_id (TEXT, FK)      │
│ name (TEXT, NULL)       │         │ title (VARCHAR 200)     │
│ password_hash (TEXT)    │         │ description (TEXT, NULL)│
│ created_at (TIMESTAMP)  │         │ completed (BOOLEAN)     │
│ updated_at (TIMESTAMP)  │         │ created_at (TIMESTAMP)  │
└─────────────────────────┘         │ updated_at (TIMESTAMP)  │
                                    └─────────────────────────┘
```

## Entities

### User (Managed by Better Auth)

The `users` table is managed by Better Auth. We interact with it through the Better Auth API, not directly through SQLModel.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | TEXT | PK | Unique user identifier (UUID or similar) |
| email | TEXT | UNIQUE, NOT NULL | User's email address |
| name | TEXT | NULL | Optional display name |
| password_hash | TEXT | NOT NULL | Bcrypt hashed password |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Notes**:
- Better Auth handles user creation, authentication, and password hashing
- We only read `id` from this table when validating JWTs
- Schema may vary based on Better Auth configuration

### Task

The `tasks` table is our custom table for storing todo items.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | SERIAL | PK | Auto-incrementing task ID |
| user_id | TEXT | FK(users.id), NOT NULL, INDEX | Owner of the task |
| title | VARCHAR(200) | NOT NULL | Task title (1-200 chars) |
| description | TEXT | NULL | Optional task description (max 1000 chars) |
| completed | BOOLEAN | DEFAULT FALSE | Completion status |
| created_at | TIMESTAMP | DEFAULT NOW() | Task creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes**:
- `idx_tasks_user_id` on `user_id` (required by constitution)
- `idx_tasks_completed` on `completed`
- `idx_tasks_created_at` on `created_at DESC`

**Foreign Key**:
- `user_id` references `users(id)` with `ON DELETE CASCADE`

## SQLModel Definitions

### Task Model

```python
from sqlmodel import Field, SQLModel
from datetime import datetime
from typing import Optional

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True, nullable=False)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

## Pydantic Schemas

### Request Schemas

```python
from pydantic import BaseModel, Field
from typing import Optional

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class TaskUpdate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class TaskComplete(BaseModel):
    completed: bool
```

### Response Schemas

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TaskResponse(BaseModel):
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TaskListResponse(BaseModel):
    tasks: list[TaskResponse]

class ErrorResponse(BaseModel):
    error: str
    detail: str
    code: str
```

## Validation Rules

### Title
- Required (not null, not empty)
- Minimum 1 character
- Maximum 200 characters
- Trimmed of leading/trailing whitespace

### Description
- Optional (can be null)
- Maximum 1000 characters when provided
- Trimmed of leading/trailing whitespace

### Completed
- Boolean value
- Defaults to `false` on creation
- Can be toggled via PATCH endpoint

### Timestamps
- `created_at`: Set automatically on INSERT, never updated
- `updated_at`: Set automatically on INSERT and UPDATE

## State Transitions

```
Task Lifecycle:

    ┌──────────────────┐
    │     CREATED      │  (completed = false)
    └────────┬─────────┘
             │
             │ Toggle Complete
             ▼
    ┌──────────────────┐
    │    COMPLETED     │  (completed = true)
    └────────┬─────────┘
             │
             │ Toggle Incomplete
             ▼
    ┌──────────────────┐
    │   INCOMPLETE     │  (completed = false)
    └────────┬─────────┘
             │
             │ Delete
             ▼
    ┌──────────────────┐
    │     DELETED      │  (hard delete, no soft delete)
    └──────────────────┘
```

## Database Migrations

### Initial Migration (Alembic)

```python
"""Initial schema

Revision ID: 001
"""
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Note: users table is created by Better Auth

    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Text(), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('completed', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    )

    op.create_index('idx_tasks_user_id', 'tasks', ['user_id'])
    op.create_index('idx_tasks_completed', 'tasks', ['completed'])
    op.create_index('idx_tasks_created_at', 'tasks', ['created_at'])

def downgrade():
    op.drop_index('idx_tasks_created_at')
    op.drop_index('idx_tasks_completed')
    op.drop_index('idx_tasks_user_id')
    op.drop_table('tasks')
```

## Query Patterns

### List Tasks (sorted by newest first)

```python
async def get_tasks(session: AsyncSession, user_id: str) -> list[Task]:
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    result = await session.execute(statement)
    return result.scalars().all()
```

### Create Task

```python
async def create_task(session: AsyncSession, user_id: str, data: TaskCreate) -> Task:
    task = Task(user_id=user_id, **data.model_dump())
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task
```

### Update Task

```python
async def update_task(session: AsyncSession, task: Task, data: TaskUpdate) -> Task:
    for key, value in data.model_dump().items():
        setattr(task, key, value)
    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task
```

### Toggle Completion

```python
async def toggle_complete(session: AsyncSession, task: Task, completed: bool) -> Task:
    task.completed = completed
    task.updated_at = datetime.utcnow()
    await session.commit()
    await session.refresh(task)
    return task
```

### Delete Task

```python
async def delete_task(session: AsyncSession, task: Task) -> None:
    await session.delete(task)
    await session.commit()
```

## Data Integrity

### Constraints

1. **Referential Integrity**: `user_id` foreign key ensures tasks belong to valid users
2. **Cascade Delete**: When user is deleted, all their tasks are deleted
3. **Not Null**: `user_id` and `title` cannot be null
4. **Length Limits**: `title` max 200 chars at database level

### Validation Layers

1. **Frontend**: Basic validation for UX feedback
2. **Pydantic**: Schema validation before database
3. **Database**: Constraints as final safety net
