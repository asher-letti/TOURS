const tones = {
  forest: 'bg-forest text-white',
  mint: 'bg-mint/70 text-forest',
  emerald: 'bg-emerald/15 text-emerald-700',
  gold: 'bg-sand text-gold-deep',
  goldSolid: 'bg-gold text-white',
  gray: 'bg-surface-high text-ink-muted',
  red: 'bg-red-100 text-red-700',
  white: 'bg-white text-ink border border-surface-high',
}

export function Badge({ tone = 'gray', dot, className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${tones[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function Tag({ highlight, children }) {
  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${
        highlight ? 'bg-sand text-gold-deep' : 'bg-surface-low text-ink border border-surface-high'
      }`}
    >
      {children}
    </span>
  )
}

const avatarTones = ['bg-mint text-forest', 'bg-sand text-gold-deep', 'bg-forest text-white', 'bg-emerald/20 text-emerald-800']

export function Avatar({ name, size = 'md', tone, online, className = '' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const idx = tone ?? [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % avatarTones.length
  const sizes = { sm: 'h-7 w-7 text-[10px]', md: 'h-9 w-9 text-xs', lg: 'h-12 w-12 text-sm', xl: 'h-16 w-16 text-lg' }
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-bold ${sizes[size]} ${avatarTones[idx]} ${className}`}>
      {initials}
      {online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald" />}
    </span>
  )
}

export function LiveDot({ color = 'bg-emerald', className = '' }) {
  return (
    <span className={`relative inline-flex h-2 w-2 ${className}`}>
      <span className={`animate-ping-soft absolute inline-flex h-full w-full rounded-full ${color} opacity-60`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  )
}

export function Progress({ value, tone = 'forest', className = '' }) {
  const fills = { forest: 'bg-forest', gold: 'bg-gold', mint: 'bg-mint-dim', emerald: 'bg-emerald' }
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-surface-high ${className}`}>
      <div className={`h-full rounded-full ${fills[tone]} transition-all`} style={{ width: `${value}%` }} />
    </div>
  )
}

const btn = {
  primary: 'bg-forest text-white hover:bg-forest-soft',
  gold: 'bg-gold-soft text-gold-deep hover:bg-gold hover:text-white',
  goldDeep: 'bg-gold-deep text-white hover:bg-[#654600]',
  outline: 'bg-white text-ink border border-surface-high hover:bg-surface-low',
  soft: 'bg-surface-mid text-ink hover:bg-surface-high',
  ghost: 'text-ink-muted hover:bg-surface-low',
}

export function Button({ variant = 'outline', icon: Icon, size = 'md', className = '', children, ...props }) {
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' }
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50 ${btn[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {children}
    </button>
  )
}

export function IconButton({ icon: Icon, label, active, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
        active ? 'border-forest bg-forest text-white' : 'border-surface-high bg-white text-ink-muted hover:bg-surface-low'
      } ${className}`}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

export function StatCard({ label, value, sub, icon: Icon, accent = 'mint', children }) {
  const accents = { mint: 'bg-mint/60 text-forest', gold: 'bg-sand text-gold-deep', gray: 'bg-surface-mid text-forest' }
  return (
    <div className="card flex items-center justify-between gap-4 p-5">
      <div className="min-w-0">
        <p className="eyebrow">{label}</p>
        <p className="mt-1 font-display text-2xl font-bold text-ink tabular">{value}</p>
        {sub && <div className="mt-1 text-xs text-ink-muted">{sub}</div>}
        {children}
      </div>
      {Icon && (
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </span>
      )}
    </div>
  )
}

export function Select({ value, onChange, options, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full cursor-pointer rounded-lg border border-surface-high bg-surface-low px-3 py-2.5 text-sm text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/15 ${className}`}
    >
      {options.map((o) => (
        <option key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </option>
      ))}
    </select>
  )
}

export function PageHeader({ eyebrow, eyebrowIcon: EIcon, title, children, meta }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-forest">
            {EIcon ? <EIcon className="h-3.5 w-3.5 text-gold-deep" /> : <LiveDot />}
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
        {meta && <div className="mt-2 text-sm text-ink-muted">{meta}</div>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2 lg:justify-end">{children}</div>}
    </div>
  )
}
