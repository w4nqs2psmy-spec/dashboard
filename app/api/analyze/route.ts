import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { analyzeStudent } from '@/lib/claude'
import { Student } from '@/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { student_id } = body

    if (!student_id) {
      return NextResponse.json({ error: 'student_id on pakollinen' }, { status: 400 })
    }

    const db = getDb()
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(Number(student_id)) as Student | undefined
    if (!student) {
      return NextResponse.json({ error: 'Oppilasta ei löydy' }, { status: 404 })
    }

    const result = await analyzeStudent({
      name: student.name,
      absences: student.absences,
      incomplete_tasks: student.incomplete_tasks,
      grade_trend: student.grade_trend,
      wellbeing_score: student.wellbeing_score,
      teacher_notes: student.teacher_notes,
    })

    const event = db.prepare(`
      INSERT INTO support_events (student_id, risk_level, teacher_message, student_message, guardian_message)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      student.id,
      result.risk_level,
      result.teacher_message,
      result.student_message,
      result.guardian_message
    )

    const savedEvent = db.prepare('SELECT * FROM support_events WHERE id = ?').get(event.lastInsertRowid)
    return NextResponse.json(savedEvent, { status: 201 })
  } catch (err) {
    console.error(err)
    const message = err instanceof Error ? err.message : 'Tuntematon virhe'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
