import { useMemo, useState } from 'react'
import Topbar from '../components/layout/Topbar'
import CommunityMap from '../components/map/CommunityMap'
import FilterPills from '../components/map/FilterPills'
import AddPinModal from '../components/map/AddPinModal'
import PinPopup from '../components/map/PinPopup'
import StatCard from '../components/dashboard/StatCard'
import TopVotedPanel from '../components/dashboard/TopVotedPanel'
import { useSpots } from '../hooks/useSpots'
import { useAppState } from '../hooks/useStore'
import { cityStats } from '../lib/store'
import { formatDate } from '../lib/format'
import { useCity } from '../hooks/useCity'

export default function MapPage() {
  const { spots } = useSpots()
  const { city } = useCity()
  const state = useAppState()
  const stats = useMemo(() => cityStats(state), [state])

  const [filter, setFilter] = useState('all')
  const [placing, setPlacing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [openSpotId, setOpenSpotId] = useState(null)

  const visible = filter === 'all' ? spots : spots.filter(s => s.type === filter)

  function handleMapClick(coords) {
    if (!placing) return
    setDraft(coords)
    setPlacing(false)
  }

  return (
    <div>
      <Topbar
        title={`${city.name} map`}
        onAddPin={() => { setPlacing(p => !p); setDraft(null) }}
        addPinLabel={placing ? 'Cancel' : 'Report a spot'}
      />

      <div style={{ padding: 32 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16, marginBottom: 28,
        }}>
          <StatCard icon="flag" number={stats.open} label="Spots open" trend="Needs work" tone="warn" />
          <StatCard icon="checkCircle" number={stats.resolved} label="Resolved" trend="Done" tone="good" />
          <StatCard icon="users" number={stats.volunteers} label="Volunteers" trend="Signed up" tone="brand" />
          <StatCard icon="calendar" number={stats.upcoming} label="Events scheduled"
            trend={stats.nextEvent ? `Next ${formatDate(stats.nextEvent.event_date)}` : 'None yet'} tone="brand" />
        </div>

        <div className="split" style={{ marginBottom: 28 }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              gap: 12, flexWrap: 'wrap', fontWeight: 700, fontSize: 15,
            }}>
              Community Map
              <FilterPills value={filter} onChange={setFilter} />
            </div>
            <CommunityMap
              spots={visible}
              placing={placing}
              draft={draft}
              onMapClick={handleMapClick}
              onOpenSpot={setOpenSpotId}
            />
            <div style={{
              padding: '12px 20px', borderTop: '1px solid var(--border)',
              fontSize: 12, color: 'var(--muted)',
            }}>
              {placing
                ? 'Click the map to place your pin.'
                : `Showing ${visible.length} of ${spots.length} spots. Click a pin to see who handles it and how to volunteer.`}
            </div>
          </div>

          <TopVotedPanel spots={spots} onSelect={setOpenSpotId} />
        </div>
      </div>

      {draft && (
        <AddPinModal
          coords={draft}
          onClose={() => setDraft(null)}
          onCreated={(spot, openIt) => { if (openIt) setOpenSpotId(spot.id) }}
        />
      )}

      {openSpotId && (
        <PinPopup spotId={openSpotId} onClose={() => setOpenSpotId(null)} />
      )}
    </div>
  )
}
