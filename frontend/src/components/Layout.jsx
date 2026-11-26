import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LuLayoutDashboard, LuTicket, LuMap, LuContactRound, LuCarFront, LuSatellite, LuRadioTower,
  LuTriangleAlert, LuSettings, LuSearch, LuPlus, LuBell, LuMenu, LuX,
} from 'react-icons/lu'
import Logo from './Logo.jsx'
import { Avatar, LiveDot } from './ui.jsx'

const nav = [
  { to: '/', label: 'Operations Dashboard', icon: LuLayoutDashboard, end: true },
  { to: '/tours', label: 'Tours & Bookings', icon: LuTicket },
  { to: '/builder', label: 'Tour Builder', icon: LuMap },
  { to: '/guides', label: 'Guides & Talent', icon: LuContactRound },
  { to: '/fleet', label: 'Fleet & Dispatch', icon: LuCarFront },
  { to: '/map', label: 'Live Telematics Map', icon: LuSatellite },
  { to: '/comms', label: 'Smart Comms Centre', icon: LuRadioTower },
  { to: '/incidents', label: 'Incidents & Alerts', icon: LuTriangleAlert, badge: 2 },
]

const linkCls = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
    isActive ? 'bg-white/10 text-white' : 'text-white/75 hover:bg-white/5 hover:text-white'
  }`

function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full w-72 flex-col bg-forest text-white">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <Logo className="h-10 w-10" />
        <div className="leading-tight">
          <p className="font-display text-xl font-bold tracking-tight">SafariFlow</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">East &amp; Southern Africa</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Core Operations</p>
        <ul className="space-y-1">
          {nav.map(({ to, label, icon: Icon, end, badge }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={linkCls} onClick={onNavigate}>
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1">{label}</span>
                {badge && <span className="rounded-full bg-gold px-1.5 text-[10px] font-bold text-forest-deep">{badge}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-2 px-3 pb-4">
        <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60">Base Node</p>
            <p className="text-sm font-bold tabular">NBO-HQ / -1.2921, 36.8219</p>
          </div>
          <LiveDot color="bg-emerald" />
        </div>
        <NavLink to="/settings" className={linkCls} onClick={onNavigate}>
          <LuSettings className="h-[18px] w-[18px]" />
          System Settings
        </NavLink>
      </div>
    </aside>
  )
}

function Topbar({ onMenu }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-surface-high bg-surface/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <button onClick={onMenu} className="rounded-lg p-2 text-ink hover:bg-surface-mid lg:hidden" aria-label="Open menu">
        <LuMenu className="h-5 w-5" />
      </button>

      <div className="hidden items-center gap-3 rounded-full bg-surface-mid px-4 py-2 text-xs text-ink-muted xl:flex">
        <span className="flex items-center gap-2"><LiveDot /> All 24 Field Radios Active</span>
        <span className="h-3 w-px bg-line" />
        <span>GPS Mesh Online</span>
      </div>

      <label className="relative flex-1 max-w-xl">
        <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          placeholder="Search expedition, safari VID, voucher or guide…"
          className="w-full rounded-lg border border-surface-high bg-white py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-ink-muted/70 focus:border-forest focus:ring-2 focus:ring-forest/15"
        />
      </label>

      <button className="hidden items-center gap-2 rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-soft md:inline-flex">
        <LuPlus className="h-4 w-4" /> New Tour / Dispatch
      </button>

      <button className="relative rounded-lg p-2 text-ink hover:bg-surface-mid" aria-label="Notifications">
        <LuBell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-surface" />
      </button>

      <div className="hidden items-center gap-3 border-l border-surface-high pl-3 sm:flex">
        <Avatar name="Alex Kiprop" online />
        <div className="leading-tight">
          <p className="text-sm font-semibold">Alex Kiprop</p>
          <p className="text-xs text-ink-muted">Chief Dispatch Officer</p>
        </div>
      </div>
    </header>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar />
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/50" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72">
            <Sidebar onNavigate={() => setOpen(false)} />
            <button
              onClick={() => setOpen(false)}
              className="absolute -right-12 top-4 rounded-full bg-white p-2 text-ink"
              aria-label="Close menu"
            >
              <LuX className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-72">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
