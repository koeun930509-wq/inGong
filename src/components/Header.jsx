function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <polyline points="21 3 21 9 15 9" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
      <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
      <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  )
}

function UnlockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.6-1.8" />
    </svg>
  )
}

const iconButtonStyle = {
  width: 40,
  height: 40,
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export default function Header({ onRefresh, darkMode, onToggleDarkMode, user, onOpenLogin, onSignOut }) {
  return (
    <header
      className="app-header"
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
        <button
          onClick={user ? onSignOut : onOpenLogin}
          aria-pressed={Boolean(user)}
          title={user ? `${user.nickname ?? user.email}님 · 로그아웃` : '로그인'}
          aria-label={user ? `${user.nickname ?? user.email}님 · 로그아웃` : '로그인'}
          style={iconButtonStyle}
        >
          {user ? <UnlockIcon /> : <UserIcon />}
        </button>
        <button
          onClick={() => onRefresh('today')}
          title="오늘 새로고침"
          aria-label="오늘 새로고침"
          style={iconButtonStyle}
        >
          <RefreshIcon />
        </button>
        <button
          onClick={() => onRefresh('tomorrow')}
          title="내일 새로고침"
          aria-label="내일 새로고침"
          style={iconButtonStyle}
        >
          <CalendarIcon />
        </button>
        <button
          onClick={onToggleDarkMode}
          aria-pressed={darkMode}
          title={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          style={iconButtonStyle}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  )
}
