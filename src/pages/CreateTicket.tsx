import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useStore } from '../store/useStore'
import TicketForm from '../components/tickets/TicketForm'

export default function CreateTicket() {
  const { addTicket, currentUserId } = useStore()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl animate-slide-in">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost mb-4 -ml-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Neues Ticket</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Erstelle ein neues Support-Ticket
        </p>
      </div>

      <div className="card p-6">
        <TicketForm
          onSubmit={(data) => {
            const id = addTicket({
              ...data,
              createdById: currentUserId,
            })
            navigate(`/tickets/${id}`)
          }}
          submitLabel="Ticket erstellen"
        />
      </div>
    </div>
  )
}
