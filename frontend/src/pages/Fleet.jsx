import { useMemo, useState } from 'react'
import {
  LuWrench, LuCarFront, LuZap, LuFuel, LuTrendingUp, LuSatellite, LuTriangleAlert, LuFilter,
  LuRadio, LuPhoneCall, LuEllipsisVertical, LuContactRound, LuCircleCheck, LuShieldCheck,
  LuLogIn, LuHammer, LuUser, LuMap, LuArrowRight, LuSiren, LuCircleCheckBig,
} from 'react-icons/lu'
import { Badge, Button, LiveDot, PageHeader, Progress, Select } from '../components/ui.jsx'
import { dispatchOptions, vehicles as seed } from '../data/index.js'

const routeKm = [640, 480, 910]
const FUEL_EFF = 8.4
const FUEL_PRICE = 1.81

function Field({ label, children }) {
  return (
    <div className="min-w-0">
      <p className="eyebrow mb-1">{label}</p>
      {children}
    </div>
  )
}

function VehicleCard({ v }) {
  if (v.state === 'Maintenance') {
    return (
      <article className="card p-5">
        <div className="flex flex-wrap items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sand text-gold-deep"><LuWrench className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold">#{v.id}</h3>
              <span className="rounded bg-surface-mid px-2 py-0.5 text-xs font-semibold tabular">{v.plate}</span>
              <Badge tone="gold" dot>{v.statusLabel}</Badge>
            </div>
            <p className="text-sm text-ink-muted">{v.model}</p>
          </div>
          <span className="rounded-lg bg-sand/70 px-3 py-1.5 text-xs font-semibold text-gold-deep">{v.eta}</span>
        </div>
        <div className="mt-4 grid gap-4 rounded-xl bg-surface-low p-4 sm:grid-cols-3">
          <Field label="Work Order Details"><p className="font-semibold">{v.workOrder}</p><p className="text-xs text-ink-muted">{v.workNote}</p></Field>
          <Field label="Parts & Tyres"><p className="font-semibold">{v.parts}</p><p className="text-xs text-ink-muted">{v.partsNote}</p></Field>
          <Field label="Lead Technician"><p className="flex items-center gap-1.5 font-semibold"><LuUser className="h-4 w-4" />{v.tech}</p><p className="text-xs text-ink-muted">{v.techNote}</p></Field>
        </div>
      </article>
    )
  }

  const standby = v.state === 'Standby'
  const PingIcon = v.ping === 'Sat Comm' ? LuPhoneCall : LuRadio
  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-mid text-forest"><LuCarFront className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold">#{v.id}</h3>
            <span className="rounded bg-surface-mid px-2 py-0.5 text-xs font-semibold tabular">{v.plate}</span>
            <Badge tone={standby ? 'gray' : 'emerald'} dot>{v.statusLabel}</Badge>
          </div>
          <p className="text-sm text-ink-muted">{v.model}</p>
        </div>
        <div className="flex gap-2">
          {standby ? (
            <Button variant="primary" size="sm" icon={LuLogIn}>Assign to Tour</Button>
          ) : (
            <Button size="sm" variant="soft" icon={PingIcon}>{v.ping}</Button>
          )}
          <button className="rounded-lg p-2 text-ink-muted hover:bg-surface-low" aria-label="More"><LuEllipsisVertical className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 rounded-xl bg-surface-low p-4 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Assigned Guide">
          {v.guide ? (
            <p className="flex items-center gap-1.5 font-semibold"><LuContactRound className="h-4 w-4 shrink-0" />{v.guide}</p>
          ) : (
            <p className="font-semibold italic text-ink-muted">None (Standby)</p>
          )}
          <p className="text-xs text-ink-muted">{v.tour}</p>
        </Field>
        <Field label={standby ? 'Garage Base' : 'Location / GPS'}>
          <p className="truncate font-semibold">{v.location}</p>
          <p className="text-xs text-ink-muted tabular">{v.gps}</p>
        </Field>
        <Field label="Fuel & Range">
          <div className="flex items-center gap-2">
            <Progress value={v.fuel} tone={v.fuel < 25 ? 'gold' : 'forest'} className="!h-2" />
            <span className="text-sm font-semibold tabular">{v.fuel}%</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">{v.fuelNote}</p>
        </Field>
        <Field label={v.permits ? 'Park Permits' : 'Service Status'}>
          <p className="flex items-center gap-1.5 font-semibold text-emerald-700">
            {v.permits ? <LuShieldCheck className="h-4 w-4" /> : <LuCircleCheck className="h-4 w-4" />}{v.service}
          </p>
          <p className="text-xs text-ink-muted">{v.serviceNote}</p>
        </Field>
      </div>
    </article>
  )
}

