import { useState } from 'react'

export default function LoginButton({ user, authError, authMessage, onSignIn, onSignUp, onSignOut }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')

  if (user) {
    return (
      <section className="card" style={{ marginBottom: 20 }}>
        <span style={{ marginRight: 12 }}>{user.email}님 로그인됨</span>
        <button onClick={onSignOut}>로그아웃</button>
      </section>
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (mode === 'login') {
      onSignIn(email, password)
    } else {
      onSignUp(email, password, nickname)
    }
  }

  return (
    <section className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => setMode('login')}
          aria-pressed={mode === 'login'}
          style={{ fontWeight: mode === 'login' ? 700 : 400 }}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          aria-pressed={mode === 'signup'}
          style={{ fontWeight: mode === 'signup' ? 700 : 400 }}
        >
          회원가입
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}
      >
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{mode === 'login' ? '로그인' : '회원가입'}</button>
      </form>

      {authError && (
        <p role="alert" style={{ color: 'var(--level-high)', marginBottom: 0 }}>
          {authError}
        </p>
      )}
      {authMessage && (
        <p style={{ color: 'var(--muted)', marginBottom: 0 }}>{authMessage}</p>
      )}
    </section>
  )
}
