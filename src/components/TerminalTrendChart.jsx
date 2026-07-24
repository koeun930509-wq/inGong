import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { formatTimeSlotLabel } from '../constants/congestion'
import TerminalToggle from './TerminalToggle'

function ChartLegend({ series }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        paddingTop: 16,
        fontSize: 12,
        color: 'var(--text)',
      }}
    >
      {series.map(({ key, color }) => (
        <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
          {key}
        </span>
      ))}
    </div>
  )
}

// rows(선택한 날짜의 전체 시간대 행) -> [{ time, 'T1 입국장': value, 'T1 출국장': value, ... }, ...] 형태로 변환한다.
function buildTrendChartData(rows) {
  const byTime = new Map()
  for (const row of rows) {
    if (!byTime.has(row.time)) byTime.set(row.time, { time: row.time })
    byTime.get(row.time)[`${row.terminal} ${row.zone}`] = row.value
  }
  return Array.from(byTime.values())
}

const SERIES_BY_TERMINAL = {
  T1: [
    { key: 'T1 입국장', color: 'var(--chart-t1)' },
    { key: 'T1 출국장', color: 'var(--chart-t2)' },
  ],
  T2: [
    { key: 'T2 입국장', color: 'var(--chart-t1)' },
    { key: 'T2 출국장', color: 'var(--chart-t2)' },
  ],
}

export default function TerminalTrendChart({ rows }) {
  const [selectedTerminal, setSelectedTerminal] = useState('T1')
  const chartData = buildTrendChartData(rows)
  const series = SERIES_BY_TERMINAL[selectedTerminal]

  return (
    <section className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, margin: 0 }}>시간대별 혼잡도 추이</h2>
        <TerminalToggle value={selectedTerminal} onChange={setSelectedTerminal} />
      </div>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ width: '100%', minWidth: 640, height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: -8 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="time"
                tickFormatter={formatTimeSlotLabel}
                stroke="var(--muted)"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                stroke="var(--muted)"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                width={50}
              />
              <Tooltip
                labelFormatter={formatTimeSlotLabel}
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--text)' }}
                itemStyle={{ color: 'var(--text)' }}
              />
              {series.map(({ key, color }) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--surface)' }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <ChartLegend series={series} />
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 0 }}>
        선택한 날짜·터미널의 시간대별(<code>time</code>) 구역(입국장/출국장) <code>value</code>(인원수, 명) 변화를 보여줍니다.
      </p>
    </section>
  )
}
