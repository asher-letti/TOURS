import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LuUserPlus, LuCarFront, LuRadio, LuCirclePlus, LuCircleCheck, LuPlaneTakeoff, LuArrowRight,
  LuFuel, LuShieldCheck, LuSatelliteDish, LuEye, LuPlane, LuSquareCheck, LuBriefcaseMedical,
  LuSend, LuCalendarDays, LuDownload, LuNavigation, LuUsers, LuChevronRight, LuWrench,
  LuSlidersHorizontal, LuPawPrint, LuBus,
} from 'react-icons/lu'
import { Avatar, Badge, Button, LiveDot } from '../components/ui.jsx'
import { circuitTable, liveStream } from '../data/index.js'

function Sparkline() {
  return (
    <svg viewBox="0 0 80 24" className="h-6 w-20 text-forest" fill="none">
      <path d="M1 20 L14 16 L24 18 L36 10 L48 13 L60 6 L72 9 L79 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function KpiCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="card p-5">
        <div className="flex items-start justify-between">
          <p className="eyebrow">Active Tours</p>
          <Badge tone="gray" dot>98% on-track</Badge>
        </div>
        <p className="mt-2 font-display text-4xl font-bold tabular">18 <span className="text-sm font-medium text-ink-muted">in circuit</span></p>
        <div className="mt-4 flex items-end justify-between text-xs text-ink-muted">
          <span className="flex items-center gap-1.5"><LuPlaneTakeoff className="h-4 w-4" /> +2 departures today</span>
          <Sparkline />
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-start justify-between">
          <p className="eyebrow">Guides Available</p>
          <Badge tone="gold">Standby</Badge>
        </div>
        <p className="mt-2 font-display text-4xl font-bold tabular">14 <span className="text-sm font-medium text-ink-muted">/ 32 roster</span></p>
        <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
          <span>Mara: 6 · Serengeti: 8</span>
          <div className="flex -space-x-2">
            <Avatar name="Samuel Ondiek" size="sm" className="ring-2 ring-white" />
            <Avatar name="Faith Mutua" size="sm" className="ring-2 ring-white" tone={1} />
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white ring-2 ring-white">+4</span>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-start justify-between">
          <p className="eyebrow">Vehicles En Route</p>
          <Badge tone="forest"><LuSatelliteDish className="h-3 w-3" /> Mesh 100%</Badge>
        </div>
        <p className="mt-2 font-display text-4xl font-bold tabular">22 <span className="text-sm font-medium text-ink-muted">4×4 Land Cruisers</span></p>
        <div className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
          <LuFuel className="h-4 w-4 text-emerald" /> Avg 78% · 0 Telemetry Faults
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-start justify-between">
          <p className="eyebrow">Departures Today</p>
          <Badge tone="gray">T-minus 35m</Badge>
        </div>
        <p className="mt-2 font-display text-4xl font-bold tabular">7 <span className="text-sm font-medium text-ink-muted">scheduled</span></p>
        <Link to="/tours" className="mt-4 flex items-center justify-between text-xs text-ink-muted hover:text-forest">
          <span className="truncate">09:30 AM · Mara Migration (Fly-in)</span>
          <LuArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </div>
  )
}

const markers = [
  { x: 24, y: 26, plate: 'KDL 482M', who: 'Samuel O.', meta: ['32 km/h', 'Fuel 82%', '4G + Sat Mesh'], icon: LuCarFront, tone: 'emerald' },
  { x: 62, y: 54, plate: 'KCR 910T', who: 'Faith M.', meta: ['Stationary (24m)', 'Governor Camp'], icon: LuPawPrint, tone: 'gold', tag: 'Pride' },
  { x: 30, y: 66, plate: 'KBZ 119Q', who: 'Juma B.', meta: ['En Route Airstrip'], icon: LuBus, tone: 'mint', compact: true },
]

