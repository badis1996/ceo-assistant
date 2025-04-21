"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Edit, Calendar, Trash2, FileText } from "lucide-react"
import { type Task, useTaskStore } from "@/lib/task-store"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EditTaskDialog } from "@/components/edit-task-dialog"
import { RescheduleTaskDialog } from "@/components/reschedule-task-dialog"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TasksTableProps {
  tasks: Task[]
}

export function TasksTable({ tasks }: TasksTableProps) {
  const { toggleTaskCompletion, deleteTask } = useTaskStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [editTask, setEditTask] = useState<string | null>(null)
  const [rescheduleTask, setRescheduleTask] = useState<string | null>(null)

  const handleDeleteTask = (id: string) => {
    deleteTask(id)
    toast({
      title: "Task deleted",
      description: "The task has been deleted successfully.",
    })
  }

  const columns: ColumnDef<Task>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.original.completed}
          onCheckedChange={() => toggleTaskCompletion(row.original.id)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className={row.original.completed ? "line-through text-muted-foreground" : ""}>
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as string
        return (
          <Badge
            className={
              category === "product"
                ? "bg-management-green"
                : category === "sales"
                  ? "bg-management-teal"
                  : "bg-management-purple"
            }
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string
        return (
          <Badge
            className={
              priority === "high"
                ? "bg-management-amber"
                : priority === "medium"
                  ? "bg-management-teal"
                  : "bg-management-green"
            }
          >
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        return format(parseISO(row.getValue("date")), "MMM d, yyyy")
      },
    },
    {
      id: "notes",
      header: "Notes",
      cell: ({ row }) => {
        const hasNotes = row.original.notes && row.original.notes.trim() !== ""
        return hasNotes ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-management-blue" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">Has notes & lessons learned</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const task = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditTask(task.id)}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setRescheduleTask(task.id)}>
              <Calendar className="h-4 w-4" />
              <span className="sr-only">Reschedule</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              onClick={() => handleDeleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: tasks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={row.original.completed ? "bg-muted/50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>

      {/* Dialogs */}
      {editTask && <EditTaskDialog taskId={editTask} isOpen={!!editTask} onClose={() => setEditTask(null)} />}
      {rescheduleTask && (
        <RescheduleTaskDialog
          taskId={rescheduleTask}
          isOpen={!!rescheduleTask}
          onClose={() => setRescheduleTask(null)}
        />
      )}
    </div>
  )
}
