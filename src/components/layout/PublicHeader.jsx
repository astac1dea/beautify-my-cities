import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Wordmark from './Wordmark'
import CitySearch from './CitySearch'
import { useAuth } from '../../hooks/useAuth'
import { useIsMobile } from '../../hooks/useMediaQuery'

// Every entry is a route, hash included, so the nav works from any page and
// not just the one the section happens to live on. WelcomePage does the
// scrolling when it sees a hash.
const LINKS = [
  { to: '/#map', label: 'The map' },
  { to: '/#events', label: 'Volunteer events' },
  { to: '/#how', label: 'How it works' },
  { to: '/learn-more', label: 'Learn more' },
  { to: '/learn-more#contact', label: 'Contact us' },
]

function NavLink({ link, style, onClick }) {
  return <Link to={link.to} style={style} onClick={onClick}>{link.label}</Link>
}

const linkStyle = {
  fontSize: 14.5, fontWeight: 600, color: 'var(--text)',
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
              borderRadius: 0, cursor: 'pointer',
              background: 'var(--surface)', border: '1px solid var(--border-firm)',
              color: 'var(--text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size="md" />
          </button>
        ) : (
          <>
            <nav style={{ display: 'flex', gap: 16, flexWrap: 'nowrap', marginRight: 'auto' }}>
              {LINKS.map(l => (
                <NavLink key={l.label} link={l} style={linkStyle} />
              ))}
            </nav>
            <div style={{ width: 250, flexShrink: 0 }}>
              <CitySearch size="sm" placeholder="Search for your city" />
            </div>
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
          <CitySearch size="sm" placeholder="Search for your city" />

          <nav style={{ display: 'grid', gap: 2 }}>
            {LINKS.map(l => (
              <NavLink
                key={l.label}
                link={l}
                onClick={() => setMenuOpen(false)}
                style={{
                  ...linkStyle, fontSize: 15,
                  padding: '11px 4px', borderBottom: '1px solid var(--border)',
                }}
              />
            ))}
          </nav>

          <AuthActions isAuthed={isAuthed} user={user} stacked />
        </div>
      )}
    </header>
  )
}
