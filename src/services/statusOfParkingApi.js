// 공공데이터포털 "인천국제공항공사_주차 현황 조회 서비스"
// 오퍼레이션명(영문) 그대로 함수명 사용: getTrackingParking
// 응답 필드(floor/parking/parkingarea/datetm)는 활용가이드(V7.3) 기준.
// floor는 19종류 자유 텍스트('T1 단기주차장 지상층' 등) — 별도 코드 매핑 없이 원문 그대로 사용.
// 공공데이터 API는 브라우저에서 직접 호출하지 않고 Supabase Edge Function
// (parking-proxy)을 통해서만 호출한다 — 서비스 키는 Edge Function Secret으로만 존재한다.

import { supabase } from './supabaseClient'

export async function getTrackingParking() {
  const { data, error } = await supabase.functions.invoke('parking-proxy', {
    body: {},
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
