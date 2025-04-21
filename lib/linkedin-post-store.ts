"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type LinkedInPostStatus = "scheduled" | "posted" | "open"

export interface LinkedInPost {
  id: string
  title: string
  date: string // ISO date string
  status: LinkedInPostStatus
}

interface LinkedInPostStore {
  posts: LinkedInPost[]
  addPost: (post: Omit<LinkedInPost, "id">) => void
  updatePost: (id: string, updates: Partial<LinkedInPost>) => void
  deletePost: (id: string) => void
  updatePostStatus: (id: string, status: LinkedInPostStatus) => void
}

export const useLinkedInPostStore = create<LinkedInPostStore>()(
  persist(
    (set) => ({
      posts: [
        // Sample initial posts
        {
          id: "1",
          title: "Announcing our new product launch",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          status: "scheduled",
        },
        {
          id: "2",
          title: "Reflections on Q2 performance",
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          status: "open",
        },
        {
          id: "3",
          title: "Our company's sustainability initiatives",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          status: "posted",
        },
      ],

      addPost: (post) =>
        set((state) => ({
          posts: [
            ...state.posts,
            {
              ...post,
              id: crypto.randomUUID(),
            },
          ],
        })),

      updatePost: (id, updates) =>
        set((state) => ({
          posts: state.posts.map((post) => (post.id === id ? { ...post, ...updates } : post)),
        })),

      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
        })),

      updatePostStatus: (id, status) =>
        set((state) => ({
          posts: state.posts.map((post) => (post.id === id ? { ...post, status } : post)),
        })),
    }),
    {
      name: "ceo-linkedin-posts-storage",
    },
  ),
)
