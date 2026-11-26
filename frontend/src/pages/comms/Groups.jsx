import { Link } from 'react-router-dom'
import { LuPlus, LuSend, LuUsers, LuLayoutList, LuUserPlus } from 'react-icons/lu'
import { Badge, Button, PageHeader } from '../../components/ui.jsx'
import { useApi } from '../../api.js'
import { Empty, ErrorBox, Loading } from './parts.jsx'

export default function Groups() {
  const { data, error, loading, reload } = useApi('/groups')

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Smart Comms Centre" eyebrowIcon={LuUsers} title="Tour groups" meta="Create a group, add its people, then send them an alert.">
        <Link to="/comms/send"><Button variant="outline" icon={LuSend}>Send alert</Button></Link>
        <Link to="/comms/groups/new"><Button variant="primary" icon={LuPlus}>New group</Button></Link>
      </PageHeader>

      {loading && <Loading />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && data.groups.length === 0 && (
        <div className="card"><Empty>No groups yet. Create your first group to get started.</Empty></div>
      )}

      {data && data.groups.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.groups.map((g) => (
            <article key={g.id} className="card flex flex-col gap-4 p-5">
              <div>
                <h3 className="text-lg font-bold leading-tight">{g.display_name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{g.display_date}</p>
              </div>
              <Badge tone={g.member_count ? 'mint' : 'gray'} className="self-start">
                {g.member_count} {g.member_count === 1 ? 'person' : 'people'}
              </Badge>
              <div className="mt-auto flex flex-wrap gap-2">
                <Link to={`/comms/groups/${g.id}`}><Button size="sm" icon={LuUserPlus}>Members</Button></Link>
                <Link to={`/comms/groups/${g.id}/dashboard`}><Button size="sm" icon={LuLayoutList}>Dashboard</Button></Link>
                <Link to={`/comms/send?group_id=${g.id}`}><Button size="sm" variant="primary" icon={LuSend}>Send alert</Button></Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
