"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as API from "./api"
import { useEffect } from "react"

export interface Task {
  id: string
  _id?: string  // MongoDB ObjectId
  title: string
  description?: string
  date: string // ISO date string
  category: "product" | "sales" | "marketing"
  priority: "low" | "medium" | "high"
  completed: boolean
  notes: string
}

interface TaskStore {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  addTask: (task: Omit<Task, "id" | "completed" | "notes">) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskCompletion: (id: string) => Promise<void>
  updateTaskNotes: (id: string, notes: string) => Promise<void>
}

// Helper function to normalize task data from API
const normalizeTask = (task: any): Task => ({
  id: task._id || task.id,
  _id: task._id,
  title: task.title,
  description: task.description || "",
  date: task.date,
  category: task.category,
  priority: task.priority,
  completed: task.completed || false,
  notes: task.notes || "",
})

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,
      error: null,

      fetchTasks: async () => {
        set({ loading: true, error: null })
        try {
          const tasksData = await API.fetchTasks()
          set({ tasks: tasksData.map(normalizeTask), loading: false })
        } catch (error) {
          console.error("Failed to fetch tasks:", error)
          set({ error: "Failed to load tasks", loading: false })
        }
      },

      addTask: async (task) => {
        set({ loading: true, error: null })
        try {
          const newTask = await API.createTask(task)
          set((state) => ({
            tasks: [...state.tasks, normalizeTask(newTask)],
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to add task:", error)
          set({ error: "Failed to create task", loading: false })
        }
      },

      updateTask: async (id, updates) => {
        set({ loading: true, error: null })
        try {
          const task = get().tasks.find(t => t.id === id)
          if (!task) throw new Error("Task not found")
          
          const mongoId = task._id || id
          const updatedTask = await API.updateTask(mongoId, updates)
          
          set((state) => ({
            tasks: state.tasks.map((t) => 
              t.id === id ? normalizeTask(updatedTask) : t
            ),
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to update task:", error)
          set({ error: "Failed to update task", loading: false })
        }
      },

      deleteTask: async (id) => {
        set({ loading: true, error: null })
        try {
          const task = get().tasks.find(t => t.id === id)
          if (!task) throw new Error("Task not found")
          
          const mongoId = task._id || id
          await API.deleteTask(mongoId)
          
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to delete task:", error)
          set({ error: "Failed to delete task", loading: false })
        }
      },

      toggleTaskCompletion: async (id) => {
        set({ loading: true, error: null })
        try {
          const task = get().tasks.find(t => t.id === id)
          if (!task) throw new Error("Task not found")
          
          const mongoId = task._id || id
          await API.toggleTaskCompletion(mongoId)
          
          set((state) => ({
            tasks: state.tasks.map((t) => 
              t.id === id ? { ...t, completed: !t.completed } : t
            ),
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to toggle task completion:", error)
          set({ error: "Failed to update task", loading: false })
        }
      },

      updateTaskNotes: async (id, notes) => {
        set({ loading: true, error: null })
        try {
          const task = get().tasks.find(t => t.id === id)
          if (!task) throw new Error("Task not found")
          
          const mongoId = task._id || id
          const updatedTask = await API.updateTask(mongoId, { notes })
          
          set((state) => ({
            tasks: state.tasks.map((t) => 
              t.id === id ? { ...t, notes } : t
            ),
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to update task notes:", error)
          set({ error: "Failed to update task notes", loading: false })
        }
      },
    }),
    {
      name: "ceo-tasks-storage",
    }
  )
)

// Custom hook to fetch tasks on component mount
export function useFetchTasks() {
  const fetchTasks = useTaskStore((state) => state.fetchTasks)
  
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])
}
