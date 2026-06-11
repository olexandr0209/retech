import { NextRequest, NextResponse } from 'next/server'
import { sendSessionReminder, sendFounderLetter, sendWeeklyDigest } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type } = body

    switch (type) {
      case 'reminder': {
        const { toEmail, userName, partnerName, scheduledAt, roomUrl } = body
        await sendSessionReminder(toEmail, userName, partnerName, scheduledAt, roomUrl)
        return NextResponse.json({ ok: true })
      }

      case 'founder_letter': {
        const { toEmail, mentorName, learnerName, subject } = body
        await sendFounderLetter(toEmail, mentorName, learnerName, subject)
        return NextResponse.json({ ok: true })
      }

      case 'digest': {
        const { toEmail, userName, stats } = body
        await sendWeeklyDigest(toEmail, userName, stats)
        return NextResponse.json({ ok: true })
      }

      default:
        return NextResponse.json({ error: 'Невідомий тип листа' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
