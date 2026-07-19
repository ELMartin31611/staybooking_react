import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import {
  AdminLayout,
  PrivateLayout,
  PublicLayout,
} from '@/presentation/components/layout'
import AdminPlaceholderPage from '@/presentation/pages/admin/AdminPlaceholderPage'
import LoginPage from '@/presentation/pages/auth/LoginPage'
import RegisterPage from '@/presentation/pages/auth/RegisterPage'
import HotelDetailPage from '@/presentation/pages/catalog/HotelDetailPage'
import HotelsCatalogPage from '@/presentation/pages/catalog/HotelsCatalogPage'
import RoomDetailPage from '@/presentation/pages/catalog/RoomDetailPage'
import ForbiddenPage from '@/presentation/pages/ForbiddenPage'
import NotFoundPage from '@/presentation/pages/NotFoundPage'
import ProfilePage from '@/presentation/pages/profile/ProfilePage'
import ComingSoonPage from '@/presentation/pages/public/ComingSoonPage'
import HomePage from '@/presentation/pages/public/HomePage'
import MyReservationsPage from '@/presentation/pages/reservations/MyReservationsPage'
import SelectedReservationPage from '@/presentation/pages/reservations/SelectedReservationPage'

import ProtectedRoute from './ProtectedRoute'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route
            index
            element={<HomePage />}
          />

          <Route
            path="hoteles"
            element={<HotelsCatalogPage />}
          />

          <Route
            path="hoteles/:hotelId"
            element={<HotelDetailPage />}
          />

          <Route
            path="habitaciones/:roomId"
            element={<RoomDetailPage />}
          />

          <Route
            path="servicios"
            element={
              <ComingSoonPage
                title="Servicios"
                description="Consulta los servicios incluidos en nuestros hoteles y habitaciones."
              />
            }
          />
        </Route>

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/403"
          element={<ForbiddenPage />}
        />

        <Route element={<ProtectedRoute />}>
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
              allowedRoles={['ADMIN']}
            />
          }
        >
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={<AdminPlaceholderPage />}
            />

            <Route
              path="*"
              element={
                <ComingSoonPage
                  title="Módulo administrativo"
                  description="Esta sección está disponible únicamente para administradores."
                />
              }
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}