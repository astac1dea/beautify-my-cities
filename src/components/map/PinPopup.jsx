import { useMemo, useState } from 'react'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import EventDetails from '../events/EventDetails'
import { PIN_TYPES, SPOT_STATUS, STATUS_ORDER } from '../../lib/constants'
import { formatDate } from '../../lib/format'
import { useSpot } from '../../hooks/useSpots'
import { useVote } from '../../hooks/useVote'
import { useAppState } from '../../hooks/useStore'
import { spotRanking } from '../../lib/store'
import { useCity } from '../../hooks/useCity'

function StatusTimeline({ status }) {
  const current = SPOT_STATUS[status]?.step ?? 0

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 11 }}>
        {STATUS_ORDER.map((key, i) => {
          const done = i <= current
          const last = i === STATUS_ORDER.length - 1
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', flex: last ? '0 0 auto' : 1 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: done ? 'var(--navy)' : 'var(--surface)',
                border: `1.5px solid ${done ? 'var(--navy)' : 'var(--border-firm)'}`,
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done && <Icon name="check" size={12} stroke={2.6} />}
              </div>
              {!last && (
                <div style={{
                  height: 2, flex: 1,
                  background: i < current ? 'var(--navy)' : 'var(--border)',
                }} />
              )}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        {STATUS_ORDER.map((key, i) => (
          <div key={key} style={{
            fontSize: 11.5, fontWeight: 600, flex: 1,
            textAlign: i === 0 ? 'left' : i === STATUS_ORDER.length - 1 ? 'right' : 'center',
            color: i <= current ? 'var(--text)' : 'var(--muted-light)',
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
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <div style={{
        padding: '11px 17px', background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)',
        fontSize: 11.5, fontWeight: 700, letterSpacing: 0.05, textTransform: 'uppercase',
        color: 'var(--muted)',
      }}>
        Who handles this
      </div>
      <div style={{ padding: 17, display: 'grid', gap: 13 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 'var(--radius)', flexShrink: 0,
            background: 'var(--navy-soft)', color: 'var(--navy)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="building" size="md" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{org.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{org.focus}</div>
          </div>
        </div>

        <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>{org.blurb}</div>

        <div style={{ display: 'grid', gap: 7, fontSize: 13.5, paddingTop: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Icon name="user" size="sm" style={{ color: 'var(--muted-light)' }} />
            <span>{org.contact_name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Icon name="mail" size="sm" style={{ color: 'var(--muted-light)' }} />
            <a href={`mailto:${org.email}`} style={{ fontWeight: 600 }}>{org.email}</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Icon name="phone" size="sm" style={{ color: 'var(--muted-light)' }} />
            <span>{org.phone}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function VoteSection({ spot, rank, vote, voterName, setVoterName }) {
  const [nameInput, setNameInput] = useState(voterName || '')
  const [showNameField, setShowNameField] = useState(false)
  const [nameError, setNameError] = useState('')
  const [justVoted, setJustVoted] = useState(false)

  function handleVoteClick() {
    if (spot.hasVoted) {
      vote(spot.id, voterName)
      return
    }
    if (voterName) {
      vote(spot.id, voterName)
      setJustVoted(true)
      return
    }
    setShowNameField(true)
  }

  function handleSubmitName() {
    const n = nameInput.trim()
    if (!n) return setNameError('Please enter your name to upvote.')
    setNameError('')
    setVoterName(n)
    vote(spot.id, n)
    setShowNameField(false)
    setJustVoted(true)
  }

  return (
    <div style={{
      padding: '16px 20px', background: 'var(--surface-alt)',
      border: '1px solid var(--border)', borderRadius: 'var(--radius)',
      display: 'grid', gap: 14,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>
            {spot.upvotes}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
            upvotes{rank ? ` · ranked #${rank} in the city` : ''}
          </div>
        </div>
        <Button
          variant={spot.hasVoted || justVoted ? 'secondary' : 'primary'}
          icon={spot.hasVoted || justVoted ? 'check' : 'thumbsUp'}
          onClick={handleVoteClick}
        >
          {spot.hasVoted || justVoted ? 'Upvoted' : 'Upvote this spot'}
        </Button>
      </div>

      {showNameField && (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
            Just your name — no account needed. Helps keep votes meaningful.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              autoFocus
              value={nameInput}
              onChange={e => { setNameInput(e.target.value); setNameError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSubmitName()}
              placeholder="Your name"
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 'var(--radius)',
                border: `1px solid ${nameError ? 'var(--red)' : 'var(--border-firm)'}`,
                background: 'var(--surface)', fontSize: 14, color: 'var(--text)',
              }}
            />
            <Button onClick={handleSubmitName}>Submit</Button>
          </div>
          {nameError && (
            <div style={{ fontSize: 12.5, color: 'var(--red)' }}>{nameError}</div>
          )}
        </div>
      )}

      {voterName && !showNameField && spot.hasVoted && (
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          Voting as <strong>{voterName}</strong> ·{' '}
          <button
            onClick={() => { setShowNameField(true); setNameInput('') }}
            style={{ background: 'none', border: 'none', color: 'var(--link)', cursor: 'pointer', fontSize: 12, padding: 0 }}
          >
            change
          </button>
        </div>
      )}
    </div>
  )
}

export default function PinPopup({ spotId, onClose }) {
  const spot = useSpot(spotId)
  const state = useAppState()
  const { city } = useCity()
  const { vote, voterName, setVoterName } = useVote()

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
      width={640}
      title={spot.title}
      subtitle={`Reported by ${spot.reporter?.display_name || 'a resident'} on ${formatDate(spot.created_at)}`}
    >
      <div style={{ display: 'grid', gap: 24 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Badge color={type.color} bg={type.bg} icon={type.icon}>{type.label}</Badge>
          <Badge color={status.color} bg={status.bg}>{status.label}</Badge>
          {rank && rank <= 3 && (
            <Badge color="var(--amber)" bg="var(--amber-soft)" icon="award">
              {rank === 1 ? `Most upvoted in ${city.name}` : `#${rank} most upvoted`}
            </Badge>
          )}
        </div>

        {spot.address && (
          <div style={{
            display: 'flex', gap: 11, alignItems: 'flex-start',
            padding: '13px 16px', background: 'var(--surface-alt)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          }}>
            <Icon name="pin" size="sm" style={{ marginTop: 2, color: 'var(--muted-light)' }} />
            <div>
              <div style={{
                fontSize: 11.5, fontWeight: 700, letterSpacing: 0.05,
                textTransform: 'uppercase', color: 'var(--muted)',
              }}>
                Where to find it
              </div>
              <div style={{ fontSize: 14, marginTop: 2, lineHeight: 1.5 }}>{spot.address}</div>
            </div>
          </div>
        )}

        <div style={{ fontSize: 15, lineHeight: 1.65 }}>{spot.description}</div>

        {/* Upvote */}
        <VoteSection spot={spot} rank={rank} vote={vote} voterName={voterName} setVoterName={setVoterName} />

        {/* Where the request stands */}
        <div style={{ display: 'grid', gap: 13 }}>
          <h4 style={{ fontSize: 14.5, fontWeight: 700 }}>Request status</h4>
          <StatusTimeline status={spot.status} />
          <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>{status.blurb}</div>
        </div>

        <OrgCard org={spot.org} />

        {/* The volunteer event for this spot, if one exists yet */}
        <div style={{ display: 'grid', gap: 15 }}>
          <h4 style={{ fontSize: 14.5, fontWeight: 700 }}>Volunteer event for this spot</h4>
          {spot.event ? (
            <>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{spot.event.title}</div>
              <EventDetails event={spot.event} />
            </>
          ) : (
            <div style={{
              padding: '20px 22px', border: '1px dashed var(--border-firm)',
              borderRadius: 'var(--radius)', fontSize: 13.5, color: 'var(--muted)',
              lineHeight: 1.65, background: 'var(--surface-alt)',
            }}>
              No event scheduled here yet. {spot.org.name} reviews new reports as they come in,
              and schedules a work day once enough residents upvote a spot. Upvoting helps push
              it up the list.
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
