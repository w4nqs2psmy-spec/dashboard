'use client'

import { useState, useEffect, useCallback } from 'react'
import StudentCard from '@/components/StudentCard'
import SupportOutput from '@/components/SupportOutput'
import { Student, AnalysisResult, GradeTrend, RiskLevel } from '@/types'

interface StudentWithEvent extends Student {
  risk_level?: RiskLevel | null
  teacher_message?: string | null
  student_message?: string | null
  guardian_message?: string | null
}

const EMPTY_FORM = {
  name: '',
  absences: 0,
  incomplete_tasks: 0,
  grade_trend: 'stable' as GradeTrend,
  wellbeing_score: 3,
  teacher_notes: '',
}

export default function OpettajaPage() {
  const [students, setStudents] = useState<StudentWithEvent[]>([])
  const [selected, setSelected] = useState<StudentWithEvent | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isEditing, setIsEditing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStudents = useCallback(async () => {
    const res = await fetch('/api/students')
    const data = await res.json()
    setStudents(data)
  }, [])

  useEffect(() => { loadStudents() }, [loadStudents])

  const selectStudent = (s: StudentWithEvent) => {
    setSelected(s)
    setForm({
      name: s.name,
      absences: s.absences,
      incomplete_tasks: s.incomplete_tasks,
      grade_trend: s.grade_trend,
      wellbeing_score: s.wellbeing_score,
      teacher_notes: s.teacher_notes,
    })
    setIsEditing(true)
    setShowForm(true)
    setAnalysisResult(
      s.risk_level
        ? {
            risk_level: s.risk_level,
            teacher_message: s.teacher_message ?? '',
            student_message: s.student_message ?? '',
            guardian_message: s.guardian_message ?? '',
          }
        : null
    )
    setError(null)
  }

  const newStudent = () => {
    setSelected(null)
    setForm(EMPTY_FORM)
    setIsEditing(false)
    setShowForm(true)
    setAnalysisResult(null)
    setError(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const url = isEditing && selected ? `/api/students/${selected.id}` : '/api/students'
      const method = isEditing && selected ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await loadStudents()
      setSelected(data)
      setIsEditing(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Tallennus epäonnistui')
    } finally {
      setSaving(false)
    }
  }

  const handleAnalyze = async () => {
    if (!selected && !isEditing) {
      await handleSave()
    }
    const targetId = selected?.id
    if (!targetId) return

    setAnalyzing(true)
    setError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: targetId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setAnalysisResult({
        risk_level: data.risk_level,
        teacher_message: data.teacher_message,
        student_message: data.student_message,
        guardian_message: data.guardian_message,
      })
      await loadStudents()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analyysi epäonnistui')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Left column: student list */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-700 text-sm uppercase tracking-wide">Oppilaat</h2>
          <button
            onClick={newStudent}
            className="text-xs bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            + Lisää oppilas
          </button>
        </div>

        {students.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center text-stone-400 text-sm p-6">
            Ei oppilaita vielä.<br />
            <button onClick={newStudent} className="text-sky-500 hover:underline mt-1">Lisää ensimmäinen oppilas</button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto">
            {students.map(s => (
              <StudentCard
                key={s.id}
                name={s.name}
                absences={s.absences}
                incomplete_tasks={s.incomplete_tasks}
                grade_trend={s.grade_trend}
                wellbeing_score={s.wellbeing_score}
                risk_level={s.risk_level ?? null}
                onClick={() => selectStudent(s)}
                isSelected={selected?.id === s.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right column: form + analysis */}
      <div className="flex-1 flex flex-col gap-5">
        {!showForm ? (
          <div className="flex-1 flex items-center justify-center text-stone-400 text-sm">
            Valitse oppilas vasemmalta tai lisää uusi.
          </div>
        ) : (
          <>
            {/* Form */}
            <div className="bg-white rounded-2xl border border-stone-100 p-5">
              <h2 className="font-semibold text-stone-800 mb-4 text-base">
                {isEditing && selected ? `Muokkaa: ${selected.name}` : 'Uusi oppilas'}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-stone-500 mb-1">Nimi</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                    placeholder="Etunimi Sukunimi"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Poissaolot</label>
                  <input
                    type="number"
                    min={0}
                    value={form.absences}
                    onChange={e => setForm(f => ({ ...f, absences: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Tekemättömät tehtävät</label>
                  <input
                    type="number"
                    min={0}
                    value={form.incomplete_tasks}
                    onChange={e => setForm(f => ({ ...f, incomplete_tasks: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1">Arvosanatrendi</label>
                  <select
                    value={form.grade_trend}
                    onChange={e => setForm(f => ({ ...f, grade_trend: e.target.value as GradeTrend }))}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                  >
                    <option value="improving">Paraneva ↑</option>
                    <option value="stable">Vakaa →</option>
                    <option value="declining">Heikkenevä ↓</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-2">
                    Hyvinvointipistemäärä: <span className="text-sky-600 font-semibold">{form.wellbeing_score}/5</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={form.wellbeing_score}
                    onChange={e => setForm(f => ({ ...f, wellbeing_score: Number(e.target.value) }))}
                    className="w-full accent-sky-500"
                  />
                  <div className="flex justify-between text-xs text-stone-400 mt-0.5">
                    <span>Huono</span><span>Erinomainen</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-stone-500 mb-1">Opettajan huomiot</label>
                  <textarea
                    value={form.teacher_notes}
                    onChange={e => setForm(f => ({ ...f, teacher_notes: e.target.value }))}
                    rows={3}
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
                    placeholder="Vapaat huomiot tilanteesta..."
                  />
                </div>
              </div>

              {error && (
                <div className="mt-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-2">
                  {error}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name}
                  className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Tallennetaan...' : 'Tallenna tiedot'}
                </button>
                <button
                  onClick={async () => {
                    if (selected) {
                      await handleAnalyze()
                    } else {
                      setSaving(true)
                      setError(null)
                      try {
                        const res = await fetch('/api/students', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(form),
                        })
                        const data = await res.json()
                        if (!res.ok) throw new Error(data.error)
                        await loadStudents()
                        setSelected(data)
                        setIsEditing(true)
                        setSaving(false)
                        // Now analyze
                        setAnalyzing(true)
                        const res2 = await fetch('/api/analyze', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ student_id: data.id }),
                        })
                        const data2 = await res2.json()
                        if (!res2.ok) throw new Error(data2.error)
                        setAnalysisResult({
                          risk_level: data2.risk_level,
                          teacher_message: data2.teacher_message,
                          student_message: data2.student_message,
                          guardian_message: data2.guardian_message,
                        })
                        await loadStudents()
                      } catch (e) {
                        setError(e instanceof Error ? e.message : 'Virhe')
                      } finally {
                        setSaving(false)
                        setAnalyzing(false)
                      }
                    }
                  }}
                  disabled={analyzing || saving || !form.name}
                  className="flex-1 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Analysoidaan...
                    </>
                  ) : '✨ Analysoi tilannearvio'}
                </button>
              </div>
            </div>

            {/* Analysis result */}
            {analysisResult && (
              <SupportOutput
                result={analysisResult}
                role="teacher"
                studentName={selected?.name ?? form.name}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
