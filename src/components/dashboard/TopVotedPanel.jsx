import { Link } from 'react-router-dom'
import { PIN_TYPES } from '../../lib/constants'
import Icon from '../ui/Icon'

export default function TopVotedPanel({ spots = [], onSelect, focusSpotId, limit = 8 }) {
  const ranked = [...spots].sort((a, b) => b.upvotes - a.upvotes).slice(0, limit)

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 0, overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontWeight: 700, fontSize: 13,
      }}>
        Most upvoted right now
        <Link to="/leaderboard" style={{ fontSize: 11, color: 'var(--navy)', textDecoration: 'none', fontWeight: 600 }}>
          See all
        </Link>
      </div>

      {ranked.map((spot, i) => {
        const type = PIN_TYPES[spot.type] || PIN_TYPES.trash
        const focused = spot.id === focusSpotId
        return (
          <button
            key={spot.id}
            onClick={() => onSelect?.(spot.id)}
            style={{
              padding: '11px 14px', display: 'flex', gap: 11, alignItems: 'center',
              width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
              background: focused ? 'var(--navy-soft)' : 'none',
              border: 'none',
              borderBottom: i < ranked.length - 1 ? '1px solid var(--border)' : 'none',
              transition: 'background 0.13s',
            }}
            onMouseEnter={e => { if (!focused) e.currentTarget.style.background = 'var(--surface-alt)' }}
            onMouseLeave={e => { if (!focused) e.currentTarget.style.background = 'none' }}
          >
            {/* Rank */}
            <div style={{
              width: 20, flexShrink: 0, fontSize: 11, fontWeight: 800, textAlign: 'center',
              color: i === 0 ? 'var(--amber)' : focused ? 'var(--navy)' : 'var(--muted-light)',
            }}>
              #{i + 1}
            </div>

            {/* Category icon */}
            <div style={{
              width: 32, height: 32, borderRadius: 0, flexShrink: 0,
              background: type.bg, color: type.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: focused ? `1.5px solid ${type.color}` : '1.5px solid transparent',
              transition: 'border 0.13s',
            }}>
              <Icon name={type.icon} size="sm" />
            </div>

            {/* Title + label */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12.5, fontWeight: 700, marginBottom: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                color: focused ? 'var(--navy)' : 'var(--text)',
              }}>
                {spot.title}
              </div>
              <div style={{ fontSize: 11, color: type.color, fontWeight: 600 }}>
                {type.label}
              </div>
            </div>

            {/* Upvote count */}
            <div style={{
              fontSize: 13, fontWeight: 700, flexShrink: 0,
              color: focused ? 'var(--navy)' : 'var(--text)',
            }}>
              {spot.upvotes}
            </div>
          </button>
        )
      })}
    </div>
  )
}
