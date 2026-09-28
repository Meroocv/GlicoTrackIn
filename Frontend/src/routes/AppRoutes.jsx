import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom"

import DashboardLayout from "../layouts/DashboardLayout"

import Dashboard from "../pages/Dashboard"
import Pacientes from "../pages/Pacientes"
import HistoricoPaciente from "../pages/HistoricoPaciente"
import DetalhesRegistro from "../pages/DetalhesRegistro"
import DetalhesPaciente from "../pages/DetalhesPaciente"
import NovoPaciente from "../pages/NovoPaciente"
import Login from "../pages/Login"
import GestaoAcessos from "../pages/GestaoAcessos"
import AlterarSenhaInicial from "../pages/AlterarSenhaInicial"


function RotaProtegida({ children }) {
  const navigate = useNavigate()
  useEffect(() => {
    const encerrarSessao = () => navigate("/login", { replace: true })
    window.addEventListener("sessao-invalida", encerrarSessao)
    return () => window.removeEventListener("sessao-invalida", encerrarSessao)
  }, [navigate])

  const token = localStorage.getItem("token")
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null")

  if (!token) {
    return <Navigate to="/login" replace />
  }
  if (usuario?.deve_alterar_senha) {
    return <Navigate to="/alterar-senha" replace />
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}


function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/alterar-senha"
          element={localStorage.getItem("token") ? (
            JSON.parse(localStorage.getItem("usuario") || "null")?.deve_alterar_senha
              ? <AlterarSenhaInicial />
              : <Navigate to="/dashboard" replace />
          ) : <Navigate to="/login" replace />}
        />


        {/* ÁREA PROTEGIDA */}

        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />

        <Route
          path="/pacientes"
          element={
            <RotaProtegida>
              <Pacientes />
            </RotaProtegida>
          }
        />

        <Route
          path="/admin/acessos"
          element={
            JSON.parse(localStorage.getItem("usuario") || "null")?.nivel_acesso === "administrador" ? (
              <RotaProtegida><GestaoAcessos /></RotaProtegida>
            ) : <Navigate to="/dashboard" replace />
          }
        />

        <Route
          path="/pacientes/novo"
          element={
            <RotaProtegida>
              <NovoPaciente />
            </RotaProtegida>
          }
        />

        <Route
          path="/pacientes/:id"
          element={
            <RotaProtegida>
              <DetalhesPaciente />
            </RotaProtegida>
          }
        />

        <Route
          path="/pacientes/:id/historico"
          element={
            <RotaProtegida>
              <HistoricoPaciente />
            </RotaProtegida>
          }
        />

        <Route
          path="/pacientes/:id/historico/:data"
          element={
            <RotaProtegida>
              <DetalhesRegistro />
            </RotaProtegida>
          }
        />


        {/* QUALQUER ROTA INEXISTENTE */}

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default AppRoutes

