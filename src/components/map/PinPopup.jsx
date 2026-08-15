import { useMemo } from 'react'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import EventDetails from '../events/EventDetails'
import { PIN_TYPES, SPOT_STATUS, STATUS_ORDER } from '../../lib/constants'
import { formatDate } from '../../lib/format'
import { useSpot } from '../../hooks/useSpots'
import { useVote } from '../../hooks/useVote'
import { useAppState } from '../../hooks/useStore'
import { spotRanking } from '../../lib/store'

function StatusTimeline({ status }) {
  const current = SPOT_STATUS[status]?.step ?? 0
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        {STATUS_ORDER.map((key, i) => {
          const done = i <= current
          const meta = SPOT_STATUS[key]
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', flex: i === STATUS_ORDER.length - 1 ? '0 0 auto' : 1 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: done ? meta.color : 'var(--bg)',
                border: `2px solid ${done ? meta.color : 'var(--border)'}`,
                color: 'white', fontSize: 11, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{done ? '✓' : ''}</div>
              {i < STATUS_ORDER.length - 1 && (
                <div style={{
                  height: 2, flex: 1,
                  background: i < current ? SPOT_STATUS[STATUS_ORDER[i + 1]].color : 'var(--border)',
                }} />
              )}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        {STATUS_ORDER.map((key, i) => (
          <div key={key} style={{
            fontSize: 10, fontWeight: 700, flex: 1,
            textAlign: i === 0 ? 'left' : i === STATUS_ORDER.length - 1 ? 'right' : 'center',
            color: i <= current ? 'var(--text)' : 'var(--muted)',
          }}>
            {SPOT_STATUS[key].label}
          </div>
        ))}
      </div>
    </div>
  )
}

function OrgCard({ org }) {
  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px', background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--muted)',
      }}>
        Who handles this
      </div>
      <div style={{ padding: 16, display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: org.color, color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 14,
          }}>{org.name.charAt(0)}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{org.name}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{org.focus}</div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.55 }}>{org.blurb}</div>

        <div style={{ display: 'grid', gap: 4, fontSize: 12, paddingTop: 2 }}>
          <div><span style={{ color: 'var(--muted)' }}>Contact </span><strong>{org.contact_name}</strong></div>
          <div>
            <span style={{ color: 'var(--muted)' }}>Email </span>
            <a href={`mailto:${org.email}`} style={{ color: 'var(--blue)', fontWeight: 600 }}>{org.email}</a>
          </div>
          <div><span style={{ color: 'var(--muted)' }}>Phone </span><strong>{org.phone}</strong></div>
        </div>
      </div>
    </div>
  )
}

export default function PinPopup({ spotId, onClose }) {
  const spot = useSpot(spotId)
  const state = useAppState()
  const { vote, canVote } = useVote()

  const rank = useMemo(() => {
    if (!spot) return null
    return spotRanking(state).find(s => s.id === spot.id)?.rank ?? null
  }, [state, spot])

  if (!spot) return null

  const type = PIN_TYPES[spot.type] || PIN_TYPES.trash
  const status = SPOT_STATUS[spot.status] || SPOT_STATUS.reported

  return (
    <Modal
      open
      onClose={onClose}
      width={620}
      title={`${type.emoji} ${spot.title}`}
      subtitle={`Reported by ${spot.reporter?.display_name || 'a resident'} on ${formatDate(spot.created_at)}`}
    >
      <div style={{ display: 'grid', gap: 22 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color={type.color} bg={type.bg}>{type.emoji} {type.label}</Badge>
          <Badge color={status.color} bg={status.bg}>{status.label}</Badge>
          {rank && rank <= 3 && (
            <Badge color="#B45309" bg="#FEF3C7">
              {rank === 1 ? '🏆 #1 most upvoted in Milpitas' : `⭐ #${rank} most upvoted`}
            </Badge>
          )}
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{spot.description}</div>

        {/* Upvote */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 14, padding: '14px 18px', background: 'var(--bg)',
          border: '1px solid var(--border)', borderRadius: 12, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 900, lineHeight: 1 }}>
              {spot.upvotes}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
              upvotes{rank ? ` · ranked #${rank} in the city` : ''}
            </div>
          </div>
          <Button
            variant={spot.hasVoted ? 'secondary' : 'primary'}
            onClick={() => vote(spot.id)}
            disabled={!canVote}
          >
            {spot.hasVoted ? '✓ Upvoted' : '👍 Upvote this spot'}
          </Button>
        </div>

        {/* Where the request stands */}
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Request status</div>
          <StatusTimeline status={spot.status} />
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.55 }}>{status.blurb}</div>
        </div>

        <OrgCard org={spot.org} />

        {/* The volunteer event for this spot, if one exists yet */}
        <div style={{ display: 'grid', gap: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Volunteer event for this spot</div>
          {spot.event ? (
            <>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 900 }}>
                {spot.event.title}
              </div>
              <EventDetails event={spot.event} />
            </>
          ) : (
            <div style={{
              padding: '18px 20px', border: '1px dashed var(--border)', borderRadius: 12,
              fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, background: 'var(--bg)',
            }}>
              No event scheduled here yet. {spot.org.name} reviews new reports as they come in, and
              schedules a work day once enough residents upvote a spot. Upvoting helps push it up the list.
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
