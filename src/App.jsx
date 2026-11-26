import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Tours from './pages/Tours.jsx'
import Guides from './pages/Guides.jsx'
import Fleet from './pages/Fleet.jsx'
import ComingSoon from './pages/ComingSoon.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="tours" element={<Tours />} />
        <Route path="guides" element={<Guides />} />
        <Route path="fleet" element={<Fleet />} />
        <Route path="builder" element={<ComingSoon title="Tour Builder" />} />
        <Route path="map" element={<ComingSoon title="Live Telematics Map" />} />
        <Route path="comms" element={<ComingSoon title="Smart Comms Centre" />} />
        <Route path="incidents" element={<ComingSoon title="Incidents & Alerts" />} />
        <Route path="settings" element={<ComingSoon title="System Settings" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
