# Tasks: Phase II Full-Stack Web Application

**Input**: Design documents from `/specs/001-fullstack-web-app/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api.yaml, quickstart.md

**Tests**: Tests are NOT explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/app/`, `frontend/app/`
- Based on plan.md monorepo structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create monorepo structure with frontend/, backend/, specs/ directories
- [x] T002 Create root .gitignore excluding node_modules/, .env, __pycache__/, .venv/
- [x] T003 Create root .env.example with placeholder environment variables
- [x] T004 [P] Initialize Next.js 15 frontend with TypeScript and Tailwind in frontend/
- [x] T005 [P] Initialize FastAPI backend with UV package manager in backend/
- [x] T006 Create frontend/.env.example with NEXT_PUBLIC_API_URL and BETTER_AUTH_SECRET
- [x] T007 Create backend/.env.example with DATABASE_URL, BETTER_AUTH_SECRET, FRONTEND_URL, CORS_ORIGINS

**Checkpoint**: Both frontend and backend dev servers can start independently

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Database & Models

- [x] T008 Create database connection in backend/app/database.py with Neon PostgreSQL async support
- [x] T009 Create config module in backend/app/config.py for environment variables
- [x] T010 Create Task SQLModel in backend/app/models/task.py with id, user_id, title, description, completed, timestamps
- [x] T011 Setup Alembic migrations in backend/alembic/ with initial schema
- [x] T012 Create task indexes migration for user_id, completed, created_at

### API Infrastructure

- [x] T013 Create FastAPI app entry point in backend/app/main.py with CORS middleware
- [x] T014 Create error response schema in backend/app/schemas/common.py with ErrorResponse model
- [x] T015 Create task Pydantic schemas in backend/app/schemas/task.py (TaskCreate, TaskUpdate, TaskComplete, TaskResponse)
- [x] T016 Create health check endpoint GET /health in backend/app/main.py

### Authentication Infrastructure

- [x] T017 Create JWT utilities in backend/app/utils/jwt.py for token verification
- [x] T018 Create auth middleware in backend/app/middleware/auth.py to verify JWT on protected routes
- [x] T019 [P] Create Better Auth client config in frontend/lib/auth.ts
- [x] T020 [P] Create TypeScript types in frontend/types/index.ts for User, Task, AuthState

### Frontend Infrastructure

- [x] T021 Create API client wrapper in frontend/lib/api.ts with fetch and error handling
- [x] T022 Create root layout in frontend/app/layout.tsx with Tailwind and providers
- [x] T023 [P] Create reusable Button component in frontend/components/ui/Button.tsx
- [x] T024 [P] Create reusable Input component in frontend/components/ui/Input.tsx
- [x] T025 [P] Create reusable Modal component in frontend/components/ui/Modal.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 & 2 - Authentication (Priority: P1) MVP

**Goal**: Users can sign up for a new account and sign in with existing credentials

**Independent Test**: Complete signup flow, verify redirect to dashboard with empty state. Sign out, sign in again, verify session works.

### Backend Implementation

- [x] T026 [US1] Create auth routes in backend/app/routes/auth.py with Better Auth integration
- [x] T027 [US1] Implement POST /api/auth/signup endpoint in backend/app/routes/auth.py
- [x] T028 [US2] Implement POST /api/auth/signin endpoint in backend/app/routes/auth.py
- [x] T029 [US2] Implement POST /api/auth/signout endpoint in backend/app/routes/auth.py
- [x] T030 [US1] Register auth router in backend/app/main.py

### Frontend Implementation

- [x] T031 [US1] Create auth layout in frontend/app/(auth)/layout.tsx with centered form styling
- [x] T032 [US1] Create signup page in frontend/app/(auth)/signup/page.tsx with email/password form
- [x] T033 [US2] Create signin page in frontend/app/(auth)/signin/page.tsx with email/password form
- [x] T034 [US1] Add form validation for email format and password length (8+ chars)
- [x] T035 [US1] Create landing page in frontend/app/page.tsx with Sign Up and Sign In buttons
- [x] T036 [US2] Implement useAuth hook in frontend/hooks/useAuth.ts for session management
- [x] T037 [US2] Add auth redirect middleware to protect dashboard routes

**Checkpoint**: Users can sign up, sign in, sign out. Dashboard route is protected.

---

## Phase 4: User Story 3 - Create Task (Priority: P1) MVP

**Goal**: Authenticated users can create new tasks with title and description

**Independent Test**: Sign in, click Add Task, enter title/description, save. Task appears in list and persists after refresh.

### Backend Implementation

