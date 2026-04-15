import { useNavigate } from 'react-router-dom'
import {
  Ticket,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  formatRelative,
  cn,
} from '../lib/utils'
import type { TicketStatus, TicketPriority } from '../types'

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  onClick?: () => void
}

function StatCard({ label, value, icon, color, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'card p-5 text-left transition-all hover:shadow-md active:scale-[0.98]',
        onClick ? 'cursor-pointer' : 'cursor-default',
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={cn('rounded-xl p-2.5', color)}>{icon}</div>
      </div>
    </button>
  )
}

export default function Dashboard() {
  const { tickets, users } = useStore()
  const navigate = useNavigate()

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
    critical: tickets.filter(
      (t) => t.priority === 'critical' && t.status !== 'closed' && t.status !== 'resolved',
    ).length,
  }

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  const criticalTickets = tickets.filter(
    (t) => t.priority === 'critical' && t.status !== 'closed' && t.status !== 'resolved',
  )

  // Status distribution
  const statusDist: Record<TicketStatus, number> = {
    open: stats.open,
    in_progress: stats.inProgress,
    resolved: stats.resolved,
    closed: stats.closed,
  }

  // Priority distribution
  const priorityDist: Record<TicketPriority, number> = {
    critical: tickets.filter((t) => t.priority === 'critical').length,
    high: tickets.filter((t) => t.priority === 'high').length,
    medium: tickets.filter((t) => t.priority === 'medium').length,
    low: tickets.filter((t) => t.priority === 'low').length,
  }

  // Assignee workload
  const agentWorkload = users
    .filter((u) => u.role === 'admin' || u.role === 'agent')
    .map((u) => ({
      user: u,
      open: tickets.filter(
        (t) => t.assignedToId === u.id && t.status !== 'closed' && t.status !== 'resolved',
      ).length,
    }))
    .sort((a, b) => b.open - a.open)

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Übersicht aller Tickets und Aktivitäten
        </p>
      </div>

      {/* Critical alert */}
      {stats.critical > 0 && (
        <div
          className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800/50 dark:bg-red-950/30 cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
          onClick={() => navigate('/tickets?priority=critical')}
        >
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
          <p className="text-sm font-medium text-red-800 dark:text-red-300">
            {stats.critical} kritische{stats.critical > 1 ? '' : 's'} Ticket
            {stats.critical > 1 ? 's' : ''} in aktiver Bearbeitung erforderlich
          </p>
          <ArrowRight className="h-4 w-4 text-red-500 ml-auto" />
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Gesamt"
          value={stats.total}
          icon={<Ticket className="h-5 w-5 text-indigo-600" />}
          color="bg-indigo-50 dark:bg-indigo-900/20"
          onClick={() => navigate('/tickets')}
        />
        <StatCard
          label="Offen"
          value={stats.open}
          icon={<AlertCircle className="h-5 w-5 text-blue-600" />}
          color="bg-blue-50 dark:bg-blue-900/20"
          onClick={() => navigate('/tickets?status=open')}
        />
        <StatCard
          label="In Bearbeitung"
          value={stats.inProgress}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          color="bg-amber-50 dark:bg-amber-900/20"
          onClick={() => navigate('/tickets?status=in_progress')}
        />
        <StatCard
          label="Gelöst"
          value={stats.resolved + stats.closed}
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
          color="bg-green-50 dark:bg-green-900/20"
          onClick={() => navigate('/tickets?status=resolved')}
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status distribution */}
        <div className="card p-5">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            Status-Verteilung
          </h2>
          <div className="space-y-2.5">
            {(Object.entries(statusDist) as [TicketStatus, number][]).map(
              ([status, count]) => (
                <div key={status}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-2 rounded-full bg-indigo-500 transition-all"
                      style={{
                        width:
                          stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Priority distribution */}
        <div className="card p-5">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">Prioritäten</h2>
          <div className="space-y-2">
            {(Object.entries(priorityDist) as [TicketPriority, number][]).map(
              ([priority, count]) => (
                <div
                  key={priority}
                  onClick={() => navigate(`/tickets?priority=${priority}`)}
                  className="flex items-center justify-between rounded-lg p-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn('text-sm font-medium', PRIORITY_COLORS[priority])}
                    >
                      ●
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {PRIORITY_LABELS[priority]}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {count}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Team workload */}
        <div className="card p-5">
          <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">Team-Auslastung</h2>
          <div className="space-y-2">
            {agentWorkload.map(({ user, open }) => (
              <div
                key={user.id}
                onClick={() => navigate(`/tickets?assignedToId=${user.id}`)}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                    user.role === 'admin' ? 'bg-indigo-600' : 'bg-teal-600',
                  )}
                >
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user.role === 'admin' ? 'Admin' : 'Agent'}
                  </p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-semibold',
                    open > 3
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      : open > 0
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                  )}
                >
                  {open} offen
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent tickets */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">Zuletzt aktualisiert</h2>
            <button
              onClick={() => navigate('/tickets')}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Alle ansehen <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {recentTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                className="flex w-full items-start gap-3 rounded-lg p-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {ticket.title}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                    <span className={cn('badge text-xs', STATUS_COLORS[ticket.status])}>
                      {STATUS_LABELS[ticket.status]}
                    </span>
                    <span className={cn('badge text-xs', CATEGORY_COLORS[ticket.category])}>
                      {CATEGORY_LABELS[ticket.category]}
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-gray-400 mt-0.5">
                  {formatRelative(ticket.updatedAt)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Critical tickets */}
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Kritische Tickets
            </h2>
            {criticalTickets.length > 0 && (
              <button
                onClick={() => navigate('/tickets?priority=critical')}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Alle ansehen <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {criticalTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-400" />
              <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                Keine kritischen Tickets
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {criticalTickets.map((ticket) => {
                const assignee = users.find((u) => u.id === ticket.assignedToId)
                return (
                  <button
                    key={ticket.id}
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                    className="flex w-full items-start gap-3 rounded-lg border border-red-100 p-2.5 text-left hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/20 transition-colors"
                  >
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {ticket.title}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        {assignee ? `→ ${assignee.name}` : 'Nicht zugewiesen'}
                        {' · '}
                        {formatRelative(ticket.createdAt)}
                      </p>
                    </div>
                    <span className={cn('badge', STATUS_COLORS[ticket.status])}>
                      {STATUS_LABELS[ticket.status]}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
