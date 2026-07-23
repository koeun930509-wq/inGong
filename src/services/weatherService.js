// OpenWeatherMap Current Weather API (인천공항 좌표 고정)
// https://openweathermap.org/current

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const INCHEON_AIRPORT_COORDS = { lat: 37.4602, lon: 126.4407 }

export async function getIncheonAirportWeather() {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  if (!apiKey) {
    throw new Error('VITE_OPENWEATHER_API_KEY 환경변수가 설정되지 않았습니다.')
  }

  const params = new URLSearchParams({
    lat: String(INCHEON_AIRPORT_COORDS.lat),
    lon: String(INCHEON_AIRPORT_COORDS.lon),
    appid: apiKey,
    units: 'metric',
    lang: 'kr',
  })

  const response = await fetch(`${BASE_URL}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`OpenWeatherMap API 요청 실패 (HTTP ${response.status})`)
  }

  const json = await response.json()

  return {
    tempC: Math.round(json.main.temp),
    description: json.weather[0]?.description ?? '',
    iconCode: json.weather[0]?.icon ?? null,
  }
}