- [x] T038 [US3] Create tasks router in backend/app/routes/tasks.py
- [x] T039 [US3] Implement POST /api/{user_id}/tasks endpoint with validation
- [x] T040 [US3] Add user_id verification against JWT token in tasks router
- [x] T041 [US3] Register tasks router in backend/app/main.py

### Frontend Implementation

- [x] T042 [US3] Create dashboard layout in frontend/app/(dashboard)/layout.tsx with navbar
- [x] T043 [US3] Create tasks page in frontend/app/(dashboard)/tasks/page.tsx
- [x] T044 [US3] Create TaskForm component in frontend/components/TaskForm.tsx for add/edit modal
- [x] T045 [US3] Implement createTask function in frontend/lib/api.ts
- [x] T046 [US3] Add empty state message "No tasks yet. Add your first task!" in tasks page
- [x] T047 [US3] Add Add Task button that opens TaskForm modal

**Checkpoint**: Users can create tasks. MVP complete with auth + task creation.

---

## Phase 5: User Story 4 - View Task List (Priority: P2)

**Goal**: Users can see all their tasks sorted by creation date (newest first)

**Independent Test**: Create multiple tasks, verify they display in correct order with title, checkbox, and relative time.

### Backend Implementation

- [ ] T048 [US4] Implement GET /api/{user_id}/tasks endpoint in backend/app/routes/tasks.py
- [ ] T049 [US4] Add ORDER BY created_at DESC to tasks query

### Frontend Implementation

- [ ] T050 [US4] Create TaskList component in frontend/components/TaskList.tsx
- [ ] T051 [US4] Create TaskItem component in frontend/components/TaskItem.tsx with checkbox, title, time
- [ ] T052 [US4] Implement getTasks function in frontend/lib/api.ts
- [ ] T053 [US4] Create useTasks hook in frontend/hooks/useTasks.ts for data fetching
- [ ] T054 [US4] Add relative time display (e.g., "2 days ago") using date-fns or similar
- [ ] T055 [US4] Create LoadingSkeleton component in frontend/components/ui/Skeleton.tsx
- [ ] T056 [US4] Show skeleton loading state while tasks are fetching

**Checkpoint**: Task list displays with all required information and loading states

---

## Phase 6: User Story 5 - Mark Task Complete (Priority: P2)

**Goal**: Users can toggle task completion status with immediate visual feedback

**Independent Test**: Click checkbox on incomplete task, verify strikethrough appears. Click again, verify it reverts. Refresh, verify persistence.

### Backend Implementation

- [ ] T057 [US5] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/app/routes/tasks.py
- [ ] T058 [US5] Verify task belongs to authenticated user before updating

### Frontend Implementation

- [ ] T059 [US5] Implement toggleTask function in frontend/lib/api.ts
- [ ] T060 [US5] Add completion toggle handler to TaskItem component
- [ ] T061 [US5] Style completed tasks with strikethrough and grayed-out appearance
- [ ] T062 [US5] Implement optimistic UI update for completion toggle

**Checkpoint**: Task completion works with instant visual feedback

---

## Phase 7: User Story 6 - Edit Task (Priority: P2)

**Goal**: Users can edit existing task title and description

**Independent Test**: Click edit on task, modify title, save. Verify changes appear immediately and persist after refresh.

### Backend Implementation

- [ ] T063 [US6] Implement PUT /api/{user_id}/tasks/{id} endpoint in backend/app/routes/tasks.py
- [ ] T064 [US6] Implement GET /api/{user_id}/tasks/{id} endpoint for single task fetch

### Frontend Implementation

- [ ] T065 [US6] Implement updateTask function in frontend/lib/api.ts
- [ ] T066 [US6] Add edit button to TaskItem component
- [ ] T067 [US6] Open TaskForm modal pre-filled with existing task data when editing
- [ ] T068 [US6] Implement optimistic UI update for task edit

**Checkpoint**: Task editing works with form pre-population and optimistic updates

---

## Phase 8: User Story 7 - Delete Task (Priority: P3)

**Goal**: Users can permanently delete tasks with confirmation dialog

**Independent Test**: Click delete on task, confirm in dialog, verify task disappears. Refresh, verify it's gone permanently.

### Backend Implementation

- [ ] T069 [US7] Implement DELETE /api/{user_id}/tasks/{id} endpoint in backend/app/routes/tasks.py

### Frontend Implementation