function TelematicsMap() {
  const [layer, setLayer] = useState('Hybrid Topo')
  const [active, setActive] = useState(0)
  const layers = ['Hybrid Topo', 'Thermal Park Density', 'Camp Grid']

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-white"><LuSatelliteDish className="h-5 w-5" /></span>
          <div>
            <h3 className="font-semibold">Great Rift &amp; Mara Basin Real-Time Mesh</h3>
            <p className="text-xs text-ink-muted tabular">Freq: 148.825 MHz · <span className="font-semibold text-emerald">22 Beacon Links Active</span></p>
          </div>
        </div>
        <div className="flex rounded-lg border border-surface-high bg-surface-low p-1 text-xs">
          {layers.map((l) => (
            <button
              key={l}
              onClick={() => setLayer(l)}
              className={`cursor-pointer rounded-md px-3 py-1.5 font-semibold transition-colors ${layer === l ? 'bg-forest text-white' : 'text-ink-muted hover:text-ink'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[380px] overflow-hidden bg-[#0d2e26]">
        {/* Topographic vector backdrop */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {Array.from({ length: 11 }).map((_, i) => (
            <path
              key={i}
              d={`M-5 ${10 + i * 9} C 20 ${2 + i * 9}, 45 ${18 + i * 9}, 70 ${8 + i * 9} S 105 ${14 + i * 9}, 110 ${6 + i * 9}`}
              stroke="#a4d0c0" strokeOpacity={layer === 'Camp Grid' ? 0.05 : 0.09} strokeWidth="0.25" fill="none"
            />
          ))}
          {layer === 'Camp Grid' &&
            Array.from({ length: 9 }).map((_, i) => (
              <g key={i} stroke="#a4d0c0" strokeOpacity="0.14" strokeWidth="0.15">
                <line x1={i * 12.5} y1="0" x2={i * 12.5} y2="100" />
                <line x1="0" y1={i * 12.5} x2="100" y2={i * 12.5} />
              </g>
            ))}
          {layer === 'Thermal Park Density' && (
            <>
              <circle cx="62" cy="54" r="18" fill="#D9A441" opacity="0.18" />
              <circle cx="62" cy="54" r="9" fill="#D9A441" opacity="0.22" />
              <circle cx="24" cy="30" r="12" fill="#10B981" opacity="0.14" />
              <circle cx="80" cy="20" r="10" fill="#ef4444" opacity="0.12" />
            </>
          )}
          {/* Mara river */}
          <path d="M-2 62 C 15 58, 30 66, 48 60 S 80 50, 102 56" stroke="#4edea3" strokeOpacity="0.45" strokeWidth="0.5" fill="none" />
          {/* Routes */}
          <path d="M24 26 C 40 30, 52 42, 62 54" stroke="#4edea3" strokeOpacity="0.4" strokeWidth="0.35" strokeDasharray="1 1" fill="none" />
          <path d="M30 66 C 44 66, 56 62, 62 54" stroke="#D9A441" strokeOpacity="0.45" strokeWidth="0.35" strokeDasharray="1 1" fill="none" />
          <path d="M80 0 C 72 12, 68 18, 75 30" stroke="#a4d0c0" strokeOpacity="0.25" strokeWidth="0.3" fill="none" />
        </svg>

        <p className="absolute left-5 top-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">
          Sector 04 · Maasai Mara National Reserve [KE]
        </p>
        <span className="absolute left-[3%] top-[57%] rounded bg-forest/80 px-2 py-0.5 text-[10px] font-semibold text-emerald">Mara River Crossing #4</span>

        {markers.map((m, i) => {
          const Icon = m.icon
          const ring = m.tone === 'gold' ? 'bg-gold text-forest-deep' : m.tone === 'mint' ? 'bg-mint text-forest' : 'bg-emerald text-white'
          return (
            <button
              key={m.plate}
              onClick={() => setActive(i)}
              className="absolute flex -translate-x-4 -translate-y-1/2 cursor-pointer items-center gap-2 text-left"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
            >
              <span className={`relative flex h-8 w-8 items-center justify-center rounded-full ${ring} ring-4 ring-white/10`}>
                {active === i && <span className={`animate-ping-soft absolute inset-0 rounded-full ${ring} opacity-50`} />}
                <Icon className="relative h-4 w-4" />
              </span>
              <span className={`rounded-lg border border-white/10 bg-charcoal/85 px-3 py-2 text-white backdrop-blur ${active === i ? 'block' : 'hidden sm:block'}`}>
                <span className="flex items-center gap-2 text-xs font-bold">
                  <span className={m.tone === 'gold' ? 'text-gold' : 'text-emerald'}>{m.plate}</span>
                  <span className="text-white/50">·</span> {m.who}
                  {m.tag && <span className="rounded bg-gold px-1 text-[10px] text-forest-deep">{m.tag}</span>}
                  {!m.compact && m.tone === 'emerald' && <LiveDot />}
                </span>
                {active === i && <span className="mt-0.5 block text-[10px] text-white/70 tabular">{m.meta.join(' · ')}</span>}
              </span>
            </button>
          )
        })}

        <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-white/10 bg-charcoal/85 px-4 py-3 text-[11px] text-white backdrop-blur">
          <span className="flex items-center gap-2"><LiveDot /> <span className="text-white/60">SAT GATEWAY:</span> <b>IRIDIUM-9 MESH ON</b></span>
          <span><span className="text-white/60">WEATHER:</span> <b className="tabular">24°C · Baro 1014 hPa · Dry Track</b></span>
          <button className="ml-auto flex cursor-pointer items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20">
            <LuSlidersHorizontal className="h-3.5 w-3.5" /> Telemetry Filters
          </button>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-3">
        {[
          ['Fuel Critical (<20%)', '0 Units', LuCircleCheck],
          ['Ranger Checkpoints Cleared', '19 / 22', LuShieldCheck],
          ['Active Safari Radios', '24 Transceivers', LuRadio],
        ].map(([label, val, Icon]) => (
          <div key={label} className="flex items-center justify-between rounded-lg border border-surface-high p-3">
            <div>
              <p className="text-[11px] text-ink-muted">{label}</p>
              <p className="font-display text-lg font-bold tabular">{val}</p>
            </div>
            <Icon className="h-5 w-5 text-forest" />
          </div>
        ))}
      </div>
    </div>
  )
}

const streamIcons = {
  wildlife: [LuEye, 'bg-sand text-gold-deep'],
  flight: [LuPlane, 'bg-mint text-forest'],
  checkpoint: [LuSquareCheck, 'bg-surface-high text-forest'],
  medical: [LuBriefcaseMedical, 'bg-sand text-gold-deep'],
}

function LiveStream() {
  const [items, setItems] = useState(liveStream)
  const [memo, setMemo] = useState('')

  const send = (e) => {
    e.preventDefault()
    if (!memo.trim()) return
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setItems([{ kind: 'checkpoint', title: 'Memo sent to park liaison', time: now, body: [memo.trim()] }, ...items])
    setMemo('')
  }

  return (
    <div className="card flex flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold"><LuRadio className="h-5 w-5 text-forest" /> Operations Live Stream</h3>
        <Badge tone="forest"><span className="text-emerald">Real-Time Sync</span></Badge>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar lg:max-h-[520px]">
        {items.map((it, i) => {
          const [Icon, tone] = streamIcons[it.kind]
          return (
            <div key={i} className="flex gap-3 rounded-lg bg-surface-low p-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tone}`}><Icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{it.title}</p>
                  <span className="shrink-0 text-[11px] text-ink-muted tabular">{it.time}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                  {it.body.map((p, j) => (typeof p === 'string' ? p : <b key={j} className="text-ink">{p.b}</b>))}
                </p>
                {it.resolved && <Badge tone="forest" className="mt-2"><span className="text-emerald">Auto-Resolved</span></Badge>}
                {it.meta && (
                  <p className="mt-2 flex flex-wrap gap-x-3 text-[11px] text-emerald-700">
                    {it.meta.map((m) => <span key={m}>{m}</span>)}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Type quick memo to park liaison…"
          className="flex-1 rounded-lg border border-surface-high bg-surface-low px-3 py-2 text-sm outline-none focus:border-forest"
        />
        <button type="submit" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-forest text-white hover:bg-forest-soft" aria-label="Send memo">
          <LuSend className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}

const dot = { emerald: 'bg-emerald', gold: 'bg-gold', gray: 'bg-line' }
const statusText = { emerald: 'text-ink', gold: 'text-gold-deep', gray: 'text-ink-muted' }

function CircuitTable() {
  const [tab, setTab] = useState('active')
  const tabs = [['active', 'Active Now (18)'], ['pending', 'Pending Start (7)'], ['completed', 'Completed (5)']]
  const rows = circuitTable.filter((r) => r.group === tab)

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint/60 text-forest"><LuCalendarDays className="h-5 w-5" /></span>
          <div>
            <h3 className="font-semibold">Today's Safari Circuit Expeditions</h3>
            <p className="text-xs text-ink-muted">Real-time status of current and imminent departures across Kenya &amp; Tanzania</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-surface-high bg-surface-low p-1 text-xs">
            {tabs.map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`cursor-pointer rounded-md px-3 py-1.5 font-semibold ${tab === k ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'}`}>
                {l}
              </button>
            ))}
          </div>
          <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-surface-high hover:bg-surface-low" aria-label="Download manifest">
            <LuDownload className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-y border-surface-high bg-surface-low">
            <tr className="eyebrow">
              {['Tour ID & Name', 'Circuit / Sector', 'Client Party', 'Lead Guide', 'Vehicle', 'Status / Waypoint', ''].map((h) => (
                <th key={h} className="px-5 py-3 font-semibold">{h || <span className="sr-only">Actions</span>}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-high">
            {rows.map((r) => (
              <tr key={r.id} className="align-top hover:bg-surface-low/60">
                <td className="px-5 py-4">
                  <p className="font-semibold"><span className="mr-1.5 text-xs text-ink-muted">{r.id}</span>{r.name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{r.day}</p>
                </td>
                <td className="px-5 py-4"><span className="rounded-md bg-surface-mid px-2 py-1 text-xs font-medium">{r.sector}</span></td>
                <td className="px-5 py-4">
                  <p className="font-medium">{r.client}</p>
                  <p className="text-xs text-ink-muted">{r.clientNote}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={r.guide} size="sm" />
                    <div>
                      <p className="font-medium">{r.guide}</p>
                      <p className="text-xs text-ink-muted">{r.guideNote}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium tabular">{r.vehicle}</p>
                  <p className="text-xs text-emerald-700">{r.vehicleNote}</p>
                </td>
                <td className="px-5 py-4">
                  <p className={`flex items-center gap-2 font-medium ${statusText[r.tone]}`}><span className={`h-2 w-2 rounded-full ${dot[r.tone]}`} />{r.status}</p>
                  <p className="text-xs text-ink-muted">{r.statusNote}</p>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button size="sm" variant="soft" icon={LuNavigation}>Track</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const readyGuides = [
  { name: 'David Kipkoech', tier: 'Gold', spec: 'Big Cat Behaviorist · 14 yrs', langs: ['ENG', 'DEU', 'SWA'], station: 'Mara North' },
  { name: 'Amina Ndiaye', tier: 'Silver', spec: 'Ornithology & Botanical Lead', langs: ['ENG', 'FRA'], station: 'Amboseli HQ' },
]

const fleetReady = [
  { plate: 'KDE 304L', tag: 'Standby', note: 'Nairobi HQ Hangar · Full tank (180L dual)', icon: LuCircleCheck, action: 'Deploy' },
  { plate: 'KDJ 819M', tag: 'Standby', note: 'Arusha Base Hub · Pop-Up Roof Checked', icon: LuCircleCheck, action: 'Deploy' },
  { plate: 'KDA 771P', tag: 'Scheduled Service', note: '50,000km Heavy Bush Overhaul · 4h left', icon: LuWrench, bay: 'Bay #3' },
]

function BottomPanels() {
  const [assigned, setAssigned] = useState({})
  const [deployed, setDeployed] = useState({})

  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="card flex flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <LuUsers className="mt-0.5 h-5 w-5 text-forest" />
            <div>
              <h3 className="font-semibold">Guide Talent Ready for Dispatch</h3>
              <p className="text-xs text-ink-muted">Top-certified guides currently unassigned or finishing rotation</p>
            </div>
          </div>
          <Link to="/guides" className="flex shrink-0 items-center gap-1 text-sm font-semibold text-forest hover:underline">View All 32 <LuChevronRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {readyGuides.map((g) => (
            <div key={g.name} className="rounded-xl bg-surface-low p-4">
              <div className="flex items-start gap-3">
                <Avatar name={g.name} size="lg" online tone={g.tier === 'Gold' ? 2 : 1} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{g.name}</p>
                    <Badge tone={g.tier === 'Gold' ? 'goldSolid' : 'forest'}>{g.tier}</Badge>
                  </div>
                  <p className="text-xs text-ink-muted">{g.spec}</p>
                  <div className="mt-2 flex gap-1">
                    {g.langs.map((l) => <span key={l} className="rounded border border-surface-high bg-white px-1.5 text-[10px] font-semibold">{l}</span>)}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-700">Stationed: {g.station}</span>
                <Button size="sm" variant="primary" onClick={() => setAssigned({ ...assigned, [g.name]: true })} disabled={assigned[g.name]}>
                  {assigned[g.name] ? 'Assigned ✓' : 'Assign Tour'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-auto flex items-center gap-2 rounded-lg bg-surface-low p-3 pt-3 text-xs text-ink-muted xl:mt-6">
          <LuShieldCheck className="h-4 w-4 shrink-0 text-forest" />
          KPSGA Accreditation check for Q4 2024: 100% compliant across staff. <span className="ml-auto font-semibold">KPSGA-NBO</span>
        </p>
      </div>

      <div className="card p-5">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <LuCarFront className="mt-0.5 h-5 w-5 text-forest" />
            <div>
              <h3 className="font-semibold">Fleet Readiness Hub</h3>
              <p className="text-xs text-ink-muted">28 Total Safari 4×4s in Fleet</p>
            </div>
          </div>
          <Badge tone="mint">96% Fleet Health</Badge>
        </div>
        <div className="mt-4 space-y-3">
          {fleetReady.map((v) => (
            <div key={v.plate} className="flex items-center gap-3 rounded-lg bg-surface-low p-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-high bg-white"><v.icon className="h-4 w-4 text-forest" /></span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold tabular">
                  {v.plate} <Badge tone={v.action ? 'forest' : 'gold'}>{v.tag}</Badge>
                </p>
                <p className="text-xs text-ink-muted">{v.note}</p>
              </div>
              {v.action ? (
                <Button size="sm" onClick={() => setDeployed({ ...deployed, [v.plate]: true })} disabled={deployed[v.plate]}>
                  {deployed[v.plate] ? 'Deployed' : v.action}
                </Button>
              ) : (
                <span className="text-xs text-ink-muted">{v.bay}</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
          <span>Next Dispatch Gate: Wilson Airstrip (10:15 EAT)</span>
          <Link to="/fleet" className="flex items-center gap-1 font-semibold text-forest hover:underline">Open Fleet Telematics <LuArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            <LiveDot /> Operations Hub <span>/</span> East Africa Region <span>/</span> Saturday, 14 Oct 2024
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Good morning, Alex</h1>
            <Badge tone="mint"><LuCircleCheck className="h-3.5 w-3.5" /> All Systems Nominal</Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button icon={LuUserPlus}>Assign Guide</Button>
          <Button icon={LuCarFront}>Dispatch Fleet</Button>
          <Button variant="gold" icon={LuRadio}>Broadcast Alert</Button>
          <Button variant="primary" icon={LuCirclePlus}>New Expedition</Button>
        </div>
      </div>

      <KpiCards />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <TelematicsMap />
        <LiveStream />
      </div>

      <CircuitTable />
      <BottomPanels />
    </div>
  )
}
