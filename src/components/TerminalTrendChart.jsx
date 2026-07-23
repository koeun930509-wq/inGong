import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

// rows(선택한 날짜의 전체 시간대 행) -> [{ time, 'T1 입국장': value, 'T1 출국장': value, ... }, ...] 형태로 변환한다.
function buildTrendChartData(rows) {
  const byTime = new Map()
  for (const row of rows) {
    if (!byTime.has(row.time)) byTime.set(row.time, { time: row.time })
    byTime.get(row.time)[`${row.terminal} ${row.zone}`] = row.value
  }
  return Array.from(byTime.values())
}

const SERIES = [
  { key: 'T1 입국장', color: 'var(--chart-t1)', dash: undefined },
  { key: 'T1 출국장', color: 'var(--chart-t1)', dash: '6 4' },
  { key: 'T2 입국장', color: 'var(--chart-t2)', dash: undefined },
  { key: 'T2 출국장', color: 'var(--chart-t2)', dash: '6 4' },
]

export default function TerminalTrendChart({ rows }) {
  const chartData = buildTrendChartData(rows)

  return (
    <section className="card" style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, marginTop: 0 }}>시간대별 혼잡도 추이</h2>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" stroke="var(--muted)" />
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
            <Legend wrapperStyle={{ color: 'var(--text)' }} />
            {SERIES.map(({ key, color, dash }) => (
              <Line
                key={key}
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                strokeDasharray={dash}
                dot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: 'var(--surface)' }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 0 }}>
        선택한 날짜의 시간대별(<code>time</code>) 터미널 × 구역 <code>value</code>(인원수, 명) 변화를 선(색상: 터미널, 실선/점선: 구역)으로 보여줍니다.
      </p>
    </section>
  )
}
