'use client'

import { RiskLevel } from '@/types'

const config: Record<RiskLevel, { label: string; classes: string }> = {
  low: {
    label: 'Matala',
    classes: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  },
  medium: {
    label: 'Kohtalainen',
    classes: 'bg-amber-100 text-amber-800 border border-amber-200',
  },
  high: {
    label: 'Korkea',
    classes: 'bg-rose-100 text-rose-800 border border-rose-200',
  },
}

export default function RiskBadge({ level }: { level: RiskLevel }) {
  const { label, classes } = config[level]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  )
}
