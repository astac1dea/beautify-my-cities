import { useCallback, useEffect, useState } from 'react'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { supabase } from '../../lib/supabase'
import { setSpotPhotoStatus } from '../../lib/supabase-store'
import { useAuth } from '../../hooks/useAuth'
import { PIN_TYPES } from '../../lib/constants'
import { formatDate } from '../../lib/format'

// Every resident photo waiting on a decision, so an admin does not have to
// find them by clicking pins on the map one at a time.
export default function PhotoReviewQueue() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [busyId, setBusyId] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('spots')
      .select('id, title, type, address, photo_url, created_at, city_id')
      .eq('photo_status', 'pending')
      .not('photo_url', 'is', null)
      .order('created_at', { ascending: true })
    if (!error) setRows(data || [])
    setLoaded(true)
  }, [])

  useEffect(() => { load() }, [load])

  async function review(spotId, status) {
    setBusyId(spotId)
    try {
      await setSpotPhotoStatus(spotId, status, user?.id)
      setRows(rs => rs.filter(r => r.id !== spotId))
    } catch (err) {
      console.error('Could not save the photo decision:', err)
    } finally {
      setBusyId(null)
    }
  }

  // Nothing to moderate is not worth a card.
  if (!loaded || rows.length === 0) return null

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--border)',
        background: '#FFF8E1',
      }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#7B5800' }}>
          {rows.length} {rows.length === 1 ? 'photo' : 'photos'} waiting for review
        </div>
        <div style={{ fontSize: 12.5, color: '#7B5800', marginTop: 3, lineHeight: 1.5 }}>
          Residents attached these to their reports. Nobody else can see one until you approve it.
        </div>
      </div>

      <div style={{ display: 'grid', gap: 1, background: 'var(--border)' }}>
        {rows.map(row => {
          const type = PIN_TYPES[row.type] || PIN_TYPES.trash
          return (
            <div key={row.id} style={{
              background: 'var(--surface)', padding: 16,
              display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap',
            }}>
              <img
                src={row.photo_url}
                alt={row.title}
                style={{
                  width: 148, height: 104, objectFit: 'cover', flexShrink: 0,
                  background: 'var(--surface-alt)', border: '1px solid var(--border)',
                }}
              />

              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{row.title}</div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  fontSize: 12.5, color: 'var(--muted)', marginTop: 5,
                }}>
                  <Icon name={type.icon} size={13} />
                  {type.label}
                  {row.created_at && <span>· reported {formatDate(row.created_at)}</span>}
                </div>
                {row.address && (
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>
                    {row.address}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Button
                  size="sm"
                  disabled={busyId === row.id}
                  onClick={() => review(row.id, 'approved')}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={busyId === row.id}
                  onClick={() => review(row.id, 'rejected')}
                >
                  Reject
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
