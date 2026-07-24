// getTrackingParking 실제 API 연동.
// floor는 19종류 자유 텍스트('T1 단기주차장 지상층' 등) — 앞 2글자(T1/T2)로 터미널만 구분해서 사용한다.

import { getTrackingParking } from './statusOfParkingApi'

function toNumber(value) {
  return Math.round(Number(value))
}

// activation guide V7.3: parking이 0이면 미운영. 음수(예제의 -684)는 문서에 정의가 없어
// 표시상으로도 '미운영'과 동일하게 취급한다(음수 차량수는 실제 값일 수 없으므로).
function isOperating(parking) {
  return parking > 0
}

function toRow(item) {
  return {
    floor: item.floor,
    terminal: item.floor.startsWith('T2') ? 'T2' : 'T1',
    parking: toNumber(item.parking),
    parkingArea: toNumber(item.parkingarea),
    operating: isOperating(toNumber(item.parking)),
    updatedAt: item.datetm,
  }
}

export async function fetchParkingStatus() {
  const items = await getTrackingParking()
  return items.map(toRow)
}
