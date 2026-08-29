import { formatDate } from '../../lib/format'

// Plain summary of the volunteer's service hours: what is verified, what is
// still waiting on an organization, and where the hours came from.
export default function HoursSummary({ rows, verified, pending }) {
  const total = verified + pending
  const pct = total > 0 ? (verified / total) * 100 : 0
  const orgs = new Set(
    rows.map(r => r.org?.id ?? r.org_id ?? r.organizations?.name).filter(Boolean)
  ).size
  const latest = rows[0]

  const stat = (value, label) => (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 5 }}>{label}</div>
    </div>
  )

  return (
    <div style={{ background: 'var(--navy)', color: '#fff', borderRadius: 'var(--radius-lg)', padding: '24px 26px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: 16, marginBottom: 20,
      }}>
        <div>
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,.65)', marginBottom: 12 }}>
            Service hours
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.25 }}>
            {total === 0
              ? 'No hours logged yet'
              : pending > 0 ? `${verified} of ${total} hours verified` : 'Every hour verified'}
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
      </div>

      <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.72)', lineHeight: 1.65, marginBottom: 22 }}>
        {total === 0
          ? <>Sign up for a work day and your hours show up here once you have been.</>
          : pending > 0
            ? <>{pending} {pending === 1 ? 'hour is' : 'hours are'} waiting on an organization to confirm. The table below has a button that emails them for you.</>
            : <>Everything you have logged has been confirmed by the organization that supervised it.</>}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: 18, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.14)',
      }}>
        {stat(total, total === 1 ? 'Hour logged' : 'Hours logged')}
        {stat(rows.length, rows.length === 1 ? 'Session' : 'Sessions')}
        {stat(orgs, orgs === 1 ? 'Organization' : 'Organizations')}
        {stat(latest ? formatDate(latest.date) : '—', 'Last logged')}
      </div>
    </div>
  )
}
