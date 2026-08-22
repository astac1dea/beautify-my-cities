import { PIN_TYPES } from '../../lib/constants'
import Icon from '../ui/Icon'

export default function FilterPills({ value, onChange, spots = [] }) {
  function countFor(key) {
    if (key === 'all') return spots.length
    return spots.filter(s => s.type === key).length
  }

  const options = [['all', { label: 'All spots' }], ...Object.entries(PIN_TYPES)]

  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
      {options.map(([key, meta]) => {
        const active = value === key
        const isAll = key === 'all'
        const count = countFor(key)
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              padding: isAll ? '6px 14px' : '6px 11px',
              borderRadius: 'var(--radius)', cursor: 'pointer',
              fontSize: 13, fontWeight: isAll ? 700 : 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: active
                ? isAll ? 'var(--navy)' : meta.bg
                : 'var(--surface)',
              color: active
                ? isAll ? '#fff' : meta.color
                : 'var(--muted)',
              border: active
                ? `1.5px solid ${isAll ? 'var(--navy)' : meta.color}`
                : '1px solid var(--border-firm)',
              transition: 'all 0.13s',
            }}
          >
            {meta.icon && <Icon name={meta.icon} size={13} />}
            {meta.label}
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: active
                ? isAll ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.25)'
                : 'var(--surface-alt)',
              color: active ? (isAll ? '#fff' : meta.color) : 'var(--muted)',
              borderRadius: 20,
              padding: '1px 6px',
              minWidth: 18,
              textAlign: 'center',
            }}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
