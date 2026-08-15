import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useHours } from '../../hooks/useEvents'

const NAV = [
  { to: '/map',         icon: '🗺️', label: 'Map' },
  { to: '/calendar',    icon: '📅', label: 'My Calendar' },
  { to: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { to: '/dashboard',   icon: '📊', label: 'My Dashboard' },
  { to: '/profile',     icon: '👤', label: 'Profile' },
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
      width: 240, background: 'var(--sidebar)',
      minHeight: '100vh', padding: '28px 20px',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
      overflowY: 'auto',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 28, paddingBottom: 24,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          width: 34, height: 34, background: 'var(--blue-mid)', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
        }}>🌿</div>
        <div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 14, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
            Beautify My City
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Civic Platform</div>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, padding: '12px 14px', marginBottom: 26,
      }}>
        <div style={{
          fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600,
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4,
        }}>
          Current City
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>
          📍 Milpitas, CA
        </div>
      </div>

      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)', marginBottom: 8, paddingLeft: 4,
      }}>
        Main
      </div>
      <ul style={{ listStyle: 'none', marginBottom: 26 }}>
        {NAV.map(({ to, icon, label }) => (
          <li key={to} style={{ marginBottom: 2 }}>
            <NavLink to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
              fontSize: 13, fontWeight: 500,
              color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
              background: isActive ? 'var(--blue-mid)' : 'transparent',
            })}>
              {icon} {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Service hour summary, since it is the thing people come back for */}
      <div style={{
        background: 'rgba(255,255,255,0.05)', borderRadius: 10,
        padding: '14px 16px', marginBottom: 20,
      }}>
        <div style={{
          fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700,
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6,
        }}>
          Service hours
        </div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 900, color: 'white', lineHeight: 1 }}>
          {totals.verified}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 5 }}>
          verified{totals.pending > 0 ? ` · ${totals.pending} pending` : ''}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'rgba(255,255,255,0.05)', marginBottom: 8,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: user?.avatar_color || 'var(--blue-mid)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: 'white', fontWeight: 700,
          }}>
            {user?.display_name?.charAt(0) || '?'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, color: 'white',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.display_name}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
              Resident · Milpitas
            </div>
          </div>
        </div>

        <button
          onClick={logOut}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
          }}
        >
          Log out
        </button>
      </div>
    </div>
  )
}
