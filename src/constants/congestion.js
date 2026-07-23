// 터미널/구역/시간 슬롯 상수. getPassgrAnncmt 실제 API 스펙과 동일하게 맞춘다. (PRD.md §16-1/2 확정됨)
//
// 행 shape: { date, time, terminal, zone, value, gates? }
// - date: 'YYYY-MM-DD', time: 실제 API atime 그대로 'HH_HH' (예: '09_10')
// - value: 인원수(명), 등급/점수 없음 (§16-2: 실제 인원수 그대로 표시하기로 확정)
// - gates: 출국장에만 존재하는 게이트별(1번, 2번, ...) 인원수 배열

export const TERMINALS = ['T1', 'T2']
export const ZONES = ['입국장', '출국장']

// getPassgrAnncmt의 atime 슬롯("00_01" ~ "23_00")과 동일한 24개 1시간 단위 슬롯.
export const TIME_SLOTS = Array.from({ length: 24 }, (_, hour) => {
  const from = String(hour).padStart(2, '0')
  const to = String((hour + 1) % 24).padStart(2, '0')
  return `${from}_${to}`
})

// getPassgrAnncmt의 t1dg1~6(T1) / t2dg1~2(T2) 필드 개수와 동일한 게이트 수.
export const GATE_COUNT_BY_TERMINAL = { T1: 6, T2: 2 }

// PRD §6.6: 혼잡도(인원수)가 이 값 이상이면 "혼잡" 강조 표시.
export const HIGH_CONGESTION_THRESHOLD = 100
