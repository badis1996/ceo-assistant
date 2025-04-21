"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTaskStore } from "@/lib/task-store"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"

interface RescheduleTaskDialogProps {
  taskId: string
  isOpen: boolean
  onClose: () => void
}

export function RescheduleTaskDialog({ taskId, isOpen, onClose }: RescheduleTaskDialogProps) {
  const { tasks, updateTask } = useTaskStore()
  const task = tasks.find((t) => t.id === taskId)

  const [date, setDate] = useState<Date>(task ? new Date(task.date) : new Date())

  if (!task) return null

  const handleReschedule = () => {
    updateTask(taskId, { date: date.toISOString() })

    toast({
      title: "Task rescheduled",
      description: "Your task has been rescheduled successfully.",
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reschedule Task</DialogTitle>
          <DialogDescription>Choose a new date for "{task.title}"</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleReschedule}>Reschedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
