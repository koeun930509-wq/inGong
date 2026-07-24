// 공공데이터포털 "인천국제공항공사_주차 현황 조회 서비스"
// 오퍼레이션명(영문) 그대로 함수명 사용: getTrackingParking
// 응답 필드(floor/parking/parkingarea/datetm)는 활용가이드(V7.3) 기준.
// floor는 19종류 자유 텍스트('T1 단기주차장 지상층' 등) — 별도 코드 매핑 없이 원문 그대로 사용.

const BASE_URL = 'https://apis.data.go.kr/B551177/StatusOfParking/getTrackingParking'

export async function getTrackingParking() {
  const serviceKey = import.meta.env.VITE_AIRPORT_API_KEY
  if (!serviceKey) {
    throw new Error('VITE_AIRPORT_API_KEY 환경변수가 설정되지 않았습니다.')
  }

  const params = new URLSearchParams({
    serviceKey,
    type: 'json',
    numOfRows: '50',
    pageNo: '1',
  })

  const response = await fetch(`${BASE_URL}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`공공데이터포털 API 요청 실패 (HTTP ${response.status})`)
  }

  const json = await response.json()
  const { resultCode, resultMsg } = json.response.header

  if (resultCode !== '00') {
    throw new Error(`공공데이터포털 API 에러: ${resultMsg} (resultCode=${resultCode})`)
  }

  return json.response.body.items
}
