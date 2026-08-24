import { useEffect, useState } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Wordmark from './Wordmark'
import Icon from '../ui/Icon'
import { useAuth } from '../../hooks/useAuth'
import { useIsMobile } from '../../hooks/useMediaQuery'

const SIDEBAR_W = 244

// The bar that replaces the sidebar on small screens.
function MobileBar({ onOpen }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 400,
      background: 'var(--navy-dark)', color: '#fff',
      padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <button
        onClick={onOpen}
        aria-label="Open menu"
        style={{
          width: 40, height: 40, borderRadius: 'var(--radius)', flexShrink: 0,
          background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.16)',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name="menu" size="md" />
      </button>
      <Wordmark dark size={30} subtitle={null} />
    </div>
  )
}

export default function AppLayout() {
  const { isAuthed } = useAuth()
  const isMobile = useIsMobile()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  // Navigating should always close the drawer behind you.
  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  // Don't leave the drawer stranded open if the window grows.
  useEffect(() => { if (!isMobile) setDrawerOpen(false) }, [isMobile])

  useEffect(() => {
    if (!drawerOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') setDrawerOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [drawerOpen])

  if (!isAuthed) return <Navigate to="/login" replace />

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <MobileBar onOpen={() => setDrawerOpen(true)} />

        {drawerOpen && (
          <>
            <div
              onClick={() => setDrawerOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(14,27,42,.55)' }}
            />
            <div style={{
              position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 901,
              width: Math.min(SIDEBAR_W + 24, 300),
              boxShadow: 'var(--shadow-lg)',
            }}>
              <Sidebar fullWidth onNavigate={() => setDrawerOpen(false)} />
            </div>
          </>
        )}

        <div style={{ minWidth: 0 }}>
          <Outlet />
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: SIDEBAR_W, flex: 1, minWidth: 0, minHeight: '100vh' }}>
        <Outlet />
      </div>
    </div>
  )
}
