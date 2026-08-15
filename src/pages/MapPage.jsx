import { useState } from 'react'
import Topbar from '../components/layout/Topbar'
import CommunityMap from '../components/map/CommunityMap'
import StatCard from '../components/dashboard/StatCard'
import TopVotedPanel from '../components/dashboard/TopVotedPanel'

const testSpots = [
  { id: 1, type: 'trash',    title: 'Park & Abel Intersection', description: 'Overflowing bins',         lat: 37.4350, lng: -121.9020, upvotes: 142 },
  { id: 2, type: 'mural',    title: 'Main St. Blank Wall',      description: 'Perfect wall for a mural', lat: 37.4280, lng: -121.8960, upvotes: 98  },
  { id: 3, type: 'graffiti', title: 'Calaveras Underpass',      description: 'Tagged last week',          lat: 37.4400, lng: -121.8900, upvotes: 77  },
  { id: 4, type: 'seating',  title: 'Civic Center Bus Stop',    description: 'No shade or seating',       lat: 37.4320, lng: -121.9050, upvotes: 61  },
  { id: 5, type: 'bike',     title: 'Calaveras Blvd Route',     description: 'Need a bike lane here',     lat: 37.4260, lng: -121.8850, upvotes: 55  },
]

export default function MapPage() {
  const [selectedSpot, setSelectedSpot] = useState(null)

  return (
    <div>
      <Topbar title="Milpitas Map" />
      <div style={{ padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          <StatCard icon="🗑️" iconBg="#FFF0E6" number={47}  label="Open Spots"       trend="↑ 12 this week" trendColor={{ bg: '#DCFCE7', text: '#16A34A' }} />
          <StatCard icon="✅" iconBg="#DCFCE7" number={89}  label="Resolved"         trend="↑ 8 this month" trendColor={{ bg: '#DCFCE7', text: '#16A34A' }} />
          <StatCard icon="👥" iconBg="#E8EFFE" number={312} label="Volunteers"       trend="↑ 34 new"       trendColor={{ bg: '#DCFCE7', text: '#16A34A' }} />
          <StatCard icon="📅" iconBg="#F3EFFE" number={3}   label="Events Scheduled" trend="Next: Jun 22"   trendColor={{ bg: '#E8EFFE', text: '#1B4FD8' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, marginBottom: 28 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: 15 }}>
              Community Map
              <div style={{ display: 'flex', gap: 6 }}>
                {['All', '🗑️', '🎨', '🪑', '🚲'].map((f, i) => (
                  <button key={i} style={{
                    padding: '5px 12px', borderRadius: 50, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    background: i === 0 ? 'var(--blue)' : 'var(--bg)',
                    color: i === 0 ? 'white' : 'var(--muted)',
                    border: `1px solid ${i === 0 ? 'var(--blue)' : 'var(--border)'}`,
                  }}>{f}</button>
                ))}
              </div>
            </div>
            <CommunityMap spots={testSpots} onPinClick={setSelectedSpot} />
          </div>
          <TopVotedPanel spots={testSpots} />
        </div>
        {selectedSpot && (
          <div style={{ padding: '16px 20px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', fontSize: 14 }}>
            <strong>{selectedSpot.title}</strong> — {selectedSpot.description} · 👍 {selectedSpot.upvotes} votes
          </div>
        )}
      </div>
    </div>
  )
}