import type React from "react"
import type { FC } from "react"
import Link from "next/link"
import { Briefcase, LayoutDashboard, Linkedin, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  color: string
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    color: "text-primary",
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: Briefcase,
    color: "text-blue-500",
  },
  {
    title: "LinkedIn",
    href: "/linkedin",
    icon: Linkedin,
    color: "text-blue-600",
  },
]

export const DashboardNav: FC = () => {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-16 items-center border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold text-primary">CEO AI</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start gap-2 px-2 text-sm font-medium">
          {navItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  item.title === "Dashboard"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 ${item.color}`} />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="flex items-center gap-4 rounded-lg bg-secondary p-4">
          <Avatar className="border border-border bg-background">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
            <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">John Doe</p>
            <p className="text-xs leading-none text-muted-foreground">CEO, Acme Inc</p>
          </div>
        </div>
      </div>
    </div>
  )
}
