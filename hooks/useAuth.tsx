'use client'

// hooks/useAuth.tsx
// Зараз: localStorage mock
// Supabase підключення: розкоментуй секцію SUPABASE нижче

import { useState, useEffect, createContext, useContext } from 'react'
import type { User, AuthState } from '@/types'
import { MOCK_CURRENT_USER } from '@/lib/mock'
import { isSupabaseConnected } from '@/lib/supabase'

// ─── Контекст ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthState & {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
}>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
})

export interface RegisterData {
  name: string
  email: string
  password: string
  can_teach: string[]
  wants_to_learn: string[]
  bio?: string
  gratitude_message?: string
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConnected) {
      // ── SUPABASE ──────────────────────────────────────────────────────────
      // Розкоментуй після підключення Supabase:
      // const { getSupabase } = require('@/lib/supabase')
      // const supabase = getSupabase()
      // supabase.auth.getSession().then(({ data: { session } }: any) => {
      //   if (session?.user) loadUser(session.user.id)
      //   else setLoading(false)
      // })
      // const { data: { subscription } } = supabase.auth.onAuthStateChange((_: any, session: any) => {
      //   if (session?.user) loadUser(session.user.id)
      //   else { setUser(null); setLoading(false) }
      // })
      // return () => subscription.unsubscribe()
    } else {
      // ── MOCK ──────────────────────────────────────────────────────────────
      const stored = localStorage.getItem('retech_user')
      if (stored) {
        try { setUser(JSON.parse(stored)) } catch {}
      }
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    if (isSupabaseConnected) {
      // const { signIn } = require('@/lib/supabase')
      // await signIn(email, password)
    } else {
      // Mock логін — в продакшні прибрати
      const mockUser = { ...MOCK_CURRENT_USER, email }
      setUser(mockUser)
      localStorage.setItem('retech_user', JSON.stringify(mockUser))
    }
  }

  const logout = async () => {
    if (isSupabaseConnected) {
      // const { signOut } = require('@/lib/supabase')
      // await signOut()
    }
    setUser(null)
    localStorage.removeItem('retech_user')
  }

  const register = async (data: RegisterData) => {
    if (isSupabaseConnected) {
      // const { signUp, upsertUser } = require('@/lib/supabase')
      // const { data: authData } = await signUp(data.email, data.password)
      // if (authData.user) await upsertUser({ id: authData.user.id, ...data })
    } else {
      // Mock реєстрація
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        can_teach: data.can_teach,
        wants_to_learn: data.wants_to_learn,
        bio: data.bio,
        gratitude_message: data.gratitude_message,
        languages: ['uk'],
        total_hours: 0,
        total_sessions: 0,
        streak_weeks: 0,
        created_at: new Date().toISOString(),
      }
      setUser(newUser)
      localStorage.setItem('retech_user', JSON.stringify(newUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
