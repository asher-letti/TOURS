import { Link, useLocation, useParams } from 'react-router-dom'
import { LuCircleAlert, LuCircleCheck, LuSend, LuUserPlus, LuUsers } from 'react-icons/lu'
import { Avatar, Badge, Button, PageHeader, StatCard } from '../../components/ui.jsx'
import { useApi } from '../../api.js'
import { Banner, Empty, ErrorBox, Loading } from './parts.jsx'

function Status({ row }) {
  if (row.state === 'sent') return <Badge tone="emerald">Sent ✓</Badge>
  if (row.state === 'failed') {
    return (
      <div>
        <Badge tone="red">Couldn't send</Badge>
        {row.reason && <p className="mt-1 text-xs text-red-700">{row.reason}</p>}
      </div>
    )
  }
  return <span className="text-sm text-ink-muted">Not sent yet</span>
}

export default function GroupDashboard() {
  const { id } = useParams()
  const location = useLocation()
  const { data, error, loading, reload } = useApi(`/groups/${id}/dashboard`)

  if (loading && !data) return <Loading />
  if (error && !data) return <ErrorBox message={error} onRetry={reload} />

  const { group, summary, rows } = data
  const banner = location.state?.banner

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Smart Comms Centre" title={group.display_name} meta={group.display_date}>
        <Link to="/comms"><Button>All groups</Button></Link>
        <Link to={`/comms/send?group_id=${group.id}`}><Button variant="primary" icon={LuSend}>Send alert</Button></Link>
      </PageHeader>

      {banner && <Banner tone={location.state?.ok === false ? 'error' : 'success'}>{banner}</Banner>}

      {rows.length === 0 ? (
        <div className="card">
          <Empty>
            No members yet.{' '}
            <Link className="font-semibold text-forest underline" to={`/comms/groups/${group.id}`}>Add members</Link> first.
          </Empty>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Total people" value={summary.total} icon={LuUsers} accent="gray" />
            <StatCard label="Sent" value={summary.sent} icon={LuCircleCheck} accent="mint" />
            <StatCard label="Needing attention" value={summary.attention} icon={LuCircleAlert} accent={summary.attention ? 'gold' : 'gray'} />
          </div>

          <section className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-low">
                  <tr className="eyebrow">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Phone</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Last sent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-high">
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-3"><Avatar name={r.display_name} size="sm" />{r.display_name}</span>
                      </td>
                      <td className="px-5 py-3 tabular whitespace-nowrap">{r.display_phone}</td>
                      <td className="px-5 py-3"><Status row={r} /></td>
                      <td className="px-5 py-3 whitespace-nowrap">{r.last_sent || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <details className="border-t border-surface-high">
              <summary className="cursor-pointer px-5 py-3 text-sm font-semibold text-forest">Details</summary>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-low">
                    <tr className="eyebrow">
                      <th className="px-5 py-3 font-semibold">Name</th>
                      <th className="px-5 py-3 font-semibold">Gateway status</th>
                      <th className="px-5 py-3 font-semibold">Message ID</th>
                      <th className="px-5 py-3 font-semibold">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-high">
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <td className="px-5 py-3">{r.display_name}</td>
                        <td className="px-5 py-3">{r.details.gateway_status || '-'}</td>
                        <td className="px-5 py-3 tabular">{r.details.message_id || '-'}</td>
                        <td className="px-5 py-3 tabular">{r.details.cost || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </section>

          <p className="text-xs text-ink-muted">
            Need to change who is in this group?{' '}
            <Link className="inline-flex items-center gap-1 font-semibold text-forest underline" to={`/comms/groups/${group.id}`}>
              <LuUserPlus className="h-3 w-3" /> Manage members
            </Link>
          </p>
        </>
      )}
    </div>
  )
}
