import { useState } from 'react'

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
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

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function InputField({ icon, ...inputProps }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '16px 2px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span style={{ color: 'var(--muted)', display: 'flex' }}>{icon}</span>
      <input
        {...inputProps}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          flex: 1,
          fontSize: 14,
          color: 'var(--text)',
        }}
      />
    </div>
  )
}

export default function LoginButton({
  open,
  onClose,
  authError,
  authMessage,
  onSignIn,
  onSignUp,
}) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    if (mode === 'login') {
      onSignIn(email, password)
    } else {
      onSignUp(email, password, nickname)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20, 18, 40, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 16,
      }}
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 360, position: 'relative', padding: 32 }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'absolute',
            right: 12,
            top: 12,
            border: 'none',
            background: 'none',
            padding: 0,
            width: 28,
            height: 28,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--muted)',
          }}
        >
          <CloseIcon />
        </button>

        <form onSubmit={handleSubmit}>
            <InputField
              icon={<MailIcon />}
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {mode === 'signup' && (
              <InputField
                icon={<UserIcon />}
                type="text"
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            )}

            <InputField
              icon={<LockIcon />}
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div style={{ textAlign: 'right', margin: '16px 0 24px' }}>
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  fontSize: 13,
                  fontWeight: 400,
                  color: 'var(--muted)',
                }}
              >
                {mode === 'login' ? '회원가입' : '로그인'}
              </button>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                border: 'none',
                borderRadius: 9999,
                padding: '12px 0',
                fontSize: 14,
                letterSpacing: 1,
                color: '#fff',
                background: 'linear-gradient(90deg, var(--accent) 0%, var(--chart-t2) 100%)',
              }}
            >
              {mode === 'login' ? 'LOGIN' : '회원가입'}
            </button>
        </form>

        {authError && (
          <p role="alert" style={{ color: 'var(--level-high)', marginTop: 12, marginBottom: 0 }}>
            {authError}
          </p>
        )}
        {authMessage && (
          <p style={{ color: 'var(--muted)', marginTop: 12, marginBottom: 0 }}>{authMessage}</p>
        )}
      </div>
    </div>
  )
}
