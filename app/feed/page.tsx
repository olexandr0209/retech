'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { MOCK_REQUESTS } from '@/lib/mock'
import type { LearningRequest, FeedFilters } from '@/types'

// ─── Константи ────────────────────────────────────────────────────────────────
const SUBJECTS = ['Всі', 'Мови', 'IT', 'Музика', 'Школа', 'Готування', 'Інше']

const SUBJECT_MAP: Record<string, string[]> = {
  'Мови': ['Англійська', 'Українська', 'Німецька', 'Французька', 'Іспанська', 'Польська'],
  'IT': ['Python', 'JavaScript', 'Excel'],
  'Музика': ['Гітара', 'Фортепіано'],
  'Школа': ['Математика', 'Фізика', 'Хімія'],
  'Готування': ['Готування'],
  'Інше': [],
}

const COUNTRY_FLAGS: Record<string, string> = {
  IT: '🇮🇹', NL: '🇳🇱', CA: '🇨🇦', US: '🇺🇸', GB: '🇬🇧', DE: '🇩🇪',
  PL: '🇵🇱', FR: '🇫🇷', UA: '🇺🇦', CZ: '🇨🇿', ES: '🇪🇸',
}

const FREQ_LABELS: Record<string, string> = {
  once_week: 'Раз на тиждень',
  twice_week: 'Двічі на тиждень',
  flexible: 'Гнучко',
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Початковий',
  elementary: 'Базовий',
  intermediate: 'Середній',
  advanced: 'Просунутий',
  any: 'Будь-який',
}

// ─── Утиліти ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)} хв тому`
  if (diff < 86400) return `${Math.floor(diff / 3600)} год тому`
  if (diff < 604800) return `${Math.floor(diff / 86400)} дн тому`
  return `${Math.floor(diff / 604800)} тиж тому`
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = [
  { bg: '#FAECE7', color: '#712B13' },
  { bg: '#EDF2F7', color: '#243344' },
  { bg: '#E1F5EE', color: '#085041' },
  { bg: '#FAEEDA', color: '#412402' },
  { bg: '#EEEDFE', color: '#26215C' },
]

// ─── Компонент картки запиту ──────────────────────────────────────────────────
function RequestCard({ req, idx, onOpen }: { req: LearningRequest; idx: number; onOpen: (r: LearningRequest) => void }) {
  const colors = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const flag = req.user?.country ? COUNTRY_FLAGS[req.user.country] || '' : ''

  return (
    <div onClick={() => onOpen(req)} style={{
      background: 'var(--card-bg)', border: '0.5px solid var(--border)',
      borderRadius: 14, padding: '1rem 1.25rem', marginBottom: 10,
      cursor: 'pointer', transition: 'border-color .2s, transform .15s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#F5C4B3'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'none'
      }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: colors.bg, color: colors.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
          {getInitials(req.user?.name || 'U')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>
            {req.user?.name}{req.age ? `, ${req.age}` : ''} {flag}
          </div>
          <div style={{ fontSize: 12, color: 'var(--hint)', marginTop: 2 }}>
            {timeAgo(req.created_at)}
          </div>
        </div>
        <span style={{ background: '#FAECE7', color: '#712B13', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500, flexShrink: 0 }}>
          {req.subject}
        </span>
      </div>

      <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.65, marginBottom: 10 }}>
        {req.text.length > 120 ? req.text.slice(0, 120) + '...' : req.text}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 10, borderTop: '0.5px solid var(--border)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--hint)', marginBottom: 4 }}>Хоче вивчити</div>
          <span style={{ background: '#FAECE7', color: '#712B13', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500 }}>{req.subject}</span>
        </div>
        {req.user?.can_teach && req.user.can_teach.length > 0 && (
          <>
            <div style={{ width: '0.5px', background: 'var(--border)', alignSelf: 'stretch', margin: '0 4px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--hint)', marginBottom: 4 }}>Може поділитись</div>
              <span style={{ background: '#EDF2F7', color: '#243344', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500 }}>{req.user.can_teach[0]}</span>
            </div>
          </>
        )}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--hint)', marginBottom: 4 }}>Частота</div>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{FREQ_LABELS[req.frequency]}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Модальне вікно профілю ───────────────────────────────────────────────────
