import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind class names, letting later classes override earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CATEGORY_ICONS: Record<string, string> = {
  blood: '🩸',
  hematology: '🩸',
  cbc: '🩸',
  diabetes: '🍬',
  glucose: '🍬',
  sugar: '🍬',
  lipid: '🫀',
  cholesterol: '🫀',
  cardiac: '❤️',
  heart: '❤️',
  liver: '🧪',
  kidney: '💧',
  renal: '💧',
  thyroid: '🦋',
  vitamin: '💊',
  electrolyte: '⚡',
  urine: '🧫',
  infection: '🦠',
  inflammation: '🔥',
}

/** Emoji icon for a lab-report category (falls back to a generic icon). */
export function getCategoryIcon(category: string): string {
  const key = category.toLowerCase()
  const match = Object.keys(CATEGORY_ICONS).find((k) => key.includes(k))
  return match ? CATEGORY_ICONS[match] : '📋'
}

/** Tailwind classes for a risk-level badge: low / medium (moderate) / high / critical. */
export function getRiskColor(level: string): string {
  switch (level?.toLowerCase()) {
    case 'low':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    case 'medium':
    case 'moderate':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    case 'high':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    case 'critical':
      return 'bg-red-500/10 text-red-400 border-red-500/30'
    default:
      return 'bg-slate-500/10 text-slate-300 border-slate-500/30'
  }
}

/** Tailwind gradient classes for a 0–100 risk score. */
export function getRiskGradient(score: number): string {
  if (score <= 25) return 'from-emerald-500 to-cyan-500'
  if (score <= 50) return 'from-amber-500 to-yellow-500'
  if (score <= 75) return 'from-orange-500 to-amber-500'
  return 'from-red-600 to-orange-500'
}

/** Confidence as a whole-number percentage; accepts 0–1 or 0–100. */
export function formatConfidence(confidence: number): number {
  const pct = confidence <= 1 ? confidence * 100 : confidence
  return Math.round(Math.min(100, Math.max(0, pct)))
}
