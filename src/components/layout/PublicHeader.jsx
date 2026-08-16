import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Wordmark from './Wordmark'
import { useAuth } from '../../hooks/useAuth'
import CityPicker from './CityPicker'

const LINKS = [
  { href: '#map', label: 'The map' },
  { href: '#events', label: 'Volunteer events' },
  { href: '#how', label: 'How it works' },
  { href: '#award', label: 'Congressional Award' },
]

export default function PublicHeader() {
  const { isAuthed, user } = useAuth()

  return (
    <header style={{
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 600,
    }}>
      <div style={{
        maxWidth: 1220, margin: '0 auto', padding: '13px 28px',
        display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap',
      }}>
        <Wordmark size={34} subtitle={null} />

        <div style={{ width: 178 }}>
          <CityPicker />
        </div>

        <nav style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginRight: 'auto' }}>
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontSize: 14, fontWeight: 500, color: 'var(--muted)', textDecoration: 'none',
                padding: '4px 0',
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {isAuthed ? (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>
              Signed in as {user.display_name}
            </span>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <Button iconAfter="arrowRight">My dashboard</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button variant="secondary">Log in</Button>
            </Link>
            <Link to="/login?signup=1" style={{ textDecoration: 'none' }}>
              <Button>Create account</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
