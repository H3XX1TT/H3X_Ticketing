import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { de } from 'date-fns/locale'
import type { TicketStatus, TicketPriority, TicketCategory } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  return format(parseISO(dateStr), 'dd. MMM yyyy, HH:mm', { locale: de })
}

export function formatRelative(dateStr: string) {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: de })
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Offen',
  in_progress: 'In Bearbeitung',
  resolved: 'Gelöst',
  closed: 'Geschlossen',
}

export const STATUS_COLORS: Record<TicketStatus, string> = {
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  in_progress: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400',
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Niedrig',
  medium: 'Mittel',
  high: 'Hoch',
  critical: 'Kritisch',
}

export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  low: 'text-gray-500 dark:text-gray-400',
  medium: 'text-blue-500 dark:text-blue-400',
  high: 'text-orange-500 dark:text-orange-400',
  critical: 'text-red-500 dark:text-red-400',
}

export const PRIORITY_BG: Record<TicketPriority, string> = {
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  bug: 'Bug',
  feature: 'Feature-Anfrage',
  support: 'Support',
  security: 'Sicherheit',
  performance: 'Performance',
  other: 'Sonstiges',
}

export const CATEGORY_COLORS: Record<TicketCategory, string> = {
  bug: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  feature: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  support: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  security: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  performance: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300',
}
