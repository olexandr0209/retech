import type { Metadata, Viewport } from 'next'
import '../lib/globals.css'
import { Providers } from './providers'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'ReTech — Знайди людину. Поділись. Навчись.',
  description: 'Волонтерська платформа де люди зустрічаються щоб ділитись знанням. Безкоштовно. Без дипломів. Просто люди.',
  openGraph: {
    title: 'ReTech — Давай дружити',
    description: 'Є щось що ти вмієш. І є хтось кому це потрібно.',
    type: 'website',
    siteName: 'ReTech',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://retech.chat'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
