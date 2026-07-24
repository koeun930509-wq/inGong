import { HIGH_CONGESTION_THRESHOLD, formatTimeSlotLabel } from '../constants/congestion'

// rows(현재 로딩된 탭의 혼잡도)에서 즐겨찾기와 동일한 날짜·시간·터미널·구역 행을 찾는다.
// 다른 탭(날짜)의 즐겨찾기는 그 탭을 봐야 판단할 수 있다.
function isFavoriteCongested(fav, rows) {
  const row = rows.find(
    (r) =>
      r.date === fav.target_date &&
      r.time === fav.target_time &&
      r.terminal === fav.terminal &&
      r.zone === fav.zone,
  )
  return Boolean(row) && row.value >= HIGH_CONGESTION_THRESHOLD
}

export default function FavoritesList({
  user,
  favorites,
  favoritesError,
  rows,
  onSelectFavorite,
  onDeleteFavorite,
}) {
  if (!user) {
    return (
      <section className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>즐겨찾기</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>로그인 후 즐겨찾기를 이용할 수 있습니다.</p>
      </section>
    )
  }

  return (
    <section className="card" style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, marginTop: 0, marginBottom: 12 }}>내 즐겨찾기</h2>

      {favoritesError && (
        <p role="alert" style={{ color: 'var(--level-high)' }}>
          {favoritesError}
        </p>
      )}

      {favorites.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>저장된 즐겨찾기가 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {favorites.map((fav) => (
            <li
              key={fav.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <button
                type="button"
                onClick={() => onSelectFavorite(fav)}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  textAlign: 'left',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontWeight: 400,
                }}
              >
                {isFavoriteCongested(fav, rows) && '🔥 '}
                {fav.label ? `${fav.label} · ` : ''}
                {fav.target_date} {formatTimeSlotLabel(fav.target_time)} · {fav.terminal} {fav.zone}
              </button>
              <button
                onClick={() => onDeleteFavorite(fav.id)}
                style={{
                  border: 'none',
                  background: 'var(--border)',
                  color: 'var(--text)',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 400,
                  padding: '5px 11px',
                }}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
