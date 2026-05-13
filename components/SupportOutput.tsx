'use client'

import { AnalysisResult, Role } from '@/types'
import RiskBadge from './RiskBadge'

interface Props {
  result: AnalysisResult
  role: Role
  studentName?: string
}

const roleContent: Record<Role, { title: string; field: keyof AnalysisResult; icon: string; color: string }> = {
  teacher: {
    title: 'Toimintaohje opettajalle',
    field: 'teacher_message',
    icon: '📋',
    color: 'from-indigo-50 to-sky-50 border-indigo-100',
  },
  student: {
    title: 'Sinulle, opiskelija',
    field: 'student_message',
    icon: '💬',
    color: 'from-emerald-50 to-teal-50 border-emerald-100',
  },
  guardian: {
    title: 'Tilannekatsaus huoltajalle',
    field: 'guardian_message',
    icon: '🏠',
    color: 'from-amber-50 to-orange-50 border-amber-100',
  },
}

export default function SupportOutput({ result, role }: Props) {
  const { title, field, icon, color } = roleContent[role]
  const message = result[field] as string

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${color} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h3 className="font-semibold text-stone-800">{title}</h3>
        </div>
        {role === 'teacher' && (
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <span>Riskitaso:</span>
            <RiskBadge level={result.risk_level} />
          </div>
        )}
      </div>
      <p className="text-stone-700 leading-relaxed text-sm">{message}</p>
      {role === 'teacher' && (
        <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/70 p-3">
            <p className="text-xs text-stone-400 mb-1">Oppilaalle</p>
            <p className="text-xs text-stone-600 leading-relaxed">{result.student_message}</p>
          </div>
          <div className="rounded-xl bg-white/70 p-3">
            <p className="text-xs text-stone-400 mb-1">Huoltajalle</p>
            <p className="text-xs text-stone-600 leading-relaxed">{result.guardian_message}</p>
          </div>
        </div>
      )}
    </div>
  )
}
