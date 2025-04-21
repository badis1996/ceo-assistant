"use client"

import { useState } from "react"
import { format, addDays, subDays, parseISO } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useLinkedInPostStore } from "@/lib/linkedin-post-store"
import { toast } from "@/components/ui/use-toast"

interface PostDatePickerProps {
  postId: string
  date: string // ISO date string
}

export function PostDatePicker({ postId, date }: PostDatePickerProps) {
  const { updatePost } = useLinkedInPostStore()
  const [isOpen, setIsOpen] = useState(false)

  const parsedDate = parseISO(date)

  const handlePreviousDay = () => {
    const newDate = subDays(parsedDate, 1)
    updatePost(postId, { date: newDate.toISOString() })
    toast({
      title: "Date updated",
      description: `Post rescheduled to ${format(newDate, "MMMM d, yyyy")}`,
      duration: 2000,
    })
  }

  const handleNextDay = () => {
    const newDate = addDays(parsedDate, 1)
    updatePost(postId, { date: newDate.toISOString() })
    toast({
      title: "Date updated",
      description: `Post rescheduled to ${format(newDate, "MMMM d, yyyy")}`,
      duration: 2000,
    })
  }

  const handleSelectDate = (newDate: Date | undefined) => {
    if (newDate) {
      updatePost(postId, { date: newDate.toISOString() })
      toast({
        title: "Date updated",
        description: `Post rescheduled to ${format(newDate, "MMMM d, yyyy")}`,
        duration: 2000,
      })
      setIsOpen(false)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0" onClick={handlePreviousDay}>
        <ChevronLeft className="h-3 w-3" />
        <span className="sr-only">Previous day</span>
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex h-auto items-center gap-1 rounded-md px-1 py-0 text-xs font-normal text-muted-foreground hover:bg-muted",
            )}
          >
            <CalendarIcon className="h-3 w-3" />
            {format(parsedDate, "MMM d, yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={parsedDate} onSelect={handleSelectDate} initialFocus />
        </PopoverContent>
      </Popover>

      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0" onClick={handleNextDay}>
        <ChevronRight className="h-3 w-3" />
        <span className="sr-only">Next day</span>
      </Button>
    </div>
  )
}