function ProfileModal({ req, idx, onClose, onMatch }: {
  req: LearningRequest; idx: number; onClose: () => void; onMatch: () => void
}) {
  const colors = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const flag = req.user?.country ? COUNTRY_FLAGS[req.user.country] || '' : ''

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, zIndex: 50, overflowY: 'auto',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--card-bg)', borderRadius: 16, padding: '1.5rem',
        width: '100%', maxWidth: 420, maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.25rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: colors.bg, color: colors.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 500, flexShrink: 0 }}>
            {getInitials(req.user?.name || 'U')}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--text)' }}>
              {req.user?.name}{req.age ? `, ${req.age}` : ''} {flag}
            </div>
            <div style={{ fontSize: 13, color: 'var(--hint)', marginTop: 2 }}>
              {timeAgo(req.created_at)} · {LEVEL_LABELS[req.level]}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--hint)', padding: 4 }}>×</button>
        </div>

        {req.user?.gratitude_message && (
          <div style={{ background: '#FAECE7', borderRadius: 10, padding: '12px 14px', marginBottom: '1.25rem', fontSize: 14, color: '#712B13', lineHeight: 1.75, fontStyle: 'italic' }}>
            "{req.user.gratitude_message}"
          </div>
        )}

        {req.user?.bio && (
          <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            {req.user.bio}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1.25rem' }}>
          <div style={{ background: '#FAECE7', borderRadius: 10, padding: '12px' }}>
            <div style={{ fontSize: 11, color: '#712B13', fontWeight: 500, marginBottom: 5, letterSpacing: '.04em', textTransform: 'uppercase' }}>Хоче вивчити</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{req.subject}</div>
            <div style={{ fontSize: 12, color: 'var(--hint)', marginTop: 2 }}>{LEVEL_LABELS[req.level]}</div>
          </div>
          {req.user?.can_teach && req.user.can_teach.length > 0 && (
            <div style={{ background: '#EDF2F7', borderRadius: 10, padding: '12px' }}>
              <div style={{ fontSize: 11, color: '#243344', fontWeight: 500, marginBottom: 5, letterSpacing: '.04em', textTransform: 'uppercase' }}>Може поділитись</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{req.user.can_teach.join(', ')}</div>
              <div style={{ fontSize: 12, color: 'var(--hint)', marginTop: 2 }}>{FREQ_LABELS[req.frequency]}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span style={{ background: 'var(--gray)', color: 'var(--muted)', borderRadius: 8, padding: '5px 12px', fontSize: 12 }}>
            🕐 {FREQ_LABELS[req.frequency]}
          </span>
          <span style={{ background: 'var(--gray)', color: 'var(--muted)', borderRadius: 8, padding: '5px 12px', fontSize: 12 }}>
            💻 Онлайн
          </span>
        </div>

        <button onClick={onMatch} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, background: '#C85A2A', color: '#fff', border: 'none',
          borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .15s',
        }} onMouseEnter={e => (e.currentTarget.style.opacity = '.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
          Давай дружити ♥
        </button>

        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'var(--hint)' }}>
          Ти побачиш контакт після взаємного підтвердження
        </div>
      </div>
    </div>
  )
}

