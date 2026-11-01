// Tyhjentää tietokannan ja lisää keksityt testioppilaat.
// Käyttö: npm run seed
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const root = process.cwd()
const db = new Database(path.join(root, 'kasvualusta.db'))
db.pragma('foreign_keys = ON')
db.exec(fs.readFileSync(path.join(root, 'lib', 'schema.sql'), 'utf8'))

const students = [
  // Odotettu riski: matala
  { name: 'Aino Virtanen', absences: 1, incomplete_tasks: 0, grade_trend: 'improving', wellbeing_score: 5, teacher_notes: '' },
  // Odotettu riski: kohtalainen
  { name: 'Eetu Korhonen', absences: 6, incomplete_tasks: 3, grade_trend: 'stable', wellbeing_score: 3, teacher_notes: 'Vaikuttaa väsyneeltä aamuisin.' },
  // Odotettu riski: korkea
  { name: 'Venla Mäkinen', absences: 14, incomplete_tasks: 8, grade_trend: 'declining', wellbeing_score: 1, teacher_notes: 'Vetäytynyt, syö välitunnilla yksin.' },
  // Ristiriitainen: numerot hyvät, mutta elämäntilanne muuttuu
  { name: 'Leo Nieminen', absences: 0, incomplete_tasks: 0, grade_trend: 'declining', wellbeing_score: 2, teacher_notes: 'Perhe muuttamassa toiselle paikkakunnalle.' },
  // Ristiriitainen: paljon poissaoloja, mutta tehtävät tehty ja voi hyvin
  { name: 'Mira Hämäläinen', absences: 10, incomplete_tasks: 0, grade_trend: 'stable', wellbeing_score: 4, teacher_notes: '' },
]

const insert = db.prepare(`
  INSERT INTO students (name, absences, incomplete_tasks, grade_trend, wellbeing_score, teacher_notes)
  VALUES (@name, @absences, @incomplete_tasks, @grade_trend, @wellbeing_score, @teacher_notes)
`)

db.transaction(() => {
  db.exec('DELETE FROM support_events; DELETE FROM students;')
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('students', 'support_events');")
  for (const s of students) insert.run(s)
})()

db.close()
console.log(`✓ Tietokanta tyhjennetty ja ${students.length} testioppilasta lisätty.`)
