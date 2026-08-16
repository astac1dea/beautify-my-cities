import { PIN_TYPES } from '../../lib/constants'
import Icon from '../ui/Icon'

export default function FilterPills({ value, onChange }) {
  const options = [['all', { label: 'All spots' }], ...Object.entries(PIN_TYPES)]

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map(([key, meta]) => {
        const active = value === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              padding: '6px 12px', borderRadius: 'var(--radius)', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: active ? 'var(--navy)' : 'var(--surface)',
              color: active ? '#fff' : 'var(--muted)',
              border: `1px solid ${active ? 'var(--navy)' : 'var(--border-firm)'}`,
            }}
          >
            {meta.icon && <Icon name={meta.icon} size={14} />}
            {meta.label}
          </button>
        )
      })}
    </div>
  )
}
