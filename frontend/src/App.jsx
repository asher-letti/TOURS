import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Tours from './pages/Tours.jsx'
import Guides from './pages/Guides.jsx'
import Fleet from './pages/Fleet.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import Groups from './pages/comms/Groups.jsx'
import NewGroup from './pages/comms/NewGroup.jsx'
import GroupMembers from './pages/comms/GroupMembers.jsx'
import GroupDashboard from './pages/comms/GroupDashboard.jsx'
import SendAlert from './pages/comms/SendAlert.jsx'


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
        <Route path="comms" element={<Groups />} />
        <Route path="comms/groups/new" element={<NewGroup />} />
        <Route path="comms/groups/:id" element={<GroupMembers />} />
        <Route path="comms/groups/:id/dashboard" element={<GroupDashboard />} />
        <Route path="comms/send" element={<SendAlert />} />
        <Route path="incidents" element={<ComingSoon title="Incidents & Alerts" />} />
        <Route path="settings" element={<ComingSoon title="System Settings" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
