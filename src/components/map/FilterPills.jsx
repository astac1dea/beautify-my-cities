import { PIN_TYPES } from '../../lib/constants'

export default function FilterPills({ value, onChange }) {
  const options = [['all', { label: 'All', emoji: '' }], ...Object.entries(PIN_TYPES)]
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map(([key, meta]) => {
        const active = value === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            title={meta.label}
            style={{
              padding: '5px 12px', borderRadius: 50, cursor: 'pointer',
              fontSize: 11, fontWeight: 600, fontFamily: 'inherit',
              background: active ? 'var(--blue)' : 'var(--bg)',
              color: active ? 'white' : 'var(--muted)',
              border: `1px solid ${active ? 'var(--blue)' : 'var(--border)'}`,
            }}
          >
            {key === 'all' ? 'All' : `${meta.emoji} ${meta.label}`}
          </button>
        )
      })}
    </div>
  )
}
