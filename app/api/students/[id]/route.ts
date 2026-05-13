import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { Student } from '@/types'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const db = getDb()
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(Number(params.id)) as Student | undefined
    if (!student) return NextResponse.json({ error: 'Oppilasta ei löydy' }, { status: 404 })
    return NextResponse.json(student)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Tietokantavirhe' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, absences, incomplete_tasks, grade_trend, wellbeing_score, teacher_notes } = body
    const db = getDb()

    const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(Number(params.id)) as Student | undefined
    if (!existing) return NextResponse.json({ error: 'Oppilasta ei löydy' }, { status: 404 })

    db.prepare(`
      UPDATE students SET
        name = ?,
        absences = ?,
        incomplete_tasks = ?,
        grade_trend = ?,
        wellbeing_score = ?,
        teacher_notes = ?
      WHERE id = ?
    `).run(
      name ?? existing.name,
      absences ?? existing.absences,
      incomplete_tasks ?? existing.incomplete_tasks,
      grade_trend ?? existing.grade_trend,
      wellbeing_score ?? existing.wellbeing_score,
      teacher_notes ?? existing.teacher_notes,
      Number(params.id)
    )

    const updated = db.prepare('SELECT * FROM students WHERE id = ?').get(Number(params.id)) as Student
    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Tietokantavirhe' }, { status: 500 })
  }
}
