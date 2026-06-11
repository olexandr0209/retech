import { NextRequest, NextResponse } from 'next/server'
import { createPair } from '@/lib/supabase'
import { createRoom } from '@/lib/whereby'
import { sendFounderLetter } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { mentorId, requestId, subject, mentorName, learnerName, mentorEmail } = body

    // 1. Створити пару в Supabase
    const pair = await createPair(mentorId, requestId)

    if (!pair) {
      // Mock відповідь якщо Supabase не підключено
      const mockPairId = `pair-${Date.now()}`
      const roomUrl = await createRoom(mockPairId)

      return NextResponse.json({
        ok: true,
        pairId: mockPairId,
        roomUrl,
        source: 'mock',
      })
    }

    // 2. Створити Whereby кімнату
    const roomUrl = await createRoom(pair.id)

    // 3. Якщо це перший урок — лист засновника менторові
    if (mentorEmail) {
      await sendFounderLetter(mentorEmail, mentorName, learnerName, subject)
    }

    return NextResponse.json({
      ok: true,
      pairId: pair.id,
      roomUrl,
      source: 'supabase',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
