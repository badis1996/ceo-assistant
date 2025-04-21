"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Task {
  id: string
  title: string
  description: string
  date: string // ISO date string
  category: "product" | "sales" | "marketing"
  priority: "low" | "medium" | "high"
  completed: boolean
  notes: string // New field for notes and lessons learned
}

interface TaskStore {
  tasks: Task[]
  addTask: (task: Omit<Task, "id" | "completed" | "notes">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
  updateTaskNotes: (id: string, notes: string) => void // New function specifically for notes
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [
        // Sample initial tasks
        {
          id: "1",
          title: "Review new feature specifications",
          description: "Review and approve the specifications for the upcoming feature release.",
          date: new Date().toISOString(),
          category: "product",
          priority: "high",
          completed: false,
          notes: "Make sure to check compatibility with existing systems.",
        },
        {
          id: "2",
          title: "Enterprise client proposal",
          description: "Finalize the proposal for the enterprise client.",
          date: new Date().toISOString(),
          category: "sales",
          priority: "high",
          completed: false,
          notes: "Include case studies from similar clients.",
        },
        {
          id: "3",
          title: "Content calendar approval",
          description: "Review and approve the content calendar for the next month.",
          date: new Date().toISOString(),
          category: "marketing",
          priority: "medium",
          completed: false,
          notes: "Align with product launch dates.",
        },
      ],

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: crypto.randomUUID(),
              completed: false,
              notes: "",
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      toggleTaskCompletion: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
        })),

      updateTaskNotes: (id, notes) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, notes } : task)),
        })),
    }),
    {
      name: "ceo-tasks-storage",
    },
  ),
)
