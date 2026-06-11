'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

const SUBJECTS = [
  'Англійська', 'Українська', 'Німецька', 'Французька', 'Іспанська', 'Польська',
  'Python', 'JavaScript', 'Excel', 'Математика', 'Фізика', 'Хімія',
  'Гітара', 'Фортепіано', 'Малювання', 'Готування', 'Йога', 'Фотографія',
]

type Step = 1 | 2 | 3

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    wants_to_learn: [] as string[],
    can_teach: [] as string[],
    custom_learn: '',
    custom_teach: '',
    gratitude_message: '',
    bio: '',
  })

  const toggle = (field: 'wants_to_learn' | 'can_teach', value: string) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter(v => v !== value)
        : [...f[field], value],
    }))
  }

  const addCustom = (field: 'wants_to_learn' | 'can_teach', customField: 'custom_learn' | 'custom_teach') => {
    const val = form[customField].trim()
    if (!val) return
    setForm(f => ({ ...f, [field]: [...f[field], val], [customField]: '' }))
  }

  const canNext1 = form.name.trim().length >= 2 && form.email.includes('@') && form.password.length >= 6
  const canNext2 = form.wants_to_learn.length > 0 && form.can_teach.length > 0
  const canSubmit = canNext2

  const handleSubmit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        can_teach: form.can_teach,
        wants_to_learn: form.wants_to_learn,
        bio: form.bio.trim() || undefined,
        gratitude_message: form.gratitude_message.trim() || undefined,
      })
      router.push('/feed')
    } catch (e: any) {
      setError(e?.message || 'Щось пішло не так. Спробуй ще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        body { background: #fff; }
        @media (prefers-color-scheme: dark) { body { background: #111; } }
        .reg-wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 20px; }
        .reg-box { width: 100%; max-width: 420px; }
        .reg-logo { text-align: center; margin-bottom: 2rem; }
        .reg-logo span:first-child { color: #C85A2A; font-size: 22px; font-weight: 500; }
        .reg-logo span:last-child { color: #4A6580; font-size: 22px; font-weight: 500; }
        .steps { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 2rem; }
        .step-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(0,0,0,0.12); transition: all .2s; }
        @media (prefers-color-scheme: dark) { .step-dot { background: rgba(255,255,255,0.15); } }
        .step-dot.active { background: #C85A2A; width: 24px; border-radius: 4px; }
        .step-dot.done { background: #C85A2A; opacity: .4; }
        .card { background: #fff; border: 0.5px solid rgba(0,0,0,0.08); border-radius: 14px; padding: 1.5rem; }
        @media (prefers-color-scheme: dark) { .card { background: #1a1a18; border-color: rgba(255,255,255,0.09); } }
        .field { margin-bottom: 1rem; }
        .field label { display: block; font-size: 13px; font-weight: 500; color: #555; margin-bottom: 6px; }
        @media (prefers-color-scheme: dark) { .field label { color: #aaa; } }
        .input { width: 100%; border: 0.5px solid rgba(0,0,0,0.1); border-radius: 10px; padding: 10px 14px; font-size: 15px; color: #1a1a1a; background: #fff; font-family: inherit; outline: none; transition: border-color .15s, box-shadow .15s; }
        @media (prefers-color-scheme: dark) { .input { background: #111; color: #e8e6e0; border-color: rgba(255,255,255,0.12); } }
        .input:focus { border-color: #C85A2A; box-shadow: 0 0 0 3px #FAECE7; }
        .textarea { width: 100%; border: 0.5px solid rgba(0,0,0,0.1); border-radius: 10px; padding: 10px 14px; font-size: 14px; color: #1a1a1a; background: #fff; font-family: inherit; outline: none; resize: vertical; min-height: 80px; line-height: 1.6; transition: border-color .15s, box-shadow .15s; }
        @media (prefers-color-scheme: dark) { .textarea { background: #111; color: #e8e6e0; border-color: rgba(255,255,255,0.12); } }
        .textarea:focus { border-color: #C85A2A; box-shadow: 0 0 0 3px #FAECE7; }
        .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
        .tag { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 8px; font-size: 13px; cursor: pointer; border: 0.5px solid rgba(0,0,0,0.1); background: #f5f5f3; color: #555; transition: all .15s; user-select: none; }
        @media (prefers-color-scheme: dark) { .tag { background: #1e1e1c; color: #aaa; border-color: rgba(255,255,255,0.1); } }
        .tag:hover { border-color: #C85A2A; color: #C85A2A; }
        .tag.active-fire { background: #FAECE7; color: #712B13; border-color: #F5C4B3; font-weight: 500; }
        .tag.active-blue { background: #EDF2F7; color: #243344; border-color: #A8BDD0; font-weight: 500; }
        .btn-primary { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: #C85A2A; color: #fff; border: none; border-radius: 10px; padding: 12px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: inherit; transition: opacity .15s; margin-top: 1.25rem; }
        .btn-primary:hover { opacity: .9; }
        .btn-primary:disabled { opacity: .5; cursor: not-allowed; }
        .btn-back { background: none; border: none; color: #999; font-size: 13px; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 4px; margin-bottom: 1rem; padding: 0; }
        .btn-back:hover { color: #C85A2A; }
        .mission { border-left: 2.5px solid #C85A2A; padding: 8px 0 8px 14px; font-size: 13px; color: #777; font-style: italic; line-height: 1.7; margin-bottom: 1.25rem; border-radius: 0; }
        .h2 { font-size: 20px; font-weight: 500; color: #1a1a1a; margin-bottom: 4px; }
        @media (prefers-color-scheme: dark) { .h2 { color: #e8e6e0; } }
        .sub { font-size: 13px; color: #888; margin-bottom: 1.25rem; line-height: 1.6; }
        .error { background: #fff0f0; color: #c0392b; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin-top: 10px; }
        .custom-row { display: flex; gap: 8px; margin-top: 8px; }
        .custom-row .input { flex: 1; padding: 8px 12px; font-size: 13px; }
        .custom-row button { padding: 8px 14px; background: #FAECE7; color: #712B13; border: none; border-radius: 8px; font-size: 13px; cursor: pointer; font-family: inherit; white-space: nowrap; }
        .selected-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .selected-tag { display: inline-flex; align-items: center; gap: 4px; background: #FAECE7; color: #712B13; border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 500; }
        .selected-tag button { background: none; border: none; color: #C85A2A; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; margin-left: 2px; }
        .footer-note { text-align: center; margin-top: 1.25rem; font-size: 13px; color: #999; }
        .footer-note a { color: #C85A2A; text-decoration: none; }
        .divider { border: none; border-top: 0.5px solid rgba(0,0,0,0.08); margin: 1rem 0; }
        @media (prefers-color-scheme: dark) { .divider { border-color: rgba(255,255,255,0.08); } }
      `}</style>

      <div className="reg-wrap">
        <div className="reg-box">

          <div className="reg-logo">
            <span>Re</span><span>Tech</span>
          </div>

          <div className="steps">
            {[1, 2, 3].map(s => (
              <div key={s} className={`step-dot ${step === s ? 'active' : step > s ? 'done' : ''}`} />
            ))}
          </div>

          {/* ── КРОК 1: базові дані ─────────────────────────────────────────── */}
          {step === 1 && (
            <div className="card">
              <div className="h2">Привіт! Як тебе звати?</div>
              <div className="sub">Тільки основне — решта потім.</div>

              <div className="field">
                <label>Ім'я</label>
                <input className="input" type="text" placeholder="Марія" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
              </div>
              <div className="field">
                <label>Email</label>
                <input className="input" type="email" placeholder="maria@gmail.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Пароль</label>
                <input className="input" type="password" placeholder="Мінімум 6 символів" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && canNext1 && setStep(2)} />
              </div>

              <button className="btn-primary" disabled={!canNext1} onClick={() => setStep(2)}>
                Далі →
              </button>

              <div className="footer-note" style={{ marginTop: '1rem' }}>
                Вже є акаунт? <Link href="/login">Увійти</Link>
              </div>
            </div>
          )}

          {/* ── КРОК 2: що вчити і що ділитись ────────────────────────────── */}
          {step === 2 && (
            <div className="card">
              <button className="btn-back" onClick={() => setStep(1)}>← Назад</button>

              <div className="mission">
                Тут не потрібен диплом. Достатньо знати трохи більше — і мати серце.
              </div>

              <div className="h2">Чого хочеш навчитись?</div>
              <div className="sub">Обери одну або кілька тем.</div>

              <div className="tags">
                {SUBJECTS.map(s => (
                  <div key={s} className={`tag ${form.wants_to_learn.includes(s) ? 'active-fire' : ''}`}
                    onClick={() => toggle('wants_to_learn', s)}>{s}</div>
                ))}
              </div>
              <div className="custom-row">
                <input className="input" placeholder="Інша тема..." value={form.custom_learn}
                  onChange={e => setForm(f => ({ ...f, custom_learn: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addCustom('wants_to_learn', 'custom_learn')} />
                <button onClick={() => addCustom('wants_to_learn', 'custom_learn')}>+ Додати</button>
              </div>

              <hr className="divider" />

              <div className="h2">А що ти можеш дати назад?</div>
              <div className="sub" style={{ marginBottom: 8 }}>
                Готуєш? Знаєш мову? Граєш на інструменті? Це вже скарб для когось.
              </div>

              <div className="tags">
                {SUBJECTS.map(s => (
                  <div key={s} className={`tag ${form.can_teach.includes(s) ? 'active-blue' : ''}`}
                    onClick={() => toggle('can_teach', s)}>{s}</div>
                ))}
              </div>
              <div className="custom-row">
                <input className="input" placeholder="Інша тема..." value={form.custom_teach}
                  onChange={e => setForm(f => ({ ...f, custom_teach: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && addCustom('can_teach', 'custom_teach')} />
                <button onClick={() => addCustom('can_teach', 'custom_teach')}>+ Додати</button>
              </div>

              <button className="btn-primary" disabled={!canNext2} onClick={() => setStep(3)}>
                Далі →
              </button>
            </div>
          )}

          {/* ── КРОК 3: живий голос ─────────────────────────────────────────── */}
          {step === 3 && (
            <div className="card">
              <button className="btn-back" onClick={() => setStep(2)}>← Назад</button>

              <div className="mission">
                Людина яка тебе знайде — прочитає це перш ніж написати. Говори від серця.
              </div>

              <div className="h2">Твоє звернення до ментора</div>
              <div className="sub">Необов'язково — але це найважливіше поле.</div>
              <div className="field">
                <textarea className="textarea" rows={3}
                  placeholder={`Наприклад: "Я безмежно вдячна кожному хто готовий витратити свій час. Для мене це не просто урок — це підтримка."`}
                  value={form.gratitude_message}
                  onChange={e => setForm(f => ({ ...f, gratitude_message: e.target.value }))} />
              </div>

              <div className="h2">Пару слів про себе</div>
              <div className="sub">Де живеш, чому хочеш навчитись, що тебе надихає.</div>
              <div className="field" style={{ marginBottom: 0 }}>
                <textarea className="textarea" rows={2}
                  placeholder="Живу в Мілані три роки. Англійська потрібна на роботі щодня..."
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </div>

              {error && <div className="error">{error}</div>}

              <button className="btn-primary" disabled={loading} onClick={handleSubmit}>
                {loading ? 'Створюємо профіль...' : 'Створити профіль →'}
              </button>

              <div className="footer-note">
                Безкоштовно · Без зобов'язань · Просто люди
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
