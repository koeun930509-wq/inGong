// Supabase 'favorites' 테이블 연동. (CLAUDE.md 규칙 7, 12)
// 접근 제어는 RLS(auth.uid() = user_id)가 담당하며, 아래 userId 인자는
// UX 편의용 필터일 뿐 보안 경계가 아니다.

import { supabase } from './supabaseClient'

export async function listFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function addFavorite({ userId, terminal, zone, targetDate, targetTime, label }) {
  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: userId,
      terminal,
      zone,
      target_date: targetDate,
      target_time: targetTime,
      label: label ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteFavorite(favoriteId) {
  const { error } = await supabase.from('favorites').delete().eq('id', favoriteId)
  if (error) throw error
}
