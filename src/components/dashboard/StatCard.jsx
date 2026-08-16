import Icon from '../ui/Icon'

export default function StatCard({ icon, number, label, trend, tone = 'neutral' }) {
  const tones = {
    neutral: { color: 'var(--muted)', bg: '#EDF0F3' },
    good:    { color: 'var(--green)', bg: 'var(--green-soft)' },
    warn:    { color: 'var(--amber)', bg: 'var(--amber-soft)' },
    brand:   { color: 'var(--navy)',  bg: 'var(--navy-soft)' },
  }
  const t = tones[tone] || tones.neutral

  return (
    <div className="card" style={{ padding: '20px 22px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: 12, marginBottom: 16,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 'var(--radius)',
          background: 'var(--navy-soft)', color: 'var(--navy)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={icon} size="md" />
        </div>
        {trend && (
          <span style={{
            fontSize: 12, fontWeight: 600, padding: '3px 9px', borderRadius: 4,
            background: t.bg, color: t.color, whiteSpace: 'nowrap',
          }}>
            {trend}
          </span>
        )}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.025em' }}>
        {number}
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 7 }}>{label}</div>
    </div>
  )
}
