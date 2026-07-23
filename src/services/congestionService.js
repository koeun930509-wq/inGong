// getPassgrAnncmt 실제 API 연동. (CLAUDE.md 규칙 5 — 함수 시그니처/반환 shape는
// 목업 단계와 동일하게 유지해서 컴포넌트 쪽 코드는 건드리지 않는다)

import { getPassgrAnncmt } from './passgrAnncmtApi'
import { GATE_COUNT_BY_TERMINAL } from '../constants/congestion'

function formatDate(adate) {
  return `${adate.slice(0, 4)}-${adate.slice(4, 6)}-${adate.slice(6, 8)}`
}

function toNumber(value) {
  return Math.round(Number(value))
}

function buildGates(item, terminal) {
  const prefix = terminal === 'T1' ? 't1dg' : 't2dg'
  return Array.from({ length: GATE_COUNT_BY_TERMINAL[terminal] }, (_, i) => ({
    gate: i + 1,
    value: toNumber(item[`${prefix}${i + 1}`]),
  }))
}

// getPassgrAnncmt의 한 시간 슬롯 item -> 터미널×구역별 행 4개로 변환한다.
function toRows(item) {
  const date = formatDate(item.adate)
  const time = item.atime

  return [
    { date, time, terminal: 'T1', zone: '입국장', value: toNumber(item.t1egsum1) },
    {
      date,
      time,
      terminal: 'T1',
      zone: '출국장',
      value: toNumber(item.t1dgsum1),
      gates: buildGates(item, 'T1'),
    },
    { date, time, terminal: 'T2', zone: '입국장', value: toNumber(item.t2egsum1) },
    {
      date,
      time,
      terminal: 'T2',
      zone: '출국장',
      value: toNumber(item.t2dgsum2),
      gates: buildGates(item, 'T2'),
    },
  ]
}

// date: 'today' | 'tomorrow'
export async function fetchCongestionByDate(date) {
  const selectdate = date === 'tomorrow' ? 1 : 0
  const items = await getPassgrAnncmt(selectdate)
  return items.filter((item) => item.atime !== '합계').flatMap(toRows)
}

export async function fetchTodayCongestion() {
  return fetchCongestionByDate('today')
}

export async function fetchTomorrowCongestion() {
  return fetchCongestionByDate('tomorrow')
}

// rows 중 선택한 time에 해당하는 터미널×구역 상세 목록을 반환한다.
export function getCongestionDetail(rows, time) {
  return rows.filter((row) => row.time === time)
}
