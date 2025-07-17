import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/pages/dashboard/Dashboard'
import BrokerageManagement from './components/pages/brokerage/BrokerageManagement'
import ScriptManagement from './components/pages/script/ScriptManagement'
import UserManagement from './components/pages/user/UserManagement'
import PositionDashboard from './components/pages/position/PositionDashboard'
import PositionsPage from './components/pages/position/PositionPage'
import StockPositions from './components/pages/position/StockPositions'
import ClientTrades from './components/pages/position/ClientTrades'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/brokerage-management" element={<BrokerageManagement />} />
        <Route path="/script-management" element={<ScriptManagement />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/positions-dashboard" element={<PositionDashboard />} />
        <Route path="/positions" element={<PositionsPage />} />
        <Route path="/stock/:id" element={<StockPositions />} />
        <Route path="/client/:id" element={<ClientTrades />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App