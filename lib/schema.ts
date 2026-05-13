export const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  absences INTEGER NOT NULL DEFAULT 0,
  incomplete_tasks INTEGER NOT NULL DEFAULT 0,
  grade_trend TEXT NOT NULL DEFAULT 'stable',
  wellbeing_score INTEGER NOT NULL DEFAULT 3,
  teacher_notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS support_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  risk_level TEXT NOT NULL,
  teacher_message TEXT NOT NULL,
  student_message TEXT NOT NULL,
  guardian_message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`
