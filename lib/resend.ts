// lib/resend.ts
// Підключення: додай RESEND_API_KEY в .env.local
// Встанови: npm install resend

const API_KEY = process.env.RESEND_API_KEY
const FROM = process.env.RESEND_FROM_EMAIL || 'hello@retech.world'
const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL || 'hello@retech.world'

export const isResendConnected = !!API_KEY

// ─── Базова відправка ─────────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!isResendConnected) {
    console.log(`[Email mock] To: ${to} | Subject: ${subject}`)
    return true
  }

  try {
    // Розкоментуй після: npm install resend
    // const { Resend } = require('resend')
    // const resend = new Resend(API_KEY)
    // await resend.emails.send({ from: FROM, to, subject, html })
    return true
  } catch {
    return false
  }
}

// ─── Нагадування перед зустріччю ─────────────────────────────────────────────
export async function sendSessionReminder(
  toEmail: string,
  userName: string,
  partnerName: string,
  scheduledAt: string,
  roomUrl: string
) {
  const date = new Date(scheduledAt).toLocaleString('uk-UA', {
    weekday: 'long', hour: '2-digit', minute: '2-digit'
  })

  return sendEmail(
    toEmail,
    `ReTech · Зустріч з ${partnerName} — ${date}`,
    `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a;">
      <div style="margin-bottom:24px;">
        <span style="color:#C85A2A;font-weight:500;font-size:18px;">Re</span>
        <span style="color:#4A6580;font-weight:500;font-size:18px;">Tech</span>
      </div>
      <p style="font-size:16px;">${userName},</p>
      <p style="font-size:15px;color:#666;line-height:1.7;">
        За 15 хвилин твоя зустріч з <strong>${partnerName}</strong>.
        <br>Він витрачає свій вечір — і робить це з радістю. Просто будь собою.
      </p>
      <a href="${roomUrl}" style="display:inline-block;background:#C85A2A;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;margin:20px 0;font-weight:500;">
        Приєднатись до зустрічі →
      </a>
      <p style="font-size:13px;color:#999;margin-top:32px;border-top:1px solid #f0f0f0;padding-top:16px;">
        Знайди людину. Поділись. Навчись. — retech.world
      </p>
    </div>
    `
  )
}

// ─── Лист засновника після першого уроку ─────────────────────────────────────
export async function sendFounderLetter(
  toEmail: string,
  mentorName: string,
  learnerName: string,
  subject: string
) {
  return sendEmail(
    toEmail,
    `Дякую тобі, ${mentorName} — від засновника ReTech`,
    `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a;">
      <div style="margin-bottom:24px;">
        <span style="color:#C85A2A;font-weight:500;font-size:18px;">Re</span>
        <span style="color:#4A6580;font-weight:500;font-size:18px;">Tech</span>
      </div>
      <p style="font-size:16px;">${mentorName},</p>
      <p style="font-size:15px;color:#444;line-height:1.8;">
        Ти провів свою першу зустріч вчора — з ${learnerName} по темі "${subject}".
      </p>
      <p style="font-size:15px;color:#444;line-height:1.8;">
        Дякую тобі за це — не як ввічливість, а справді.
        Ти витратив свій вечір на людину яка цього дуже потребувала.
        І ти змінив щось у її житті.
      </p>
      <p style="font-size:15px;color:#444;line-height:1.8;">
        Я радий що ти тут.
      </p>
      <p style="font-size:15px;color:#444;margin-top:24px;">
        — Oleksandr Krychylskyi<br>
        <span style="color:#999;font-size:13px;">Засновник ReTech</span>
      </p>
      <p style="font-size:13px;color:#999;margin-top:32px;border-top:1px solid #f0f0f0;padding-top:16px;">
        retech.world · hello@retech.world
      </p>
    </div>
    `
  )
}

// ─── Щотижневий дайджест ─────────────────────────────────────────────────────
export async function sendWeeklyDigest(
  toEmail: string,
  userName: string,
  stats: { sessions: number; hours: number; streak: number }
) {
  return sendEmail(
    toEmail,
    `ReTech · Твій тиждень — ${stats.sessions} зустрічей`,
    `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a;">
      <div style="margin-bottom:24px;">
        <span style="color:#C85A2A;font-weight:500;font-size:18px;">Re</span>
        <span style="color:#4A6580;font-weight:500;font-size:18px;">Tech</span>
      </div>
      <p style="font-size:16px;">${userName},</p>
      <p style="font-size:15px;color:#666;line-height:1.7;">Твій тиждень на ReTech:</p>
      <div style="display:flex;gap:12px;margin:20px 0;">
        <div style="background:#FAECE7;border-radius:10px;padding:16px;text-align:center;flex:1;">
          <div style="font-size:28px;font-weight:500;color:#C85A2A;">${stats.sessions}</div>
          <div style="font-size:12px;color:#712B13;">зустрічей</div>
        </div>
        <div style="background:#EDF2F7;border-radius:10px;padding:16px;text-align:center;flex:1;">
          <div style="font-size:28px;font-weight:500;color:#4A6580;">${stats.hours}</div>
          <div style="font-size:12px;color:#243344;">годин</div>
        </div>
        <div style="background:#f5f5f3;border-radius:10px;padding:16px;text-align:center;flex:1;">
          <div style="font-size:28px;font-weight:500;color:#333;">${stats.streak}</div>
          <div style="font-size:12px;color:#666;">тижнів поспіль</div>
        </div>
      </div>
      <p style="font-size:13px;color:#999;margin-top:32px;border-top:1px solid #f0f0f0;padding-top:16px;">
        Знайди людину. Поділись. Навчись. — retech.world
      </p>
    </div>
    `
  )
}
