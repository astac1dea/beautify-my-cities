import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Icon from '../ui/Icon'

export default function Topbar({
  title, subtitle, onAddPin, addPinLabel = 'Report a spot', actions,
}) {
  const cancelling = addPinLabel === 'Cancel'

  return (
    <header style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '17px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 18,
      flexWrap: 'wrap',
      position: 'sticky',
      top: 0,
      zIndex: 500,
    }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ fontSize: 21, fontWeight: 700 }}>{title}</h1>
        {subtitle && (
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{subtitle}</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <Link
          to="/"
          style={{
            fontSize: 13.5, fontWeight: 600, textDecoration: 'none',
            color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 2px',
          }}
        >
          <Icon name="chevronLeft" size="sm" />
          Home
        </Link>
        {actions}
        {onAddPin && (
          <Button
            onClick={onAddPin}
            variant={cancelling ? 'secondary' : 'primary'}
            icon={cancelling ? undefined : 'pinPlus'}
          >
            {addPinLabel}
          </Button>
        )}
      </div>
    </header>
  )
}
