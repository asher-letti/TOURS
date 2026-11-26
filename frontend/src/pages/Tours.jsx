import { useMemo, useState } from 'react'
import {
  LuBadgeCheck, LuCirclePlus, LuCalendarDays, LuSearch, LuSlidersHorizontal, LuDownload,
  LuMapPin, LuUsers, LuEye, LuMessageSquare, LuPencil, LuEllipsisVertical, LuNavigation,
  LuSatellite, LuPlane, LuReceipt, LuStar, LuFileText, LuArchive, LuBanknote, LuCarFront,
  LuRadioTower, LuRefreshCw, LuSearchX,
} from 'react-icons/lu'
import { Avatar, Badge, Button, IconButton, PageHeader, Progress, Select } from '../components/ui.jsx'
import { tours } from '../data/index.js'

const statusTone = { Ongoing: 'mint', Upcoming: 'gold', Completed: 'gray', Cancelled: 'red' }
const detailIcons = {
  'Sector Status': LuNavigation, Telemetry: LuSatellite, 'Flight Stage': LuPlane, 'Charter Manifest': LuReceipt,
  'Current Waypoint': LuMapPin, 'Financial Closure': LuReceipt, 'Client Rating': LuStar, 'UWA Permits': LuBadgeCheck,
  'Overnight Base': LuMapPin, 'Current Lodge': LuMapPin, Reason: LuFileText, 'Credit Note': LuReceipt,
}
const circuits = ['All Circuits (Mara, Serengeti, Amboseli, Tsavo, Bwindi)', 'Mara', 'Serengeti', 'Amboseli', 'Tsavo', 'Bwindi']

