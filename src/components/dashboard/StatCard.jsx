import Icon from '../ui/Icon'

export default function StatCard({ icon, number, label, trend, tone = 'neutral' }) {
  const tones = {
    neutral: { color: 'var(--muted)',  bg: '#EDF0F3' },
    good:    { color: 'var(--green)',  bg: 'var(--green-soft)' },
    warn:    { color: 'var(--amber)',  bg: 'var(--amber-soft)' },
    brand:   { color: 'var(--navy)',   bg: 'var(--navy-soft)' },
  }
  const t = tones[tone] || tones.neutral

  return (
    <div className="card" style={{ padding: '18px 20px', display: 'grid', gap: 12 }}>
      {/* Top row: icon + trend badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 0,
          background: t.bg, color: t.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name={icon} size="md" />
        </div>
        {trend && (
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 0,
            background: t.bg, color: t.color, whiteSpace: 'nowrap',
            letterSpacing: '0.02em',
          }}>
            {trend}
          </span>
        )}
      </div>

      {/* Number + label */}
      <div>
        <div style={{
          fontSize: 30, fontWeight: 800, lineHeight: 1,
          letterSpacing: '-0.025em', color: 'var(--text)',
        }}>
          {number ?? '—'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 5, fontWeight: 500 }}>
          {label}
        </div>
      </div>
    </div>
  )
}
