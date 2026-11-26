import { useState } from 'react'
import {
  LuDownload, LuSparkles, LuCirclePlus, LuAward, LuRadio, LuLanguages, LuStar, LuSlidersHorizontal,
  LuPhone, LuMessageSquare, LuBriefcase, LuClock, LuSquareCheck, LuCalendarDays, LuSend, LuCircleCheck,
  LuMapPin, LuNavigation, LuBadgeCheck, LuSearchX, LuSatellite, LuPlaneTakeoff,
} from 'react-icons/lu'
import { Avatar, Badge, Button, IconButton, PageHeader, Select, StatCard, Tag } from '../components/ui.jsx'
import { guideFilters, guides } from '../data/index.js'

const statusTone = { 'In Field': 'gold', Available: 'emerald', Dispatched: 'gold', 'On Standby': 'gold' }
const tierTone = (t) => (t.includes('Gold') ? 'gold' : 'mint')

const quickTags = [
  { label: 'Big Cat Tracking', apply: { skill: 'Big Cat Tracking' } },
  { label: 'KPSGA Gold Only', apply: { tier: 'KPSGA Gold' } },
  { label: 'French Speakers', apply: { lang: 'French' } },
  { label: 'German Speakers', apply: { lang: 'German' } },
  { label: 'Ready for Immediate Dispatch', apply: { status: 'Available' } },
]

const empty = { lang: '', skill: '', tier: '', status: '' }

