import { useMemo, useState } from 'react'
import Topbar from '../components/layout/Topbar'
import Badge from '../components/ui/Badge'
import Leaderboard from '../components/dashboard/Leaderboard'
import PinPopup from '../components/map/PinPopup'
import { useAuth } from '../hooks/useAuth'
import { useSpots } from '../hooks/useSpots'
import { plural } from '../lib/format'
import { useCity } from '../hooks/useCity'

function ResidentTable({ residents, currentUserId }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 0, overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 15, fontWeight: 800 }}>Residents</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
          Ranked by the upvotes their pins have collected
        </div>
      </div>

      {residents.map(row => {
        const isMe = row.profile.id === currentUserId
        return (
          <div key={row.profile.id} style={{
            display: 'flex', gap: 14, alignItems: 'center', padding: '13px 20px',
            borderBottom: '1px solid var(--border)',
            background: isMe ? 'var(--navy-soft)' : 'transparent',
          }}>
            <div style={{
              width: 30, flexShrink: 0, textAlign: 'center',
              fontWeight: 800,
              fontSize: row.rank <= 3 ? 18 : 14,
              color: row.rank <= 3 ? 'var(--amber)' : 'var(--muted)',
            }}>
              {row.rank}
            </div>

            <div style={{
              width: 34, height: 34, borderRadius: 0, flexShrink: 0,
              background: row.profile.avatar_color || 'var(--navy)',
              color: 'white', fontWeight: 800, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {row.profile.display_name.charAt(0)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {row.profile.display_name}
                {isMe && <Badge color="var(--navy-deep)" bg="var(--navy-soft)" size="sm">You</Badge>}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                {plural(row.pins, 'pin')} · {row.hours} verified hours
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>
                {row.upvotes}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>upvotes</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const { spots: allSpots, ranking: spotRankingData } = useSpots()
  const { city } = useCity()
  const [openSpotId, setOpenSpotId] = useState(null)

  const { spots, myBest } = useMemo(() => {
    const spots = spotRankingData || []
    const mine = spots.filter(s => s.user_id === user?.id)
    return {
      spots,
      myBest: mine.length ? mine.reduce((a, b) => (a.rank < b.rank ? a : b)) : null,
    }
  }, [spotRankingData, user])
  const residents = []

  return (
    <div>
      <Topbar
        title="Leaderboard"
        subtitle={`The spots ${city.name} most wants dealt with`}
      />

      <div className="page-pad" style={{ display: 'grid', gap: 20 }}>
        {myBest && (
          <div style={{
            background: 'var(--navy)', color: 'white', borderRadius: 0,
            padding: '20px 24px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                YOUR BEST PIN
              </div>
              <div style={{ fontSize: 21, fontWeight: 800, marginBottom: 5 }}>
                {myBest.title}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                {myBest.rank === 1
                  ? 'Sitting at #1. This is the most upvoted spot in the city right now.'
                  : `Ranked #${myBest.rank} of ${spots.length} spots in ${city.name}.`}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>
                {myBest.upvotes}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                upvotes · {myBest.volunteerCount} volunteers
              </div>
            </div>
          </div>
        )}

        <div className="split">
          <Leaderboard spots={spots} currentUserId={user?.id} cityName={city.name} onOpen={setOpenSpotId} />
          <ResidentTable residents={residents} currentUserId={user?.id} />
        </div>
      </div>

      {openSpotId && <PinPopup spotId={openSpotId} onClose={() => setOpenSpotId(null)} />}
    </div>
  )
}
