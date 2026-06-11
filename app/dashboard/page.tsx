'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { MOCK_PAIRS, MOCK_SESSIONS, MOCK_CURRENT_USER } from '@/lib/mock'
import type { Pair, Session } from '@/types'

// ─── Утиліти ─────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleString('uk-UA', {
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  })
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleString('uk-UA', {
    day: 'numeric', month: 'short',
  })
}

const AVATAR_COLORS = [
  { bg: '#FAECE7', color: '#712B13' },
  { bg: '#EDF2F7', color: '#243344' },
  { bg: '#E1F5EE', color: '#085041' },
]

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

// ─── Компонент статистики ─────────────────────────────────────────────────────
function StatCard({ num, label, bg, color }: { num: number | string; label: string; bg: string; color: string }) {
  return (
    <div style={{ background: bg, borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
      <div style={{ fontSize: 30, fontWeight: 500, color, lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: 12, color, marginTop: 4, opacity: .7 }}>{label}</div>
    </div>
  )
}

// ─── Компонент пари ───────────────────────────────────────────────────────────
function PairCard({ pair, idx, nextSession, onChatOpen }: {
  pair: Pair; idx: number; nextSession?: Session; onChatOpen: (pair: Pair) => void
}) {
  const partner = pair.learner || pair.mentor
  const colors = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)

  const saveNote = () => {
    setNoteSaved(true)
    setTimeout(() => { setNoteSaved(false); setNoteOpen(false) }, 1500)
  }

  return (
    <div style={{ background: 'var(--card-bg)', border: '0.5px solid var(--border)', borderRadius: 14, padding: '1.25rem', marginBottom: 12 }}>

      {/* Шапка пари */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: colors.bg, color: colors.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, flexShrink: 0 }}>
          {getInitials(partner?.name || 'U')}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text)' }}>{partner?.name}</div>
          <div style={{ fontSize: 12, color: 'var(--hint)', marginTop: 2 }}>
            {pair.subject} · разом з {formatDateShort(pair.created_at)}
          </div>
        </div>
        <span style={{ background: '#FAECE7', color: '#712B13', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500 }}>
          {pair.subject}
        </span>
      </div>

      {/* Статистика пари */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: '1rem' }}>
        <div style={{ background: '#EDF2F7', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 500, color: '#4A6580' }}>{pair.total_hours}</div>
          <div style={{ fontSize: 11, color: '#4A6580', marginTop: 2 }}>годин</div>
        </div>
        <div style={{ background: '#EDF2F7', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 500, color: '#4A6580' }}>{pair.sessions_count}</div>
          <div style={{ fontSize: 11, color: '#4A6580', marginTop: 2 }}>зустрічей</div>
        </div>
        <div style={{ background: 'var(--gray)', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--text)' }}>
            {Math.round(pair.total_hours / Math.max(1, Math.ceil((Date.now() - new Date(pair.created_at).getTime()) / 604800000)))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--hint)', marginTop: 2 }}>год/тиж</div>
        </div>
      </div>

      {/* Наступна зустріч */}
      {nextSession && (
        <div style={{ background: '#FAECE7', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: '#C85A2A', borderRadius: 8, padding: '6px 10px', textAlign: 'center', minWidth: 44 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>
              {new Date(nextSession.scheduled_at).getDate()}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.8)' }}>
              {new Date(nextSession.scheduled_at).toLocaleString('uk-UA', { month: 'short' })}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#712B13' }}>Наступна зустріч</div>
            <div style={{ fontSize: 12, color: '#993C1D', marginTop: 2 }}>
              {new Date(nextSession.scheduled_at).toLocaleString('uk-UA', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <a href={pair.whereby_room_url || '#'} target="_blank" rel="noopener noreferrer"
            style={{ background: '#C85A2A', color: '#fff', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 500, textDecoration: 'none', flexShrink: 0 }}>
            Приєднатись →
          </a>
        </div>
      )}

      {/* Цитата партнера */}
      {partner?.gratitude_message && (
        <div style={{ borderLeft: '2.5px solid #F5C4B3', padding: '6px 0 6px 12px', fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1rem', borderRadius: 0 }}>
          "{partner.gratitude_message.slice(0, 100)}{partner.gratitude_message.length > 100 ? '...' : ''}"
        </div>
      )}

      {/* Дії */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => onChatOpen(pair)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#C85A2A', color: '#fff', border: 'none', borderRadius: 8, padding: '9px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', minWidth: 80 }}>
          ✉ Написати
        </button>
        {!nextSession && (
          <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'transparent', color: '#C85A2A', border: '1.5px solid #C85A2A', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', minWidth: 80 }}>
            📅 Запланувати
          </button>
        )}
        <button onClick={() => setNoteOpen(!noteOpen)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--gray)', color: 'var(--muted)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '9px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          ✏ Нотатка
        </button>
      </div>

      {/* Нотатка після зустрічі */}
      {noteOpen && (
        <div style={{ marginTop: 10 }}>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Як пройшла зустріч? Один рядок — для себе і для партнера."
            style={{ width: '100%', border: '0.5px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none', minHeight: 60, background: 'var(--card-bg)', color: 'var(--text)', lineHeight: 1.6, boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button onClick={saveNote} style={{ flex: 1, background: noteSaved ? '#1D9E75' : '#C85A2A', color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'background .2s' }}>
              {noteSaved ? '✓ Збережено' : 'Зберегти'}
            </button>
            <button onClick={() => setNoteOpen(false)} style={{ background: 'var(--gray)', color: 'var(--muted)', border: '0.5px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              Скасувати
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Чат-панель ───────────────────────────────────────────────────────────────
function ChatPanel({ pair, onClose }: { pair: Pair; onClose: () => void }) {
  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState([
    { id: '1', sender: 'partner', text: 'Привіт! Дякую що відгукнувся 🙂 Коли тобі зручно провести першу зустріч?', time: '18:00' },
    { id: '2', sender: 'me', text: 'Привіт! Можу у вівторок або четвер ввечері — як тобі?', time: '18:05' },
    { id: '3', sender: 'partner', text: 'Вівторок ідеально! О 19:00 підійде?', time: '18:10' },
  ])
  const partner = pair.learner || pair.mentor

  const send = () => {
    if (!msg.trim()) return
    setMessages(m => [...m, { id: Date.now().toString(), sender: 'me', text: msg.trim(), time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) }])
    setMsg('')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50, padding: '0 0 0 0' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--card-bg)', borderRadius: '16px 16px 0 0', width: '100%', maxWidth: 480, height: '70vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '0.5px solid var(--border)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FAECE7', color: '#712B13', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>
            {getInitials(partner?.name || 'U')}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{partner?.name}</div>
            <div style={{ fontSize: 12, color: 'var(--hint)' }}>{pair.subject}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--hint)', padding: 4 }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'me' ? 'flex-end' : 'flex-start' }}>
              <div style={{ background: m.sender === 'me' ? '#C85A2A' : 'var(--gray)', color: m.sender === 'me' ? '#fff' : 'var(--text)', borderRadius: m.sender === 'me' ? '12px 12px 4px 12px' : '12px 12px 12px 4px', padding: '9px 14px', fontSize: 14, lineHeight: 1.5, maxWidth: '80%' }}>
                {m.text}
              </div>
              <div style={{ fontSize: 11, color: 'var(--hint)', marginTop: 3 }}>{m.time}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '10px 16px', borderTop: '0.5px solid var(--border)', display: 'flex', gap: 8 }}>
          <input value={msg} onChange={e => setMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={`Написати ${partner?.name}...`}
            style={{ flex: 1, border: '0.5px solid var(--border)', borderRadius: 10, padding: '9px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: 'var(--card-bg)', color: 'var(--text)' }} />
          <button onClick={send} style={{ background: '#C85A2A', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 16px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>→</button>
        </div>
      </div>
    </div>
  )
}

// ─── Головний компонент ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const currentUser = user || MOCK_CURRENT_USER
  const [chatPair, setChatPair] = useState<Pair | null>(null)
  const [tab, setTab] = useState<'pairs' | 'tracker'>('pairs')

  // Наступна зустріч для кожної пари
  const nextSessionForPair = (pairId: string) =>
    MOCK_SESSIONS.find(s => s.pair_id === pairId && s.status === 'scheduled')

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>Увійди щоб побачити свій дашборд</div>
          <Link href="/login" style={{ color: '#C85A2A', textDecoration: 'none' }}>Увійти →</Link>
        </div>
      </div>
    )
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
        .header-inner { max-width: 680px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 56px; gap: 12px; }
        .logo span:first-child { color: #C85A2A; font-size: 18px; font-weight: 500; }
        .logo span:last-child { color: #4A6580; font-size: 18px; font-weight: 500; }
        .nav-link { font-size: 13px; color: var(--muted); text-decoration: none; transition: color .15s; }
        .nav-link:hover, .nav-link.active { color: var(--fire); }
        .container { max-width: 680px; margin: 0 auto; padding: 0 20px; }
        .tab-row { display: flex; border-bottom: 0.5px solid var(--border); margin-bottom: 1.5rem; }
        .tab { padding: 10px 20px; font-size: 14px; border: none; background: transparent; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; font-family: inherit; transition: color .15s; }
        .tab.active { color: #C85A2A; border-bottom-color: #C85A2A; font-weight: 500; }
        .mission { border-left: 2.5px solid #4A6580; padding: 8px 0 8px 14px; font-size: 13px; color: var(--muted); font-style: italic; line-height: 1.7; margin-bottom: 1.5rem; border-radius: 0; }
        .section-label { font-size: 11px; font-weight: 500; color: var(--hint); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 1rem; }
        .bar-wrap { background: var(--gray); border-radius: 14px; padding: 1rem; margin-bottom: 10px; }
        .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; font-size: 13px; color: var(--muted); }
        .bar-track { flex: 1; height: 6px; background: rgba(0,0,0,0.08); border-radius: 3px; overflow: hidden; }
        @media (prefers-color-scheme: dark) { .bar-track { background: rgba(255,255,255,0.1); } }
        .bar-fill { height: 100%; border-radius: 3px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; margin-bottom: 1.5rem; }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
        .week-grid { display: flex; gap: 6px; align-items: flex-end; height: 60px; margin-bottom: 6px; }
        .week-bar { flex: 1; border-radius: 4px 4px 0 0; }
        .week-labels { display: flex; gap: 6px; }
        .week-label { flex: 1; text-align: center; font-size: 11px; color: var(--hint); }
        @media (max-width: 600px) { .nav-links { display: none; } }
      `}</style>

      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
            <span>Re</span><span>Tech</span>
          </Link>
          <nav style={{ display: 'flex', gap: 16 }} className="nav-links">
            <Link href="/feed" className="nav-link">Стрічка</Link>
            <Link href="/dashboard" className="nav-link active">Мої пари</Link>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FAECE7', color: '#712B13', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>
              {getInitials(currentUser.name)}
            </div>
            <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{currentUser.name}</span>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>

        <div className="tab-row">
          <button className={`tab${tab === 'pairs' ? ' active' : ''}`} onClick={() => setTab('pairs')}>
            Мої пари
          </button>
          <button className={`tab${tab === 'tracker' ? ' active' : ''}`} onClick={() => setTab('tracker')}>
            Трекер
          </button>
        </div>

        {/* ── ВКЛАДКА: МОЇ ПАРИ ─────────────────────────────────────────── */}
        {tab === 'pairs' && (
          <>
            <div className="mission">
              {MOCK_PAIRS.length > 0
                ? `${MOCK_PAIRS.length === 1 ? 'Одна людина' : `${MOCK_PAIRS.length} людини`} поряд. Це вже не самотність.`
                : 'Ще немає пар. Знайди людину у стрічці — і натисни "Давай дружити".'}
            </div>

            {MOCK_PAIRS.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <Link href="/feed" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#C85A2A', color: '#fff', textDecoration: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 15, fontWeight: 500 }}>
                  Перейти до стрічки →
                </Link>
              </div>
            )}

            {MOCK_PAIRS.map((pair, idx) => (
              <PairCard
                key={pair.id}
                pair={pair}
                idx={idx}
                nextSession={nextSessionForPair(pair.id)}
                onChatOpen={setChatPair}
              />
            ))}
          </>
        )}

        {/* ── ВКЛАДКА: ТРЕКЕР ───────────────────────────────────────────── */}
        {tab === 'tracker' && (
          <>
            <div style={{ borderLeft: '2.5px solid #4A6580', padding: '8px 0 8px 14px', fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: '1.5rem', borderRadius: 0 }}>
              {currentUser.total_hours} годин разом. Стільки самотності не сталось.
            </div>

            {/* Загальна статистика */}
            <div className="stats-grid">
              <StatCard num={currentUser.total_hours} label="годин" bg="#EDF2F7" color="#4A6580" />
              <StatCard num={currentUser.total_sessions} label="зустрічей" bg="#EDF2F7" color="#4A6580" />
              <StatCard num={MOCK_PAIRS.length} label="людини" bg="#FAECE7" color="#C85A2A" />
              <StatCard num={currentUser.streak_weeks} label="тижнів" bg="var(--gray)" color="var(--text)" />
            </div>

            {/* Активність — 8 тижнів */}
            <div className="bar-wrap">
              <div className="section-label" style={{ marginBottom: '0.75rem' }}>Активність — останні 8 тижнів</div>
              <div className="week-grid">
                {[1.5, 2, 0.5, 3, 2.5, 3.5, 2, 4].map((h, i) => (
                  <div key={i} className="week-bar" style={{ height: `${(h / 4) * 100}%`, background: i >= 4 ? '#4A6580' : '#A8BDD0', opacity: i === 7 ? 1 : 0.7 + i * 0.04 }} />
                ))}
              </div>
              <div className="week-labels">
                {['т1', 'т2', 'т3', 'т4', 'т5', 'т6', 'т7', 'т8'].map(l => (
                  <div key={l} className="week-label">{l}</div>
                ))}
              </div>
            </div>

            {/* По парах */}
            <div className="section-label" style={{ marginTop: '1.5rem' }}>По парах</div>
            {MOCK_PAIRS.map((pair, idx) => {
              const partner = pair.learner || pair.mentor
              const colors = AVATAR_COLORS[idx % AVATAR_COLORS.length]
              const maxHours = Math.max(...MOCK_PAIRS.map(p => p.total_hours), 1)
              return (
                <div key={pair.id} className="bar-wrap">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: colors.bg, color: colors.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, flexShrink: 0 }}>
                      {getInitials(partner?.name || 'U')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{partner?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--hint)' }}>{pair.subject}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 500, color: '#4A6580' }}>{pair.total_hours}</div>
                      <div style={{ fontSize: 11, color: 'var(--hint)' }}>годин</div>
                    </div>
                  </div>
                  <div className="bar-row">
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(pair.total_hours / maxHours) * 100}%`, background: '#4A6580' }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--hint)', flexShrink: 0 }}>{pair.sessions_count} зустр.</span>
                  </div>
                  {partner?.gratitude_message && (
                    <div style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic', marginTop: 8, lineHeight: 1.6 }}>
                      "{partner.gratitude_message.slice(0, 80)}..."
                    </div>
                  )}
                </div>
              )
            })}

            {MOCK_PAIRS.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--hint)', fontSize: 14 }}>
                Поки нема зустрічей. Все починається з першого "Давай дружити".
              </div>
            )}
          </>
        )}

      </main>

      {/* Чат-панель */}
      {chatPair && (
        <ChatPanel pair={chatPair} onClose={() => setChatPair(null)} />
      )}
    </>
  )
}
