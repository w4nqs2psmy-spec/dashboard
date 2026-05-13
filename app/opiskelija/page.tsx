'use client'

import { useState, useEffect } from 'react'
import { RiskLevel } from '@/types'

interface StudentWithEvent {
  id: number
  name: string
  student_message?: string | null
  risk_level?: RiskLevel | null
  event_created_at?: string | null
}

export default function OpiskelijaPage() {
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
        <div className="text-5xl mb-4">📚</div>
        <h2 className="font-semibold text-stone-700 text-lg mb-2">Ei oppilaita vielä</h2>
        <p className="text-stone-400 text-sm">Opettaja ei ole vielä lisännyt oppilaita järjestelmään.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!selected ? (
        <div>
          <h2 className="font-semibold text-stone-700 mb-1">Kuka olet?</h2>
          <p className="text-stone-400 text-sm mb-5">Valitse nimesi nähdäksesi sinulle tarkoitetun viestin.</p>
          <div className="flex flex-col gap-2">
            {students.map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-stone-100 hover:border-sky-300 hover:shadow-sm transition-all text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-200 to-indigo-200 flex items-center justify-center text-stone-700 font-bold">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-stone-800">{s.name}</span>
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

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-200 to-indigo-300 flex items-center justify-center text-stone-700 font-bold text-2xl mx-auto mb-3">
              {selected.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold text-stone-800">Hei, {selected.name.split(' ')[0]}!</h2>
          </div>

          {selected.student_message ? (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💬</span>
                <span className="font-semibold text-stone-700">Viesti sinulle</span>
              </div>
              <p className="text-stone-700 leading-relaxed">{selected.student_message}</p>
              {selected.event_created_at && (
                <p className="text-xs text-stone-400 mt-4">
                  Päivitetty: {new Date(selected.event_created_at).toLocaleDateString('fi-FI')}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6 text-center">
              <p className="text-stone-500">Sinulle ei ole vielä viestiä. Opettaja päivittää tilanteesi pian.</p>
            </div>
          )}

          <div className="mt-5 bg-sky-50 border border-sky-100 rounded-2xl p-4 text-sm text-sky-700">
            💡 Jos sinulla on kysyttävää, ota rohkeasti yhteyttä opettajaasi tai oppilashuoltoon.
          </div>
        </div>
      )}
    </div>
  )
}
