import { TIME_SLOTS } from '../constants/congestion'

// 'HH_HH' 슬롯 -> 'HH:00~HH:00' 표시용 라벨
function formatTimeSlotLabel(slot) {
  const [from, to] = slot.split('_')
  return `${from}:00~${to}:00`
}

export default function DateTimeSelector({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
}) {
  return (
    <section className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
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

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {TIME_SLOTS.map((time) => (
          <button
            key={time}
            onClick={() => onSelectTime(time)}
            aria-pressed={selectedTime === time}
            style={{
              fontSize: 12,
              fontWeight: selectedTime === time ? 700 : 400,
              borderColor: selectedTime === time ? 'var(--accent)' : 'var(--border)',
            }}
          >
            {formatTimeSlotLabel(time)}
          </button>
        ))}
      </div>
    </section>
  )
}
