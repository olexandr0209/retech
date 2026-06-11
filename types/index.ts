// ─── Мови ────────────────────────────────────────────────────────────────────
export type Lang = 'ua' | 'ru' | 'en'

// ─── Користувач ──────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  avatar_url?: string
  country?: string
  timezone?: string
  bio?: string
  gratitude_message?: string      // звернення до ментора — "безмежно вдячна..."
  can_teach: string[]             // що може навчити
  wants_to_learn: string[]        // що хоче вивчити
  languages: string[]             // мови спілкування
  total_hours: number             // години разом (з трекера)
  total_sessions: number          // кількість зустрічей
  streak_weeks: number            // тижнів поспіль
  created_at: string
}

// ─── Запит учня ──────────────────────────────────────────────────────────────
export type RequestStatus = 'open' | 'matched' | 'closed'
export type LevelType = 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'any'
export type FrequencyType = 'once_week' | 'twice_week' | 'flexible'

export interface LearningRequest {
  id: string
  user_id: string
  user?: User                     // populated join
  subject: string                 // тема: "Англійська", "Python"...
  level: LevelType
  text: string                    // живий текст запиту
  frequency: FrequencyType
  age?: number                    // вік учня (необов'язково)
  status: RequestStatus
  created_at: string
}

// ─── Пара (матч) ─────────────────────────────────────────────────────────────
export type PairStatus = 'active' | 'paused' | 'completed'

export interface Pair {
  id: string
  mentor_id: string
  learner_id: string
  request_id: string
  mentor?: User                   // populated join
  learner?: User                  // populated join
  subject: string
  whereby_room_url?: string       // посилання на відеокімнату
  status: PairStatus
  total_hours: number
  sessions_count: number
  created_at: string
}

// ─── Зустріч ─────────────────────────────────────────────────────────────────
export type SessionStatus = 'scheduled' | 'completed' | 'cancelled'

export interface Session {
  id: string
  pair_id: string
  pair?: Pair                     // populated join
  scheduled_at: string
  duration_min: number
  status: SessionStatus
  mentor_note?: string            // нотатка ментора після зустрічі
  learner_note?: string           // нотатка учня — "вперше говорила без страху"
  ai_summary?: string             // Claude аналіз прогресу
  created_at: string
}

// ─── Повідомлення чату ───────────────────────────────────────────────────────
export interface Message {
  id: string
  pair_id: string
  sender_id: string
  sender?: User                   // populated join
  text: string
  created_at: string
  read_at?: string
}

// ─── AI Конспект ─────────────────────────────────────────────────────────────
export interface LessonPlan {
  topic: string
  level: string
  opening_question: string        // з чого почати розмову
  key_phrases: string[]           // ключові фрази для учня
  activities: string[]            // що робити під час зустрічі
  tips: string[]                  // поради для ментора
  duration_min: number
}

// ─── Стан авторизації ────────────────────────────────────────────────────────
export interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

// ─── API відповіді ───────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T
  error?: string
}

// ─── Фільтри стрічки ─────────────────────────────────────────────────────────
export interface FeedFilters {
  subject?: string
  age_min?: number
  age_max?: number
  sort: 'newest' | 'age_asc' | 'age_desc'
}

// ─── Конфіг платформи ────────────────────────────────────────────────────────
export interface SiteConfig {
  requestsLimit: number
  stats: {
    people: string
    hours: string
    countries: string
  }
}
