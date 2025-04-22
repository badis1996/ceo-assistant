"use client"

import { useState, type FC } from "react"
import { CheckCircle2, Circle, Pencil, Trash2, Plus } from "lucide-react"
import { isSameDay, parseISO, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useDailyGoalStore } from "@/lib/daily-goal-store"
import type { DailyGoal as DailyGoalType } from "@/lib/daily-goal-store"

interface DailyGoalsProps {
  selectedDate: Date
}

export const DailyGoals: FC<DailyGoalsProps> = ({ selectedDate }) => {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingGoal, setEditingGoal] = useState<DailyGoalType | null>(null)
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use the zustand store with API integration
  const { goals, addGoal, updateGoal, deleteGoal, toggleGoalCompletion } = useDailyGoalStore()

  // Filter goals for the selected date
  const filteredGoals = goals.filter((goal) => isSameDay(parseISO(goal.date), selectedDate))

  const handleAddGoal = async () => {
    if (newGoalTitle.trim()) {
      setIsSubmitting(true)
      try {
        await addGoal({
          title: newGoalTitle.trim(),
          date: selectedDate.toISOString(),
        })
        setNewGoalTitle("")
        setShowAddDialog(false)
        toast({
          title: "Goal added",
          description: `New goal "${newGoalTitle.trim()}" added for ${format(selectedDate, 'MMMM d, yyyy')}`,
        })
      } catch (error) {
        toast({
          title: "Failed to add goal",
          description: "There was an error adding your goal. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleEditGoal = async () => {
    if (editingGoal && newGoalTitle.trim()) {
      setIsSubmitting(true)
      try {
        await updateGoal(editingGoal.id, { title: newGoalTitle.trim() })
        setShowEditDialog(false)
        setEditingGoal(null)
        setNewGoalTitle("")
        toast({
          title: "Goal updated",
          description: "Your goal has been updated successfully",
        })
      } catch (error) {
        toast({
          title: "Failed to update goal",
          description: "There was an error updating your goal. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleDeleteGoal = async (id: string, title: string) => {
    try {
      await deleteGoal(id)
      toast({
        title: "Goal deleted",
        description: `Goal "${title}" has been deleted`,
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Failed to delete goal",
        description: "There was an error deleting your goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleCompletion = async (id: string) => {
    try {
      await toggleGoalCompletion(id)
    } catch (error) {
      toast({
        title: "Failed to update goal",
        description: "There was an error updating your goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (goal: DailyGoalType) => {
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
                onClick={() => handleToggleCompletion(goal.id)}
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
            <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleAddGoal} disabled={isSubmitting || !newGoalTitle.trim()}>
              {isSubmitting ? "Adding..." : "Add Goal"}
            </Button>
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
            <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleEditGoal} disabled={isSubmitting || !newGoalTitle.trim()}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
