import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LuArrowLeft, LuPlus } from 'react-icons/lu'
import { Button, PageHeader } from '../../components/ui.jsx'
import { api } from '../../api.js'
import { Banner, Field, inputCls } from './parts.jsx'

export default function NewGroup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const { group } = await api('/groups', { method: 'POST', body: { name, date } })
      navigate(`/comms/groups/${group.id}`, { state: { banner: `Group '${group.display_name}' created. Now add its people.` } })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader eyebrow="Smart Comms Centre" title="New group" />
      <form onSubmit={submit} className="card space-y-4 p-6">
        {error && <Banner tone="error">{error}</Banner>}
        <Field label="Group name">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mara Migration Safari" autoFocus />
        </Field>
        <Field label="Tour date">
          <input className={inputCls} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="submit" variant="primary" icon={LuPlus} disabled={saving}>{saving ? 'Creating…' : 'Create group'}</Button>
          <Link to="/comms"><Button icon={LuArrowLeft}>Back</Button></Link>
        </div>
      </form>
    </div>
  )
}
