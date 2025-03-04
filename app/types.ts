export type SubjectType = "LK" | "GK" | "None"
export type ExamType = "Written" | "Oral" | "None"

export interface Subject {
  id: string
  name: string
  type: SubjectType
  examType: ExamType
  grades: {
    Q1: number | null
    Q2: number | null
    Q3: number | null
    Q4: number | null
  }
  examGrade: number | null
  selected: boolean
}

export interface AvailableSubject {
  id: string
  name: string
}

export interface CalculationResults {
  totalPoints: number
  averageGrade: number | string
  validSelection: boolean
  baseCoursesCount: number
  advancedCoursesCount: number
  examSubjectsCount: number
  lkPoints: number
  gkPoints: number
  examPoints: number
  messages: string[]
}

