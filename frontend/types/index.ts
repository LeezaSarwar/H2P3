export interface User {
  id: string;
  email: string;
  name?: string | null;
}

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
}

export interface TaskUpdate {
  title: string;
  description?: string | null;
}

export interface ErrorResponse {
  error: string;
  detail: string;
  code: string;
}
