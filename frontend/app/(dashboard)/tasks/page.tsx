"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Task, TaskCreate, TaskUpdate } from "@/types";

export default function TasksPage() {
  const { user } = useAuth();
  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
  } = useTasks(user?.id || null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: TaskCreate | TaskUpdate) => {
    if (editingTask) {
      await updateTask(editingTask.id, data as TaskUpdate);
    } else {
      await createTask(data as TaskCreate);
    }
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    try {
      await toggleComplete(taskId, completed);
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const handleDeleteClick = (taskId: number) => {
    setDeletingTaskId(taskId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;

    setIsDeleting(true);
    try {
      await deleteTask(deletingTaskId);
      setDeletingTaskId(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeletingTaskId(null);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="mt-1 text-gray-600">
            {totalCount === 0 ? (
              "No tasks yet. Create your first one!"
            ) : (
              <>
                <span className="font-medium text-indigo-600">{completedCount}</span> of{" "}
                <span className="font-medium">{totalCount}</span> tasks completed
              </>
            )}
          </p>
        </div>
        <button onClick={handleOpenForm} className="btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-indigo-600">
              {Math.round((completedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Task List */}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        task={editingTask}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTaskId}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}
