export default function Header({ onRefresh, darkMode, onToggleDarkMode }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 20,
      }}
    >
      <h1 style={{ fontSize: 20, margin: 0 }}>인천공항 혼잡도 대시보드</h1>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onRefresh('today')}>오늘 새로고침</button>
        <button onClick={() => onRefresh('tomorrow')}>내일 새로고침</button>
        <button onClick={onToggleDarkMode} aria-pressed={darkMode}>
          {darkMode ? '라이트 모드' : '다크 모드'}
        </button>
      </div>
    </header>
  )
}
