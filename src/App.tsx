// import { Button } from "@/components/ui/button"
 
// function App() {
//   return (
//     <div className="flex min-h-svh flex-col items-center justify-center">
//       <Button>Click me</Button>
//     </div>
//   )
// }
 
// export default App


import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Home from './pages/Home'
// import About from './pages/About'
import Dashboard from './components/pages/dashboard/Dashboard'
import BrokerageManagement from './components/pages/brokerage/BrokerageManagement'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/brokerage-management" element={<BrokerageManagement />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
