import { useEffect, useState } from 'react'
import { HIGH_CONGESTION_THRESHOLD, TIME_SLOTS, formatTimeSlotLabel } from '../constants/congestion'
import { getIncheonAirportWeather } from '../services/weatherService'

function StarIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8-6.1-3.6-6.1 3.6 1.5-6.8-5.2-4.7 6.9-.7z" strokeLinejoin="round" />
    </svg>
  )
}

function PlaneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2.5 1.8V22l3.5-1 3.5 1v-1.2L13 19v-5.5z" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <polyline points="21 3 21 9 15 9" />
    </svg>
  )
}

function congestionLevel(value) {
  if (value >= HIGH_CONGESTION_THRESHOLD) return { label: '매우 혼잡', color: 'var(--level-high)' }
  if (value >= HIGH_CONGESTION_THRESHOLD * 0.6) return { label: '약간 혼잡', color: 'var(--level-mid)' }
  if (value >= HIGH_CONGESTION_THRESHOLD * 0.3) return { label: '보통', color: 'var(--level-mid)' }
  return { label: '여유', color: 'var(--level-ok)' }
}

function formatNumber(value) {
  return value.toLocaleString('ko-KR')
}

function GaugeBar({ percent, color }) {
  return (
    <div
      style={{
        height: 6,
        borderRadius: 9999,
        background: 'var(--border)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${percent}%`,
          height: '100%',
          borderRadius: 9999,
          background: color,
        }}
      />
    </div>
  )
}

export default function CongestionDetailCard({
  date,
  time,
  isLive,
  detailRows,
  loading,
  user,
  onAddFavorite,
  favorites,
  onSelectDate,
  onSelectTime,
}) {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    getIncheonAirportWeather()
      .then(setWeather)
      .catch(() => setWeather(null))
  }, [])

  const maxValue = Math.max(...detailRows.map((row) => row.value), 1)
  const maxGateValue = Math.max(
    ...detailRows.flatMap((row) => row.gates?.map((gate) => gate.value) ?? []),
    1,
  )

  return (
    <section className="card" style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, marginTop: 0, marginBottom: 16 }}>
        {isLive
          ? `실시간(${formatTimeSlotLabel(time)}) 상세 혼잡도`
          : `${date === 'tomorrow' ? '내일 ' : ''}${formatTimeSlotLabel(time)} 상세 혼잡도`}
      </h2>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            width: 160,
            padding: '0 1px',
            borderRadius: 9999,
            background: 'var(--border)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: date === 'today' ? 1 : '50%',
              width: 'calc(50% - 1px)',
              borderRadius: 9999,
              background: 'var(--accent)',
              transition: 'left 0.2s ease',
            }}
          />
          {['today', 'tomorrow'].map((d) => (
            <button
              key={d}
              onClick={() => onSelectDate(d)}
              aria-pressed={date === d}
              style={{
                position: 'relative',
                zIndex: 1,
                flex: 1,
                border: 'none',
                background: 'transparent',
                color: date === d ? 'var(--on-accent)' : 'var(--text)',
                fontWeight: date === d ? 700 : 400,
                padding: '6px 0',
              }}
            >
              {d === 'today' ? '오늘' : '내일'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {weather && (
            <span
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--muted)' }}
              title={weather.description}
            >
              {weather.iconCode && (
                <img
                  src={`https://openweathermap.org/img/wn/${weather.iconCode}.png`}
                  alt={weather.description}
                  width={24}
                  height={24}
                />
              )}
              {weather.tempC}°C
            </span>
          )}

          <select
            value={time}
            onChange={(e) => onSelectTime(e.target.value)}
            style={{
              fontFamily: 'inherit',
              fontSize: 14,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
            }}
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {formatTimeSlotLabel(slot)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>불러오는 중...</p>
      ) : detailRows.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>해당 시간대 데이터가 없습니다.</p>
      ) : (
        <>
          <div className="detail-grid">
            {detailRows.map((row) => {
              const level = congestionLevel(row.value)
              const gaugePercent = Math.round((row.value / maxValue) * 100)
              const isFavorited = favorites?.some(
                (fav) =>
                  fav.terminal === row.terminal &&
                  fav.zone === row.zone &&
                  fav.target_date === row.date &&
                  fav.target_time === row.time,
              )

              return (
                <div
                  key={`${row.terminal}-${row.zone}`}
                  className="card"
                  style={{
                    position: 'relative',
                    height: '100%',
                    boxSizing: 'border-box',
                    padding: 14,
                    paddingBottom: 44,
                    boxShadow: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--muted)',
                        }}
                      >
                        <PlaneIcon />
                      </span>
                      {row.terminal} · {row.zone}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: level.color,
                        background: 'color-mix(in srgb, ' + level.color + ' 16%, transparent)',
                        borderRadius: 3,
                        padding: '4px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {level.label}
                    </span>
                  </div>

                  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 10 }}>
                    {formatNumber(row.value)}
                    <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--muted)' }}> 명</span>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 11,
                        color: 'var(--muted)',
                        marginBottom: 4,
                      }}
                    >
                      <span>혼잡도</span>
                      <span style={{ fontWeight: 700, color: 'var(--text)' }}>{gaugePercent}%</span>
                    </div>
                    <GaugeBar percent={gaugePercent} color={level.color} />
                  </div>

                  {row.gates && (
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {row.gates.map((gate) => (
                        <div key={gate.gate} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, color: 'var(--muted)', width: 44, flexShrink: 0 }}>
                            Gate {gate.gate}
                          </span>
                          <div style={{ flex: 1 }}>
                            <GaugeBar
                              percent={Math.round((gate.value / maxGateValue) * 100)}
                              color="var(--accent)"
                            />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--muted)', width: 48, textAlign: 'right', flexShrink: 0 }}>
                            {formatNumber(gate.value)}명
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="favorite-star-btn"
                    onClick={() => {
                      if (!user) {
                        alert('로그인이 필요합니다.')
                        return
                      }
                      onAddFavorite(row)
                    }}
                    title="즐겨찾기 추가"
                    aria-label="즐겨찾기 추가"
                    style={{
                      position: 'absolute',
                      right: 10,
                      bottom: 10,
                      width: 32,
                      height: 32,
                      padding: 0,
                      border: 'none',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isFavorited ? 'var(--accent)' : undefined,
                    }}
                  >
                    <StarIcon filled={isFavorited} />
                  </button>
                </div>
              )
            })}
          </div>
          {isLive && (
            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                color: 'var(--muted)',
                marginTop: 12,
                marginBottom: 0,
              }}
            >
              <RefreshIcon />
              5분마다 새로고침
            </p>
          )}
        </>
      )}
    </section>
  )
}
