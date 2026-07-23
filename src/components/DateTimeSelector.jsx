import { TIME_SLOTS, formatTimeSlotLabel } from '../constants/congestion'

export default function DateTimeSelector({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
}) {
  return (
    <section className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['today', 'tomorrow'].map((date) => (
            <button
              key={date}
              onClick={() => onSelectDate(date)}
              aria-pressed={selectedDate === date}
              style={{
                fontWeight: selectedDate === date ? 700 : 400,
                borderColor: selectedDate === date ? 'var(--accent)' : 'var(--border)',
              }}
            >
              {date === 'today' ? '오늘' : '내일'}
            </button>
          ))}
        </div>

        <select
          value={selectedTime}
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
          {TIME_SLOTS.map((time) => (
            <option key={time} value={time}>
              {formatTimeSlotLabel(time)}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}
