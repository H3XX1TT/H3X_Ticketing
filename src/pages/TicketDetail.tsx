import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  Trash2,
  MessageSquare,
  Send,
  Lock,
  Unlock,
  CheckCheck,
  AlertCircle,
  Clock,
  X,
  ChevronDown,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_BG,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  formatDate,
  formatRelative,
  cn,
} from '../lib/utils'
import type { TicketStatus } from '../types'

const STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ['in_progress', 'closed'],
  in_progress: ['open', 'resolved', 'closed'],
  resolved: ['open', 'closed'],
  closed: ['open'],
}

const STATUS_ICONS: Record<TicketStatus, React.FC<{ className?: string }>> = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCheck,
  closed: X,
}

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    getTicketById,
    updateTicket,
    deleteTicket,
    addComment,
    deleteComment,
    getUserById,
    currentUserId,
    users,
  } = useStore()

  const ticket = id ? getTicketById(id) : undefined
  const [commentText, setCommentText] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Ticket nicht gefunden.
        </p>
        <button onClick={() => navigate('/tickets')} className="btn-primary mt-4">
          Zur Übersicht
        </button>
      </div>
    )
  }

  const creator = getUserById(ticket.createdById)
  const assignee = ticket.assignedToId ? getUserById(ticket.assignedToId) : null
  const currentUser = getUserById(currentUserId)
  const isAgent = currentUser?.role === 'admin' || currentUser?.role === 'agent'

  const handleStatusChange = (newStatus: TicketStatus) => {
    const updates: Partial<typeof ticket> = { status: newStatus }
    if (newStatus === 'resolved') {
      updates.resolvedAt = new Date().toISOString()
    }
    updateTicket(ticket.id, updates)
    setStatusMenuOpen(false)
  }

  const handleDelete = () => {
    deleteTicket(ticket.id)
    navigate('/tickets')
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return
    addComment(ticket.id, commentText.trim(), isInternal)
    setCommentText('')
    setIsInternal(false)
  }

  const StatusIcon = STATUS_ICONS[ticket.status]
  const nextStatuses = STATUS_TRANSITIONS[ticket.status]

  return (
    <div className="mx-auto max-w-4xl animate-slide-in">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 -ml-2 text-sm">
        <ArrowLeft className="h-4 w-4" />
        Zurück zur Übersicht
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-5 lg:col-span-2">
          {/* Ticket header card */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-gray-400">#{ticket.id.slice(0, 8)}</span>
                  <span className={cn('badge', STATUS_COLORS[ticket.status])}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {STATUS_LABELS[ticket.status]}
                  </span>
                  <span className={cn('badge', PRIORITY_BG[ticket.priority])}>
                    {PRIORITY_LABELS[ticket.priority]}
                  </span>
                  <span className={cn('badge', CATEGORY_COLORS[ticket.category])}>
                    {CATEGORY_LABELS[ticket.category]}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                  {ticket.title}
                </h1>
              </div>

              {/* Actions */}
              {isAgent && (
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                    className="btn-secondary h-9 px-3"
                    title="Bearbeiten"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn-secondary h-9 px-3 text-red-500 hover:border-red-300"
                    title="Löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>

            {/* Tags */}
            {ticket.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {ticket.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status change */}
          {isAgent && nextStatuses.length > 0 && (
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status ändern
                </p>
                <div className="relative">
                  <button
                    onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                    className="btn-secondary h-9 gap-1.5"
                  >
                    Status wechseln
                    <ChevronDown className={cn('h-4 w-4 transition-transform', statusMenuOpen && 'rotate-180')} />
                  </button>
                  {statusMenuOpen && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 animate-slide-in">
                      {nextStatuses.map((s) => {
                        const Icon = STATUS_ICONS[s]
                        return (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                          >
                            <Icon className="h-4 w-4 text-gray-400" />
                            {STATUS_LABELS[s]}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <MessageSquare className="h-4 w-4 text-indigo-500" />
              Kommentare
              {ticket.comments.length > 0 && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {ticket.comments.length}
                </span>
              )}
            </h2>

            {ticket.comments.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                Noch keine Kommentare. Sei der Erste!
              </p>
            ) : (
              <div className="space-y-4">
                {ticket.comments.map((comment) => {
                  const author = getUserById(comment.authorId)
                  const isOwn = comment.authorId === currentUserId
                  return (
                    <div
                      key={comment.id}
                      className={cn(
                        'rounded-xl p-4',
                        comment.isInternal
                          ? 'border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20'
                          : 'border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50',
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                            {author?.name.charAt(0) ?? '?'}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {author?.name ?? 'Unbekannt'}
                          </span>
                          {comment.isInternal && (
                            <span className="flex items-center gap-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                              <Lock className="h-3 w-3" />
                              Intern
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400" title={formatDate(comment.createdAt)}>
                            {formatRelative(comment.createdAt)}
                          </span>
                          {(isOwn || currentUser?.role === 'admin') && (
                            <button
                              onClick={() => deleteComment(ticket.id, comment.id)}
                              className="rounded p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Add comment */}
            <form onSubmit={handleAddComment} className="mt-4 space-y-2">
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Kommentar schreiben..."
                className="input resize-none"
              />
              <div className="flex items-center justify-between">
                {isAgent && (
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-400 select-none">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    {isInternal ? (
                      <Lock className="h-3.5 w-3.5 text-amber-500" />
                    ) : (
                      <Unlock className="h-3.5 w-3.5" />
                    )}
                    Intern (nur für Team sichtbar)
                  </label>
                )}
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="btn-primary ml-auto h-9"
                >
                  <Send className="h-4 w-4" />
                  Senden
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          {/* Details */}
          <div className="card p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Details</h3>

            <InfoRow label="Status">
              <span className={cn('badge', STATUS_COLORS[ticket.status])}>
                {STATUS_LABELS[ticket.status]}
              </span>
            </InfoRow>

            <InfoRow label="Priorität">
              <span className={cn('text-sm font-medium', PRIORITY_COLORS[ticket.priority])}>
                {PRIORITY_LABELS[ticket.priority]}
              </span>
            </InfoRow>

            <InfoRow label="Kategorie">
              <span className={cn('badge', CATEGORY_COLORS[ticket.category])}>
                {CATEGORY_LABELS[ticket.category]}
              </span>
            </InfoRow>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-3">
              <InfoRow label="Erstellt von">
                <UserChip name={creator?.name ?? 'Unbekannt'} role={creator?.role} />
              </InfoRow>

              <InfoRow label="Zugewiesen an">
                {assignee ? (
                  <UserChip name={assignee.name} role={assignee.role} />
                ) : (
                  <span className="text-sm text-gray-400 dark:text-gray-500">Nicht zugewiesen</span>
                )}
              </InfoRow>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2">
              <InfoRow label="Erstellt">
                <span className="text-xs text-gray-500 dark:text-gray-400" title={formatDate(ticket.createdAt)}>
                  {formatRelative(ticket.createdAt)}
                </span>
              </InfoRow>
              <InfoRow label="Aktualisiert">
                <span className="text-xs text-gray-500 dark:text-gray-400" title={formatDate(ticket.updatedAt)}>
                  {formatRelative(ticket.updatedAt)}
                </span>
              </InfoRow>
              {ticket.resolvedAt && (
                <InfoRow label="Gelöst am">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(ticket.resolvedAt)}
                  </span>
                </InfoRow>
              )}
            </div>
          </div>

          {/* Quick assign (for agents) */}
          {isAgent && (
            <div className="card p-4">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                Zuweisung ändern
              </h3>
              <select
                value={ticket.assignedToId ?? ''}
                onChange={(e) => updateTicket(ticket.id, { assignedToId: e.target.value || undefined })}
                className="input text-sm"
              >
                <option value="">— Nicht zugewiesen —</option>
                {users
                  .filter((u) => u.role === 'admin' || u.role === 'agent')
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="card w-full max-w-sm p-6 animate-slide-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ticket löschen?
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Das Ticket <strong>"{ticket.title}"</strong> wird unwiederbringlich gelöscht. Dieser Vorgang kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary">
                Abbrechen
              </button>
              <button onClick={handleDelete} className="btn-danger">
                Endgültig löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
      <div className="flex-1 flex justify-end">{children}</div>
    </div>
  )
}

function UserChip({ name, role }: { name: string; role?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white',
          role === 'admin' ? 'bg-indigo-600' : role === 'agent' ? 'bg-teal-600' : 'bg-gray-500',
        )}
      >
        {name.charAt(0)}
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{name}</span>
    </div>
  )
}
