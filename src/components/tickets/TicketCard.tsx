import { useNavigate } from 'react-router-dom'
import { MessageSquare, User, AlertCircle } from 'lucide-react'
import type { Ticket } from '../../types'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_BG,
  PRIORITY_LABELS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  formatRelative,
  cn,
} from '../../lib/utils'
import { useStore } from '../../store/useStore'

interface TicketCardProps {
  ticket: Ticket
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const navigate = useNavigate()
  const { getUserById } = useStore()
  const assignee = ticket.assignedToId ? getUserById(ticket.assignedToId) : null
  const creator = getUserById(ticket.createdById)

  return (
    <button
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className={cn(
        'card w-full p-4 text-left transition-all hover:shadow-md active:scale-[0.995]',
        ticket.priority === 'critical' &&
          ticket.status !== 'closed' &&
          ticket.status !== 'resolved' &&
          'border-red-200 dark:border-red-800/50',
      )}
    >
      <div className="flex items-start gap-3">
        {/* Priority indicator */}
        {ticket.priority === 'critical' && ticket.status !== 'closed' && ticket.status !== 'resolved' && (
          <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
        )}

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex flex-wrap items-start gap-2 justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 flex-1">
              {ticket.title}
            </h3>
            <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
              #{ticket.id.slice(0, 8)}
            </span>
          </div>

          {/* Description */}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {ticket.description}
          </p>

          {/* Badges */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={cn('badge', STATUS_COLORS[ticket.status])}>
              {STATUS_LABELS[ticket.status]}
            </span>
            <span className={cn('badge', PRIORITY_BG[ticket.priority])}>
              {PRIORITY_LABELS[ticket.priority]}
            </span>
            <span className={cn('badge', CATEGORY_COLORS[ticket.category])}>
              {CATEGORY_LABELS[ticket.category]}
            </span>
            {ticket.tags.map((tag) => (
              <span
                key={tag}
                className="badge bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer row */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            <div className="flex items-center gap-3">
              {/* Creator */}
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {creator?.name ?? 'Unbekannt'}
              </span>
              {/* Assignee */}
              {assignee && (
                <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                  → {assignee.name}
                </span>
              )}
              {/* Comments */}
              {ticket.comments.length > 0 && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {ticket.comments.length}
                </span>
              )}
            </div>
            <span>{formatRelative(ticket.updatedAt)}</span>
          </div>
        </div>
      </div>
    </button>
  )
}