function DispatchConsole({ standby, onDispatch }) {
  const [tourIdx, setTourIdx] = useState(0)
  const [vehicleId, setVehicleId] = useState(standby[0]?.id ?? '')
  const [guide, setGuide] = useState(dispatchOptions.guides[0])
  const [kws, setKws] = useState(true)
  const [geo, setGeo] = useState(true)
  const [done, setDone] = useState(null)

  const km = routeKm[tourIdx]
  const litres = km / FUEL_EFF
  const selected = standby.find((v) => v.id === vehicleId) ?? standby[0]

  const confirm = () => {
    if (!selected) return
    onDispatch(selected.id, guide.split(' (')[0], dispatchOptions.tours[tourIdx].split(' —')[0])
    setDone(`#${selected.id} dispatched with ${guide.split(' (')[0]}`)
    setVehicleId('')
  }

  return (
    <section className="card p-5">
      <div className="flex items-start justify-between gap-3 border-b border-surface-high pb-4">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest text-gold"><LuZap className="h-5 w-5" /></span>
          <div>
            <h2 className="text-lg font-bold leading-tight">Quick Dispatch Console</h2>
            <p className="text-xs text-ink-muted">Instant Tour-Vehicle-Guide Assignment</p>
          </div>
        </div>
        <Badge tone="mint"><LiveDot /> LIVE</Badge>
      </div>

      <div className="mt-4 space-y-4 text-sm">
        <label className="block space-y-1.5">
          <span className="font-medium">Unassigned Tour / Expedition</span>
          <Select value={tourIdx} onChange={(v) => setTourIdx(Number(v))} options={dispatchOptions.tours.map((t, i) => ({ value: i, label: t }))} />
        </label>
        <label className="block space-y-1.5">
          <span className="font-medium">Available 4x4 Fleet</span>
          {standby.length ? (
            <Select
              value={selected?.id}
              onChange={setVehicleId}
              options={standby.map((v) => ({ value: v.id, label: `#${v.id} · ${v.plate} (${v.model.split('(')[0].replace('Toyota ', '').trim()})` }))}
            />
          ) : (
            <p className="rounded-lg bg-sand/60 px-3 py-2.5 text-xs font-medium text-gold-deep">No standby vehicles left in the pool.</p>
          )}
        </label>
        <label className="block space-y-1.5">
          <span className="font-medium">Lead Guide Certification</span>
          <Select value={guide} onChange={setGuide} options={dispatchOptions.guides} />
        </label>

        <dl className="space-y-2 rounded-xl bg-surface-low p-4">
          <div className="flex justify-between gap-3"><dt className="text-ink-muted">Estimated Route Mileage:</dt><dd className="font-semibold tabular">{km} km roundtrip</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-ink-muted">Fuel Required (@ {FUEL_EFF} km/L):</dt><dd className="text-right font-semibold tabular">{litres.toFixed(1)} Litres <span className="block text-xs text-ink-muted">(~${Math.round(litres * FUEL_PRICE)})</span></dd></div>
          <div className="flex items-center justify-between gap-3"><dt className="text-ink-muted">Park Authority Permits:</dt><dd><Badge tone={kws ? 'emerald' : 'gray'}>{kws ? 'KWS + Mara Gate Ready' : 'Manual filing'}</Badge></dd></div>
        </dl>

        <label className="flex cursor-pointer items-start gap-2.5">
          <input type="checkbox" checked={kws} onChange={(e) => setKws(e.target.checked)} className="mt-0.5 h-4 w-4 accent-forest" />
          <span>Auto-generate Kenya Wildlife Service (KWS) eCitizen Gate Pass</span>
        </label>
        <label className="flex cursor-pointer items-start gap-2.5">
          <input type="checkbox" checked={geo} onChange={(e) => setGeo(e.target.checked)} className="mt-0.5 h-4 w-4 accent-forest" />
          <span>Sync GPS geofence perimeter to satellite relay</span>
        </label>

        <Button variant="primary" size="lg" icon={LuSatellite} className="w-full" onClick={confirm} disabled={!selected}>
          Confirm &amp; Transmit Dispatch Order
        </Button>
        {done && (
          <p className="flex items-center gap-2 rounded-lg bg-mint/50 px-3 py-2 text-xs font-medium text-forest">
            <LuCircleCheckBig className="h-4 w-4" /> {done}. Order transmitted.
          </p>
        )}
      </div>
    </section>
  )
}

