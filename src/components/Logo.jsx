// Acacia tree silhouette with a navigational needle and telematics node.
export default function Logo({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#1c4a3e" />
      <path d="M8 25c9-7 39-7 48 0-7 3-15 4-24 4S15 28 8 25z" fill="#D9A441" />
      <path d="M14 22c6-4 30-4 36 0" stroke="#D9A441" strokeWidth="2" fill="none" opacity=".55" />
      <path d="M30.5 29h3l1.2 25h-5.4z" fill="#D9A441" />
      <path d="M32 31l-9-5M32 31l10-6" stroke="#D9A441" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M46 37l2.2 6-2.2-1.4-2.2 1.4z" fill="#F8F7F2" />
      <circle cx="46" cy="47" r="3.4" fill="#10B981" />
      <circle cx="46" cy="47" r="6" fill="none" stroke="#10B981" strokeOpacity=".45" />
    </svg>
  )
}
