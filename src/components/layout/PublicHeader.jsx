import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Wordmark from './Wordmark'
import CityPicker from './CityPicker'
import { useAuth } from '../../hooks/useAuth'
import { useIsMobile } from '../../hooks/useMediaQuery'

const LINKS = [
  { href: '#map', label: 'The map' },
  { href: '#events', label: 'Volunteer events' },
  { href: '#how', label: 'How it works' },
]

const linkStyle = {
  fontSize: 14, fontWeight: 500, color: 'var(--muted)',
  textDecoration: 'none', padding: '4px 0',
}

function AuthActions({ isAuthed, user, stacked }) {
  if (isAuthed) {
    return (
      <div style={{
        display: 'flex', gap: 10,
        flexDirection: stacked ? 'column' : 'row',
        alignItems: stacked ? 'stretch' : 'center',
      }}>
        {!stacked && (
          <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>
            Signed in as {user.display_name}
          </span>
        )}
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <Button iconAfter="arrowRight" full={stacked}>My dashboard</Button>
        </Link>
      </div>
    )
  }
  return (
    <div style={{
      display: 'flex', gap: 10,
      flexDirection: stacked ? 'column' : 'row',
    }}>
      <Link to="/login" style={{ textDecoration: 'none' }}>
        <Button variant="secondary" full={stacked}>Log in</Button>
      </Link>
      <Link to="/login?signup=1" style={{ textDecoration: 'none' }}>
        <Button full={stacked}>Create account</Button>
      </Link>
    </div>
  )
}

export default function PublicHeader() {
  const { isAuthed, user } = useAuth()
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header style={{
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 600,
    }}>
      <div className="shell" style={{
        padding: isMobile ? '11px 16px' : '13px 28px',
        display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 26,
      }}>
        <Wordmark size={isMobile ? 32 : 34} subtitle={null} />

        {isMobile ? (
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              marginLeft: 'auto', width: 40, height: 40, flexShrink: 0,
              borderRadius: 'var(--radius)', cursor: 'pointer',
              background: 'var(--surface)', border: '1px solid var(--border-firm)',
              color: 'var(--text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size="md" />
          </button>
        ) : (
          <>
            <div style={{ width: 178, flexShrink: 0 }}>
              <CityPicker />
            </div>
            <nav style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginRight: 'auto' }}>
              {LINKS.map(l => (
                <a key={l.href} href={l.href} style={linkStyle}>{l.label}</a>
              ))}
            </nav>
            <AuthActions isAuthed={isAuthed} user={user} />
          </>
        )}
      </div>

      {/* Mobile: everything folds into a panel under the bar */}
      {isMobile && menuOpen && (
        <div style={{
          borderTop: '1px solid var(--border)', background: 'var(--surface)',
          padding: '16px', display: 'grid', gap: 18,
          maxHeight: 'calc(100vh - 62px)', overflowY: 'auto',
        }}>
          <CityPicker />

          <nav style={{ display: 'grid', gap: 2 }}>
            {LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  ...linkStyle, fontSize: 15, color: 'var(--text)',
                  padding: '11px 4px', borderBottom: '1px solid var(--border)',
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <AuthActions isAuthed={isAuthed} user={user} stacked />
        </div>
      )}
    </header>
  )
}
