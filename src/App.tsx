import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/pages/dashboard/Dashboard'
import BrokerageManagement from './components/pages/brokerage/BrokerageManagement'
import ScriptManagement from './components/pages/script/ScriptManagement'
import UserManagement from './components/pages/user/UserManagement'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/brokerage-management" element={<BrokerageManagement />} />
        <Route path="/script-management" element={<ScriptManagement />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
