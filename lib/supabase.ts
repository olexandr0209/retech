// lib/supabase.ts
// Підключення: додай NEXT_PUBLIC_SUPABASE_URL і NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local
// Встанови: npm install @supabase/supabase-js

import type { User, LearningRequest, Pair, Session, Message } from '@/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ─── Перевірка чи підключено Supabase ────────────────────────────────────────
export const isSupabaseConnected = !!(SUPABASE_URL && SUPABASE_ANON_KEY)

// ─── Клієнт (lazy — підключається тільки якщо є ключі) ───────────────────────
let _supabase: any = null

export function getSupabase() {
  if (!isSupabaseConnected) return null
  if (_supabase) return _supabase

  // Розкоментуй після: npm install @supabase/supabase-js
  // const { createClient } = require('@supabase/supabase-js')
  // _supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
  return _supabase
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────
export async function signUp(email: string, password: string) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not connected')
  // return supabase.auth.signUp({ email, password })
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not connected')
  // return supabase.auth.signInWithPassword({ email, password })
}

export async function signOut() {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase not connected')
  // return supabase.auth.signOut()
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function getUser(id: string): Promise<User | null> {
  const supabase = getSupabase()
  if (!supabase) return null
  // const { data } = await supabase.from('users').select('*').eq('id', id).single()
  // return data
  return null
}

export async function upsertUser(user: Partial<User>): Promise<User | null> {
  const supabase = getSupabase()
  if (!supabase) return null
  // const { data } = await supabase.from('users').upsert(user).select().single()
  // return data
  return null
}

// ─── Requests ─────────────────────────────────────────────────────────────────
export async function getRequests(filters?: any): Promise<LearningRequest[]> {
  const supabase = getSupabase()
  if (!supabase) return []
  // let q = supabase.from('requests').select('*, user:users(*)').eq('status', 'open').order('created_at', { ascending: false })
  // if (filters?.subject) q = q.eq('subject', filters.subject)
  // const { data } = await q
  // return data || []
  return []
}

export async function createRequest(req: Partial<LearningRequest>): Promise<LearningRequest | null> {
  const supabase = getSupabase()
  if (!supabase) return null
  // const { data } = await supabase.from('requests').insert(req).select().single()
  // return data
  return null
}

// ─── Pairs ────────────────────────────────────────────────────────────────────
export async function createPair(mentorId: string, requestId: string): Promise<Pair | null> {
  const supabase = getSupabase()
  if (!supabase) return null
  // const { data } = await supabase.from('pairs').insert({ mentor_id: mentorId, request_id: requestId, status: 'active' }).select().single()
  // return data
  return null
}

export async function getPairs(userId: string): Promise<Pair[]> {
  const supabase = getSupabase()
  if (!supabase) return []
  // const { data } = await supabase.from('pairs').select('*, mentor:users!mentor_id(*), learner:users!learner_id(*)').or(`mentor_id.eq.${userId},learner_id.eq.${userId}`)
  // return data || []
  return []
}

// ─── Messages (Realtime) ──────────────────────────────────────────────────────
export async function getMessages(pairId: string): Promise<Message[]> {
  const supabase = getSupabase()
  if (!supabase) return []
  // const { data } = await supabase.from('messages').select('*, sender:users(*)').eq('pair_id', pairId).order('created_at')
  // return data || []
  return []
}

export async function sendMessage(pairId: string, senderId: string, text: string): Promise<Message | null> {
  const supabase = getSupabase()
  if (!supabase) return null
  // const { data } = await supabase.from('messages').insert({ pair_id: pairId, sender_id: senderId, text }).select().single()
  // return data
  return null
}

export function subscribeToMessages(pairId: string, callback: (msg: Message) => void) {
  const supabase = getSupabase()
  if (!supabase) return null
  // return supabase.channel(`messages:${pairId}`)
  //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `pair_id=eq.${pairId}` }, (payload: any) => callback(payload.new))
  //   .subscribe()
  return null
}

// ─── Sessions ─────────────────────────────────────────────────────────────────
export async function createSession(session: Partial<Session>): Promise<Session | null> {
  const supabase = getSupabase()
  if (!supabase) return null
  // const { data } = await supabase.from('sessions').insert(session).select().single()
  // return data
  return null
}

export async function updateSession(id: string, updates: Partial<Session>): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) return
  // await supabase.from('sessions').update(updates).eq('id', id)
}
