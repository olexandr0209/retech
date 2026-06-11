'use client'

import { use, useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { MOCK_PAIRS, MOCK_MESSAGES, MOCK_CURRENT_USER } from '@/lib/mock'
import type { Message, Pair } from '@/types'

// ─── Утиліти ─────────────────────────────────────────────────────────────────
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
}

function formatDay(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return 'Сьогодні'
  if (diff === 1) return 'Вчора'
  return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

// ─── Компонент повідомлення ───────────────────────────────────────────────────
function MessageBubble({ msg, isMe }: { msg: Message; isMe: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
      <div style={{
        background: isMe ? '#C85A2A' : 'var(--gray)',
        color: isMe ? '#fff' : 'var(--text)',
        borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        padding: '9px 14px',
        fontSize: 14,
        lineHeight: 1.55,
        maxWidth: '78%',
        wordBreak: 'break-word',
      }}>
        {msg.text}
      </div>
      <div style={{ fontSize: 11, color: 'var(--hint)', marginTop: 3, padding: '0 4px' }}>
        {formatTime(msg.created_at)}
        {isMe && <span style={{ marginLeft: 4, opacity: .6 }}>✓✓</span>}
      </div>
    </div>
  )
}

// ─── Панель AI конспекту ──────────────────────────────────────────────────────
function LessonPlanPanel({ pair, onClose }: { pair: Pair; onClose: () => void }) {
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<any>(null)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch('/api/prepare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: pair.subject,
            level: 'beginner',
            learnerName: pair.learner?.name || 'учень',
            learnerText: pair.learner?.gratitude_message || '',
          }),
        })
        const data = await res.json()
        setPlan(data.plan)
      } catch {
        setPlan({
          topic: `${pair.subject} — перша зустріч`,
          opening_question: 'Розкажи мені про свій типовий день. Будь-якою мовою — я допоможу.',
          key_phrases: ['How are you?', 'Can you repeat please?', 'I don\'t understand'],
          activities: ['Знайомство — 10 хв', 'Ключові фрази — 20 хв', 'Вільна розмова — 15 хв'],
          tips: ['Не виправляй кожну помилку', 'Підбадьорюй часто', 'Говори повільніше'],
          duration_min: 45,
        })
      } finally {
        setLoading(false)
      }
    }
    fetchPlan()
  }, [pair])

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 60,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--card-bg)', borderRadius: '16px 16px 0 0',
        width: '100%', maxWidth: 520, maxHeight: '80vh', overflowY: 'auto',
        padding: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--text)' }}>Конспект зустрічі</div>
            <div style={{ fontSize: 12, color: 'var(--hint)', marginTop: 2 }}>Підготовлено AI · {pair.subject}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--hint)' }}>×</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--hint)', fontSize: 14 }}>
            <div style={{ marginBottom: 8 }}>Генеруємо конспект...</div>
            <div style={{ fontSize: 12 }}>Claude аналізує рівень учня</div>
          </div>
        ) : plan && (
          <>
            <div style={{ background: '#FAECE7', borderRadius: 10, padding: '12px 14px', marginBottom: '1rem' }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#712B13', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6 }}>З чого почати</div>
              <div style={{ fontSize: 14, color: '#712B13', lineHeight: 1.65 }}>"{plan.opening_question}"</div>
            </div>

            {plan.key_phrases && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--hint)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>Ключові фрази</div>
                {plan.key_phrases.map((p: string, i: number) => (
                  <div key={i} style={{ background: 'var(--gray)', borderRadius: 8, padding: '8px 12px', marginBottom: 6, fontSize: 13, color: 'var(--text)' }}>
                    {p}
                  </div>
                ))}
              </div>
            )}

            {plan.activities && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--hint)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>План зустрічі</div>
                {plan.activities.map((a: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#EDF2F7', color: '#4A6580', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', paddingTop: 3 }}>{a}</div>
                  </div>
                ))}
              </div>
            )}

            {plan.tips && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--hint)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>Поради</div>
                {plan.tips.map((tip: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <span style={{ color: '#4A6580', flexShrink: 0 }}>·</span>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{tip}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Головний компонент ───────────────────────────────────────────────────────
export default function ChatPage({ params }: { params: Promise<{ pairId: string }> }) {
  const { pairId } = use(params)
  const { user, isAuthenticated } = useAuth()
  const currentUser = user || MOCK_CURRENT_USER
  const bottomRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [input, setInput] = useState('')
  const [videoOpen, setVideoOpen] = useState(false)
  const [planOpen, setPlanOpen] = useState(false)
  const [sending, setSending] = useState(false)

  // Знаходимо пару
  // Supabase: const pair = await getPairs(currentUser.id) → find by pairId
  const pair: Pair = MOCK_PAIRS.find(p => p.id === pairId) ?? MOCK_PAIRS[0]
  const partner = pair?.learner?.id !== currentUser.id ? pair?.learner : pair?.mentor

  // Scroll до останнього повідомлення
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const newMsg: Message = {
      id: Date.now().toString(),
      pair_id: pairId,
      sender_id: currentUser.id,
      text: input.trim(),
      created_at: new Date().toISOString(),
    }
    setMessages(m => [...m, newMsg])
    setInput('')
    setSending(false)
    // Supabase: await sendMessage(pairId, currentUser.id, input.trim())
  }

  // Групування по дням
  const grouped = messages.reduce((acc, msg) => {
    const day = formatDay(msg.created_at)
    if (!acc[day]) acc[day] = []
    acc[day].push(msg)
    return acc
  }, {} as Record<string, Message[]>)

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
          :root { --gray: #1a1a18; --border: rgba(255,255,255,0.09); --text: #e8e6e0; --muted: #aaa; --hint: #666; --card-bg: #1a1a18; --fire-bg: #2a1508; --fire-dark: #F5C4B3; }
          body { background: #111; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        html, body { height: 100%; }
        .chat-layout { display: flex; flex-direction: column; height: 100vh; max-width: 680px; margin: 0 auto; }
        .chat-header { flex-shrink: 0; background: var(--card-bg); border-bottom: 0.5px solid var(--border); padding: 10px 16px; display: flex; align-items: center; gap: 12px; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 16px; }
        .chat-input-row { flex-shrink: 0; background: var(--card-bg); border-top: 0.5px solid var(--border); padding: 10px 16px; display: flex; gap: 8px; align-items: flex-end; }
        .day-label { text-align: center; font-size: 12px; color: var(--hint); margin: 12px 0 10px; }
        .input-field { flex: 1; border: 0.5px solid var(--border); border-radius: 20px; padding: 9px 16px; font-size: 14px; font-family: inherit; outline: none; background: var(--gray); color: var(--text); resize: none; max-height: 100px; line-height: 1.5; transition: border-color .15s; }
        .input-field:focus { border-color: #C85A2A; }
        .send-btn { width: 40px; height: 40px; border-radius: 50%; background: #C85A2A; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: opacity .15s; font-size: 16px; }
        .send-btn:hover { opacity: .9; }
        .send-btn:disabled { opacity: .5; cursor: not-allowed; }
        .action-btn { display: flex; align-items: center; gap: 5px; background: var(--gray); color: var(--muted); border: 0.5px solid var(--border); border-radius: 8px; padding: 7px 12px; font-size: 12px; cursor: pointer; font-family: inherit; transition: all .15s; white-space: nowrap; flex-shrink: 0; }
        .action-btn:hover { border-color: #C85A2A; color: #C85A2A; }
        .action-btn.fire { background: #C85A2A; color: #fff; border-color: #C85A2A; }
        .video-frame { position: fixed; inset: 0; background: #000; z-index: 50; display: flex; flex-direction: column; }
        .video-topbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: rgba(0,0,0,.7); }
        .whereby-embed { flex: 1; border: none; }
        .avatar-sm { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; flex-shrink: 0; }
      `}</style>

      <div className="chat-layout">

        {/* ── ШАПКА ────────────────────────────────────────────────────────── */}
        <div className="chat-header">
          <Link href="/dashboard" style={{ color: 'var(--muted)', fontSize: 20, textDecoration: 'none', lineHeight: 1 }}>←</Link>

          <div className="avatar-sm" style={{ background: '#FAECE7', color: '#712B13' }}>
            {getInitials(partner?.name || 'U')}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {partner?.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--hint)' }}>{pair?.subject}</div>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button className="action-btn" onClick={() => setPlanOpen(true)}>
              ✨ Конспект
            </button>
            <button className={`action-btn${videoOpen ? '' : ' fire'}`} onClick={() => setVideoOpen(!videoOpen)}>
              {videoOpen ? '✕ Відео' : '▶ Відео'}
            </button>
          </div>
        </div>

        {/* ── ПОВІДОМЛЕННЯ ─────────────────────────────────────────────────── */}
        <div className="chat-messages">

          {/* Нагадування про зустріч */}
          {pair?.whereby_room_url && (
            <div style={{ background: '#FAECE7', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>📅</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#712B13' }}>Відеозустріч готова</div>
                <div style={{ fontSize: 12, color: '#993C1D' }}>Натисни "▶ Відео" щоб приєднатись</div>
              </div>
              <button onClick={() => setVideoOpen(true)} style={{ background: '#C85A2A', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                Відкрити
              </button>
            </div>
          )}

          {/* Системне повідомлення — початок */}
          <div className="day-label">
            Це початок вашого спілкування ♥
          </div>

          {/* Повідомлення згруповані по днях */}
          {Object.entries(grouped).map(([day, msgs]) => (
            <div key={day}>
              <div className="day-label">{day}</div>
              {msgs.map(msg => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isMe={msg.sender_id === currentUser.id}
                />
              ))}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* ── ПОЛЕ ВВОДУ ───────────────────────────────────────────────────── */}
        <div className="chat-input-row">
          <textarea
            className="input-field"
            placeholder={`Написати ${partner?.name || ''}...`}
            value={input}
            rows={1}
            onChange={e => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <button className="send-btn" onClick={sendMessage} disabled={!input.trim() || sending}>
            →
          </button>
        </div>
      </div>

      {/* ── ВІДЕО (Whereby) ──────────────────────────────────────────────────── */}
      {videoOpen && (
        <div className="video-frame">
          <div className="video-topbar">
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>
              {partner?.name} · {pair?.subject}
            </div>
            <button onClick={() => setVideoOpen(false)} style={{ color: '#fff', background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              Закрити відео
            </button>
          </div>

          {pair?.whereby_room_url ? (
            <iframe
              className="whereby-embed"
              src={`${pair.whereby_room_url}?background=off&chat=off&people=off&screenshare=on&displayName=${encodeURIComponent(currentUser.name)}`}
              allow="camera; microphone; fullscreen; speaker; display-capture"
              title="Відеозустріч ReTech"
            />
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, color: '#fff' }}>
              <div style={{ fontSize: 16 }}>Відеокімната ще не створена</div>
              <div style={{ fontSize: 13, opacity: .6 }}>Підключи Whereby API в .env.local</div>
              <div style={{ fontSize: 12, opacity: .4 }}>WHEREBY_API_KEY=your_key</div>
            </div>
          )}
        </div>
      )}

      {/* ── AI КОНСПЕКТ ──────────────────────────────────────────────────────── */}
      {planOpen && pair && (
        <LessonPlanPanel pair={pair} onClose={() => setPlanOpen(false)} />
      )}
    </>
  )
}