function SatelliteOverlay() {
  return (
    <section className="card p-5">
      <div className="flex items-start justify-between">
        <h3 className="flex items-center gap-2 font-semibold"><LuMap className="h-5 w-5 text-forest" /> Fleet Satellite Overlay</h3>
        <span className="text-xs text-ink-muted">Serengeti / Mara Basin</span>
      </div>
      <div className="relative mt-3 h-56 overflow-hidden rounded-xl bg-[#cfe3cf]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d="M0 0 H100 V100 H0z" fill="#d8e8d3" />
          <path d="M30 10 C 55 5, 80 20, 85 45 S 70 90, 45 88 S 10 65, 15 40 S 20 15, 30 10z" fill="#b9d8b4" />
          <path d="M-2 60 C 20 55, 40 70, 60 58 S 90 48, 102 52" stroke="#6fa8dc" strokeWidth="1" fill="none" />
          <path d="M10 95 L 40 60 L 70 40 L 95 10" stroke="#e7b76d" strokeWidth="0.6" fill="none" strokeDasharray="2 1" />
        </svg>
        {[[20, 30], [55, 25], [75, 70], [35, 68], [62, 50]].map(([x, y], i) => (
          <span key={i} className="absolute h-2.5 w-2.5 rounded-full bg-pink-500 ring-2 ring-white" style={{ left: `${x}%`, top: `${y}%` }} />
        ))}
        <span className="absolute left-[48%] top-[40%] text-[9px] font-semibold text-forest/70">Maasai Mara<br />National Reserve</span>
        <div className="absolute left-2 right-2 top-2 flex justify-between gap-2 text-[11px] font-semibold">
          <span className="rounded bg-forest/90 px-2 py-1 text-white">GPS MESH: 22 VANS PINGING</span>
          <span className="rounded bg-white/90 px-2 py-1 tabular">ZOOM: 1:50,000</span>
        </div>
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-lg bg-forest/90 px-3 py-2 text-xs text-white">
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gold" /> SF-LC-01 · River Crossing Point 4</span>
          <span className="text-white/70">Just now</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span><span className="font-semibold">Conservation Range Alerts:</span> None</span>
        <a href="#" className="flex items-center gap-1 font-semibold text-forest hover:underline">Full Geofence View <LuArrowRight className="h-3.5 w-3.5" /></a>
      </div>
    </section>
  )
}

const sorts = { ping: 'Last Telemetry Ping', fuel: 'Fuel Level (Low first)', id: 'Fleet ID' }

