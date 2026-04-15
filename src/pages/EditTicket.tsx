import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '../store/useStore'
import TicketForm from '../components/tickets/TicketForm'

export default function EditTicket() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getTicketById, updateTicket } = useStore()
  const ticket = id ? getTicketById(id) : undefined

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

  return (
    <div className="mx-auto max-w-2xl animate-slide-in">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost mb-4 -ml-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ticket bearbeiten</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          #{ticket.id.slice(0, 8)} · {ticket.title}
        </p>
      </div>

      <div className="card p-6">
        <TicketForm
          initialData={ticket}
          onSubmit={(data) => {
            updateTicket(ticket.id, data)
            navigate(`/tickets/${ticket.id}`)
          }}
          submitLabel="Änderungen speichern"
        />
      </div>
    </div>
  )
}