- [ ] T070 [US7] Create ConfirmDialog component in frontend/components/ConfirmDialog.tsx
- [ ] T071 [US7] Implement deleteTask function in frontend/lib/api.ts
- [ ] T072 [US7] Add delete button to TaskItem component
- [ ] T073 [US7] Show confirmation dialog before deletion
- [ ] T074 [US7] Implement optimistic UI update for task deletion

**Checkpoint**: Task deletion works with confirmation and optimistic updates

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Toast Notifications

- [ ] T075 Install and configure sonner toast library in frontend/
- [ ] T076 Add Toaster component to root layout
- [ ] T077 Add success toasts for task create, update, delete operations
- [ ] T078 Add error toasts for validation and network errors

### UI Enhancements

- [ ] T079 [P] Add keyboard shortcuts (Enter to save, Escape to cancel) to forms
- [ ] T080 [P] Ensure responsive design works on mobile (320px+)
- [ ] T081 [P] Add logout button to dashboard navbar with user email display

### Error Handling

- [ ] T082 Implement global error boundary in frontend
- [ ] T083 Add retry logic for failed API calls (max 3 attempts)
- [ ] T084 Ensure all API errors return consistent ErrorResponse format

### Deployment Preparation

- [ ] T085 Create comprehensive README.md with setup and deployment instructions
- [ ] T086 Configure Vercel deployment for frontend/ directory
- [ ] T087 Configure backend deployment (Railway/Render) with start command
- [ ] T088 Test end-to-end flow in deployed environment

### Demo & Documentation

- [ ] T089 Verify all success criteria from spec.md are met
- [ ] T090 Record demo video (< 90 seconds) showing full workflow

**Checkpoint**: Application is polished, deployed, and demo-ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **Auth Stories (Phase 3)**: Depends on Foundational - BLOCKS task stories
- **Task Stories (Phase 4-8)**: Depends on Auth (Phase 3) completion
  - Phase 4 (Create) can start immediately after Phase 3
  - Phase 5-8 can run in parallel after Phase 4 is complete
- **Polish (Phase 9)**: Depends on all core user stories (Phase 3-8)

### User Story Dependencies

| Story | Phase | Dependencies | Can Parallel With |
|-------|-------|--------------|-------------------|
| US1 (Signup) | 3 | Foundational | US2 (same phase) |
| US2 (Signin) | 3 | Foundational | US1 (same phase) |
| US3 (Create) | 4 | Auth (Phase 3) | None initially |
| US4 (List) | 5 | Create (Phase 4) | US5, US6, US7 |
| US5 (Complete) | 6 | Create (Phase 4) | US4, US6, US7 |
| US6 (Edit) | 7 | Create (Phase 4) | US4, US5, US7 |
| US7 (Delete) | 8 | Create (Phase 4) | US4, US5, US6 |
| US8 (Cross-Device) | N/A | All stories | Verified by architecture |

### Parallel Opportunities

```
Phase 1: T004 || T005 (frontend || backend init)
Phase 2: T019 || T020, T023 || T024 || T025
Phase 3: T031-T037 can run after T026-T030
Phase 5-8: All phases can run in parallel after Phase 4
Phase 9: T079 || T080 || T081
```

---

## Implementation Strategy

### MVP First (Phases 1-4)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: Auth (US1 + US2)
4. Complete Phase 4: Create Task (US3)
5. **STOP and VALIDATE**: Test signup → signin → create task flow
6. Deploy MVP if ready

### Incremental Delivery

1. **MVP** (Phases 1-4): Signup + Signin + Create Task
2. **+List** (Phase 5): View all tasks
3. **+Complete** (Phase 6): Toggle completion
4. **+Edit** (Phase 7): Modify tasks
5. **+Delete** (Phase 8): Remove tasks
6. **Polish** (Phase 9): Toasts, error handling, deployment

Each increment is independently deployable and testable.

---

## Task Summary

| Phase | Description | Task Count | Priority |
|-------|-------------|------------|----------|
| 1 | Setup | 7 | Critical |
| 2 | Foundational | 18 | Critical |
| 3 | Auth (US1+US2) | 12 | P1 |
| 4 | Create Task (US3) | 10 | P1 |
| 5 | View List (US4) | 9 | P2 |
| 6 | Complete Toggle (US5) | 6 | P2 |
| 7 | Edit Task (US6) | 6 | P2 |
| 8 | Delete Task (US7) | 6 | P3 |
| 9 | Polish | 16 | Medium |
| **Total** | | **90** | |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US8 (Cross-Device Access) is verified by architecture - no dedicated tasks
- Tests omitted as not explicitly requested in specification
- Each checkpoint allows for MVP validation and incremental deployment
- Commit after each task or logical group
