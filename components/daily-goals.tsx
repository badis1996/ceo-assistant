"use client"

import { useState, type FC } from "react"
import { CheckCircle2, Circle, Pencil, Trash2, Plus } from "lucide-react"
import { isSameDay, parseISO, format } from "date-fns"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface Goal {
  id: string
  title: string
  date: string // ISO date string
  completed: boolean
}

interface DailyGoalsProps {
  selectedDate: Date
}

// Create a persistent store for daily goals
interface DailyGoalStore {
  goals: Goal[]
  addGoal: (goal: Omit<Goal, "id" | "completed">) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  toggleGoalCompletion: (id: string) => void
}

export const useDailyGoalStore = create<DailyGoalStore>()(
  persist(
    (set) => ({
      goals: [
        // Sample initial goals
    {
      id: "1",
      title: "Morning team standup",
          date: new Date().toISOString(),
      completed: true,
    },
    {
      id: "2",
      title: "Review quarterly financial report",
          date: new Date().toISOString(),
      completed: false,
    },
    {
      id: "3",
      title: "Lunch with potential investor",
          date: new Date().toISOString(),
      completed: false,
    },
    {
      id: "4",
      title: "Approve marketing campaign",
          date: new Date().toISOString(),
      completed: false,
    },
    {
      id: "5",
      title: "Prepare for tomorrow's board meeting",
          date: new Date().toISOString(),
      completed: false,
        }
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
      name: "ceo-daily-goals-storage",
    },
  ),
)

export const DailyGoals: FC<DailyGoalsProps> = ({ selectedDate }) => {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [newGoalTitle, setNewGoalTitle] = useState("")

  // Use the zustand store
  const { goals, addGoal, updateGoal, deleteGoal, toggleGoalCompletion } = useDailyGoalStore()

  // Filter goals for the selected date
  const filteredGoals = goals.filter((goal) => isSameDay(parseISO(goal.date), selectedDate))

  const handleAddGoal = () => {
    if (newGoalTitle.trim()) {
      addGoal({
        title: newGoalTitle.trim(),
        date: selectedDate.toISOString(),
      })
      setNewGoalTitle("")
      setShowAddDialog(false)
      toast({
        title: "Goal added",
        description: `New goal "${newGoalTitle.trim()}" added for ${format(selectedDate, 'MMMM d, yyyy')}`,
      })
    }
  }

  const handleEditGoal = () => {
    if (editingGoal && newGoalTitle.trim()) {
      updateGoal(editingGoal.id, { title: newGoalTitle.trim() })
      setShowEditDialog(false)
      setEditingGoal(null)
      setNewGoalTitle("")
      toast({
        title: "Goal updated",
        description: "Your goal has been updated successfully",
      })
    }
  }

  const handleDeleteGoal = (id: string, title: string) => {
    deleteGoal(id)
    toast({
      title: "Goal deleted",
      description: `Goal "${title}" has been deleted`,
      variant: "destructive",
    })
  }

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal)
    setNewGoalTitle(goal.title)
    setShowEditDialog(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {filteredGoals.length} {filteredGoals.length === 1 ? "Goal" : "Goals"} for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowAddDialog(true)}
          className="h-8"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Goal
        </Button>
      </div>

      {filteredGoals.length === 0 ? (
        <div className="flex h-24 items-center justify-center rounded-lg border border-dashed p-4 text-center text-muted-foreground">
          No goals scheduled for this day
        </div>
      ) : (
    <div className="space-y-3">
      {filteredGoals.map((goal) => (
        <div
          key={goal.id}
              className="group flex items-center justify-between p-2 rounded-md hover:bg-secondary/20"
            >
              <div 
                className="flex items-center space-x-3 cursor-pointer flex-1"
          onClick={() => toggleGoalCompletion(goal.id)}
        >
          {goal.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
          ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          )}
          <span className={`${goal.completed ? "line-through text-muted-foreground" : "font-medium"} text-base`}>
            {goal.title}
          </span>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(goal)}>
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteGoal(goal.id, goal.title)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
        </div>
      ))}
        </div>
      )}

      {/* Add Goal Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="Enter goal title..."
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddGoal}>Add Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Goal Title</Label>
              <Input
                id="edit-title"
                placeholder="Enter goal title..."
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditGoal}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
