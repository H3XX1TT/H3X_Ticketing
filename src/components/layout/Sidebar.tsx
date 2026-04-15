import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Ticket,
  Plus,
  X,
  Hexagon,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useStore } from '../../store/useStore'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tickets', icon: Ticket, label: 'Alle Tickets' },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const { tickets } = useStore()

  const openCount = tickets.filter((t) => t.status === 'open').length
  const criticalCount = tickets.filter(
    (t) => t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed',
  ).length

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Hexagon className="h-5 w-5 text-white" fill="white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            H3X<span className="text-indigo-600">Ticket</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* New Ticket Button */}
      <div className="p-4">
        <NavLink
          to="/tickets/new"
          onClick={onClose}
          className="btn-primary w-full justify-center"
        >
          <Plus className="h-4 w-4" />
          Neues Ticket
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 pb-4">
        <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Navigation
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {label === 'Alle Tickets' && openCount > 0 && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                {openCount}
              </span>
            )}
          </NavLink>
        ))}

        {/* Quick Filters */}
        <div className="mt-6">
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Schnellfilter
          </p>
          <NavLink
            to="/tickets?status=open"
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              location.search === '?status=open'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
            )}
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
            Offen
          </NavLink>
          <NavLink
            to="/tickets?priority=critical"
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              location.search === '?priority=critical'
                ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
            )}
          >
            <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
            Kritisch
            {criticalCount > 0 && (
              <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
                {criticalCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/tickets?assignedToId=unassigned"
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              location.search === '?assignedToId=unassigned'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
            )}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            Nicht zugewiesen
          </NavLink>
        </div>

        {/* Disabled nav items (for UI completeness) */}
        <div className="mt-6 opacity-40">
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Bald verfügbar
          </p>
          {[
            { icon: BarChart3, label: 'Reports' },
            { icon: Users, label: 'Team' },
            { icon: Settings, label: 'Einstellungen' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  )
}
