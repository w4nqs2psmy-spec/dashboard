import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Student } from '@/types'

export async function GET() {
  try {
    const db = getDb()
    const students = db.prepare(`
      SELECT s.*, se.risk_level, se.teacher_message, se.student_message, se.guardian_message,
             se.created_at as event_created_at
      FROM students s
      LEFT JOIN support_events se ON se.id = (
        SELECT id FROM support_events WHERE student_id = s.id ORDER BY created_at DESC LIMIT 1
      )
      ORDER BY s.name ASC
    `).all()
    return NextResponse.json(students)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Tietokantavirhe' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, absences, incomplete_tasks, grade_trend, wellbeing_score, teacher_notes } = body

    if (!name) {
      return NextResponse.json({ error: 'Nimi on pakollinen' }, { status: 400 })
    }

    const db = getDb()
    const result = db.prepare(`
      INSERT INTO students (name, absences, incomplete_tasks, grade_trend, wellbeing_score, teacher_notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      name,
      absences ?? 0,
      incomplete_tasks ?? 0,
      grade_trend ?? 'stable',
      wellbeing_score ?? 3,
      teacher_notes ?? ''
    )

    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(result.lastInsertRowid) as Student
    return NextResponse.json(student, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Tietokantavirhe' }, { status: 500 })
  }
}
