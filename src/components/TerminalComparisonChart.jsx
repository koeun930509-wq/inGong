import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { ZONES } from '../constants/congestion'

// detailRows -> [{ zone, T1, T2 }, ...] 형태로 변환한다.
function buildComparisonChartData(detailRows) {
  return ZONES.map((zone) => {
    const row = { zone }
    for (const terminalRow of detailRows.filter((r) => r.zone === zone)) {
      row[terminalRow.terminal] = terminalRow.value
    }
    return row
  })
}

export default function TerminalComparisonChart({ detailRows }) {
  const chartData = buildComparisonChartData(detailRows)

  return (
    <section className="card" style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, marginTop: 0 }}>터미널별 비교 (T1 vs T2)</h2>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="zone" stroke="var(--muted)" />
            <YAxis stroke="var(--muted)" />
            <Tooltip
              contentStyle={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
              }}
              labelStyle={{ color: 'var(--text)' }}
              itemStyle={{ color: 'var(--text)' }}
            />
            <Legend wrapperStyle={{ color: 'var(--text)', paddingTop: 16 }} />
            <Bar dataKey="T1" fill="var(--chart-t1)" barSize={24} radius={[4, 4, 0, 0]} />
            <Bar dataKey="T2" fill="var(--chart-t2)" barSize={24} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 0 }}>
        선택한 시간대의 터미널(T1/T2) × 구역(입국장/출국장)별 <code>value</code>(인원수, 명) 값을 비교합니다.
      </p>
    </section>
  )
}
