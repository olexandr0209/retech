import type { Metadata } from 'next'
import '../lib/globals.css'

export const metadata: Metadata = {
  title: 'ReTech — Знайди людину. Поділись. Навчись.',
  description: 'Волонтерська платформа де люди зустрічаються щоб ділитись знанням. Безкоштовно. Без дипломів. Просто люди.',
  openGraph: {
    title: 'ReTech — Давай дружити',
    description: 'Є щось що ти вмієш. І є хтось кому це потрібно.',
    type: 'website',
    siteName: 'ReTech',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        {/* AuthProvider підключається тут після: 'use client' wrapper */}
        {children}
      </body>
    </html>
  )
}
