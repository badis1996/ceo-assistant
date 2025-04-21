import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <div className={`stats-card cursor-pointer transition-all hover:shadow-md ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="stats-card-label">{title}</p>
          <p className="stats-card-value">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-xs font-medium ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
          <span className="ml-1.5 text-xs text-muted-foreground">from last week</span>
        </div>
      )}
    </div>
  )
}
