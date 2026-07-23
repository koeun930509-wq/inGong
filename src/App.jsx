import { useEffect, useState } from 'react'
import Header from './components/Header'
import DateTimeSelector from './components/DateTimeSelector'
import CongestionDetailCard from './components/CongestionDetailCard'
import TerminalComparisonChart from './components/TerminalComparisonChart'
import TerminalTrendChart from './components/TerminalTrendChart'
import LoginButton from './components/LoginButton'
import FavoritesList from './components/FavoritesList'
import { TIME_SLOTS, isPastTimeSlot } from './constants/congestion'
import {
  fetchCongestionByDate,
  getCongestionDetail,
} from './services/congestionService'
import { listFavorites, addFavorite, deleteFavorite } from './services/favoritesService'
import { signIn, signUp, signOut, getCurrentUser, onAuthStateChange } from './services/authService'

function getDateString(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getInitialDarkMode() {
  const saved = localStorage.getItem('darkMode')
  if (saved !== null) return saved === 'true'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getCurrentTimeSlot() {
  const hour = new Date().getHours()
  return TIME_SLOTS[hour]
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState('today')
  const [selectedTime, setSelectedTime] = useState(getCurrentTimeSlot)
  const [rows, setRows] = useState([])
  const [darkMode, setDarkMode] = useState(getInitialDarkMode)
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [authMessage, setAuthMessage] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [favoritesError, setFavoritesError] = useState(null)
  const [congestionLoading, setCongestionLoading] = useState(true)
  const [congestionError, setCongestionError] = useState(null)

  async function loadCongestion(date) {
    setCongestionLoading(true)
    setCongestionError(null)
    try {
      const nextRows = await fetchCongestionByDate(date)
      setRows(nextRows)
    } catch (err) {
      setCongestionError(err.message)
    } finally {
      setCongestionLoading(false)
    }
  }

  useEffect(() => {
    loadCongestion(selectedDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  useEffect(() => {
    getCurrentUser().then(setUser)
    const subscription = onAuthStateChange(setUser)
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }
    setFavoritesError(null)
    listFavorites(user.id)
      .then(async (loaded) => {
        const past = loaded.filter((fav) => isPastTimeSlot(fav.target_date, fav.target_time))
        const current = loaded.filter((fav) => !isPastTimeSlot(fav.target_date, fav.target_time))
        setFavorites(current)
        if (past.length > 0) {
          await Promise.all(past.map((fav) => deleteFavorite(fav.id).catch(() => {})))
        }
      })
      .catch((err) => setFavoritesError(err.message))
  }, [user])

  const detailRows = getCongestionDetail(rows, selectedTime)
  const isLive = selectedDate === 'today' && selectedTime === getCurrentTimeSlot()

  function handleRefresh(date) {
    setSelectedDate(date)
  }

  async function handleSignIn(email, password) {
    setAuthError(null)
    setAuthMessage(null)
    try {
      const signedInUser = await signIn(email, password)
      setUser(signedInUser)
    } catch (err) {
      setAuthError(err.message)
    }
  }

  async function handleSignUp(email, password, nickname) {
    setAuthError(null)
    setAuthMessage(null)
    try {
      const { user: signedUpUser, needsEmailConfirmation } = await signUp(email, password, nickname)
      if (needsEmailConfirmation) {
        setAuthMessage('가입 확인 이메일을 보냈습니다. 이메일 인증 후 로그인해주세요.')
      } else {
        setUser(signedUpUser)
      }
    } catch (err) {
      setAuthError(err.message)
    }
  }

  async function handleSignOut() {
    setAuthError(null)
    setAuthMessage(null)
    await signOut()
    setUser(null)
  }

  async function handleAddFavorite(row) {
    if (!user) return
    setFavoritesError(null)
    try {
      const newFavorite = await addFavorite({
        userId: user.id,
        terminal: row.terminal,
        zone: row.zone,
        targetDate: row.date,
        targetTime: row.time,
      })
      setFavorites((prev) => [newFavorite, ...prev])
    } catch (err) {
      setFavoritesError(err.message)
    }
  }

  function handleSelectFavorite(fav) {
    setFavoritesError(null)
    if (fav.target_date === getDateString(0)) {
      setSelectedDate('today')
    } else if (fav.target_date === getDateString(1)) {
      setSelectedDate('tomorrow')
    } else {
      setFavoritesError('이 즐겨찾기는 오늘/내일 조회 가능 범위를 벗어나 이동할 수 없습니다.')
      return
    }
    setSelectedTime(fav.target_time)
  }

  async function handleDeleteFavorite(favoriteId) {
    setFavoritesError(null)
    try {
      await deleteFavorite(favoriteId)
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId))
    } catch (err) {
      setFavoritesError(err.message)
    }
  }

  return (
    <>
      <Header
        onRefresh={handleRefresh}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />

      <DateTimeSelector
        selectedDate={selectedDate}
        onSelectDate={handleRefresh}
        selectedTime={selectedTime}
        onSelectTime={setSelectedTime}
      />

      {congestionError && (
        <div className="card" style={{ marginBottom: 20 }}>
          <p role="alert" style={{ color: 'var(--level-high)' }}>
            혼잡도 정보를 불러올 수 없습니다. ({congestionError})
          </p>
          <button type="button" onClick={() => loadCongestion(selectedDate)}>
            재시도
          </button>
        </div>
      )}

      {!congestionError && (
        <CongestionDetailCard
          date={selectedDate}
          time={selectedTime}
          isLive={isLive}
          detailRows={detailRows}
          loading={congestionLoading}
          user={user}
          onAddFavorite={handleAddFavorite}
        />
      )}

      <LoginButton
        user={user}
        authError={authError}
        authMessage={authMessage}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSignOut={handleSignOut}
      />

      <FavoritesList
        user={user}
        favorites={favorites}
        favoritesError={favoritesError}
        rows={rows}
        onSelectFavorite={handleSelectFavorite}
        onDeleteFavorite={handleDeleteFavorite}
      />

      {!congestionError && (
        congestionLoading ? (
          <p style={{ color: 'var(--muted)' }}>그래프를 불러오는 중입니다...</p>
        ) : (
          <>
            <TerminalComparisonChart detailRows={detailRows} />
            <TerminalTrendChart rows={rows} />
          </>
        )
      )}
    </>
  )
}