export default function Fleet() {
  const [fleet, setFleet] = useState(seed)
  const [tab, setTab] = useState('All')
  const [sort, setSort] = useState('ping')

  const counts = useMemo(() => {
    const c = { All: fleet.length }
    fleet.forEach((v) => (c[v.state] = (c[v.state] ?? 0) + 1))
    return c
  }, [fleet])

  const list = fleet
    .filter((v) => tab === 'All' || v.state === tab)
    .sort((a, b) => (sort === 'fuel' ? (a.fuel ?? 999) - (b.fuel ?? 999) : sort === 'id' ? a.id.localeCompare(b.id) : a.lastPing - b.lastPing))

  const standby = fleet.filter((v) => v.state === 'Standby')

  const dispatch = (id, guide, tour) => {
    setFleet((f) =>
      f.map((v) =>
        v.id === id
          ? { ...v, state: 'On Safari', statusLabel: 'Dispatched · Departing', guide, tour: `Tour: ${tour}`, ping: 'Live Ping', permits: false, service: 'Good', serviceNote: 'Pre-trip check passed', lastPing: 0 }
          : v,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Telemetry Relay: East African Rift Node Alpha / Freq 412.85 MHz"
        title="Safari Fleet & Dispatch Telematics"
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="gray" dot>28 Total Vehicles</Badge>
            <Badge tone="mint" dot>22 On Expedition</Badge>
            <Badge tone="gold" dot>4 Service Bay / Maintenance</Badge>
            <Badge tone="gray" dot>2 Available at Garage</Badge>
          </div>
        }
      >
        <Button icon={LuHammer}>Schedule Service</Button>
        <Button icon={LuCarFront}>+ Register Vehicle</Button>
        <Button variant="primary" icon={LuZap}>Instant Dispatcher Tool</Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card flex items-center justify-between p-5">
          <div>
            <p className="eyebrow">Avg Fleet Fuel Efficiency</p>
            <p className="mt-1 font-display text-3xl font-bold tabular">8.4 <span className="text-sm font-medium text-ink-muted">km / L</span></p>
            <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted"><LuTrendingUp className="h-3.5 w-3.5 text-emerald" /> +0.3 km/L vs Oct Avg</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-mid text-forest"><LuFuel className="h-5 w-5" /></span>
        </div>
        <div className="card flex items-center justify-between p-5">
          <div>
            <p className="eyebrow">Active Telematics Mesh</p>
            <p className="mt-1 font-display text-3xl font-bold tabular">100% <span className="text-sm font-medium text-ink-muted">Sat Link Active</span></p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted"><span className="h-1.5 w-1.5 rounded-full bg-emerald" /> Iridium SBD + Safaricom eSim</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-mid text-forest"><LuSatellite className="h-5 w-5" /></span>
        </div>
        <div className="card flex items-center justify-between p-5">
          <div>
            <p className="eyebrow">Maint. Due &lt; 7 Days</p>
            <p className="mt-1 font-display text-3xl font-bold tabular"><span className="text-gold-deep">2</span> <span className="text-sm font-medium text-ink-muted">Vehicles in Queue</span></p>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gold-deep"><LuTriangleAlert className="h-3.5 w-3.5" /> SF-LC-09 (Brake pads), SF-SV-04</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand text-gold-deep"><LuWrench className="h-5 w-5" /></span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="card flex flex-col gap-3 p-3 2xl:flex-row 2xl:items-center">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <LuFilter className="ml-2 h-4 w-4 shrink-0 text-ink-muted" />
              {[['All', 'All Fleets'], ['On Safari', 'On Safari'], ['Maintenance', 'Maintenance'], ['Standby', 'Standby']].map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`shrink-0 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${tab === k ? 'bg-forest text-white' : 'text-ink-muted hover:bg-surface-low'}`}
                >
                  {l} ({counts[k] ?? 0})
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 2xl:ml-auto">
              <span className="eyebrow">Sort:</span>
              <Select value={sort} onChange={setSort} options={Object.entries(sorts).map(([value, label]) => ({ value, label }))} className="md:w-56" />
            </label>
          </div>
          {list.map((v) => <VehicleCard key={v.id} v={v} />)}
        </div>

        <aside className="space-y-6">
          <DispatchConsole standby={standby} onDispatch={dispatch} />
          <SatelliteOverlay />
          <section className="card flex items-center gap-3 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600"><LuSiren className="h-5 w-5" /></span>
            <div className="flex-1">
              <p className="font-semibold leading-tight">AMREF Flying Doctors Relay</p>
              <p className="text-xs text-ink-muted">24/7 Medevac Dispatch Channel</p>
            </div>
            <span className="rounded-lg bg-surface-mid px-3 py-2 text-xs font-semibold tabular">VHF<br />155.200</span>
          </section>
        </aside>
      </div>
    </div>
  )
}
