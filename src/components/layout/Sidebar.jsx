import { NavLink, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import Wordmark from './Wordmark'
import { useAuth } from '../../hooks/useAuth'
import { useHours } from '../../hooks/useEvents'

const NAV = [
  { to: '/map',         icon: 'map',      label: 'Map' },
  { to: '/calendar',    icon: 'calendar', label: 'My calendar' },
  { to: '/leaderboard', icon: 'award',    label: 'Leaderboard' },
  { to: '/dashboard',   icon: 'chart',    label: 'My dashboard' },
  { to: '/profile',     icon: 'user',     label: 'Profile' },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const { totals } = useHours()
  const navigate = useNavigate()

  function logOut() {
    signOut()
    navigate('/', { replace: true })
  }

  return (
    <div style={{
      width: 244, background: 'var(--navy-dark)',
      minHeight: '100vh', padding: '22px 16px',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
      overflowY: 'auto',
    }}>
      <div style={{ padding: '0 6px 20px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
        <Wordmark dark size={32} subtitle="Milpitas, California" />
      </div>

      <nav style={{ marginTop: 20 }}>
        <ul style={{ listStyle: 'none' }}>
          {NAV.map(({ to, icon, label }) => (
            <li key={to} style={{ marginBottom: 2 }}>
              <NavLink to={to} style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '10px 12px', borderRadius: 'var(--radius)', textDecoration: 'none',
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                color: isActive ? '#fff' : 'rgba(255,255,255,.62)',
                background: isActive ? 'rgba(255,255,255,.12)' : 'transparent',
              })}>
                <Icon name={icon} size="sm" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Service hour summary, since it is the thing people come back for */}
      <div style={{
        background: 'rgba(255,255,255,.07)', borderRadius: 'var(--radius)',
        padding: '15px 16px', marginTop: 24,
      }}>
        <div style={{
          fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 700,
          letterSpacing: 0.07, textTransform: 'uppercase', marginBottom: 7,
        }}>
          Service hours
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {totals.verified}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 6 }}>
          verified{totals.pending > 0 ? ` · ${totals.pending} pending` : ''}
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 11,
          padding: '10px 12px', borderRadius: 'var(--radius)',
          background: 'rgba(255,255,255,.06)', marginBottom: 8,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(255,255,255,.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: '#fff', fontWeight: 700,
          }}>
            {user?.display_name?.charAt(0) || '?'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: '#fff',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.display_name}
            </div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.45)' }}>Resident</div>
          </div>
        </div>

        <button
          onClick={logOut}
          style={{
            width: '100%', padding: '9px 12px', borderRadius: 'var(--radius)', cursor: 'pointer',
            background: 'transparent', border: '1px solid rgba(255,255,255,.16)',
            color: 'rgba(255,255,255,.62)', fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Icon name="logout" size="sm" />
          Log out
        </button>
      </div>
    </div>
  )
}
