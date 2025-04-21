"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WeeklyGoal {
  id: string
  title: string
  date: string // ISO date string
  completed: boolean
}

interface WeeklyGoalStore {
  goals: WeeklyGoal[]
  addGoal: (goal: Omit<WeeklyGoal, "id" | "completed">) => void
  updateGoal: (id: string, updates: Partial<WeeklyGoal>) => void
  deleteGoal: (id: string) => void
  toggleGoalCompletion: (id: string) => void
}

export const useWeeklyGoalStore = create<WeeklyGoalStore>()(
  persist(
    (set) => ({
      goals: [
        // Initial sample goal
        {
          id: "1",
          title: "Finalize Q3 Strategy",
          date: new Date().toISOString(),
          completed: false,
        },
      ],

      addGoal: (goal) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...goal,
              id: crypto.randomUUID(),
              completed: false,
            },
          ],
        })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),

      toggleGoalCompletion: (id) =>
        set((state) => ({
          goals: state.goals.map((goal) => (goal.id === id ? { ...goal, completed: !goal.completed } : goal)),
        })),
    }),
    {
      name: "ceo-weekly-goals-storage",
    },
  ),
)
