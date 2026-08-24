import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Topbar from '../components/layout/Topbar'
import Button from '../components/ui/Button'
import StatCard from '../components/dashboard/StatCard'
import HoursTable from '../components/dashboard/HoursTable'
import AwardProgress from '../components/dashboard/AwardProgress'
import SpotBreakdown from '../components/dashboard/SpotBreakdown'
import UpcomingEvents from '../components/dashboard/UpcomingEvents'
import PinPopup from '../components/map/PinPopup'
import EventModal from '../components/events/EventModal'
import { useAuth } from '../hooks/useAuth'
import { useAppState } from '../hooks/useStore'
import { useHours } from '../hooks/useEvents'
import { mySpots, myEvents, spotRanking, residentRanking, todayISO } from '../lib/store'
import { plural } from '../lib/format'
import { useCity } from '../hooks/useCity'

export default function DashboardPage() {
  const { user } = useAuth()
  const { city } = useCity()
  const state = useAppState()
  const { rows, totals } = useHours()
  const [openSpotId, setOpenSpotId] = useState(null)
  const [openEventId, setOpenEventId] = useState(null)

  const { pins, ranking, upcoming, myRank, totalUpvotes, bestRank } = useMemo(() => {
    const pins = mySpots(state)
    const ranking = spotRanking(state)
    const rankIndex = new Map(ranking.map(s => [s.id, s.rank]))
    const today = todayISO()
    return {
      pins,
      ranking: rankIndex,
      upcoming: myEvents(state).filter(e => e.event_date >= today),
      myRank: residentRanking(state).find(r => r.profile.id === user?.id) || null,
      totalUpvotes: pins.reduce((n, s) => n + s.upvotes, 0),
      bestRank: pins.length ? Math.min(...pins.map(s => rankIndex.get(s.id) ?? Infinity)) : null,
    }
  }, [state, user])

  return (
    <div>
      <Topbar
        title="My Dashboard"
        subtitle={`${user.display_name}${user.school ? ` · ${user.school}` : ''}`}
        actions={
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <Button variant="secondary">Edit profile</Button>
          </Link>
        }
      />

      <div className="page-pad" style={{ display: 'grid', gap: 20 }}>
        {/* Headline numbers */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16,
        }}>
          <StatCard icon="clock" number={totals.verified} label="Verified service hours"
            trend={totals.pending > 0 ? `${totals.pending} pending` : 'All verified'}
            tone={totals.pending > 0 ? 'warn' : 'good'} />
          <StatCard icon="pin" number={pins.length} label="Spots I pinned" trend={`${totalUpvotes} upvotes`} tone="brand" />
          <StatCard icon="award" number={bestRank ? `#${bestRank}` : '—'} label="Best pin ranking"
            trend={bestRank === 1 ? 'Most popular' : 'By upvotes'} tone="warn" />
          <StatCard icon="calendar" number={upcoming.length} label="Events coming up" trend={`${rows.length} attended`} />
        </div>

        {/* Award tracking + what's next */}
        <div className="split">
          <AwardProgress verified={totals.verified} pending={totals.pending} />
          <UpcomingEvents events={upcoming} onOpen={setOpenEventId} />
        </div>

        {/* Volunteer hour spreadsheet */}
        <HoursTable rows={rows} totals={totals} volunteerName={user.display_name} />

        {/* My pins */}
        <SpotBreakdown
          spots={pins}
          rankOf={id => ranking.get(id)}
          onOpen={setOpenSpotId}
        />

        {/* Where I sit among residents */}
        {myRank && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '20px 24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: 16, flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>
                You are ranked #{myRank.rank} in {city.name}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                Based on {myRank.upvotes} upvotes across {plural(myRank.pins, 'pin')}, plus {myRank.hours} verified hours.
              </div>
            </div>
            <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
              <Button variant="secondary">See the full ranking</Button>
            </Link>
          </div>
        )}
      </div>

      {openSpotId && <PinPopup spotId={openSpotId} onClose={() => setOpenSpotId(null)} />}
      {openEventId && <EventModal eventId={openEventId} onClose={() => setOpenEventId(null)} />}
    </div>
  )
}
