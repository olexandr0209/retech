// lib/whereby.ts
// Підключення: додай WHEREBY_API_KEY в .env.local
// Документація: https://whereby.dev/http-api

const API_KEY = process.env.WHEREBY_API_KEY
export const isWherebyConnected = !!API_KEY

// ─── Створення кімнати для пари ──────────────────────────────────────────────
export async function createRoom(pairId: string): Promise<string | null> {
  if (!isWherebyConnected) {
    // Mock посилання для розробки
    return `https://whereby.com/retech-dev-${pairId}`
  }

  try {
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1) // кімната на рік

    const response = await fetch('https://api.whereby.dev/v1/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endDate: endDate.toISOString(),
        fields: ['hostRoomUrl'],
        roomNamePrefix: `retech-${pairId}`,
        roomMode: 'normal',
      }),
    })

    if (!response.ok) return null
    const data = await response.json()
    return data.roomUrl || null
  } catch {
    return null
  }
}

// ─── Видалення кімнати ────────────────────────────────────────────────────────
export async function deleteRoom(meetingId: string): Promise<void> {
  if (!isWherebyConnected) return

  await fetch(`https://api.whereby.dev/v1/meetings/${meetingId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${API_KEY}` },
  }).catch(() => {})
}
