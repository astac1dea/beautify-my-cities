import { NavLink } from 'react-router-dom'

const navMain = [
  { to: '/',            icon: '🗺️', label: 'Map' },
  { to: '/events',      icon: '📅', label: 'Events' },
  { to: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { to: '/dashboard',   icon: '📊', label: 'City Dashboard' },
]

const navCommunity = [
  { to: '/murals',  icon: '🎨', label: 'Murals' },
  { to: '/local',   icon: '🏪', label: 'Support Local' },
  { to: '/vote',    icon: '🗳️', label: 'Vote for Change' },
  { to: '/green',   icon: '🌳', label: 'Green Spots' },
]

export default function Sidebar() {
  return (
    <div style={{
      width: '240px', background: 'var(--sidebar)',
      minHeight: '100vh', padding: '28px 20px',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '40px', paddingBottom: '28px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          width: 34, height: 34, background: 'var(--blue-mid)',
          borderRadius: 10, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 16,
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
        borderRadius: 10, padding: '12px 14px', marginBottom: 32,
      }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
          Current City
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'white', display: 'flex', justifyContent: 'space-between' }}>
          📍 Milpitas, CA <span style={{ opacity: 0.5 }}>⌄</span>
        </div>
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8, paddingLeft: 4 }}>Main</div>
      <ul style={{ listStyle: 'none', marginBottom: 32 }}>
        {navMain.map(({ to, icon, label }) => (
          <li key={to} style={{ marginBottom: 2 }}>
            <NavLink to={to} end style={({ isActive }) => ({
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

      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8, paddingLeft: 4 }}>Community</div>
      <ul style={{ listStyle: 'none', marginBottom: 32 }}>
        {navCommunity.map(({ to, icon, label }) => (
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

      <div style={{ marginTop: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'rgba(255,255,255,0.05)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--blue-mid)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: 'white', fontWeight: 700, flexShrink: 0,
          }}>A</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>Ayu</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>City Admin · Milpitas</div>
          </div>
        </div>
      </div>
    </div>
  )
}