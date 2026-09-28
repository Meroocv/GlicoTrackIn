import { BrowserRouter, Routes, Route } from "react-router-dom"

import DashboardLayout from "../layouts/DashboardLayout"
import Dashboard from "../pages/Dashboard"
import Pacientes from "../pages/Pacientes"
import HistoricoPaciente from "../pages/HistoricoPaciente"
import DetalhesRegistro from "../pages/DetalhesRegistro"
import DetalhesPaciente from "../pages/DetalhesPaciente"
import NovoPaciente from "../pages/NovoPaciente"

function AppRoutes() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/pacientes/:id/historico" element={<HistoricoPaciente />}/>
          <Route path="/pacientes/:id/historico/:data" element={<DetalhesRegistro />}/>
          <Route path="/pacientes/:id" element={<DetalhesPaciente />}/>
          <Route path="/pacientes/novo" element={<NovoPaciente />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  )
}

export default AppRoutes