import Button from '../ui/Button'

export default function Topbar({ title, subtitle, onAddPin, addPinLabel = '+ Pin a Spot', actions }) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap',
      position: 'sticky',
      top: 0,
      zIndex: 500,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 900, color: 'var(--text)' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{subtitle}</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {actions}
        {onAddPin && (
          <Button onClick={onAddPin} variant={addPinLabel === 'Cancel' ? 'secondary' : 'primary'}>
            {addPinLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
