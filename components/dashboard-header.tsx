import type React from "react"
import type { FC, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  heading: string
  text?: string
  children?: React.ReactNode
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({ heading, text, children, className, ...props }) => {
  return (
    <div className={cn("flex flex-col gap-2 pb-5", className)} {...props}>
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="grid gap-1">
          <h1 className="font-heading text-3xl font-bold tracking-tight">{heading}</h1>
          {text && <p className="text-muted-foreground">{text}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
