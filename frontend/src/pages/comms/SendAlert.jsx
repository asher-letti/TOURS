import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { LuSend } from 'react-icons/lu'
import { Button, PageHeader } from '../../components/ui.jsx'
import { api, useApi } from '../../api.js'
import { Banner, ErrorBox, Field, Loading, inputCls } from './parts.jsx'

export default function SendAlert() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { data, error: loadError, loading, reload } = useApi('/groups')

  const [groupId, setGroupId] = useState(params.get('group_id') || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const result = await api('/alerts', { method: 'POST', body: { group_id: groupId, message } })
      navigate(`/comms/groups/${groupId}/dashboard`, { state: { banner: result.message, ok: result.ok } })
    } catch (err) {
      setError(err.message)
      setSending(false)
    }
  }

  if (loading && !data) return <Loading />
  if (loadError && !data) return <ErrorBox message={loadError} onRetry={reload} />

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader eyebrow="Smart Comms Centre" title="Send alert" meta="Your message goes to everyone in the group." />

      <form onSubmit={submit} className="card space-y-4 p-6">
        {error && <Banner tone="error">{error}</Banner>}

        {data.groups.length === 0 ? (
          <p className="text-sm text-ink-muted">
            There are no groups yet. <Link className="font-semibold text-forest underline" to="/comms/groups/new">Create one</Link> first.
          </p>
        ) : (
          <>
            <Field label="Group">
              <select className={inputCls} value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                <option value="">Choose a group…</option>
                {data.groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.display_name} ({g.member_count} {g.member_count === 1 ? 'person' : 'people'})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Message">
              <textarea className={`${inputCls} min-h-32`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message…" />
            </Field>
            <p className="text-right text-xs text-ink-muted tabular">{message.length} characters</p>
            <Button type="submit" variant="primary" size="lg" icon={LuSend} className="w-full" disabled={sending}>
              {sending ? 'Sending…' : 'Send alert'}
            </Button>
          </>
        )}
      </form>
    </div>
  )
}
