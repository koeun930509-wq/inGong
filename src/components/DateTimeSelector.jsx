import { useEffect, useState } from 'react'
import { TIME_SLOTS, formatTimeSlotLabel } from '../constants/congestion'
import { getIncheonAirportWeather } from '../services/weatherService'

export default function DateTimeSelector({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
}) {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    getIncheonAirportWeather()
      .then(setWeather)
      .catch(() => setWeather(null))
  }, [])

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
      </div>
    </section>
  )
}
