'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = email.includes('@') && password.length >= 6

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      await login(email.trim(), password)
      router.push('/dashboard')
    } catch (e: any) {
      setError('Невірний email або пароль. Спробуй ще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        body { background: #fff; }
        @media (prefers-color-scheme: dark) { body { background: #111; } }
        .wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 20px; }
        .box { width: 100%; max-width: 380px; }
        .logo { text-align: center; margin-bottom: 2rem; }
        .logo span:first-child { color: #C85A2A; font-size: 22px; font-weight: 500; }
        .logo span:last-child { color: #4A6580; font-size: 22px; font-weight: 500; }
        .card { background: #fff; border: 0.5px solid rgba(0,0,0,0.08); border-radius: 14px; padding: 1.5rem; }
        @media (prefers-color-scheme: dark) { .card { background: #1a1a18; border-color: rgba(255,255,255,0.09); } }
        .h2 { font-size: 20px; font-weight: 500; color: #1a1a1a; margin-bottom: 4px; }
        @media (prefers-color-scheme: dark) { .h2 { color: #e8e6e0; } }
        .sub { font-size: 13px; color: #888; margin-bottom: 1.5rem; }
        .field { margin-bottom: 1rem; }
        .field label { display: block; font-size: 13px; font-weight: 500; color: #555; margin-bottom: 6px; }
        @media (prefers-color-scheme: dark) { .field label { color: #aaa; } }
        .input { width: 100%; border: 0.5px solid rgba(0,0,0,0.1); border-radius: 10px; padding: 10px 14px; font-size: 15px; color: #1a1a1a; background: #fff; font-family: inherit; outline: none; transition: border-color .15s, box-shadow .15s; }
        @media (prefers-color-scheme: dark) { .input { background: #111; color: #e8e6e0; border-color: rgba(255,255,255,0.12); } }
        .input:focus { border-color: #C85A2A; box-shadow: 0 0 0 3px #FAECE7; }
        .btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: #C85A2A; color: #fff; border: none; border-radius: 10px; padding: 12px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: inherit; transition: opacity .15s; margin-top: 0.5rem; }
        .btn:hover { opacity: .9; }
        .btn:disabled { opacity: .5; cursor: not-allowed; }
        .error { background: #fff0f0; color: #c0392b; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin-top: 10px; }
        .footer { text-align: center; margin-top: 1.25rem; font-size: 13px; color: #999; }
        .footer a { color: #C85A2A; text-decoration: none; }
        .mission { border-left: 2.5px solid #4A6580; padding: 8px 0 8px 14px; font-size: 13px; color: #777; font-style: italic; line-height: 1.7; margin-bottom: 1.5rem; border-radius: 0; }
      `}</style>

      <div className="wrap">
        <div className="box">
          <div className="logo">
            <span>Re</span><span>Tech</span>
          </div>

          <div className="card">
            <div className="mission">
              З поверненням. Хтось вже чекає на тебе.
            </div>

            <div className="h2">Увійти</div>
            <div className="sub">Раді бачити тебе знову.</div>

            <div className="field">
              <label>Email</label>
              <input className="input" type="email" placeholder="maria@gmail.com"
                value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <label>Пароль</label>
              <input className="input" type="password" placeholder="Твій пароль"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && canSubmit && handleSubmit()} />
            </div>

            {error && <div className="error">{error}</div>}

            <button className="btn" disabled={!canSubmit || loading} onClick={handleSubmit}
              style={{ marginTop: '1.25rem' }}>
              {loading ? 'Входимо...' : 'Увійти →'}
            </button>

            <div className="footer">
              Ще немає акаунту? <Link href="/register">Зареєструватись</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
