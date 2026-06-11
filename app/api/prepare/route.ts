import { NextRequest, NextResponse } from 'next/server'
import { generateLessonPlan } from '@/lib/claude'
import type { User, LearningRequest } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { subject, level, learnerName, learnerText, mentorName } = body

    // Мінімальні об'єкти для generateLessonPlan
    const mentor: User = {
      id: 'mentor',
      name: mentorName || 'Ментор',
      can_teach: [subject],
      wants_to_learn: [],
      languages: ['uk'],
      total_hours: 0,
      total_sessions: 0,
      streak_weeks: 0,
      created_at: new Date().toISOString(),
    }

    const learner: User = {
      id: 'learner',
      name: learnerName || 'Учень',
      can_teach: [],
      wants_to_learn: [subject],
      languages: ['uk'],
      total_hours: 0,
      total_sessions: 0,
      streak_weeks: 0,
      created_at: new Date().toISOString(),
    }

    const request: LearningRequest = {
      id: 'req',
      user_id: 'learner',
      subject,
      level: level || 'beginner',
      text: learnerText || '',
      frequency: 'once_week',
      status: 'open',
      created_at: new Date().toISOString(),
    }

    const plan = await generateLessonPlan(mentor, learner, request)

    return NextResponse.json({ plan, source: process.env.ANTHROPIC_API_KEY ? 'claude' : 'mock' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Помилка генерації' }, { status: 500 })
  }
}