function TourCard({ t }) {
  const done = t.status === 'Completed'
  return (
    <article className="card flex flex-col p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Badge tone={statusTone[t.status]} dot>{t.status === 'Completed' ? 'Completed & Closed' : `${t.status} · ${t.statusNote}`}</Badge>
          <p><span className="rounded bg-surface-mid px-2 py-0.5 text-[11px] font-semibold tracking-wide tabular">{t.id}</span></p>
        </div>
        <IconButton icon={LuEllipsisVertical} label="More actions" className="border-transparent" />
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug">{t.title}</h3>
      <div className="mt-2 flex items-start justify-between gap-3 text-sm">
        <span className="flex items-start gap-1.5 text-gold-deep"><LuMapPin className="mt-0.5 h-4 w-4 shrink-0" />{t.region}</span>
        <span className="shrink-0 text-xs text-ink-muted">{t.dates}</span>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-surface-low p-3">
        <Avatar name={t.party.name.replace(/^(The|Dr\.) /, '')} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight">{t.party.name}</p>
          <p className="text-xs text-ink-muted">{t.party.origin}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold">
          <LuUsers className="h-4 w-4 text-ink-muted" /> {t.party.pax} Pax
        </div>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        {t.details.map(([k, v, live, tone]) => {
          const Icon = detailIcons[k] ?? LuFileText
          return (
            <div key={k} className="flex items-start gap-2">
              <dt className="flex w-36 shrink-0 items-center gap-1.5 text-ink-muted"><Icon className="h-4 w-4" />{k}:</dt>
              <dd className={`flex items-center gap-1.5 font-medium ${tone === 'gold' ? 'text-gold-deep' : ''}`}>
                {live && <span className="h-2 w-2 shrink-0 rounded-full bg-emerald" />}
                {v}
              </dd>
            </div>
          )
        })}
      </dl>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-surface-low p-3">
        <Avatar name={t.guide.name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{t.guide.name}</p>
          <p className="text-[11px] text-ink-muted">{t.guide.tier}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold tabular">{t.vehicle.plate}</p>
          <p className="text-[11px] text-ink-muted">{t.vehicle.type}</p>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <div className="mb-2 flex justify-between text-xs">
          <span className="font-medium text-ink-muted">{t.progressLabel}</span>
          <span className={`font-semibold tabular ${t.tone === 'gold' ? 'text-gold-deep' : ''}`}>{t.progressText ?? `${t.progress}%`}</span>
        </div>
        <Progress value={t.progress} tone={t.tone ?? 'forest'} />
        <div className="mt-4 flex gap-2">
          {done ? (
            <>
              <Button variant="soft" icon={LuFileText} className="flex-1">View Summary &amp; NPS</Button>
              <IconButton icon={LuArchive} label="Archive" />
            </>
          ) : (
            <>
              <Button variant="soft" icon={LuEye} className="flex-1">View Details</Button>
              <IconButton icon={LuMessageSquare} label="Message party" />
              <IconButton icon={LuPencil} label="Edit tour" />
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Tours() {
  const [status, setStatus] = useState('All')
  const [circuit, setCircuit] = useState(circuits[0])
  const [q, setQ] = useState('')

  const counts = useMemo(() => {
    const c = { All: tours.length }
    tours.forEach((t) => (c[t.status] = (c[t.status] ?? 0) + 1))
    return c
  }, [])

  const filtered = tours.filter((t) => {
    if (status !== 'All' && t.status !== status) return false
    if (circuit !== circuits[0] && t.circuit !== circuit) return false
    if (q) {
      const hay = [t.id, t.title, t.party.name, t.guide.name, t.vehicle.plate, t.region].join(' ').toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    return true
  })

  const tabs = ['All', 'Ongoing', 'Upcoming', 'Completed', 'Cancelled']

  return (
    <div className="space-y-6 pb-28">
      <PageHeader eyebrow="Operational Manifest & Circuit Dispatch" eyebrowIcon={LuBadgeCheck} title="Tour Expeditions & Bookings">
        <span className="rounded-lg bg-surface-mid px-3 py-2 text-xs font-medium text-ink-muted">Q3 Active Season</span>
        <div className="card flex divide-x divide-surface-high text-xs">
          <div className="px-4 py-2"><p className="eyebrow !text-[10px]">Park Circuits</p><p className="font-semibold">5 Active Regimes</p></div>
          <div className="px-4 py-2"><p className="eyebrow !text-[10px]">Field Radio Mesh</p><p className="flex items-center gap-1.5 font-semibold"><span className="h-1.5 w-1.5 rounded-full bg-emerald" />100% Lock</p></div>
        </div>
        <Button variant="primary" size="lg" icon={LuCirclePlus}>Build New Tour</Button>
      </PageHeader>

      <div className="card space-y-3 p-4">
        <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center">
          <div className="flex overflow-x-auto no-scrollbar rounded-lg border border-surface-high bg-surface-low p-1">
            {tabs.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  status === s ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {s === 'All' ? 'All Expeditions' : s}
                <span className={`rounded px-1.5 text-[11px] font-semibold ${s === 'Upcoming' || s === 'Ongoing' ? 'bg-sand text-gold-deep' : 'bg-surface-high'}`}>{counts[s] ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row 2xl:ml-auto">
            <span className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-surface-high bg-surface-low px-3 py-2.5 text-sm"><LuCalendarDays className="h-4 w-4 text-ink-muted" /> Aug 14 – Aug 28, 2024</span>
            <Select value={circuit} onChange={setCircuit} options={circuits} className="sm:w-72" />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative flex-1">
            <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by passenger party (e.g. Henderson), Booking VID (SF-2024-884), guide or registration plate"
              className="w-full rounded-lg border border-surface-high bg-surface-low py-2.5 pl-9 pr-3 text-sm outline-none focus:border-forest"
            />
          </label>
          <Button icon={LuSlidersHorizontal}>Attributes</Button>
          <Button icon={LuDownload}>Export Manifest</Button>
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((t) => <TourCard key={t.id} t={t} />)}
        </div>
      ) : (
        <div className="card flex flex-col items-center gap-2 p-12 text-center text-ink-muted">
          <LuSearchX className="h-8 w-8" />
          <p className="font-semibold text-ink">No expeditions match these filters</p>
          <Button size="sm" onClick={() => { setStatus('All'); setCircuit(circuits[0]); setQ('') }}>Reset filters</Button>
        </div>
      )}

      {/* Operational ticker */}
      <div className="fixed inset-x-4 bottom-4 z-10 lg:left-[calc(18rem+2rem)] lg:right-8">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl bg-forest px-5 py-4 text-white shadow-xl shadow-forest/20">
          {[
            [LuUsers, 'Active Pax in Field', '142', 'Across 22 Expeditions'],
            [LuBanknote, 'Revenue Run-Rate', '$340,000', '/ month'],
            [LuCarFront, 'Fleet Utilization', '88%', '32 of 36 Cruisers Deployed'],
          ].map(([Icon, label, val, note]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 sm:flex"><Icon className="h-5 w-5" /></span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60">{label}</p>
                <p className="font-display text-xl font-bold tabular">{val} <span className="text-[11px] font-medium text-emerald">{note}</span></p>
              </div>
            </div>
          ))}
          <div className="ml-auto hidden gap-2 md:flex">
            <button className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"><LuRadioTower className="h-4 w-4" /> Open Fleet SOS Protocol</button>
            <button className="flex cursor-pointer items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"><LuRefreshCw className="h-4 w-4" /> Sync SAT Nodes</button>
          </div>
        </div>
      </div>
    </div>
  )
}
