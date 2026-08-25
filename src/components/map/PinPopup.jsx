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
import { supabase } from '../../lib/supabase'
import { useSpots } from '../../hooks/useSpots'
import { useCity } from '../../hooks/useCity'
import { useAuth } from '../../hooks/useAuth'

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

function OrgCard({ org, isAdmin }) {
  if (!org) return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '15px 17px' }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Who handles this</div>
      <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>
        We'll route this to the right local organization.{' '}
        <a href="mailto:hello@beautifymycities.org" style={{ fontWeight: 600 }}>hello@beautifymycities.org</a>
      </div>
    </div>
  )
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <div style={{
        padding: '11px 17px', background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)',
        fontSize: 11.5, fontWeight: 700, letterSpacing: 0.05, textTransform: 'uppercase',
        color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>Who handles this</span>
        {isAdmin && (
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#8A5417',
            background: '#F7EEE1', border: '1px solid #E8C99A',
            borderRadius: 4, padding: '2px 7px',
          }}>
            Unverified — reach out to confirm details with org
          </span>
        )}
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
            <div style={{ fontSize: 15, fontWeight: 700 }}>{org?.name || 'Local organization'}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{org?.focus}</div>
          </div>
        </div>

        {org?.blurb && <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>{org.blurb}</div>}

        <div style={{ display: 'grid', gap: 7, fontSize: 13.5, paddingTop: 2 }}>
          {isAdmin ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Icon name="user" size="sm" style={{ color: 'var(--muted-light)' }} />
                <span style={{ color: 'var(--muted)' }}>{org?.contact_name || '—'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Icon name="mail" size="sm" style={{ color: 'var(--muted-light)' }} />
                <a href={`mailto:${org?.email || 'hello@beautifymycities.org'}`} style={{ fontWeight: 600 }}>
                  {org?.email || 'hello@beautifymycities.org'}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Icon name="phone" size="sm" style={{ color: 'var(--muted-light)' }} />
                <span style={{ color: 'var(--muted)' }}>{org?.phone || '—'}</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Icon name="mail" size="sm" style={{ color: 'var(--muted-light)' }} />
                <a href="mailto:hello@beautifymycities.org" style={{ fontWeight: 600 }}>
                  hello@beautifymycities.org
                </a>
              </div>
              <div style={{
                fontSize: 12, color: 'var(--muted)', fontStyle: 'italic',
                background: 'var(--surface-alt)', padding: '8px 10px',
                borderRadius: 'var(--radius)', border: '1px solid var(--border)',
              }}>
                We are working with {org?.name || 'local partners'} to coordinate this request.
                Contact us at hello@beautifymycities.org for updates.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminDelete({ spotId, title, onDeleted }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (confirming) return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'center',
      padding: '8px 10px', background: '#FFEBEE',
      border: '1px solid #FFCDD2', borderRadius: 6, flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 12, color: '#B71C1C', flex: 1 }}>
        Delete <strong>{title}</strong>? This cannot be undone.
      </span>
      <button
        onClick={() => setConfirming(false)}
        style={{ padding: '4px 10px', borderRadius: 5, border: '1px solid #ccc', background: '#fff', fontSize: 12, cursor: 'pointer' }}
      >
        Cancel
      </button>
      <button
        disabled={deleting}
        onClick={async () => {
          setDeleting(true)
          const { error } = await supabase.from('spots').delete().eq('id', spotId)
          if (error) { alert('Delete failed: ' + error.message); setDeleting(false); return }
          onDeleted()
        }}
        style={{ padding: '4px 10px', borderRadius: 5, border: 'none', background: '#B71C1C', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
      >
        {deleting ? 'Deleting...' : 'Yes, delete'}
      </button>
    </div>
  )

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{ padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#B71C1C', color: '#fff', border: 'none', alignSelf: 'flex-start' }}
    >
      Delete spot
    </button>
  )
}

export default function PinPopup({ spotId, onClose }) {
  const [spot, reloadSpot] = useSpot(spotId)
  const { city } = useCity()
  const { vote, voterName, setVoterName } = useVote()
  const { ranking } = useSpots()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [showNameField, setShowNameField] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [nameError, setNameError] = useState('')
  const [voting, setVoting] = useState(false)

  const rank = useMemo(() => {
    if (!spot) return null
    return ranking.find(s => s.id === spot.id)?.rank ?? null
  }, [ranking, spot])

  if (!spot) return null

  const type = PIN_TYPES[spot.type] || PIN_TYPES.trash
  const status = SPOT_STATUS[spot.status] || SPOT_STATUS.reported

  return (
    <Modal
      open
      onClose={onClose}
      width={640}
      title={spot.title}
      subtitle={`Reported by ${spot.reporter?.display_name || 'a resident'}${spot.created_at ? ' on ' + formatDate(spot.created_at) : ''}`}
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
        <div style={{
          padding: '16px 20px', background: 'var(--surface-alt)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          display: 'grid', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>
                {spot.upvotes}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
                upvotes{rank ? ` · ranked #${rank} in the city` : ''}
              </div>
            </div>
            <Button
              variant={spot.hasVoted ? 'secondary' : 'primary'}
              icon={spot.hasVoted ? 'check' : 'thumbsUp'}
              disabled={voting}
              onClick={async () => {
                if (spot.hasVoted || voterName) {
                  setVoting(true)
                  await vote(spot.id, voterName)
                  await reloadSpot()
                  setVoting(false)
                } else {
                  setShowNameField(true)
                }
              }}
            >
              {voting ? 'Saving...' : spot.hasVoted ? 'Upvoted' : 'Upvote this spot'}
            </Button>
          </div>

          {showNameField && !voterName && (
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                Just your name — no account needed.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  autoFocus
                  value={nameInput}
                  onChange={e => { setNameInput(e.target.value); setNameError('') }}
                  onKeyDown={async e => {
                    if (e.key !== 'Enter') return
                    const n = nameInput.trim()
                    if (!n) return setNameError('Please enter your name.')
                    setVoterName(n)
                    setShowNameField(false)
                    setVoting(true)
                    await vote(spot.id, n)
                    await reloadSpot()
                    setVoting(false)
                  }}
                  placeholder="Your name"
                  style={{
                    flex: 1, padding: '8px 12px', borderRadius: 'var(--radius)',
                    border: `1px solid ${nameError ? 'var(--red)' : 'var(--border-firm)'}`,
                    background: 'var(--surface)', fontSize: 14, color: 'var(--text)',
                  }}
                />
                <Button onClick={async () => {
                  const n = nameInput.trim()
                  if (!n) return setNameError('Please enter your name.')
                  setVoterName(n)
                  setShowNameField(false)
                  setVoting(true)
                  await vote(spot.id, n)
                  await reloadSpot()
                  setVoting(false)
                }}>Submit</Button>
              </div>
              {nameError && <div style={{ fontSize: 12.5, color: 'var(--red)' }}>{nameError}</div>}
            </div>
          )}

          {voterName && spot.hasVoted && (
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              Voting as <strong>{voterName}</strong> ·{' '}
              <button
                onClick={() => { setVoterName(''); setShowNameField(true); setNameInput('') }}
                style={{ background: 'none', border: 'none', color: 'var(--link)', cursor: 'pointer', fontSize: 12, padding: 0 }}
              >
                change
              </button>
            </div>
          )}
        </div>

        {/* Where the request stands */}
        <div style={{ display: 'grid', gap: 13 }}>
          <h4 style={{ fontSize: 14.5, fontWeight: 700 }}>Request status</h4>
          <StatusTimeline status={spot.status} />
          <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.6 }}>{status.blurb}</div>
        </div>

        <OrgCard org={spot.org} isAdmin={isAdmin} />

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
              No event scheduled here yet. {spot.org?.name || 'The responsible organization'} reviews new reports as they come in,
              and schedules a work day once enough residents upvote a spot. Upvoting helps push
              it up the list.
            </div>
          )}
        </div>
        {/* Admin actions */}
        {isAdmin && (
          <div style={{
            display: 'grid', gap: 10,
            padding: '14px 16px', background: '#FFF8E1',
            border: '1px solid #F0D080', borderRadius: 'var(--radius)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#7B5800' }}>
              Admin actions
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {['reported','reviewing','scheduled','resolved','rejected'].map(s => (
                <button
                  key={s}
                  onClick={async () => {
                    await supabase.from('spots').update({ status: s }).eq('id', spot.id)
                    await reloadSpot()
                  }}
                  style={{
                    padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    background: spot.status === s ? '#1a3352' : '#fff',
                    color: spot.status === s ? '#fff' : '#1a3352',
                    border: '1px solid #1a3352',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <AdminDelete spotId={spot.id} title={spot.title} onDeleted={onClose} />
          </div>
        )}
      </div>
    </Modal>
  )
}
