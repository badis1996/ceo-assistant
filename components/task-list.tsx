"use client"

import { type FC, useState } from "react"
import { Clock, Edit, Calendar, Trash2, FileText } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { format, isSameDay, parseISO } from "date-fns"
import { useTaskStore } from "@/lib/task-store"
import { Button } from "@/components/ui/button"
import { RescheduleTaskDialog } from "@/components/reschedule-task-dialog"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TaskListProps {
  category: "product" | "sales" | "marketing"
  selectedDate: Date
  limit?: number
}

export const TaskList: FC<TaskListProps> = ({ category, selectedDate, limit }) => {
  // Get tasks and functions from the store
  const { tasks, toggleTaskCompletion, deleteTask } = useTaskStore()

  // State for the dialogs
  const [rescheduleTask, setRescheduleTask] = useState<string | null>(null)
  const [editTask, setEditTask] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isCompletingTask, setIsCompletingTask] = useState<string | null>(null)

  // Filter tasks for the selected date and category
  const filteredTasks = tasks
    .filter((task) => task.category === category && isSameDay(parseISO(task.date), selectedDate))
    .slice(0, limit || tasks.length)

  if (filteredTasks.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border border-border bg-secondary/20 p-4 text-center text-muted-foreground">
        No tasks scheduled for this day
      </div>
    )
  }

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "product":
        return "border-blue-200 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10"
      case "sales":
        return "border-purple-200 bg-purple-50 dark:border-purple-500/30 dark:bg-purple-500/10"
      case "marketing":
        return "border-indigo-200 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10"
      default:
        return ""
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-600 hover:bg-red-200 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 dark:border-red-500/30">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-200 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30 dark:border-amber-500/30">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge className="bg-green-100 text-green-600 hover:bg-green-200 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30 dark:border-green-500/30">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  const handleDeleteTask = async (id: string) => {
    setIsDeleting(id)
    try {
      await deleteTask(id)
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleTaskCompletion = async (id: string) => {
    setIsCompletingTask(id)
    try {
      await toggleTaskCompletion(id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCompletingTask(null)
    }
  }

  const categoryColor = getCategoryColor(category)

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className={`task-item ${
            task.completed
              ? "border-green-200 bg-green-50 dark:border-green-500/30 dark:bg-green-500/10"
              : categoryColor
          }`}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              id={task.id}
              checked={task.completed}
              onCheckedChange={() => handleToggleTaskCompletion(task.id)}
              disabled={isCompletingTask === task.id}
              className={task.completed ? "border-green-500 text-green-500 mt-1" : "mt-1"}
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <label
                  htmlFor={task.id}
                  className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </label>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                    onClick={() => setEditTask(task.id)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                    onClick={() => setRescheduleTask(task.id)}
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="sr-only">Reschedule</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={isDeleting === task.id}
                  >
                    {isDeleting === task.id ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
              {task.description && <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>}
              <div className="mt-1 flex items-center gap-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {format(parseISO(task.date), "MMM d")}
                </div>
                <div>{getPriorityBadge(task.priority)}</div>
                {task.notes && task.notes.trim() !== "" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                          <FileText className="h-3 w-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Has notes & lessons learned</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dialogs */}
      {rescheduleTask && (
        <RescheduleTaskDialog
          taskId={rescheduleTask}
          isOpen={!!rescheduleTask}
          onClose={() => setRescheduleTask(null)}
        />
      )}
      {editTask && <EditTaskDialog taskId={editTask} isOpen={!!editTask} onClose={() => setEditTask(null)} />}
    </div>
  )
}
