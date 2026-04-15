import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import type { Ticket, Comment, TicketFilters, User } from '../types'
import { DEMO_TICKETS, DEMO_USERS } from '../lib/demo-data'

interface TicketStore {
  tickets: Ticket[]
  users: User[]
  currentUserId: string
  filters: TicketFilters
  darkMode: boolean

  // Ticket actions
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => string
  updateTicket: (id: string, updates: Partial<Ticket>) => void
  deleteTicket: (id: string) => void
  addComment: (ticketId: string, content: string, isInternal?: boolean) => void
  deleteComment: (ticketId: string, commentId: string) => void

  // Filter actions
  setFilters: (filters: Partial<TicketFilters>) => void
  resetFilters: () => void

  // UI actions
  toggleDarkMode: () => void
  setCurrentUser: (userId: string) => void

  // Getters
  getFilteredTickets: () => Ticket[]
  getTicketById: (id: string) => Ticket | undefined
  getUserById: (id: string) => User | undefined
}

const DEFAULT_FILTERS: TicketFilters = {
  status: 'all',
  priority: 'all',
  category: 'all',
  assignedToId: 'all',
  search: '',
}

export const useStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      tickets: DEMO_TICKETS,
      users: DEMO_USERS,
      currentUserId: 'u1',
      filters: DEFAULT_FILTERS,
      darkMode: false,

      addTicket: (ticketData) => {
        const id = uuidv4()
        const now = new Date().toISOString()
        const newTicket: Ticket = {
          ...ticketData,
          id,
          createdAt: now,
          updatedAt: now,
          comments: [],
        }
        set((state) => ({ tickets: [newTicket, ...state.tickets] }))
        return id
      },

      updateTicket: (id, updates) => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t,
          ),
        }))
      },

      deleteTicket: (id) => {
        set((state) => ({ tickets: state.tickets.filter((t) => t.id !== id) }))
      },

      addComment: (ticketId, content, isInternal = false) => {
        const comment: Comment = {
          id: uuidv4(),
          ticketId,
          authorId: get().currentUserId,
          content,
          createdAt: new Date().toISOString(),
          isInternal,
        }
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  comments: [...t.comments, comment],
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        }))
      },

      deleteComment: (ticketId, commentId) => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId
              ? { ...t, comments: t.comments.filter((c) => c.id !== commentId) }
              : t,
          ),
        }))
      },

      setFilters: (filters) => {
        set((state) => ({ filters: { ...state.filters, ...filters } }))
      },

      resetFilters: () => {
        set({ filters: DEFAULT_FILTERS })
      },

      toggleDarkMode: () => {
        set((state) => {
          const next = !state.darkMode
          if (next) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { darkMode: next }
        })
      },

      setCurrentUser: (userId) => {
        set({ currentUserId: userId })
      },

      getFilteredTickets: () => {
        const { tickets, filters } = get()
        return tickets.filter((t) => {
          if (filters.status !== 'all' && t.status !== filters.status) return false
          if (filters.priority !== 'all' && t.priority !== filters.priority) return false
          if (filters.category !== 'all' && t.category !== filters.category) return false
          if (filters.assignedToId !== 'all') {
            if (filters.assignedToId === 'unassigned' && t.assignedToId) return false
            if (filters.assignedToId !== 'unassigned' && t.assignedToId !== filters.assignedToId) return false
          }
          if (filters.search) {
            const q = filters.search.toLowerCase()
            const matches =
              t.title.toLowerCase().includes(q) ||
              t.description.toLowerCase().includes(q) ||
              t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
              t.id.toLowerCase().includes(q)
            if (!matches) return false
          }
          return true
        })
      },

      getTicketById: (id) => get().tickets.find((t) => t.id === id),

      getUserById: (id) => get().users.find((u) => u.id === id),
    }),
    {
      name: 'h3x-ticketing-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add('dark')
        }
      },
    },
  ),
)
