import { Logo } from './Wordmark'
import { useCity } from '../../hooks/useCity'

const SHELL = { maxWidth: 1220, margin: '0 auto', padding: '0 var(--shell-pad, 28px)' }

// Shared by every page that is visible without an account.
export default function PublicFooter() {
  const { city } = useCity()

  return (
    <footer style={{ background: 'var(--surface-alt)', color: 'var(--muted)' }}>
      <div style={{
        ...SHELL, paddingTop: 40, paddingBottom: 40,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 24, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Logo size={32} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>Beautify Our Cities</div>
            <div style={{ fontSize: 12.5, marginTop: 2 }}>A civic platform for {city.name}, {city.state}</div>
          </div>
        </div>
        <div style={{ fontSize: 13.5 }}>
          Map data © OpenStreetMap contributors
        </div>
      </div>
    </footer>
  )
}
