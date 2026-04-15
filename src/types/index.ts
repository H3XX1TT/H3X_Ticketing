export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type TicketCategory =
  | 'bug'
  | 'feature'
  | 'support'
  | 'security'
  | 'performance'
  | 'other'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'agent' | 'user'
}

export interface Comment {
  id: string
  ticketId: string
  authorId: string
  content: string
  createdAt: string
  isInternal: boolean
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  createdById: string
  assignedToId?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  tags: string[]
  comments: Comment[]
}

export interface TicketFilters {
  status: TicketStatus | 'all'
  priority: TicketPriority | 'all'
  category: TicketCategory | 'all'
  assignedToId: string | 'all'
  search: string
}
