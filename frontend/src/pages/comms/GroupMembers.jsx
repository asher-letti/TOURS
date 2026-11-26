import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { LuLayoutList, LuSend, LuUserPlus } from 'react-icons/lu'
import { Avatar, Button, PageHeader } from '../../components/ui.jsx'
import { api, useApi } from '../../api.js'
import { Banner, Empty, ErrorBox, Field, Loading, inputCls } from './parts.jsx'

export default function GroupMembers() {
  const { id } = useParams()
  const location = useLocation()
  const { data, error, loading, reload } = useApi(`/groups/${id}`)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [formError, setFormError] = useState(null)
  const [added, setAdded] = useState(null)
  const [saving, setSaving] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    setAdded(null)
    try {
      const { member } = await api(`/groups/${id}/members`, { method: 'POST', body: { name, phone } })
      setName('')
      setPhone('')
      setAdded(`Added ${member.display_name}.`)
      reload()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading && !data) return <Loading />
  if (error && !data) return <ErrorBox message={error} onRetry={reload} />

  const { group, members } = data
  const banner = added || location.state?.banner

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Smart Comms Centre" title={group.display_name} meta={group.display_date}>
        <Link to="/comms"><Button>All groups</Button></Link>
        <Link to={`/comms/groups/${group.id}/dashboard`}><Button icon={LuLayoutList}>Dashboard</Button></Link>
        <Link to={`/comms/send?group_id=${group.id}`}><Button variant="primary" icon={LuSend}>Send alert</Button></Link>
      </PageHeader>

      {banner && <Banner>{banner}</Banner>}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="card">
          <h2 className="border-b border-surface-high px-5 py-4 text-base font-bold">
            People in this group <span className="font-medium text-ink-muted">({members.length})</span>
          </h2>
          {members.length === 0 ? (
            <Empty>No one yet. Add the first person using the form.</Empty>
          ) : (
            <ul className="divide-y divide-surface-high">
              {members.map((m) => (
                <li key={m.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar name={m.display_name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{m.display_name}</p>
                    <p className="text-xs text-ink-muted tabular">{m.display_phone}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <form onSubmit={submit} className="card h-fit space-y-4 p-5">
          <h2 className="text-base font-bold">Add a person</h2>
          {formError && <Banner tone="error">{formError}</Banner>}
          <Field label="Name">
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ann Otieno" />
          </Field>
          <Field label="Phone number">
            <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254711111111" inputMode="tel" />
          </Field>
          <Button type="submit" variant="primary" icon={LuUserPlus} className="w-full" disabled={saving}>
            {saving ? 'Adding…' : 'Add person'}
          </Button>
        </form>
      </div>
    </div>
  )
}
