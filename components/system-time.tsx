"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"

export function SystemTime() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">System Time</div>
      <div className="system-time">{format(time, "HH:mm:ss")}</div>
      <div className="system-date mt-1">{format(time, "MMM d, yyyy")}</div>
    </div>
  )
}
