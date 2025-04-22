"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import * as API from './api'
import { useEffect } from "react"

export type LinkedInPostStatus = "scheduled" | "posted" | "open"

export interface LinkedInPost {
  id: string
  _id?: string // MongoDB ID
  title: string
  date: string // ISO date string
  status: LinkedInPostStatus
}

// Helper to normalize API response to our store format
const normalizePost = (post: any): LinkedInPost => ({
  id: post._id || post.id,
  _id: post._id,
  title: post.title,
  date: post.date instanceof Date ? post.date.toISOString() : post.date,
  status: post.status as LinkedInPostStatus,
})

interface LinkedInPostStore {
  posts: LinkedInPost[]
  loading: boolean
  error: string | null
  fetchPosts: () => Promise<void>
  addPost: (post: Omit<LinkedInPost, "id">) => Promise<void>
  updatePost: (id: string, updates: Partial<LinkedInPost>) => Promise<void>
  deletePost: (id: string) => Promise<void>
  updatePostStatus: (id: string, status: LinkedInPostStatus) => Promise<void>
}

export const useLinkedInPostStore = create<LinkedInPostStore>()(
  persist(
    (set, get) => ({
      posts: [],
      loading: false,
      error: null,

      fetchPosts: async () => {
        set({ loading: true, error: null })
        try {
          const postsData = await API.fetchLinkedInPosts()
          set({ posts: postsData.map(normalizePost), loading: false })
        } catch (error) {
          console.error("Failed to fetch LinkedIn posts:", error)
          set({ error: "Failed to load posts", loading: false })
        }
      },

      addPost: async (post) => {
        set({ loading: true, error: null })
        try {
          const newPost = await API.createLinkedInPost(post)
          set((state) => ({
            posts: [...state.posts, normalizePost(newPost)],
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to add LinkedIn post:", error)
          set({ error: "Failed to create post", loading: false })
        }
      },

      updatePost: async (id, updates) => {
        set({ loading: true, error: null })
        try {
          const post = get().posts.find(p => p.id === id)
          if (!post) throw new Error("Post not found")
          
          const mongoId = post._id || id
          const updatedPost = await API.updateLinkedInPost(mongoId, updates)
          
          set((state) => ({
            posts: state.posts.map((p) => 
              p.id === id ? normalizePost(updatedPost) : p
            ),
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to update LinkedIn post:", error)
          set({ error: "Failed to update post", loading: false })
        }
      },

      deletePost: async (id) => {
        set({ loading: true, error: null })
        try {
          const post = get().posts.find(p => p.id === id)
          if (!post) throw new Error("Post not found")
          
          const mongoId = post._id || id
          await API.deleteLinkedInPost(mongoId)
          
          set((state) => ({
            posts: state.posts.filter((p) => p.id !== id),
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to delete LinkedIn post:", error)
          set({ error: "Failed to delete post", loading: false })
        }
      },

      updatePostStatus: async (id, status) => {
        set({ loading: true, error: null })
        try {
          const post = get().posts.find(p => p.id === id)
          if (!post) throw new Error("Post not found")
          
          const mongoId = post._id || id
          const updatedPost = await API.updateLinkedInPost(mongoId, { status })
          
          set((state) => ({
            posts: state.posts.map((p) => (p.id === id ? normalizePost(updatedPost) : p)),
            loading: false,
          }))
        } catch (error) {
          console.error("Failed to update LinkedIn post status:", error)
          set({ error: "Failed to update post status", loading: false })
        }
      },
    }),
    {
      name: "ceo-linkedin-posts-storage",
    },
  ),
)

// Custom hook to fetch posts on component mount
export function useFetchLinkedInPosts() {
  const fetchPosts = useLinkedInPostStore((state) => state.fetchPosts)
  
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])
}
