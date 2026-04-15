import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tag, X } from 'lucide-react'
import type { Ticket, TicketStatus, TicketPriority, TicketCategory } from '../../types'
import { useStore } from '../../store/useStore'
import { cn } from '../../lib/utils'

type TicketFormData = {
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  assignedToId: string
  tags: string[]
}

interface TicketFormProps {
  initialData?: Partial<Ticket>
  onSubmit: (data: TicketFormData) => void
  submitLabel?: string
  isLoading?: boolean
}

export default function TicketForm({
  initialData,
  onSubmit,
  submitLabel = 'Ticket erstellen',
  isLoading = false,
}: TicketFormProps) {
  const navigate = useNavigate()
  const { users } = useStore()
  const agents = users.filter((u) => u.role === 'admin' || u.role === 'agent')

  const [form, setForm] = useState<TicketFormData>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    status: initialData?.status ?? 'open',
    priority: initialData?.priority ?? 'medium',
    category: initialData?.category ?? 'support',
    assignedToId: initialData?.assignedToId ?? '',
    tags: initialData?.tags ?? [],
  })

  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof TicketFormData, string>>>({})

  function set<K extends keyof TicketFormData>(key: K, value: TicketFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function addTag() {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (tag && !form.tags.includes(tag) && form.tags.length < 8) {
      set('tags', [...form.tags, tag])
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    set('tags', form.tags.filter((t) => t !== tag))
  }

  function validate(): boolean {
    const errs: typeof errors = {}
    if (!form.title.trim()) errs.title = 'Titel ist erforderlich'
    if (form.title.length > 150) errs.title = 'Titel darf max. 150 Zeichen haben'
    if (!form.description.trim()) errs.description = 'Beschreibung ist erforderlich'
    if (form.description.length < 20)
      errs.description = 'Beschreibung muss mindestens 20 Zeichen haben'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        ...form,
        assignedToId: form.assignedToId || undefined!,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="label mb-1.5">
          Titel <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Kurze, prägnante Beschreibung des Problems"
          className={cn('input', errors.title && 'border-red-400 focus:border-red-500 focus:ring-red-500/20')}
          maxLength={150}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        )}
        <p className="mt-1 text-xs text-gray-400 text-right">{form.title.length}/150</p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="label mb-1.5">
          Beschreibung <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          rows={6}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Detaillierte Beschreibung: Was ist passiert? Wie kann das Problem reproduziert werden?"
          className={cn(
            'input resize-y',
            errors.description && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
          )}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Row: Priority + Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="priority" className="label mb-1.5">
            Priorität
          </label>
          <select
            id="priority"
            value={form.priority}
            onChange={(e) => set('priority', e.target.value as TicketPriority)}
            className="input"
          >
            <option value="low">Niedrig</option>
            <option value="medium">Mittel</option>
            <option value="high">Hoch</option>
            <option value="critical">Kritisch</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="label mb-1.5">
            Kategorie
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => set('category', e.target.value as TicketCategory)}
            className="input"
          >
            <option value="bug">Bug</option>
            <option value="feature">Feature-Anfrage</option>
            <option value="support">Support</option>
            <option value="security">Sicherheit</option>
            <option value="performance">Performance</option>
            <option value="other">Sonstiges</option>
          </select>
        </div>
      </div>

      {/* Row: Status + Assignee */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="label mb-1.5">
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => set('status', e.target.value as TicketStatus)}
            className="input"
          >
            <option value="open">Offen</option>
            <option value="in_progress">In Bearbeitung</option>
            <option value="resolved">Gelöst</option>
            <option value="closed">Geschlossen</option>
          </select>
        </div>

        <div>
          <label htmlFor="assignedTo" className="label mb-1.5">
            Zugewiesen an
          </label>
          <select
            id="assignedTo"
            value={form.assignedToId}
            onChange={(e) => set('assignedToId', e.target.value)}
            className="input"
          >
            <option value="">— Nicht zugewiesen —</option>
            {agents.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role === 'admin' ? 'Admin' : 'Agent'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="label mb-1.5">Tags</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault()
                  addTag()
                }
              }}
              placeholder="Tag eingeben, Enter zum Hinzufügen"
              className="input pl-9"
            />
          </div>
          <button type="button" onClick={addTag} className="btn-secondary">
            Hinzufügen
          </button>
        </div>
        {form.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
              >
                #{tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="mt-1 text-xs text-gray-400">Max. 8 Tags</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary"
        >
          Abbrechen
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Wird gespeichert...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
