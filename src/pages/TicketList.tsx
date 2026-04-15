import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Filter, X, RotateCcw, Plus, Search } from 'lucide-react'
import { useStore } from '../store/useStore'
import TicketCard from '../components/tickets/TicketCard'
import { cn } from '../lib/utils'
import type { TicketStatus, TicketPriority, TicketCategory } from '../types'

const STATUS_OPTIONS: { value: TicketStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Alle Status' },
  { value: 'open', label: 'Offen' },
  { value: 'in_progress', label: 'In Bearbeitung' },
  { value: 'resolved', label: 'Gelöst' },
  { value: 'closed', label: 'Geschlossen' },
]

const PRIORITY_OPTIONS: { value: TicketPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'Alle Prioritäten' },
  { value: 'critical', label: 'Kritisch' },
  { value: 'high', label: 'Hoch' },
  { value: 'medium', label: 'Mittel' },
  { value: 'low', label: 'Niedrig' },
]

const CATEGORY_OPTIONS: { value: TicketCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Alle Kategorien' },
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature-Anfrage' },
  { value: 'support', label: 'Support' },
  { value: 'security', label: 'Sicherheit' },
  { value: 'performance', label: 'Performance' },
  { value: 'other', label: 'Sonstiges' },
]

export default function TicketList() {
  const { filters, setFilters, resetFilters, getFilteredTickets, users } = useStore()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tickets = getFilteredTickets()

  // Apply URL params as filters when page loads
  useEffect(() => {
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assignedToId = searchParams.get('assignedToId')
    const search = searchParams.get('search')

    const updates: Partial<typeof filters> = {}
    if (status) updates.status = status as TicketStatus
    if (priority) updates.priority = priority as TicketPriority
    if (assignedToId) updates.assignedToId = assignedToId
    if (search) updates.search = search

    if (Object.keys(updates).length > 0) {
      setFilters(updates)
    }
  }, [])

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all' ||
    filters.assignedToId !== 'all' ||
    filters.search !== ''

  const agents = users.filter((u) => u.role === 'admin' || u.role === 'agent')

  return (
    <div className="space-y-5 animate-slide-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tickets</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {tickets.length} Ticket{tickets.length !== 1 ? 's' : ''} gefunden
          </p>
        </div>
        <button onClick={() => navigate('/tickets/new')} className="btn-primary">
          <Plus className="h-4 w-4" />
          Neues Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />

          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Suche..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="input h-9 pl-9"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ search: '' })}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-3.5 w-3.5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Status filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value as TicketStatus | 'all' })}
            className="input h-9 w-auto min-w-40"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ priority: e.target.value as TicketPriority | 'all' })
            }
            className="input h-9 w-auto min-w-40"
          >
            {PRIORITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ category: e.target.value as TicketCategory | 'all' })
            }
            className="input h-9 w-auto min-w-44"
          >
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Assignee filter */}
          <select
            value={filters.assignedToId}
            onChange={(e) => setFilters({ assignedToId: e.target.value })}
            className="input h-9 w-auto min-w-44"
          >
            <option value="all">Alle Mitarbeiter</option>
            <option value="unassigned">Nicht zugewiesen</option>
            {agents.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="btn-ghost h-9 text-sm gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Zurücksetzen
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                Status: {STATUS_OPTIONS.find((o) => o.value === filters.status)?.label}
                <button onClick={() => setFilters({ status: 'all' })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.priority !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                Priorität: {PRIORITY_OPTIONS.find((o) => o.value === filters.priority)?.label}
                <button onClick={() => setFilters({ priority: 'all' })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                Kategorie: {CATEGORY_OPTIONS.find((o) => o.value === filters.category)?.label}
                <button onClick={() => setFilters({ category: 'all' })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.assignedToId !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                Zugewiesen:{' '}
                {filters.assignedToId === 'unassigned'
                  ? 'Nicht zugewiesen'
                  : users.find((u) => u.id === filters.assignedToId)?.name}
                <button onClick={() => setFilters({ assignedToId: 'all' })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                Suche: "{filters.search}"
                <button onClick={() => setFilters({ search: '' })}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Ticket grid */}
      {tickets.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
            Keine Tickets gefunden
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Versuche die Filterkriterien anzupassen oder erstelle ein neues Ticket.
          </p>
          <div className="mt-4 flex gap-3">
            {hasActiveFilters && (
              <button onClick={resetFilters} className="btn-secondary">
                Filter zurücksetzen
              </button>
            )}
            <button onClick={() => navigate('/tickets/new')} className="btn-primary">
              Neues Ticket erstellen
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  )
}
