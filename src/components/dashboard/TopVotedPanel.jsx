import { PIN_TYPES } from '../../lib/constants'

export default function TopVotedPanel({ spots = [] }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: 13 }}>
        Top Voted Spots
        <a href="#" style={{ fontSize: 11, color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>See all →</a>
      </div>
      {spots.slice(0, 4).map(spot => (
        <div key={spot.id} style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: PIN_TYPES[spot.type]?.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
            {PIN_TYPES[spot.type]?.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{spot.title}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 50, background: PIN_TYPES[spot.type]?.bg, color: PIN_TYPES[spot.type]?.color }}>{PIN_TYPES[spot.type]?.label}</span>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>👍 {spot.upvotes}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}