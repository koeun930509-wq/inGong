// 공공데이터포털 "인천국제공항공사_출입국별 승객 예고 정보 조회서비스"
// 오퍼레이션명(영문) 그대로 함수명 사용: getPassgrAnncmt
// selectdate: 0 = 오늘, 1 = 내일 (API 스펙 그대로)
// 공공데이터 API는 브라우저에서 직접 호출하지 않고 Supabase Edge Function
// (airport-proxy)을 통해서만 호출한다 — 서비스 키는 Edge Function Secret으로만 존재한다.

import { supabase } from './supabaseClient'

export async function getPassgrAnncmt(selectdate) {
  const { data, error } = await supabase.functions.invoke('airport-proxy', {
    body: { selectdate },
  })

  if (error) {
    const status = error?.context?.status
    throw new Error(
      status ? `공공데이터포털 API 요청 실패 (HTTP ${status})` : `공공데이터포털 API 요청 실패: ${error.message}`,
    )
  }

  const { resultCode, resultMsg } = data.response.header

  if (resultCode !== '00') {
    throw new Error(`공공데이터포털 API 에러: ${resultMsg} (resultCode=${resultCode})`)
  }

  return data.response.body.items
}
