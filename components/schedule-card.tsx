"use client"

import { type FC } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, addDays, subDays } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface ScheduleCardProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export const ScheduleCard: FC<ScheduleCardProps> = ({ selectedDate, onDateChange }) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date)
    }
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  const goToPreviousDay = () => {
    onDateChange(subDays(selectedDate, 1))
  }

  const goToNextDay = () => {
    onDateChange(addDays(selectedDate, 1))
  }

  return (
    <Card className="w-full shadow-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Schedule
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={goToToday} className="h-8 w-8 rounded-full">
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex flex-col space-y-4">
          {/* Date navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={goToPreviousDay} className="h-10 w-10 rounded-lg">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous day</span>
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="rounded-lg px-3 font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button variant="outline" size="icon" onClick={goToNextDay} className="h-10 w-10 rounded-lg">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next day</span>
              </Button>
            </div>
          </div>

          {/* Current date display */}
          <h2 className="text-3xl font-bold mb-1">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h2>
        </div>
      </CardContent>
    </Card>
  )
}