// ─── Головний компонент ───────────────────────────────────────────────────────
export default function FeedPage() {
  const { user, isAuthenticated } = useAuth()
  const [activeSubject, setActiveSubject] = useState('Всі')
  const [sort, setSort] = useState<FeedFilters['sort']>('newest')
  const [selectedReq, setSelectedReq] = useState<LearningRequest | null>(null)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [matched, setMatched] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  // Фільтрація і сортування
  const filtered = useMemo(() => {
    let list = [...MOCK_REQUESTS]

    if (activeSubject !== 'Всі') {
      const subjects = SUBJECT_MAP[activeSubject] || []
      if (subjects.length > 0) {
        list = list.filter(r => subjects.some(s => r.subject.includes(s)))
      }
    }

    // Не показуємо власні запити
    if (user) list = list.filter(r => r.user_id !== user.id)

    // Не показуємо вже прийняті
    list = list.filter(r => !matched.includes(r.id))

    list.sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sort === 'age_asc') return (a.age || 99) - (b.age || 99)
      if (sort === 'age_desc') return (b.age || 0) - (a.age || 0)
      return 0
    })

    return list
  }, [activeSubject, sort, user, matched])

  const handleMatch = () => {
    if (!selectedReq) return
    setMatched(m => [...m, selectedReq.id])
    setSelectedReq(null)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <>
      <style>{`
        :root {
          --fire: #C85A2A; --fire-bg: #FAECE7; --fire-dark: #712B13;
          --blue: #4A6580; --blue-bg: #EDF2F7; --blue-dark: #243344;
          --gray: #f5f5f3; --border: rgba(0,0,0,0.08);
          --text: #1a1a1a; --muted: #555; --hint: #999;
          --card-bg: #fff;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --gray: #1a1a18; --border: rgba(255,255,255,0.09);
            --text: #e8e6e0; --muted: #aaa; --hint: #666;
            --card-bg: #1a1a18; --fire-bg: #2a1508; --fire-dark: #F5C4B3;
            --blue-bg: #0c1620; --blue-dark: #A8BDD0;
          }
          body { background: #111; }
        }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .header { position: sticky; top: 0; background: var(--gray); border-bottom: 0.5px solid var(--border); z-index: 10; padding: 0 20px; }
        .header-inner { max-width: 680px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 56px; gap: 12px; }
        .logo span:first-child { color: #C85A2A; font-size: 18px; font-weight: 500; }
        .logo span:last-child { color: #4A6580; font-size: 18px; font-weight: 500; }
        .nav-links { display: flex; gap: 16px; }
        .nav-link { font-size: 13px; color: var(--muted); text-decoration: none; transition: color .15s; }
        .nav-link:hover, .nav-link.active { color: var(--fire); }
        .btn-sm { display: inline-flex; align-items: center; gap: 6px; background: var(--fire); color: #fff; border: none; border-radius: 8px; padding: 7px 14px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; text-decoration: none; transition: opacity .15s; }
        .btn-sm:hover { opacity: .9; }
        .container { max-width: 680px; margin: 0 auto; padding: 0 20px; }
        .filters { display: flex; gap: 8px; overflow-x: auto; padding: 14px 0 10px; scrollbar-width: none; }
        .filters::-webkit-scrollbar { display: none; }
        .chip { padding: 7px 16px; font-size: 13px; border: 0.5px solid var(--border); border-radius: 20px; background: var(--gray); color: var(--muted); cursor: pointer; white-space: nowrap; transition: all .15s; font-family: inherit; }
        .chip:hover { border-color: #C85A2A; color: #C85A2A; }
        .chip.active { background: #C85A2A; color: #fff; border-color: #C85A2A; font-weight: 500; }
        .sort-row { display: flex; gap: 8px; align-items: center; padding-bottom: 14px; }
        .sort-label { font-size: 12px; color: var(--hint); }
        .sort-btn { padding: 5px 12px; font-size: 12px; border: 0.5px solid var(--border); border-radius: 7px; background: transparent; color: var(--hint); cursor: pointer; font-family: inherit; transition: all .15s; }
        .sort-btn:hover { color: var(--muted); }
        .sort-btn.active { color: #C85A2A; border-color: #F5C4B3; background: #FAECE7; }
        .count { font-size: 12px; color: var(--hint); margin-left: auto; }
        .empty { text-align: center; padding: 3rem 1rem; color: var(--hint); font-size: 14px; }
        .mission { border-left: 2.5px solid #C85A2A; padding: 8px 0 8px 14px; font-size: 13px; color: var(--muted); font-style: italic; line-height: 1.7; margin: 0 0 1.25rem; border-radius: 0; }
        .success-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #1a1a1a; color: #fff; border-radius: 10px; padding: 12px 20px; font-size: 14px; z-index: 100; white-space: nowrap; animation: slideUp .3s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .add-request-btn { display: flex; align-items: center; gap: 8px; width: 100%; background: var(--fire-bg); color: var(--fire-dark); border: 1.5px dashed #F5C4B3; border-radius: 14px; padding: 14px 1.25rem; font-size: 14px; font-weight: 500; cursor: pointer; font-family: inherit; margin-bottom: 12px; transition: border-color .15s; }
        .add-request-btn:hover { border-color: #C85A2A; }
        @media (max-width: 600px) { .nav-links { display: none; } }
      `}</style>

      {/* ШАПКА */}
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
            <span>Re</span><span>Tech</span>
          </Link>
          <nav className="nav-links">
            <Link href="/feed" className="nav-link active">Стрічка</Link>
            <Link href="/dashboard" className="nav-link">Мої пари</Link>
          </nav>
          {isAuthenticated
            ? <Link href="/dashboard" className="btn-sm">{user?.name} →</Link>
            : <Link href="/register" className="btn-sm">Приєднатись</Link>
          }
        </div>
      </header>

      <main className="container" style={{ paddingTop: 8, paddingBottom: 40 }}>

        <div className="mission" style={{ marginTop: 16 }}>
          Не шукай учня. Знайди людину.
        </div>

        {/* Кнопка додати свій запит */}
        {isAuthenticated && (
          <button className="add-request-btn">
            + Додати свій запит на навчання
          </button>
        )}

        {/* Фільтри по темі */}
        <div className="filters">
          {SUBJECTS.map(s => (
            <button key={s} className={`chip${activeSubject === s ? ' active' : ''}`}
              onClick={() => setActiveSubject(s)}>{s}</button>
          ))}
        </div>

        {/* Сортування */}
        <div className="sort-row">
          <span className="sort-label">Сортувати:</span>
          {([['newest', 'Нові'], ['age_asc', 'Молодші'], ['age_desc', 'Старші']] as const).map(([val, label]) => (
            <button key={val} className={`sort-btn${sort === val ? ' active' : ''}`}
              onClick={() => setSort(val)}>{label}</button>
          ))}
          <span className="count">{filtered.length} {filtered.length === 1 ? 'запит' : filtered.length < 5 ? 'запити' : 'запитів'}</span>
        </div>

        {/* Картки */}
        {filtered.length === 0
          ? <div className="empty">Поки немає запитів за цим фільтром.<br /><span style={{ fontSize: 12 }}>Нові запити з'являються щодня.</span></div>
          : filtered.map((req, idx) => (
            <RequestCard key={req.id} req={req} idx={idx}
              onOpen={r => { setSelectedReq(r); setSelectedIdx(idx) }} />
          ))
        }
      </main>

      {/* Модалка профілю */}
      {selectedReq && (
        <ProfileModal
          req={selectedReq}
          idx={selectedIdx}
          onClose={() => setSelectedReq(null)}
          onMatch={handleMatch}
        />
      )}

      {/* Toast після матчу */}
      {showSuccess && (
        <div className="success-toast">
          ♥ Відгук надіслано — чекай підтвердження
        </div>
      )}
    </>
  )
}
