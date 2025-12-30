import type { Task, TaskCreate, TaskUpdate, ErrorResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ErrorResponse = await response.json().catch(() => ({
      error: "UnknownError",
      detail: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    }));
    throw new ApiError(error.detail, error.code);
  }
  return response.json();
}

export async function getTasks(userId: string): Promise<Task[]> {
  const response = await fetch(`${API_URL}/api/${userId}/tasks`, {
    credentials: "include",
  });

  const data = await handleResponse<{ tasks: Task[] }>(response);
  return data.tasks;
}

export async function getTask(userId: string, taskId: number): Promise<Task> {
  const response = await fetch(`${API_URL}/api/${userId}/tasks/${taskId}`, {
    credentials: "include",
  });

  return handleResponse<Task>(response);
}

export async function createTask(
  userId: string,
  data: TaskCreate
): Promise<Task> {
  const response = await fetch(`${API_URL}/api/${userId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse<Task>(response);
}

export async function updateTask(
  userId: string,
  taskId: number,
  data: TaskUpdate
): Promise<Task> {
  const response = await fetch(`${API_URL}/api/${userId}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return handleResponse<Task>(response);
}

export async function toggleTaskComplete(
  userId: string,
  taskId: number,
  completed: boolean
): Promise<Task> {
  const response = await fetch(
    `${API_URL}/api/${userId}/tasks/${taskId}/complete`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ completed }),
    }
  );

  return handleResponse<Task>(response);
}

export async function deleteTask(
  userId: string,
  taskId: number
): Promise<void> {
  const response = await fetch(`${API_URL}/api/${userId}/tasks/${taskId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json().catch(() => ({
      error: "UnknownError",
      detail: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    }));
    throw new ApiError(error.detail, error.code);
  }
}
