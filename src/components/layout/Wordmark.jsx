import { Link } from 'react-router-dom'

// The mark: three stacked bars leaning like a rising slope, in a rounded square.
export function Logo({ size = 34, background = 'var(--navy)', color = '#fff' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 0, background, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2.4" strokeLinecap="round">
        <path d="M4 19h16" />
        <path d="M7 19v-5" />
        <path d="M12 19V9" />
        <path d="M17 19V5" />
      </svg>
    </div>
  )
}

// Always links home, so there is a way back to the welcome page from anywhere.
export default function Wordmark({ dark = false, size = 34, subtitle }) {
  return (
    <Link
      to="/"
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        textDecoration: 'none', color: 'inherit', minWidth: 0,
      }}
    >
      <Logo
        size={size}
        background={dark ? 'rgba(255,255,255,.14)' : 'var(--navy)'}
        color="#fff"
      />
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: size > 30 ? 16 : 15, fontWeight: 800, lineHeight: 1.2,
          letterSpacing: '-0.02em', color: dark ? '#fff' : 'var(--text)',
        }}>
          Beautify Our Cities
        </div>
        {subtitle && (
          <div style={{
            fontSize: 11.5, marginTop: 1,
            color: dark ? 'rgba(255,255,255,.55)' : 'var(--muted)',
          }}>
            {subtitle}
          </div>
        )}
      </div>
    </Link>
  )
}
