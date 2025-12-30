"use client";

import type { Task } from "@/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onToggleComplete: (taskId: number, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

function TaskSkeleton() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-6 h-6 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="flex gap-2">
          <div className="w-9 h-9 bg-gray-200 rounded-lg" />
          <div className="w-9 h-9 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function TaskList({
  tasks,
  isLoading,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-600 mb-6">
          Create your first task to get started on your productivity journey!
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Click the</span>
          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium">
            Add Task
          </span>
          <span>button above</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
