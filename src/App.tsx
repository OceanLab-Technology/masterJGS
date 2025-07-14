import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/pages/dashboard/Dashboard'
import BrokerageManagement from './components/pages/brokerage/BrokerageManagement'
import ScriptManagement from './components/pages/script/ScriptManagement'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/brokerage-management" element={<BrokerageManagement />} />
        <Route path="/script-management" element={<ScriptManagement />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
