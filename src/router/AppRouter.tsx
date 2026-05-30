import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import DashboardPage from "../pages/DashboardPage"
import IncidenciasPage from "../pages/IncidenciasPage"
import HistorialPage from "../pages/HistorialPage"
import PortalEmpleadoPage from "../pages/PortalEmpleadoPage"
import EntradaPage from "../pages/EntradaPage"
import SalidaPage from "../pages/SalidaPage"
import ParteDiarioPage from "../pages/ParteDiarioPage"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/inicio" element={<DashboardPage />} />
        <Route path="/incidencias" element={<IncidenciasPage />} />
        <Route path="/historial" element={<HistorialPage />} />
        <Route path="/portal-empleado" element={<PortalEmpleadoPage />} />
        <Route path="/entrada" element={<EntradaPage />} />
        <Route path="/salida" element={<SalidaPage />} />
        <Route path="/parte-diario" element={<ParteDiarioPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter