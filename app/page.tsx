"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { WeeklyGoals } from "@/components/weekly-goals"
import { TaskList } from "@/components/task-list"
import { DailyGoals } from "@/components/daily-goals"
import { ScheduleCard } from "@/components/schedule-card"
import { LinkedInPosts } from "@/components/linkedin-posts"
import { SystemTime } from "@/components/system-time"
import { StatsCard } from "@/components/stats-card"
import Link from "next/link"
import { Calendar, CheckCircle, Users, Linkedin, ListTodo } from "lucide-react"
import { useTaskStore, useFetchTasks } from "@/lib/task-store"
import { useLinkedInPostStore, useFetchLinkedInPosts } from "@/lib/linkedin-post-store"
import { useWeeklyGoalStore, useFetchWeeklyGoals } from "@/lib/weekly-goal-store"
import { useDailyGoalStore, useFetchDailyGoals } from "@/lib/daily-goal-store"

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [taskCount, setTaskCount] = useState<number>(0)
  const [meetingCount, setMeetingCount] = useState<number>(0)
  const [postCount, setPostCount] = useState<number>(0)
  const [goalCount, setGoalCount] = useState<number>(0)
  
  // Fetch data from API
  useFetchTasks()
  useFetchLinkedInPosts()
  useFetchWeeklyGoals()
  useFetchDailyGoals()
  
  const tasks = useTaskStore(state => state.tasks)
  const tasksLoading = useTaskStore(state => state.loading)
  const posts = useLinkedInPostStore(state => state.posts)
  const postsLoading = useLinkedInPostStore(state => state.loading)
  const goals = useWeeklyGoalStore(state => state.goals)
  const goalsLoading = useWeeklyGoalStore(state => state.loading)
  const dailyGoals = useDailyGoalStore(state => state.goals)
  const dailyGoalsLoading = useDailyGoalStore(state => state.loading)
  
  const isLoading = tasksLoading || postsLoading || goalsLoading || dailyGoalsLoading

  // Handle date changes from the schedule card
  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }
  
  useEffect(() => {
    // Count tasks for today
    const today = new Date().toISOString().split('T')[0]
    const todaysTasks = tasks.filter(task => 
      task.date.split('T')[0] === today && !task.completed
    )
    setTaskCount(todaysTasks.length)
    
    // Count meetings (assuming tasks with category="sales" are meetings for this example)
    const meetings = tasks.filter(task => 
      task.category === "sales" && !task.completed
    )
    setMeetingCount(meetings.length)
    
    // Count LinkedIn posts
    setPostCount(posts.length)
    
    // Count weekly goals
    setGoalCount(goals.length)
  }, [tasks, posts, goals])

  return (
    <DashboardShell>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <DashboardHeader heading="System Overview" text="Your AI assistant dashboard with real-time metrics" />
        <div className="tech-card p-3 sm:p-4 mt-4 md:mt-0 w-full md:w-auto">
          <SystemTime />
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center p-8 mb-6 bg-background border border-border rounded-lg">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="dashboard-section mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link href="#tasks-section" className="block">
            <StatsCard title="Tasks Today" value={taskCount} icon={ListTodo} trend={{ value: 8, isPositive: true }} />
          </Link>
          <Link href="#schedule-section" className="block">
            <StatsCard title="Meetings" value={meetingCount} icon={Calendar} trend={{ value: 2, isPositive: true }} />
          </Link>
          <Link href="#linkedin-section" className="block">
            <StatsCard title="LinkedIn Posts" value={postCount} icon={Linkedin} trend={{ value: 12, isPositive: true }} />
          </Link>
          <Link href="#goals-section" className="block">
            <StatsCard title="Weekly Goals" value={goalCount} icon={CheckCircle} trend={{ value: 4, isPositive: false }} />
          </Link>
        </div>
      </div>

      {/* Weekly & Daily Goals */}
      <div className="dashboard-section mb-6" id="goals-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="tech-card">
            <div className="tech-card-header">
              <h3 className="text-sm font-medium flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                Weekly Goals
              </h3>
              <span className="text-xs text-muted-foreground">
                Week {new Date().getWeek()} of {new Date().getFullYear()}
              </span>
            </div>
            <div className="tech-card-content">
              <WeeklyGoals selectedDate={selectedDate} />
            </div>
          </div>

          <div className="tech-card">
            <div className="tech-card-header">
              <h3 className="text-sm font-medium flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                Daily Goals
              </h3>
              <span className="text-xs text-muted-foreground">
                {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
              </span>
            </div>
            <div className="tech-card-content">
              <DailyGoals selectedDate={selectedDate} />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="dashboard-section mb-6" id="schedule-section">
        <ScheduleCard selectedDate={selectedDate} onDateChange={handleDateChange} />
      </div>

      {/* Tasks */}
      <div className="dashboard-section mb-6" id="tasks-section">
        <div className="tech-card">
          <div className="tech-card-header">
            <h3 className="text-sm font-medium flex items-center">
              <Users className="mr-2 h-4 w-4 text-primary" />
              Team Tasks
            </h3>
          </div>
          <div className="tech-card-content space-y-6">
            <div>
              <h4 className="text-sm font-medium text-primary mb-3">Product</h4>
              <TaskList category="product" selectedDate={selectedDate} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-primary mb-3">Sales</h4>
              <TaskList category="sales" selectedDate={selectedDate} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-primary mb-3">Marketing</h4>
              <TaskList category="marketing" selectedDate={selectedDate} />
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn Posts */}
      <div className="dashboard-section mb-6" id="linkedin-section">
        <div className="tech-card">
          <div className="tech-card-header">
            <h3 className="text-sm font-medium flex items-center">
              <Linkedin className="mr-2 h-4 w-4 text-primary" />
              LinkedIn Posts
            </h3>
          </div>
          <div className="tech-card-content">
            <LinkedInPosts limit={5} />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

// Add getWeek method to Date prototype
declare global {
  interface Date {
    getWeek(): number
  }
}

Date.prototype.getWeek = function (): number {
  const date = new Date(this.getTime())
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  const week1 = new Date(date.getFullYear(), 0, 4)
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
}
