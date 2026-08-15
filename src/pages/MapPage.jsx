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

export default function MapPage() {
  const { spots } = useSpots()
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
        title="Milpitas Map"
        onAddPin={() => { setPlacing(p => !p); setDraft(null) }}
        addPinLabel={placing ? 'Cancel' : '+ Pin a Spot'}
      />

      <div style={{ padding: 32 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16, marginBottom: 28,
        }}>
          <StatCard icon="🗑️" iconBg="#FFF0E6" number={stats.open} label="Open Spots"
            trend="Needs work" trendColor={{ bg: '#FFF0E6', text: '#EA580C' }} />
          <StatCard icon="✅" iconBg="#DCFCE7" number={stats.resolved} label="Resolved"
            trend="Done" trendColor={{ bg: '#DCFCE7', text: '#16A34A' }} />
          <StatCard icon="👥" iconBg="#E8EFFE" number={stats.volunteers} label="Volunteers"
            trend="Signed up" trendColor={{ bg: '#E8EFFE', text: '#1B4FD8' }} />
          <StatCard icon="📅" iconBg="#F3EFFE" number={stats.upcoming} label="Events Scheduled"
            trend={stats.nextEvent ? `Next: ${formatDate(stats.nextEvent.event_date)}` : 'None yet'}
            trendColor={{ bg: '#F3EFFE', text: '#7C3AED' }} />
        </div>

        <div className="split" style={{ marginBottom: 28 }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, overflow: 'hidden',
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
