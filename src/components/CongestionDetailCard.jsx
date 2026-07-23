import { HIGH_CONGESTION_THRESHOLD } from '../constants/congestion'

export default function CongestionDetailCard({ date, time, detailRows, loading, user, onAddFavorite }) {
  return (
    <section className="card" style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, marginTop: 0 }}>
        {date === 'tomorrow' ? '내일' : '오늘'} {time} 상세 혼잡도
      </h2>

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>불러오는 중...</p>
      ) : detailRows.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>해당 시간대 데이터가 없습니다.</p>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
            }}
          >
            {detailRows.map((row) => {
              const isHighCongestion = row.value >= HIGH_CONGESTION_THRESHOLD

              return (
              <div
                key={`${row.terminal}-${row.zone}`}
                className="card"
                style={{
                  padding: 12,
                  background: isHighCongestion
                    ? 'color-mix(in srgb, var(--level-high) 18%, var(--surface))'
                    : undefined,
                  borderColor: isHighCongestion ? 'var(--level-high)' : undefined,
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {row.terminal} · {row.zone}
                </div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>
                  {row.value}명
                  {isHighCongestion && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--level-high)',
                        marginLeft: 6,
                      }}
                    >
                      혼잡
                    </span>
                  )}
                </div>
                {row.gates && (
                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
                    <div>게이트별 인원(명)</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
                      {row.gates.map((gate, i) => (
                        <span key={gate.gate}>
                          {i > 0 && '· '}
                          {gate.gate}번 {gate.value}명
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {user && (
                  <button
                    type="button"
                    style={{ marginTop: 8, fontSize: 12 }}
                    onClick={() => onAddFavorite(row)}
                  >
                    즐겨찾기 추가
                  </button>
                )}
              </div>
              )
            })}
          </div>
          {!user && (
            <p style={{ color: 'var(--muted)', marginTop: 12, marginBottom: 0 }}>
              로그인하면 각 항목을 즐겨찾기에 추가할 수 있습니다.
            </p>
          )}
        </>
      )}
    </section>
  )
}
