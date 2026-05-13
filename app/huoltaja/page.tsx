'use client'

import { useState, useEffect } from 'react'
import RiskBadge from '@/components/RiskBadge'
import { RiskLevel } from '@/types'

interface StudentWithEvent {
  id: number
  name: string
  absences: number
  incomplete_tasks: number
  grade_trend: string
  wellbeing_score: number
  risk_level?: RiskLevel | null
  guardian_message?: string | null
  event_created_at?: string | null
}

const trendLabel: Record<string, string> = {
  improving: 'Paraneva',
  stable: 'Vakaa',
  declining: 'Heikkenevä',
}

export default function HuoltajaPage() {
  const [students, setStudents] = useState<StudentWithEvent[]>([])
  const [selected, setSelected] = useState<StudentWithEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/students')
      .then(r => r.json())
      .then(data => {
        setStudents(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-stone-400">Ladataan...</div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-5xl mb-4">🏠</div>
        <h2 className="font-semibold text-stone-700 text-lg mb-2">Ei oppilaita järjestelmässä</h2>
        <p className="text-stone-400 text-sm">Opettaja ei ole vielä lisännyt tietoja järjestelmään.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!selected ? (
        <div>
          <h2 className="font-semibold text-stone-700 mb-1">Tervetuloa, huoltaja</h2>
          <p className="text-stone-400 text-sm mb-5">Valitse lapsesi nimi nähdäksesi tilannekatsauksen.</p>
          <div className="flex flex-col gap-2">
            {students.map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className="flex items-center justify-between p-4 rounded-2xl bg-white border border-stone-100 hover:border-amber-300 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-stone-700 font-bold">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-stone-800">{s.name}</span>
                </div>
                {s.risk_level && <RiskBadge level={s.risk_level} />}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelected(null)}
            className="text-sm text-stone-400 hover:text-stone-600 mb-5 flex items-center gap-1"
          >
            ← Takaisin
          </button>

          <div className="bg-white rounded-2xl border border-stone-100 p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-stone-700 font-bold text-lg">
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-stone-800 text-lg">{selected.name}</h2>
                  {selected.event_created_at && (
                    <p className="text-xs text-stone-400">
                      Päivitetty {new Date(selected.event_created_at).toLocaleDateString('fi-FI')}
                    </p>
                  )}
                </div>
              </div>
              {selected.risk_level && (
                <div className="text-right">
                  <div className="text-xs text-stone-400 mb-1">Tuen tarve</div>
                  <RiskBadge level={selected.risk_level} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-stone-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-stone-800">{selected.absences}</div>
                <div className="text-xs text-stone-400 mt-0.5">Poissaoloa</div>
              </div>
              <div className="bg-stone-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-stone-800">{selected.incomplete_tasks}</div>
                <div className="text-xs text-stone-400 mt-0.5">Avointa tehtävää</div>
              </div>
              <div className="bg-stone-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-stone-800">{selected.wellbeing_score}/5</div>
                <div className="text-xs text-stone-400 mt-0.5">Hyvinvointi</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-stone-400">Arvosanatrendi:</span>
              <span className="font-medium text-stone-700">{trendLabel[selected.grade_trend] ?? selected.grade_trend}</span>
            </div>
          </div>

          {selected.guardian_message ? (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🏠</span>
                <span className="font-semibold text-stone-700">Viesti koululta</span>
              </div>
              <p className="text-stone-700 leading-relaxed">{selected.guardian_message}</p>
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-100 rounded-2xl p-5 text-center">
              <p className="text-stone-500 text-sm">Opettaja ei ole vielä tehnyt tilannearvioita. Tiedot päivitetään pian.</p>
            </div>
          )}

          <div className="mt-4 bg-sky-50 border border-sky-100 rounded-2xl p-4 text-sm text-sky-700">
            📞 Halutessasi lisätietoja, ota yhteyttä suoraan luokanvalvojaan tai oppilashuollon ohjaajaan.
          </div>
        </div>
      )}
    </div>
  )
}
