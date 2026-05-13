'use client'

import { RiskLevel } from '@/types'
import RiskBadge from './RiskBadge'

interface Props {
  name: string
  absences: number
  incomplete_tasks: number
  grade_trend: string
  wellbeing_score: number
  risk_level?: RiskLevel | null
  onClick?: () => void
  isSelected?: boolean
}

const trendLabel: Record<string, string> = {
  improving: 'Paraneva ↑',
  stable: 'Vakaa →',
  declining: 'Heikkenevä ↓',
}

const trendColor: Record<string, string> = {
  improving: 'text-emerald-600',
  stable: 'text-stone-500',
  declining: 'text-rose-600',
}

const wellbeingDots = (score: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={`inline-block w-2 h-2 rounded-full ${i < score ? 'bg-sky-400' : 'bg-stone-200'}`}
    />
  ))

export default function StudentCard({ name, absences, incomplete_tasks, grade_trend, wellbeing_score, risk_level, onClick, isSelected }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
        isSelected
          ? 'border-sky-400 bg-sky-50'
          : 'border-stone-100 bg-white hover:border-stone-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-200 to-indigo-200 flex items-center justify-center text-stone-700 font-semibold text-sm">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-stone-800">{name}</span>
        </div>
        {risk_level ? <RiskBadge level={risk_level} /> : (
          <span className="text-xs text-stone-400 italic">Ei arvioitu</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-stone-50 rounded-lg p-2">
          <div className="text-stone-400 mb-0.5">Poissaolot</div>
          <div className="font-semibold text-stone-700">{absences} krt</div>
        </div>
        <div className="bg-stone-50 rounded-lg p-2">
          <div className="text-stone-400 mb-0.5">Tehtävät</div>
          <div className="font-semibold text-stone-700">{incomplete_tasks} auki</div>
        </div>
        <div className="bg-stone-50 rounded-lg p-2">
          <div className="text-stone-400 mb-0.5">Trendi</div>
          <div className={`font-semibold ${trendColor[grade_trend] ?? 'text-stone-700'}`}>
            {trendLabel[grade_trend] ?? grade_trend}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-xs text-stone-400">Hyvinvointi:</span>
        <div className="flex gap-0.5">{wellbeingDots(wellbeing_score)}</div>
      </div>
    </button>
  )
}
