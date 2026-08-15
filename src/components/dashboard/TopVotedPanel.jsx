import { Link } from 'react-router-dom'
import { PIN_TYPES } from '../../lib/constants'

export default function TopVotedPanel({ spots = [], onSelect, limit = 5 }) {
  const ranked = [...spots].sort((a, b) => b.upvotes - a.upvotes).slice(0, limit)

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontWeight: 700, fontSize: 13,
      }}>
        Top Voted Spots
        <Link to="/leaderboard" style={{ fontSize: 11, color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>
          See all →
        </Link>
      </div>

      {ranked.map((spot, i) => (
        <button
          key={spot.id}
          onClick={() => onSelect?.(spot.id)}
          style={{
            padding: '12px 16px', display: 'flex', gap: 11, alignItems: 'flex-start',
            borderBottom: '1px solid var(--border)', cursor: 'pointer', width: '100%',
            textAlign: 'left', background: 'none', border: 'none',
            borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--border)',
            fontFamily: 'inherit',
          }}
        >
          <div style={{
            width: 20, flexShrink: 0, fontSize: 11, fontWeight: 800,
            color: i === 0 ? '#B45309' : 'var(--muted)', paddingTop: 9,
          }}>
            #{i + 1}
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: PIN_TYPES[spot.type]?.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>
            {PIN_TYPES[spot.type]?.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 12, fontWeight: 700, marginBottom: 3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {spot.title}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 50,
                background: PIN_TYPES[spot.type]?.bg, color: PIN_TYPES[spot.type]?.color,
              }}>
                {PIN_TYPES[spot.type]?.label}
              </span>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>👍 {spot.upvotes}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
