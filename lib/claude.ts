// lib/claude.ts
// Підключення: додай ANTHROPIC_API_KEY в .env.local
// Встанови: npm install @anthropic-ai/sdk

import type { LessonPlan, User, LearningRequest } from '@/types'

const API_KEY = process.env.ANTHROPIC_API_KEY
export const isClaudeConnected = !!API_KEY

// ─── Генерація конспекту уроку ───────────────────────────────────────────────
export async function generateLessonPlan(
  mentor: User,
  learner: User,
  request: LearningRequest
): Promise<LessonPlan> {
  if (!isClaudeConnected) {
    // Mock відповідь поки немає API ключа
    return getMockLessonPlan(request.subject, request.level)
  }

  const prompt = `Ти помічник для ментора волонтерської платформи ReTech.
Ментор: ${mentor.name}, може навчити: ${mentor.can_teach.join(', ')}
Учень: ${learner.name}, хоче навчитись: ${request.subject}, рівень: ${request.level}
Звернення учня: "${request.text}"

Склади простий конспект для першої зустрічі (45-60 хвилин).
Відповідь ТІЛЬКИ у форматі JSON без markdown:
{
  "topic": "назва теми",
  "level": "рівень учня",
  "opening_question": "питання щоб почати розмову природньо",
  "key_phrases": ["фраза 1", "фраза 2", "фраза 3"],
  "activities": ["активність 1", "активність 2"],
  "tips": ["порада для ментора 1", "порада 2"],
  "duration_min": 45
}`

  try {
    // Розкоментуй після: npm install @anthropic-ai/sdk
    // const Anthropic = require('@anthropic-ai/sdk')
    // const client = new Anthropic({ apiKey: API_KEY })
    // const msg = await client.messages.create({
    //   model: 'claude-sonnet-4-20250514',
    //   max_tokens: 1024,
    //   messages: [{ role: 'user', content: prompt }]
    // })
    // const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    // return JSON.parse(text.replace(/```json|```/g, '').trim())

    return getMockLessonPlan(request.subject, request.level)
  } catch {
    return getMockLessonPlan(request.subject, request.level)
  }
}

// ─── Аналіз прогресу після зустрічі ─────────────────────────────────────────
export async function analyzeProgress(
  mentorNote: string,
  learnerNote: string,
  subject: string
): Promise<string> {
  if (!isClaudeConnected) {
    return 'Зустріч завершена. Продовжуйте в тому ж темпі.'
  }

  const prompt = `Коротко проаналізуй прогрес після зустрічі з теми "${subject}".
Нотатка ментора: "${mentorNote}"
Нотатка учня: "${learnerNote}"
Дай 1-2 речення про прогрес і рекомендацію для наступної зустрічі. Тепло і підбадьорливо.`

  try {
    // Розкоментуй після підключення:
    // const Anthropic = require('@anthropic-ai/sdk')
    // const client = new Anthropic({ apiKey: API_KEY })
    // const msg = await client.messages.create({
    //   model: 'claude-sonnet-4-20250514',
    //   max_tokens: 200,
    //   messages: [{ role: 'user', content: prompt }]
    // })
    // return msg.content[0].type === 'text' ? msg.content[0].text : ''

    return 'Зустріч завершена. Продовжуйте в тому ж темпі.'
  } catch {
    return 'Зустріч завершена.'
  }
}

// ─── Mock конспект (поки немає API ключа) ────────────────────────────────────
function getMockLessonPlan(subject: string, level: string): LessonPlan {
  return {
    topic: `${subject} — перша зустріч`,
    level,
    opening_question: 'Розкажи мені про свій типовий день — будь-якою мовою. Я допоможу якщо застрянеш.',
    key_phrases: [
      'How are you? / Як справи?',
      'Can you repeat please? / Можеш повторити?',
      'I don\'t understand / Я не розумію',
    ],
    activities: [
      'Знайомство — 10 хв: розкажіть одне одному про себе',
      'Базові фрази — 20 хв: практика ключових виразів',
      'Вільна розмова — 15 хв: будь-яка тема',
    ],
    tips: [
      'Не виправляй кожну помилку — тільки якщо заважає розумінню',
      'Підбадьорюй часто — учень хвилюється',
      'Говори повільніше ніж зазвичай',
    ],
    duration_min: 45,
  }
}
