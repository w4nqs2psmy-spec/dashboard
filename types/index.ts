export type GradeTrend = 'improving' | 'stable' | 'declining'
export type RiskLevel = 'low' | 'medium' | 'high'
export type Role = 'teacher' | 'student' | 'guardian'

export interface Student {
  id: number
  name: string
  absences: number
  incomplete_tasks: number
  grade_trend: GradeTrend
  wellbeing_score: number
  teacher_notes: string
  created_at: string
}

export interface SupportEvent {
  id: number
  student_id: number
  risk_level: RiskLevel
  teacher_message: string
  student_message: string
  guardian_message: string
  created_at: string
}

export interface AnalysisResult {
  risk_level: RiskLevel
  teacher_message: string
  student_message: string
  guardian_message: string
}

export interface StudentWithLatestEvent extends Student {
  latest_event?: SupportEvent | null
}
