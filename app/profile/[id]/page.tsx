'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { MOCK_USERS, MOCK_REQUESTS } from '@/lib/mock'
import type { User } from '@/types'

const COUNTRY_FLAGS: Record<string, string> = {
  IT: '🇮🇹', NL: '🇳🇱', CA: '🇨🇦', US: '🇺🇸', GB: '🇬🇧', DE: '🇩🇪',
  PL: '🇵🇱', FR: '🇫🇷', UA: '🇺🇦', CZ: '🇨🇿', ES: '🇪🇸',
}

const AVATAR_COLORS = [
  { bg: '#FAECE7', color: '#712B13' },
  { bg: '#EDF2F7', color: '#243344' },
  { bg: '#E1F5EE', color: '#085041' },
  { bg: '#FAEEDA', color: '#412402' },
  { bg: '#EEEDFE', color: '#26215C' },
]

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function timeJoined(iso: string) {
  const months = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24 * 30))
  if (months < 1) return 'цього місяця'
  if (months === 1) return '1 місяць тому'
  if (months < 5) return `${months} місяці тому`
  return `${months} місяців тому`
}

function StatPill({ num, label, fire }: { num: number; label: string; fire?: boolean }) {
  return (
    <div style={{ background: fire ? '#FAECE7' : '#EDF2F7', borderRadius: 10, padding: '10px 14px', textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 22, fontWeight: 500, color: fire ? '#C85A2A' : '#4A6580' }}>{num}</div>
      <div style={{ fontSize: 11, color: fire ? '#712B13' : '#243344', marginTop: 2 }}>{label}</div>
    </div>
  )
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user: currentUser, isAuthenticated } = useAuth()
  const [matched, setMatched] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Знаходимо користувача — спочатку в mock, потім Supabase
  // Supabase: const profile = await getUser(id)
  const colorIdx = MOCK_USERS.findIndex(u => u.id === id) % AVATAR_COLORS.length
  const profile: User | undefined = MOCK_USERS.find(u => u.id === id) ?? {
    id,
    name: 'Користувач',
    can_teach: [],
    wants_to_learn: [],
    languages: [],
    total_hours: 0,
    total_sessions: 0,
    streak_weeks: 0,
    created_at: new Date().toISOString(),
  }

  const colors = AVATAR_COLORS[Math.abs(colorIdx) % AVATAR_COLORS.length]
  const flag = profile.country ? COUNTRY_FLAGS[profile.country] || '' : ''
  const isOwn = currentUser?.id === id

  // Запити цієї людини
  const requests = MOCK_REQUESTS.filter(r => r.user_id === id)

  const handleMatch = () => {
    setMatched(true)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <>
      <style>{`
        :root {
          --fire: #C85A2A; --fire-bg: #FAECE7; --fire-dark: #712B13;
          --blue: #4A6580; --blue-bg: #EDF2F7; --blue-dark: #243344;
          --gray: #f5f5f3; --border: rgba(0,0,0,0.08);
          --text: #1a1a1a; --muted: #555; --hint: #999; --card-bg: #fff;
        }
        @media (prefers-color-scheme: dark) {
          :root { --gray: #1a1a18; --border: rgba(255,255,255,0.09); --text: #e8e6e0; --muted: #aaa; --hint: #666; --card-bg: #1a1a18; --fire-bg: #2a1508; --fire-dark: #F5C4B3; --blue-bg: #0c1620; --blue-dark: #A8BDD0; }
          body { background: #111; }
        }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .header { position: sticky; top: 0; background: var(--gray); border-bottom: 0.5px solid var(--border); z-index: 10; padding: 0 20px; }
        .header-inner { max-width: 680px; margin: 0 auto; display: flex; align-items: center; height: 56px; gap: 12px; }
        .back-btn { display: flex; align-items: center; gap: 6px; color: var(--muted); font-size: 14px; text-decoration: none; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; transition: color .15s; }
        .back-btn:hover { color: var(--fire); }
        .logo span:first-child { color: #C85A2A; font-size: 18px; font-weight: 500; }
        .logo span:last-child { color: #4A6580; font-size: 18px; font-weight: 500; }
        .container { max-width: 680px; margin: 0 auto; padding: 0 20px 48px; }
        .hero { padding: 2rem 0 0; text-align: center; margin-bottom: 1.5rem; }
        .avatar-big { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 500; margin: 0 auto 1rem; }
        .card { background: var(--card-bg); border: 0.5px solid var(--border); border-radius: 14px; padding: 1.25rem; margin-bottom: 12px; }
        .section-label { font-size: 11px; font-weight: 500; color: var(--hint); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 10px; }
        .tag-fire { display: inline-block; background: var(--fire-bg); color: var(--fire-dark); border-radius: 6px; padding: 4px 12px; font-size: 13px; font-weight: 500; margin: 3px; }
        .tag-blue { display: inline-block; background: var(--blue-bg); color: var(--blue-dark); border-radius: 6px; padding: 4px 12px; font-size: 13px; font-weight: 500; margin: 3px; }
        .btn-primary { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: #C85A2A; color: #fff; border: none; border-radius: 10px; padding: 13px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: inherit; transition: opacity .15s; }
        .btn-primary:hover { opacity: .9; }
        .btn-primary:disabled { opacity: .6; cursor: default; }
        .btn-secondary { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: transparent; color: #C85A2A; border: 1.5px solid #C85A2A; border-radius: 10px; padding: 12px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; transition: background .15s; text-decoration: none; }
        .btn-secondary:hover { background: var(--fire-bg); }
        .mission { border-left: 2.5px solid var(--fire); padding: 8px 0 8px 14px; font-size: 14px; color: var(--fire-dark); font-style: italic; line-height: 1.75; background: var(--fire-bg); border-radius: 0 10px 10px 0; padding-right: 14px; }
        .req-card { border: 0.5px solid var(--border); border-radius: 10px; padding: 12px 14px; margin-bottom: 8px; }
        .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #1a1a1a; color: #fff; border-radius: 10px; padding: 12px 20px; font-size: 14px; z-index: 100; white-space: nowrap; animation: up .3s ease; }
        @keyframes up { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .divider { border: none; border-top: 0.5px solid var(--border); margin: 1rem 0; }
      `}</style>

      <header className="header">
        <div className="header-inner">
          <button className="back-btn" onClick={() => history.back()}>
            ← Назад
          </button>
          <div style={{ flex: 1 }} />
          <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
            <span>Re</span><span>Tech</span>
          </Link>
        </div>
      </header>

      <main className="container">

        {/* ── ГЕРОЙ ──────────────────────────────────────────────────────── */}
        <div className="hero">
          <div className="avatar-big" style={{ background: colors.bg, color: colors.color }}>
            {getInitials(profile.name)}
          </div>

          <div style={{ fontSize: 24, fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>
            {profile.name} {flag}
          </div>
          <div style={{ fontSize: 14, color: 'var(--hint)', marginBottom: '1.25rem' }}>
            {profile.country && `${profile.country} · `}На платформі {timeJoined(profile.created_at)}
          </div>

          {/* Статистика */}
          <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
            <StatPill num={profile.total_hours} label="годин" fire />
            <StatPill num={profile.total_sessions} label="зустрічей" />
            <StatPill num={profile.streak_weeks} label="тижнів" />
          </div>
        </div>

        {/* ── ЗВЕРНЕННЯ ──────────────────────────────────────────────────── */}
        {profile.gratitude_message && (
          <div className="card">
            <div className="mission">{profile.gratitude_message}</div>
          </div>
        )}

        {/* ── ПРО СЕБЕ ───────────────────────────────────────────────────── */}
        {profile.bio && (
          <div className="card">
            <div className="section-label">Про себе</div>
            <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>
              {profile.bio}
            </div>
          </div>
        )}

        {/* ── ЩО ВЧИТЬ / ЩО ДІЛИТЬСЯ ────────────────────────────────────── */}
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div className="section-label">Хоче вивчити</div>
              <div>
                {profile.wants_to_learn.map(s => (
                  <span key={s} className="tag-fire">{s}</span>
                ))}
                {profile.wants_to_learn.length === 0 && (
                  <span style={{ fontSize: 13, color: 'var(--hint)' }}>—</span>
                )}
              </div>
            </div>
            <div>
              <div className="section-label">Може поділитись</div>
              <div>
                {profile.can_teach.map(s => (
                  <span key={s} className="tag-blue">{s}</span>
                ))}
                {profile.can_teach.length === 0 && (
                  <span style={{ fontSize: 13, color: 'var(--hint)' }}>—</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── АКТИВНІ ЗАПИТИ ─────────────────────────────────────────────── */}
        {requests.length > 0 && (
          <div className="card">
            <div className="section-label">Активні запити</div>
            {requests.map(req => (
              <div key={req.id} className="req-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span className="tag-fire" style={{ margin: 0 }}>{req.subject}</span>
                  <span style={{ fontSize: 12, color: 'var(--hint)', marginLeft: 'auto' }}>
                    {req.frequency === 'once_week' ? 'Раз на тиждень' : req.frequency === 'twice_week' ? 'Двічі' : 'Гнучко'}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>
                  {req.text.length > 100 ? req.text.slice(0, 100) + '...' : req.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        {!isOwn && (
          <div style={{ marginTop: '1.5rem' }}>
            {!isAuthenticated ? (
              <>
                <Link href="/register" className="btn-primary" style={{ display: 'flex', textDecoration: 'none', marginBottom: 10 }}>
                  Зареєструватись щоб написати →
                </Link>
                <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--hint)' }}>
                  Безкоштовно · Без зобов'язань
                </div>
              </>
            ) : matched ? (
              <div style={{ background: '#E1F5EE', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#085041', marginBottom: 4 }}>
                  ♥ Відгук надіслано
                </div>
                <div style={{ fontSize: 13, color: '#0F6E56' }}>
                  Чекай підтвердження від {profile.name}
                </div>
              </div>
            ) : (
              <>
                <button className="btn-primary" onClick={handleMatch} style={{ marginBottom: 10 }}>
                  Давай дружити ♥
                </button>
                <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--hint)' }}>
                  Ти побачиш контакт після взаємного підтвердження
                </div>
              </>
            )}
          </div>
        )}

        {/* Власний профіль — кнопка редагування */}
        {isOwn && (
          <div style={{ marginTop: '1.5rem' }}>
            <button className="btn-secondary">
              ✏ Редагувати профіль
            </button>
          </div>
        )}

      </main>

      {showToast && (
        <div className="toast">♥ Відгук надіслано — чекай підтвердження</div>
      )}
    </>
  )
}
