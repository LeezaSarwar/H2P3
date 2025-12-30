"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/lib/theme";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const themeOptions = [
    {
      value: "light" as const,
      label: "Light",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      value: "dark" as const,
      label: "Dark",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
    },
    {
      value: "system" as const,
      label: "System",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Appearance</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Customize how TaskFlow looks on your device
        </p>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
          <div className="grid grid-cols-3 gap-4">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  theme === option.value
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-3 ${
                  theme === option.value
                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}>
                  {option.icon}
                </div>
                <p className={`text-sm font-medium text-center ${
                  theme === option.value
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}>
                  {option.label}
                </p>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Current: {resolvedTheme === "dark" ? "Dark mode" : "Light mode"}
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notifications</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Manage how you receive notifications
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive push notifications for task reminders
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Email Updates</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive weekly summary of your tasks
              </p>
            </div>
            <button
              onClick={() => setEmailUpdates(!emailUpdates)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emailUpdates ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailUpdates ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Account</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Manage your account settings
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
            <label className="text-sm text-gray-500 dark:text-gray-400">Email Address</label>
            <p className="mt-1 font-medium text-gray-900 dark:text-white">{user?.email}</p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
            <label className="text-sm text-gray-500 dark:text-gray-400">Password</label>
            <p className="mt-1 font-medium text-gray-900 dark:text-white">••••••••</p>
            <button className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              Change password
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-red-200 dark:border-red-900">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Irreversible and destructive actions
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Delete All Tasks</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permanently delete all your tasks
              </p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              Delete All
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Delete Account</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permanently delete your account and all data
              </p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
