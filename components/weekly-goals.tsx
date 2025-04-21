"use client"

import { useState, type FC } from "react"
import { CheckCircle2, Circle, Trash2, Plus } from "lucide-react"
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from "date-fns"
import { useWeeklyGoalStore } from "@/lib/weekly-goal-store"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateWeeklyGoalForm } from "@/components/create-weekly-goal-form"

interface WeeklyGoalsProps {
  selectedDate: Date
}

export const WeeklyGoals: FC<WeeklyGoalsProps> = ({ selectedDate }) => {
  const { goals, toggleGoalCompletion, deleteGoal } = useWeeklyGoalStore()
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)

  // Get the start and end of the week for the selected date
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }) // Week starts on Monday
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })

  // Filter goals for the selected week
  const filteredGoals = goals.filter((goal) => {
    const goalDate = parseISO(goal.date)
    return (
      isWithinInterval(goalDate, { start: weekStart, end: weekEnd }) ||
      isWithinInterval(selectedDate, {
        start: startOfWeek(goalDate, { weekStartsOn: 1 }),
        end: endOfWeek(goalDate, { weekStartsOn: 1 }),
      })
    )
  })

  const handleDeleteGoal = (id: string) => {
    deleteGoal(id)
    toast({
      title: "Goal deleted",
      description: "The weekly goal has been deleted successfully.",
    })
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6"
          onClick={() => setIsAddGoalOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Goal
        </Button>
      </div>

      {filteredGoals.length === 0 ? (
        <div className="flex h-24 items-center justify-center rounded-lg border border-border bg-secondary/10 dark:bg-secondary/20 p-4 text-center text-muted-foreground">
          No weekly goals for this week
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => toggleGoalCompletion(goal.id)}>
                {goal.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" />
                )}
                <span className={`${goal.completed ? "line-through text-muted-foreground" : "font-medium"} text-base`}>
                  {goal.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-400/80 dark:hover:bg-red-400/10"
                onClick={() => handleDeleteGoal(goal.id)}
              >
                <Trash2 className="h-5 w-5" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add Goal Dialog */}
      <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Weekly Goal</DialogTitle>
          </DialogHeader>
          <CreateWeeklyGoalForm onSuccess={() => setIsAddGoalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
