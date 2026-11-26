import { Link } from 'react-router-dom'
import { LuCompass, LuArrowLeft } from 'react-icons/lu'
import { Button } from '../components/ui.jsx'

export default function ComingSoon({ title }) {
  return (
    <div className="card mx-auto mt-10 flex max-w-xl flex-col items-center gap-4 p-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mint/60 text-forest"><LuCompass className="h-7 w-7" /></span>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-ink-muted">This module is on the expedition roadmap and not yet part of the delivered canvas.</p>
      <Link to="/"><Button variant="primary" icon={LuArrowLeft}>Back to Operations Dashboard</Button></Link>
    </div>
  )
}
