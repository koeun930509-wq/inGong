import { useState } from 'react'
import TerminalToggle from './TerminalToggle'

export default function ParkingStatusCard({ parkingRows, loading, error, onRetry }) {
  const [selectedTerminal, setSelectedTerminal] = useState('T1')
  const rows = parkingRows.filter((row) => row.terminal === selectedTerminal)

  return (
    <section className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, margin: 0 }}>주차장 현황</h2>
        <TerminalToggle value={selectedTerminal} onChange={setSelectedTerminal} />
      </div>

      {error ? (
        <div>
          <p role="alert" style={{ color: 'var(--level-high)' }}>
            주차장 현황을 불러올 수 없습니다. ({error})
          </p>
          <button type="button" onClick={onRetry}>
            재시도
          </button>
        </div>
      ) : loading ? (
        <p style={{ color: 'var(--muted)' }}>불러오는 중...</p>
      ) : rows.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>주차장 현황 데이터가 없습니다.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 8,
          }}
        >
          {rows.map((row) => (
            <div
              key={row.floor}
              className="card"
              style={{ padding: 20, borderRadius: 6, boxShadow: 'none' }}
            >
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{row.floor}</div>
              {row.operating ? (
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {row.parking}
                  <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted)' }}>
                    {' '}
                    / {row.parkingArea}대
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>미운영</div>
              )}
            </div>
          ))}
        </div>
      )}

      {!error && !loading && rows.length > 0 && (
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12, marginBottom: 0 }}>
          {rows[0].updatedAt} 기준 · 1분 주기로 갱신되는 실제 주차 대수입니다.
        </p>
      )}
    </section>
  )
}
