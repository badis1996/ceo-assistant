"use client"

import { format, addDays, subDays } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/date-picker"

interface DateNavigationProps {
  date: Date
  setDate: (date: Date) => void
}

export function DateNavigation({ date, setDate }: DateNavigationProps) {
  const goToPreviousDay = () => {
    setDate(subDays(date, 1))
  }

  const goToNextDay = () => {
    setDate(addDays(date, 1))
  }

  const goToToday = () => {
    setDate(new Date())
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={goToPreviousDay}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous day</span>
        </Button>
        <Button variant="outline" size="sm" onClick={goToToday}>
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={goToNextDay}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next day</span>
        </Button>
      </div>
      <div className="text-xl font-semibold">{format(date, "EEEE, MMMM d, yyyy")}</div>
      <DatePicker date={date} setDate={setDate} />
    </div>
  )
}
