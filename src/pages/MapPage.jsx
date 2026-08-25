import { useState } from 'react'
import Topbar from '../components/layout/Topbar'
import CommunityMap from '../components/map/CommunityMap'
import FilterPills from '../components/map/FilterPills'
import AddPinModal from '../components/map/AddPinModal'
import PinPopup from '../components/map/PinPopup'
import StatCard from '../components/dashboard/StatCard'
import TopVotedPanel from '../components/dashboard/TopVotedPanel'
import Button from '../components/ui/Button'
import { useSpots } from '../hooks/useSpots'
import { useCityStats } from '../hooks/useCityStats'
import { formatDate } from '../lib/format'
import { useCity } from '../hooks/useCity'
import { useIsMobile } from '../hooks/useMediaQuery'

export default function MapPage() {
  const { spots } = useSpots()
  const { city } = useCity()
  const stats = useCityStats()
  const isMobile = useIsMobile()

  const [filter, setFilter] = useState('all')
  const [placing, setPlacing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [openSpotId, setOpenSpotId] = useState(null)
  const [focusSpotId, setFocusSpotId] = useState(null)

  const visible = filter === 'all' ? spots : spots.filter(s => s.type === filter)

  function handleMapClick(coords) {
    if (!placing) return
    setDraft(coords)
    setPlacing(false)
  }

  return (
    <div>
      <Topbar title={`${city.name} map`} />
      <div className="page-pad">
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 14, marginBottom: 24,
        }}>
          <StatCard icon="flag" number={stats.open} label="Spots open" trend="Needs work" tone="warn" />
          <StatCard icon="checkCircle" number={stats.resolved} label="Resolved" trend="Done" tone="good" />
          <StatCard icon="users" number={stats.volunteers} label="Volunteers" trend="Signed up" tone="brand" />
          <StatCard icon="calendar" number={stats.upcoming} label="Events scheduled"
            trend={stats.nextEvent ? `Next ${formatDate(stats.nextEvent.event_date)}` : 'None yet'} tone="brand" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>Every reported spot</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{city.name} community map</h2>
          </div>
          <FilterPills value={filter} onChange={v => { setFilter(v); setFocusSpotId(null) }} spots={spots} />
        </div>
        <div className="split">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                {placing ? 'Click the map to place your pin.' : `Showing ${visible.length} of ${spots.length} spots${filter !== 'all' ? ` · ${filter}` : ''}.`}
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {filter !== 'all' && (
                  <button onClick={() => setFilter('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--link)', fontWeight: 600, padding: 0 }}>Show all</button>
                )}
                <Button variant={placing ? 'secondary' : 'primary'} icon={placing ? undefined : 'pinPlus'} size="sm" onClick={() => { setPlacing(p => !p); setDraft(null) }}>
                  {placing ? 'Cancel' : 'Report a spot'}
                </Button>
              </div>
            </div>
            <CommunityMap spots={visible} placing={placing} draft={draft} onMapClick={handleMapClick}
              onOpenSpot={id => { setOpenSpotId(id); setFocusSpotId(id) }} focusSpotId={focusSpotId}
              filter={filter} height={isMobile ? 380 : 520} />
          </div>
          <TopVotedPanel spots={spots} limit={8} focusSpotId={focusSpotId} onSelect={id => { setFocusSpotId(id); setOpenSpotId(id) }} />
        </div>
      </div>
      {draft && <AddPinModal coords={draft} onClose={() => setDraft(null)} onCreated={(spot, openIt) => { if (openIt) setOpenSpotId(spot.id) }} />}
      {openSpotId && <PinPopup spotId={openSpotId} onClose={() => setOpenSpotId(null)} />}
    </div>
  )
}
