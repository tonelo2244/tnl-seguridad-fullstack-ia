import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import HomePage from "../pages/HomePage"
import IncidenciasPage from "../pages/IncidenciasPage"
import HistorialPage from "../pages/HistorialPage"
import PortalEmpleadoPage from "../pages/PortalEmpleadoPage"
import EntradaPage from "../pages/EntradaPage"
import SalidaPage from "../pages/SalidaPage"
import ParteDiarioPage from "../pages/ParteDiarioPage"
import RutaProtegida from "../router/RutaProtegida"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/inicio"
          element={
            <RutaProtegida>
              <HomePage />
            </RutaProtegida>
          }
        />

        <Route
          path="/incidencias"
          element={
            <RutaProtegida>
              <IncidenciasPage />
            </RutaProtegida>
          }
        />

        <Route
          path="/historial"
          element={
            <RutaProtegida>
              <HistorialPage />
            </RutaProtegida>
          }
        />

        <Route
          path="/portal-empleado"
          element={
            <RutaProtegida>
              <PortalEmpleadoPage />
            </RutaProtegida>
          }
        />

        <Route
          path="/entrada"
          element={
            <RutaProtegida>
              <EntradaPage />
            </RutaProtegida>
          }
        />

        <Route
          path="/salida"
          element={
            <RutaProtegida>
              <SalidaPage />
            </RutaProtegida>
          }
        />

        <Route
          path="/parte-diario"
          element={
            <RutaProtegida>
              <ParteDiarioPage />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter