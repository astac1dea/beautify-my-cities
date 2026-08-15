import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { HOUR_STATUS } from '../../lib/constants'
import { formatDate } from '../../lib/format'

const th = {
  textAlign: 'left', padding: '10px 14px', fontSize: 10, fontWeight: 800,
  letterSpacing: 0.7, textTransform: 'uppercase', color: 'var(--muted)',
  borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
}
const td = {
  padding: '12px 14px', fontSize: 13, borderBottom: '1px solid var(--border)',
  verticalAlign: 'top',
}

// Builds a mailto the volunteer can send to the organization to ask them to
// confirm the hours - this is what the Congressional Award needs signed off.
function verifyMailto(org, rows, volunteerName) {
  const theirs = rows.filter(r => r.org.id === org.id)
  const total = theirs.reduce((n, r) => n + r.hours, 0)
  const lines = theirs.map(r => `  ${formatDate(r.date)} - ${r.event?.title || 'Volunteer event'} - ${r.hours} hours`)
  const body = [
    `Hello ${org.contact_name},`,
    '',
    `My name is ${volunteerName} and I volunteered with ${org.name} through Beautify My City.`,
    'I am recording service hours for the Congressional Award and need them verified by a',
    'supervising adult from the organization.',
    '',
    'Here is what I have logged with you:',
    ...lines,
    '',
    `  Total: ${total} hours`,
    '',
    'Could you confirm that these are accurate and that I was present? Thank you very much.',
    '',
    volunteerName,
  ].join('\n')

  return `mailto:${org.email}?subject=${encodeURIComponent(
    `Service hour verification request - ${volunteerName}`
  )}&body=${encodeURIComponent(body)}`
}

function downloadCsv(rows, volunteerName) {
  const header = ['Date', 'Event', 'Organization', 'Hours', 'Status', 'Verifying contact', 'Verification email']
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`
  const body = rows.map(r => [
    r.date,
    r.event?.title || '',
    r.org.name,
    r.hours,
    r.status === 'verified' ? 'Verified' : 'Awaiting verification',
    r.org.contact_name,
    r.org.email,
  ].map(esc).join(','))

  const csv = [header.map(esc).join(','), ...body].join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${volunteerName.replace(/\s+/g, '-').toLowerCase()}-service-hours.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function HoursTable({ rows, totals, volunteerName }) {
  // One entry per organization, for the "ask them to verify" buttons.
  const orgs = [...new Map(rows.map(r => [r.org.id, r.org])).values()]

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 12, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>Volunteer hour log</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
            {totals.verified} verified · {totals.pending} awaiting verification · {totals.total} total
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => downloadCsv(rows, volunteerName)}>
          ⬇ Download as CSV
        </Button>
      </div>

      {rows.length === 0 ? (
        <div style={{ padding: '28px 20px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          No hours yet. Once you attend an event you signed up for, it shows up here and the
          organization can confirm you were there.
        </div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={th}>Date</th>
                  <th style={th}>Event</th>
                  <th style={th}>Organization</th>
                  <th style={{ ...th, textAlign: 'right' }}>Hours</th>
                  <th style={th}>Status</th>
                  <th style={th}>Who can verify</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => {
                  const meta = HOUR_STATUS[row.status]
                  return (
                    <tr key={row.id}>
                      <td style={{ ...td, whiteSpace: 'nowrap', color: 'var(--muted)' }}>
                        {formatDate(row.date)}
                      </td>
                      <td style={{ ...td, fontWeight: 600 }}>{row.event?.title || '—'}</td>
                      <td style={td}>{row.org.name}</td>
                      <td style={{ ...td, textAlign: 'right', fontWeight: 800, whiteSpace: 'nowrap' }}>
                        {row.hours}
                      </td>
                      <td style={td}>
                        <Badge color={meta.color} bg={meta.bg} size="sm">{meta.label}</Badge>
                      </td>
                      <td style={td}>
                        <div style={{ fontSize: 12 }}>{row.org.contact_name}</div>
                        <a href={`mailto:${row.org.email}`} style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600 }}>
                          {row.org.email}
                        </a>
                      </td>
                    </tr>
                  )
                })}
                <tr>
                  <td style={{ ...td, fontWeight: 800, borderBottom: 'none' }} colSpan={3}>
                    Total verified hours
                  </td>
                  <td style={{
                    ...td, textAlign: 'right', borderBottom: 'none',
                    fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 900,
                  }}>
                    {totals.verified}
                  </td>
                  <td style={{ ...td, borderBottom: 'none' }} colSpan={2}>
                    {totals.pending > 0 && (
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                        +{totals.pending} more once verified
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
              Ask an organization to verify your hours
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
              The Congressional Award needs a supervising adult to confirm you were there. These
              buttons open an email with your logged hours already filled in.
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {orgs.map(org => (
                <a key={org.id} href={verifyMailto(org, rows, volunteerName)} style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="sm">✉️ {org.name}</Button>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
