import { LuCircleAlert, LuCircleCheck, LuLoader } from 'react-icons/lu'

// Shared bits for the Comms pages.

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="card flex items-center justify-center gap-2 p-10 text-sm text-ink-muted">
      <LuLoader className="h-4 w-4 animate-spin" /> {label}
    </div>
  )
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div role="alert" className="card flex flex-col items-center gap-3 border-red-200 p-8 text-center">
      <LuCircleAlert className="h-6 w-6 text-red-600" />
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="cursor-pointer text-sm font-semibold text-forest underline">
          Try again
        </button>
      )}
    </div>
  )
}

export function Banner({ tone = 'success', children }) {
  const styles = {
    success: 'border-emerald/40 bg-emerald/10 text-emerald-800',
    error: 'border-red-200 bg-red-50 text-red-700',
  }
  const Icon = tone === 'success' ? LuCircleCheck : LuCircleAlert
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${styles[tone]}`}>
      <Icon className="h-4 w-4 shrink-0" /> {children}
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

export const inputCls =
  'w-full rounded-lg border border-surface-high bg-surface-low px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted/70 focus:border-forest focus:ring-2 focus:ring-forest/15'

export function Empty({ children }) {
  return <p className="p-8 text-center text-sm text-ink-muted">{children}</p>
}
