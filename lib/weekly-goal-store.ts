"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as API from './api'
import { useEffect } from "react"

export interface WeeklyGoal {
  id: string
  _id?: string // MongoDB ID
  title: string
  date: string // ISO date string
  completed: boolean
}

// Helper to normalize API response to our store format
const normalizeGoal = (goal: any): WeeklyGoal => ({
  id: goal._id || goal.id,
  _id: goal._id,
  title: goal.title,
  date: goal.date instanceof Date ? goal.date.toISOString() : goal.date,
  completed: Boolean(goal.completed),
})

interface WeeklyGoalStore {
  goals: WeeklyGoal[]
  loading: boolean
  error: string | null
  fetchGoals: () => Promise<void>
  addGoal: (goal: Omit<WeeklyGoal, "id" | "completed">) => Promise<void>
  updateGoal: (id: string, updates: Partial<WeeklyGoal>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
  toggleGoalCompletion: (id: string) => Promise<void>
}

export const useWeeklyGoalStore = create<WeeklyGoalStore>()(
  persist(
    (set, get) => ({
      goals: [],
      loading: false,
      error: null,

      fetchGoals: async () => {
        set({ loading: true, error: null })
        try {
          const goalsData = await API.fetchWeeklyGoals()
          set({ goals: goalsData.map(normalizeGoal), loading: false })
        } catch (error) {
          console.error("Failed to fetch weekly goals:", error)
          set({ error: "Failed to load goals", loading: false })
        }
      },

      addGoal: async (goal) => {
        set({ loading: true, error: null })
        try {
          const newGoal = await API.createWeeklyGoal(goal)
          set((state) => ({
            goals: [...state.goals, normalizeGoal(newGoal)],
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to add weekly goal:", error)
          set({ error: "Failed to create goal", loading: false })
        }
      },

      updateGoal: async (id, updates) => {
        set({ loading: true, error: null })
        try {
          const goal = get().goals.find(g => g.id === id)
          if (!goal) throw new Error("Goal not found")
          
          const mongoId = goal._id || id
          const updatedGoal = await API.updateWeeklyGoal(mongoId, updates)
          
          set((state) => ({
            goals: state.goals.map((g) => 
              g.id === id ? normalizeGoal(updatedGoal) : g
            ),
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to update weekly goal:", error)
          set({ error: "Failed to update goal", loading: false })
        }
      },

      deleteGoal: async (id) => {
        set({ loading: true, error: null })
        try {
          const goal = get().goals.find(g => g.id === id)
          if (!goal) throw new Error("Goal not found")
          
          const mongoId = goal._id || id
          await API.deleteWeeklyGoal(mongoId)
          
          set((state) => ({
            goals: state.goals.filter((g) => g.id !== id),
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to delete weekly goal:", error)
          set({ error: "Failed to delete goal", loading: false })
        }
      },

      toggleGoalCompletion: async (id) => {
        set({ loading: true, error: null })
        try {
          const goal = get().goals.find(g => g.id === id)
          if (!goal) throw new Error("Goal not found")
          
          const mongoId = goal._id || id
          const updatedGoal = await API.toggleWeeklyGoalCompletion(mongoId)
          
          set((state) => ({
            goals: state.goals.map((g) => 
              g.id === id ? normalizeGoal(updatedGoal) : g
            ),
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to toggle goal completion:", error)
          set({ error: "Failed to update goal", loading: false })
        }
      },
    }),
    {
      name: "ceo-weekly-goals-storage",
    },
  ),
)

// Custom hook to fetch goals on component mount
export function useFetchWeeklyGoals() {
  const fetchGoals = useWeeklyGoalStore((state) => state.fetchGoals)
  
  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])
}
