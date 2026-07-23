// Supabase Auth(이메일/비밀번호) 연동.
// (CLAUDE.md 규칙 10, 11 — service role key/admin API는 절대 여기 들어오지 않는다)

import { supabase } from './supabaseClient'

function toUser(session) {
  if (!session?.user) return null
  return {
    id: session.user.id,
    email: session.user.email,
    nickname: session.user.user_metadata?.nickname ?? null,
  }
}

export async function signUp(email, password, nickname) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  })
  if (error) throw error

  return {
    user: toUser(data.session),
    needsEmailConfirmation: !data.session,
  }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return toUser(data.session)
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return toUser(data.session)
}

// callback(user)을 세션 변경(로그인/로그아웃/토큰 갱신)마다 호출한다.
// 반환값의 unsubscribe()로 구독을 해제한다.
export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(toUser(session))
  })
  return data.subscription
}
