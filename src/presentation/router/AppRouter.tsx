import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { localUserStorage } from '@/infrastructure/storage/local-user-storage'
import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import {
  AdminLayout,
  PrivateLayout,
  PublicLayout,
} from '@/presentation/components/layout'
import AdminPlaceholderPage from '@/presentation/pages/admin/AdminPlaceholderPage'
import LoginPage from '@/presentation/pages/auth/LoginPage'
import RegisterPage from '@/presentation/pages/auth/RegisterPage'
import ForbiddenPage from '@/presentation/pages/ForbiddenPage'
import NotFoundPage from '@/presentation/pages/NotFoundPage'
import PrivatePlaceholderPage from '@/presentation/pages/profile/PrivatePlaceholderPage'
import HotelsCatalogPage from '@/presentation/pages/catalog/HotelsCatalogPage'
import ProfilePage from '@/presentation/pages/profile/ProfilePage'
import MyReservationsPage from '@/presentation/pages/reservations/MyReservationsPage'
import SelectedReservationPage from '@/presentation/pages/reservations/SelectedReservationPage'
import ComingSoonPage from '@/presentation/pages/public/ComingSoonPage'
import HomePage from '@/presentation/pages/public/HomePage'


import ProtectedRoute from './ProtectedRoute'

export default function AppRouter() {
  const isAuthenticated = localTokenStorage.hasTokens()
  const userRole = localUserStorage.getUser()?.rol ?? null

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />

          <Route
            path="hoteles"
            element={<HotelsCatalogPage />}
          />

          <Route
            path="hoteles/:hotelId"
            element={
              <ComingSoonPage
                title="Detalle del hotel"
                description="El detalle, tipos y habitaciones serán desarrollados por el Integrante 2."
              />
            }
          />

          <Route
            path="servicios"
            element={
              <ComingSoonPage
                title="Servicios"
                description="Los servicios incluidos se mostrarán con el detalle de las habitaciones."
              />
            }
          />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/403" element={<ForbiddenPage />} />

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
            />
          }
        >
          <Route element={<PrivateLayout />}>
            <Route
              path="/perfil"
              element={<ProfilePage />}
            />

            <Route
              path="/mis-reservas"
              element={<MyReservationsPage />}
            />

            <Route
              path="/reserva/seleccion"
              element={<SelectedReservationPage />}
            />
          </Route>
        </Route>

        <Route
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              allowedRoles={['ADMIN']}
            />
          }
        >
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPlaceholderPage />} />

            <Route
              path="*"
              element={
                <ComingSoonPage
                  title="Módulo administrativo"
                  description="Este CRUD será implementado en una rama posterior."
                />
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}