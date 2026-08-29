import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import WelcomePage from './pages/WelcomePage'
import LearnMorePage from './pages/LearnMorePage'
import AuthPage from './pages/AuthPage'
import MapPage from './pages/MapPage'
import CalendarPage from './pages/CalendarPage'
import LeaderboardPage from './pages/LeaderboardPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Straight into the city page. The search bar in the hero and the
            header is how you switch to another one. */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/city/:cityId" element={<WelcomePage />} />

        {/* Our story, and what the site is for */}
        <Route path="/learn-more" element={<LearnMorePage />} />

        {/* Auth */}
        <Route path="/login" element={<AuthPage />} />

        {/* Requires an account */}
        <Route element={<AppLayout />}>
          <Route path="/map" element={<MapPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
