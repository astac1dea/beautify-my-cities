export default function StatCard({ icon, iconBg, number, label, trend, trendColor }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
        {trend && <div style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 50, background: trendColor?.bg || '#E8EFFE', color: trendColor?.text || '#1B4FD8' }}>{trend}</div>}
      </div>
      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 900, color: 'var(--text)', lineHeight: 1, marginBottom: 4 }}>{number}</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)' }}>{label}</div>
    </div>
  )
}