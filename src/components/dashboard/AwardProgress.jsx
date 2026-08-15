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
    <div style={{
      background: 'var(--sidebar)', color: 'white', borderRadius: 14, padding: '22px 24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
        <div>
          <div style={{
            display: 'inline-block', padding: '4px 11px', borderRadius: 50,
            background: 'rgba(255,255,255,0.1)', fontSize: 10, fontWeight: 800, marginBottom: 10,
          }}>
            🏅 Congressional Award
          </div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 900, lineHeight: 1.2 }}>
            {current ? `${current.label} earned` : 'Working toward Bronze'}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 34, fontWeight: 900, lineHeight: 1 }}>
            {verified}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>
            verified hours
          </div>
        </div>
      </div>

      {/* Progress toward the next level */}
      <div style={{
        height: 9, borderRadius: 50, background: 'rgba(255,255,255,0.1)',
        overflow: 'hidden', display: 'flex', marginBottom: 10,
      }}>
        <div style={{ width: `${pct}%`, background: 'var(--green)' }} />
        <div style={{ width: `${pendingPct}%`, background: 'rgba(234,88,12,0.75)' }} />
      </div>

      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 20 }}>
        {remaining > 0
          ? <>{remaining} more verified {remaining === 1 ? 'hour' : 'hours'} to reach the <strong style={{ color: 'white' }}>{next.label}</strong>.</>
          : <>You have cleared every service level on this list.</>}
        {pending > 0 && <> You have {pending} {pending === 1 ? 'hour' : 'hours'} waiting on an organization to confirm.</>}
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        {AWARD_TIERS.map(tier => {
          const done = tier.hours <= verified
          const isNext = tier.id === next.id && !done
          return (
            <div key={tier.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '9px 13px', borderRadius: 8, fontSize: 12,
              background: isNext ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
              border: isNext ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
            }}>
              <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: done ? '#4ADE80' : 'rgba(255,255,255,0.3)' }}>
                  {done ? '✓' : '○'}
                </span>
                {tier.label}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>{tier.hours} hrs</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
