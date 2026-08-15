import Badge from '../ui/Badge'
import { PIN_TYPES, SPOT_STATUS } from '../../lib/constants'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

// Spots ranked by how much support they have. Ties break on the number of
// volunteers who signed up for the spot's event.
export default function Leaderboard({ spots, currentUserId, onOpen }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 15, fontWeight: 800 }}>Most wanted spots in Milpitas</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
          Ranked by upvotes, then by how many volunteers signed up
        </div>
      </div>

      {spots.map(spot => {
        const type = PIN_TYPES[spot.type] || PIN_TYPES.trash
        const status = SPOT_STATUS[spot.status] || SPOT_STATUS.reported
        const isMine = spot.user_id === currentUserId
        const top = spot.rank <= 3

        return (
          <button
            key={spot.id}
            onClick={() => onOpen?.(spot.id)}
            style={{
              display: 'flex', gap: 14, alignItems: 'center', width: '100%', textAlign: 'left',
              padding: '14px 20px', cursor: 'pointer', fontFamily: 'inherit',
              background: isMine ? 'var(--blue-light)' : 'none',
              border: 'none', borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{
              width: 34, flexShrink: 0, textAlign: 'center',
              fontFamily: 'Fraunces, serif', fontWeight: 900,
              fontSize: top ? 20 : 15,
              color: top ? '#B45309' : 'var(--muted)',
            }}>
              {MEDALS[spot.rank] || spot.rank}
            </div>

            <div style={{
              width: 38, height: 38, borderRadius: 9, flexShrink: 0, background: type.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
            }}>
              {type.emoji}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {spot.title}
                {isMine && <Badge color="#1B4FD8" bg="#DBEAFE" size="sm">Your pin</Badge>}
                {spot.rank === 1 && <Badge color="#B45309" bg="#FEF3C7" size="sm">Most popular</Badge>}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <Badge color={type.color} bg={type.bg} size="sm">{type.label}</Badge>
                <Badge color={status.color} bg={status.bg} size="sm">{status.label}</Badge>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                  by {spot.reporter?.display_name || 'a resident'}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 21, fontWeight: 900, lineHeight: 1 }}>
                {spot.upvotes}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
                upvotes
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                {spot.volunteerCount} volunteers
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
