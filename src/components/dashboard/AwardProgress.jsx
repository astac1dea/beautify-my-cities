import Icon from '../ui/Icon'
import { AWARD_TIERS } from '../../lib/constants'

// Shows where the volunteer's verified hours land against the Congressional
// Award service levels, and what the next one needs.
export default function AwardProgress({ verified, pending }) {
  const next = AWARD_TIERS.find(t => t.hours > verified) || AWARD_TIERS[AWARD_TIERS.length - 1]
  const earned = AWARD_TIERS.filter(t => t.hours <= verified)
  const current = earned[earned.length - 1] || null
  const remaining = Math.max(0, next.hours - verified)
  const pct = Math.min(100, (verified / next.hours) * 100)
  const pendingPct = Math.min(100 - pct, (pending / next.hours) * 100)

  return (
    <div style={{ background: 'var(--navy)', color: '#fff', borderRadius: 'var(--radius-lg)', padding: '24px 26px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: 16, marginBottom: 20,
      }}>
        <div>
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,.65)', marginBottom: 12 }}>
            Congressional Award
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>
            {current ? `${current.label} earned` : 'Working toward Bronze'}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.025em' }}>
            {verified}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 5 }}>
            verified hours
          </div>
        </div>
      </div>

      <div style={{
        height: 8, borderRadius: 4, background: 'rgba(255,255,255,.15)',
        overflow: 'hidden', display: 'flex', marginBottom: 12,
      }}>
        <div style={{ width: `${pct}%`, background: '#5FBF8C' }} />
        <div style={{ width: `${pendingPct}%`, background: 'rgba(255,255,255,.35)' }} />
      </div>

      <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.72)', lineHeight: 1.65, marginBottom: 22 }}>
        {remaining > 0
          ? <>{remaining} more verified {remaining === 1 ? 'hour' : 'hours'} to reach the <strong style={{ color: '#fff' }}>{next.label}</strong>.</>
          : <>You have cleared every service level on this list.</>}
        {pending > 0 && <> {pending} {pending === 1 ? 'hour is' : 'hours are'} waiting on an organization to confirm.</>}
      </div>

      <div style={{ display: 'grid', gap: 1, background: 'rgba(255,255,255,.12)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        {AWARD_TIERS.map(tier => {
          const done = tier.hours <= verified
          const isNext = tier.id === next.id && !done
          return (
            <div key={tier.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '11px 15px', fontSize: 13.5,
              background: isNext ? 'rgba(255,255,255,.13)' : 'var(--navy)',
            }}>
              <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{
                  width: 16, display: 'flex', alignItems: 'center',
                  color: done ? '#5FBF8C' : 'rgba(255,255,255,.28)',
                }}>
                  {done
                    ? <Icon name="check" size={14} stroke={2.6} />
                    : <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        border: '1.5px solid currentColor',
                      }} />}
                </span>
                {tier.label}
              </span>
              <span style={{ color: 'rgba(255,255,255,.58)', fontWeight: 700 }}>{tier.hours} hrs</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
