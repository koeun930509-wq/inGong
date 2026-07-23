// 공공데이터포털 "인천국제공항공사_출입국별 승객 예고 정보 조회서비스"
// 오퍼레이션명(영문) 그대로 함수명 사용: getPassgrAnncmt
// selectdate: 0 = 오늘, 1 = 내일 (API 스펙 그대로)

const BASE_URL = 'https://apis.data.go.kr/B551177/passgrAnncmt/getPassgrAnncmt'

export async function getPassgrAnncmt(selectdate) {
  const serviceKey = import.meta.env.VITE_AIRPORT_API_KEY
  if (!serviceKey) {
    throw new Error('VITE_AIRPORT_API_KEY 환경변수가 설정되지 않았습니다.')
  }

  const params = new URLSearchParams({
    serviceKey,
    selectdate: String(selectdate),
    type: 'json',
    numOfRows: '100',
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
