import { Menu, Moon, Sun, Search, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { darkMode, toggleDarkMode, currentUserId, users, tickets } = useStore()
  const currentUser = users.find((u) => u.id === currentUserId)
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')

  const criticalOpen = tickets.filter(
    (t) => t.priority === 'critical' && t.status === 'open',
  ).length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/tickets?search=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 md:px-6">
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <form onSubmit={handleSearch} className="relative hidden sm:flex flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tickets suchen..."
            className="input pl-9 h-9"
          />
        </form>
      </div>

      {/* Right: Actions + User */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
          <Bell className="h-5 w-5" />
          {criticalOpen > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          title={darkMode ? 'Hellmodus' : 'Dunkelmodus'}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ml-1">
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white',
              currentUser?.role === 'admin'
                ? 'bg-indigo-600'
                : currentUser?.role === 'agent'
                  ? 'bg-teal-600'
                  : 'bg-gray-500',
            )}
          >
            {currentUser?.name.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
              {currentUser?.name ?? 'Unbekannt'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize leading-tight">
              {currentUser?.role === 'admin'
                ? 'Administrator'
                : currentUser?.role === 'agent'
                  ? 'Agent'
                  : 'Nutzer'}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
