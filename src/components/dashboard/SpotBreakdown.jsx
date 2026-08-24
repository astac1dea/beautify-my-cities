import Badge from '../ui/Badge'
import { PIN_TYPES, SPOT_STATUS } from '../../lib/constants'
import { formatDate } from '../../lib/format'

const th = {
  textAlign: 'left', padding: '10px 14px', fontSize: 10, fontWeight: 800,
  letterSpacing: 0.7, textTransform: 'uppercase', color: 'var(--muted)',
  borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
}
const td = { padding: '12px 14px', fontSize: 13, borderBottom: '1px solid var(--border)' }

// The signed-in resident's own pins: how much support each one has, where it
// ranks city-wide, and what the responsible organization has done about it.
export default function SpotBreakdown({ spots, rankOf, onOpen }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 15, fontWeight: 800 }}>My pins</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
          {spots.length} reported · {spots.reduce((n, s) => n + s.upvotes, 0)} upvotes across all of them
        </div>
      </div>

      {spots.length === 0 ? (
        <div style={{ padding: '28px 20px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          You have not pinned anything yet. Open the map and drop a pin on a spot that needs work.
        </div>
      ) : (
        <div className="table-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr>
                <th style={th}>Spot</th>
                <th style={th}>Type</th>
                <th style={th}>Reported</th>
                <th style={{ ...th, textAlign: 'right' }}>Upvotes</th>
                <th style={{ ...th, textAlign: 'right' }}>City rank</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {spots.map(spot => {
                const type = PIN_TYPES[spot.type] || PIN_TYPES.trash
                const status = SPOT_STATUS[spot.status] || SPOT_STATUS.reported
                const rank = rankOf(spot.id)
                return (
                  <tr
                    key={spot.id}
                    onClick={() => onOpen?.(spot.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ ...td, fontWeight: 700 }}>{spot.title}</td>
                    <td style={td}>
                      <Badge color={type.color} bg={type.bg} icon={type.icon} size="sm">{type.label}</Badge>
                    </td>
                    <td style={{ ...td, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {formatDate(spot.created_at)}
                    </td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 800 }}>{spot.upvotes}</td>
                    <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {rank === 1
                        ? <Badge color="var(--amber)" bg="var(--amber-soft)" icon="award" size="sm">#1</Badge>
                        : <span style={{ color: 'var(--muted)', fontWeight: 700 }}>#{rank}</span>}
                    </td>
                    <td style={td}>
                      <Badge color={status.color} bg={status.bg} size="sm">{status.label}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