function GuideCard({ g, assigned, onAssign }) {
  const primaryAction = g.action === 'Instant Assign' || g.action === 'Activate Dispatch'
  const ActionIcon = g.action === 'Instant Assign' ? LuSquareCheck : g.action === 'Activate Dispatch' ? LuSend : g.action.includes('Schedule') || g.action.includes('Next') ? LuCalendarDays : LuClock
  const InfoIcon = g.status === 'Available' ? LuMapPin : g.status === 'On Standby' ? LuPlaneTakeoff : LuNavigation

  return (
    <article className="card flex flex-col p-5">
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar name={g.name} size="xl" className="!rounded-xl" />
          <LuBadgeCheck className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-white text-forest" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-lg font-bold leading-tight">{g.name}</h3>
            <Badge tone={statusTone[g.status]} dot>{g.status}</Badge>
          </div>
          <Badge tone={tierTone(g.tier)} className="mt-1">{g.tier}</Badge>
          <p className="mt-1 text-sm text-ink-muted">{g.exp}</p>
          <p className="mt-1 flex items-center gap-1 text-sm">
            <LuStar className="h-4 w-4 fill-gold text-gold" /> <b className="tabular">{g.rating.toFixed(2)}</b>
            <span className="text-xs text-ink-muted">({g.reviews} reviews)</span>
          </p>
        </div>
      </div>

      <dl className="mt-4 space-y-2 rounded-xl bg-surface-low p-3 text-xs">
        {g.info.map(([k, v], i) => (
          <div key={k} className="grid grid-cols-[110px_1fr] gap-2">
            <dt className="flex items-start gap-1 font-semibold uppercase tracking-wide text-ink-muted">
              {i === 0 && <InfoIcon className="h-3.5 w-3.5 shrink-0" />}{k}
            </dt>
            <dd className="font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 space-y-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="eyebrow mr-1">Languages:</span>
          {g.languages.map((l) => <Tag key={l} highlight={g.highlight?.includes(l)}>{l}</Tag>)}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="eyebrow mr-1">Skills:</span>
          {g.skills.map((s) => <span key={s} className="rounded-md bg-mint/50 px-2 py-0.5 text-xs font-medium text-forest">{s}</span>)}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-ink-muted">
        {g.certs.map((c) => (
          <span key={c} className="flex items-start gap-1.5"><LuCircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" />{c}</span>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2 pt-5">
        <IconButton icon={LuPhone} label={`Call ${g.name}`} />
        <IconButton icon={LuMessageSquare} label={`Message ${g.name}`} active={g.status === 'Available'} />
        <IconButton icon={g.status === 'Dispatched' ? LuSatellite : LuBriefcase} label="Assignment history" />
        <Button
          variant={assigned ? 'soft' : primaryAction ? (g.action === 'Activate Dispatch' ? 'goldDeep' : 'primary') : 'soft'}
          icon={assigned ? LuCircleCheck : ActionIcon}
          className="flex-1"
          onClick={() => onAssign(g.name)}
          disabled={assigned}
        >
          {assigned ? 'Assigned' : g.action}
        </Button>
      </div>
    </article>
  )
}

export default function Guides() {
  const [f, setF] = useState(empty)
  const [assigned, setAssigned] = useState({})
  const set = (k) => (v) => setF({ ...f, [k]: v })

  const filtered = guides.filter((g) => {
    if (f.lang && !g.languages.some((l) => l.startsWith(f.lang))) return false
    if (f.skill && !g.skills.includes(f.skill)) return false
    if (f.tier && !g.tier.includes(f.tier)) return false
    if (f.status && g.status !== f.status) return false
    return true
  })

  const opt = (label, list) => [{ value: '', label }, ...list]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<>East Africa Operational Talent Grid / <span className="text-gold-deep">Q4 High Migration Surge</span></>}
        title="Guide Roster & Field Talent"
        meta={<>32 Certified Safari Guides · <b className="text-ink">14 On Standby</b> · <b className="text-ink">18 Dispatched in Field</b> · 100% Wilderness First Aid Certified</>}
      >
        <Button icon={LuDownload}>Export Rosters</Button>
        <Button variant="gold" icon={LuSparkles}>Smart Guide Matcher</Button>
        <Button variant="primary" icon={LuCirclePlus}>Onboard New Guide</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="KPSGA Gold Roster" value="8 Guides" icon={LuAward} accent="gold" />
        <StatCard label="Field Radio Link" value="98.4% Active" icon={LuRadio} />
        <StatCard label="Multilingual VIP Ready" value="19 Guides" icon={LuLanguages} accent="gray" />
        <StatCard label="Avg Guest Satisfaction" value={<span className="text-gold-deep">4.94 / 5.0</span>} icon={LuStar} accent="gold" />
      </div>

      <section className="card p-5 sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-3">
            <LuSlidersHorizontal className="mt-1 h-5 w-5 text-forest" />
            <div>
              <h2 className="font-semibold">Smart Guide Assignment &amp; Matcher Assistant</h2>
              <p className="text-sm text-ink-muted">Real-time heuristics match itinerary dynamics, language needs, and regional park accreditations.</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="soft" onClick={() => setF(empty)}>Clear All Filters</Button>
            <span className="rounded-lg bg-surface-mid px-3 py-1.5 text-xs font-semibold text-ink-muted">Showing {filtered.length} Talent Cards</span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Spoken Languages', 'lang', opt('Any Language (Global Roster)', guideFilters.languages)],
            ['Specialization', 'skill', opt('All Disciplines & Tracks', guideFilters.specializations)],
            ['Accreditation Level', 'tier', opt('All Certification Tiers', guideFilters.tiers)],
            ['Region & Availability', 'status', opt('Any Status & Region', guideFilters.statuses)],
          ].map(([label, key, options]) => (
            <label key={key} className="space-y-1.5">
              <span className="eyebrow block">{label}</span>
              <Select value={f[key]} onChange={set(key)} options={options} />
            </label>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-surface-low p-2">
          <span className="eyebrow px-2">Quick Tags:</span>
          {quickTags.map((t) => {
            const [k, v] = Object.entries(t.apply)[0]
            const on = f[k] === v
            return (
              <button
                key={t.label}
                onClick={() => setF({ ...f, [k]: on ? '' : v })}
                className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${on ? 'bg-forest text-white' : 'bg-white text-ink hover:bg-surface-high'}`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </section>

      {filtered.length ? (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((g) => (
            <GuideCard key={g.name} g={g} assigned={assigned[g.name]} onAssign={(n) => setAssigned({ ...assigned, [n]: true })} />
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center gap-2 p-12 text-center text-ink-muted">
          <LuSearchX className="h-8 w-8" />
          <p className="font-semibold text-ink">No guides match this combination</p>
          <Button size="sm" onClick={() => setF(empty)}>Clear filters</Button>
        </div>
      )}
    </div>
  )
}
