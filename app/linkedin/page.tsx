"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { LinkedInPosts } from "@/components/linkedin-posts"
import { CreateLinkedInPostForm } from "@/components/create-linkedin-post-form"
import { useFetchLinkedInPosts } from "@/lib/linkedin-post-store"

export default function LinkedInPage() {
  // Fetch LinkedIn posts from API
  useFetchLinkedInPosts()
  
  return (
    <DashboardShell>
      <DashboardHeader heading="LinkedIn Posts" text="Create and manage your LinkedIn content calendar." />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1 md:sticky md:top-6 md:self-start">
          <CreateLinkedInPostForm />
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Your LinkedIn Posts</h2>
          <LinkedInPosts />
        </div>
      </div>
    </DashboardShell>
  )
}
