import type { FC, HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { DashboardNav } from "@/components/dashboard-nav"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardShellProps extends HTMLAttributes<HTMLDivElement> {}

export const DashboardShell: FC<DashboardShellProps> = ({ children, className, ...props }) => {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Fixed sidebar */}
      <div className="fixed left-0 top-0 z-20 hidden h-screen w-[220px] border-r border-border bg-sidebar-background/80 backdrop-blur-sm md:block">
        <DashboardNav />
      </div>

      {/* Main content area */}
      <div className="flex-1 w-full md:pl-[220px]">
        {/* Theme toggle in top right corner */}
        <div className="fixed right-4 top-4 z-30">
          <ThemeToggle />
        </div>

        <main className={cn("h-full w-full", className)} {...props}>
          <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 pt-12">{children}</div>
        </main>
      </div>
    </div>
  )
}
