"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TasksTable } from "@/components/tasks-table"
import { CreateTaskForm } from "@/components/create-task-form"
import { useTaskStore } from "@/lib/task-store"

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("all")
  const { tasks } = useTaskStore()

  const filteredTasks = activeTab === "all" ? tasks : tasks.filter((task) => task.category === activeTab)

  return (
    <DashboardShell>
      <DashboardHeader heading="Tasks Management" text="Create, view, and manage your tasks across all categories." />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1 md:sticky md:top-6 md:self-start">
          <CreateTaskForm />
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="w-full sticky top-0 z-10 bg-background">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <TasksTable tasks={filteredTasks} />
            </TabsContent>
            <TabsContent value="product" className="mt-4">
              <TasksTable tasks={filteredTasks} />
            </TabsContent>
            <TabsContent value="sales" className="mt-4">
              <TasksTable tasks={filteredTasks} />
            </TabsContent>
            <TabsContent value="marketing" className="mt-4">
              <TasksTable tasks={filteredTasks} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  )
}
