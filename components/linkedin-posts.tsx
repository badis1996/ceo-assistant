"use client"

import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLinkedInPostStore, type LinkedInPostStatus } from "@/lib/linkedin-post-store"
import { EditLinkedInPostDialog } from "@/components/edit-linkedin-post-dialog"
import { PostDatePicker } from "@/components/post-date-picker"
import { toast } from "@/components/ui/use-toast"

interface LinkedInPostsProps {
  limit?: number
}

export function LinkedInPosts({ limit }: LinkedInPostsProps) {
  const { posts, deletePost, updatePostStatus } = useLinkedInPostStore()
  const [editPost, setEditPost] = useState<string | null>(null)

  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const displayPosts = limit ? sortedPosts.slice(0, limit) : sortedPosts

  const getStatusBadge = (status: LinkedInPostStatus) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-200 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:hover:bg-amber-500/30 dark:border-amber-500/30">
            Scheduled
          </Badge>
        )
      case "posted":
        return (
          <Badge className="bg-green-100 text-green-600 hover:bg-green-200 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500/30 dark:border-green-500/30">
            Posted
          </Badge>
        )
      case "open":
        return (
          <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-200 dark:bg-purple-500/20 dark:text-purple-400 dark:hover:bg-purple-500/30 dark:border-purple-500/30">
            Open
          </Badge>
        )
      default:
        return null
    }
  }

  const handleDeletePost = (id: string) => {
    deletePost(id)
    toast({
      title: "Post deleted",
      description: "The LinkedIn post has been deleted successfully.",
    })
  }

  const handleStatusChange = (id: string, currentStatus: LinkedInPostStatus) => {
    let newStatus: LinkedInPostStatus

    if (currentStatus === "scheduled") {
      newStatus = "posted"
    } else if (currentStatus === "posted") {
      newStatus = "open"
    } else {
      newStatus = "scheduled"
    }

    updatePostStatus(id, newStatus)
    toast({
      title: "Status updated",
      description: `Post status changed to ${newStatus}.`,
    })
  }

  if (displayPosts.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border border-border bg-secondary/20 p-4 text-center text-muted-foreground">
        No LinkedIn posts scheduled
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayPosts.map((post) => (
        <div key={post.id} className="rounded-lg border border-border bg-card shadow-sm">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{post.title}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <PostDatePicker postId={post.id} date={post.date} />
                  <div>{getStatusBadge(post.status)}</div>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-primary dark:hover:text-primary/80 dark:hover:bg-primary/10"
                  onClick={() => setEditPost(post.id)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-primary dark:hover:text-primary/80 dark:hover:bg-primary/10"
                  onClick={() => handleStatusChange(post.id, post.status)}
                >
                  Change Status
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-400/80 dark:hover:bg-red-400/10"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Edit Dialog */}
      {editPost && <EditLinkedInPostDialog postId={editPost} isOpen={!!editPost} onClose={() => setEditPost(null)} />}
    </div>
  )
}
