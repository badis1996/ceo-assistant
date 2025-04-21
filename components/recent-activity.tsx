import type React from "react"
import type { FC } from "react"
import { Calendar, CheckCircle2, FileText, MessageSquare, PieChart, Users } from "lucide-react"

interface Activity {
  id: string
  title: string
  description: string
  time: string
  icon: React.ElementType
  color: string
  bgColor: string
}

const activities: Activity[] = [
  {
    id: "1",
    title: "Task Completed",
    description: "You completed the quarterly review task.",
    time: "Just now",
    icon: CheckCircle2,
    color: "text-management-green",
    bgColor: "bg-green-100",
  },
  {
    id: "2",
    title: "Meeting Scheduled",
    description: "Board meeting scheduled for Friday at 2 PM.",
    time: "1 hour ago",
    icon: Calendar,
    color: "text-management-blue",
    bgColor: "bg-blue-100",
  },
  {
    id: "3",
    title: "Report Generated",
    description: "Q2 Financial Report is ready for review.",
    time: "2 hours ago",
    icon: FileText,
    color: "text-management-purple",
    bgColor: "bg-purple-100",
  },
  {
    id: "4",
    title: "Team Update",
    description: "Marketing team completed the campaign planning.",
    time: "Yesterday",
    icon: Users,
    color: "text-management-teal",
    bgColor: "bg-teal-100",
  },
  {
    id: "5",
    title: "AI Insight",
    description: "New market trend analysis is available.",
    time: "Yesterday",
    icon: PieChart,
    color: "text-management-amber",
    bgColor: "bg-amber-100",
  },
  {
    id: "6",
    title: "Message",
    description: "New message from VP of Sales regarding Q3 targets.",
    time: "2 days ago",
    icon: MessageSquare,
    color: "text-management-blue",
    bgColor: "bg-blue-100",
  },
]

export const RecentActivity: FC = () => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activity.icon
        return (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`rounded-full ${activity.bgColor} p-2`}>
              <Icon className={`h-4 w-4 ${activity.color}`} />
            </div>
            <div>
              <h4 className={`font-medium ${activity.color}`}>{activity.title}</h4>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
