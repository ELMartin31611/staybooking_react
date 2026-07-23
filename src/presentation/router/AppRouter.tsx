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
import AdminBillingPage from '@/presentation/pages/admin/AdminBillingPage'
import AdminDashboardPage from '@/presentation/pages/admin/AdminDashboardPage'
import AdminHotelAddressesPage from '@/presentation/pages/admin/AdminHotelAddressesPage'
import AdminHotelsPage from '@/presentation/pages/admin/AdminHotelsPage'
import AdminRatesPage from '@/presentation/pages/admin/AdminRatesPage'
import AdminReservationsPage from '@/presentation/pages/admin/AdminReservationsPage'
import AdminRoomsPage from '@/presentation/pages/admin/AdminRoomsPage'
import AdminRoomTypesPage from '@/presentation/pages/admin/AdminRoomTypesPage'
import AdminServicesPage from '@/presentation/pages/admin/AdminServicesPage'
import LoginPage from '@/presentation/pages/auth/LoginPage'
import RegisterPage from '@/presentation/pages/auth/RegisterPage'
import HotelDetailPage from '@/presentation/pages/catalog/HotelDetailPage'
import HotelsCatalogPage from '@/presentation/pages/catalog/HotelsCatalogPage'
import RoomDetailPage from '@/presentation/pages/catalog/RoomDetailPage'
import ForbiddenPage from '@/presentation/pages/ForbiddenPage'
import NotFoundPage from '@/presentation/pages/NotFoundPage'
import InvoicePage from '@/presentation/pages/payments/InvoicePage'
import PaymentPage from '@/presentation/pages/payments/PaymentPage'
import ProfilePage from '@/presentation/pages/profile/ProfilePage'
import ComingSoonPage from '@/presentation/pages/public/ComingSoonPage'
import AboutStayBookingPage from '@/presentation/pages/public/AboutStayBookingPage'
import HomePage from '@/presentation/pages/public/HomePage'
import ServiceDetailPage from '@/presentation/pages/public/ServiceDetailPage'
import ServicesPage from '@/presentation/pages/public/ServicesPage'
import MyReservationsPage from '@/presentation/pages/reservations/MyReservationsPage'
import ReservationDetailPage from '@/presentation/pages/reservations/ReservationDetailPage'
import ReservationGuestsPage from '@/presentation/pages/reservations/ReservationGuestsPage'
import SelectedRoomsPage from '@/presentation/pages/reservations/SelectedRoomsPage'

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
            element={<ServicesPage />}
          />

          <Route
            path="servicios/:serviceId"
            element={<ServiceDetailPage />}
          />

          <Route
            path="sobre/:section"
            element={<AboutStayBookingPage />}
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
              path="/mis-reservas/:reservationId"
              element={
                <ReservationDetailPage />
              }
            />

            <Route
              path="/mis-reservas/:reservationId/pagar"
              element={<PaymentPage />}
            />

            <Route
              path="/facturas/:invoiceId"
              element={<InvoicePage />}
            />

            <Route
              path="/reserva/seleccion"
              element={<SelectedRoomsPage />}
            />

            <Route
              path="/reserva/huespedes"
              element={
                <ReservationGuestsPage />
              }
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
              element={
                <AdminDashboardPage />
              }
            />

            <Route
              path="hoteles"
              element={<AdminHotelsPage />}
            />

            <Route
              path="direcciones-hotel"
              element={
                <AdminHotelAddressesPage />
              }
            />

            <Route
              path="tipos-habitacion"
              element={
                <AdminRoomTypesPage />
              }
            />

            <Route
              path="habitaciones"
              element={<AdminRoomsPage />}
            />

            <Route
              path="servicios"
              element={<AdminServicesPage />}
            />

            <Route
              path="tarifas"
              element={<AdminRatesPage />}
            />

            <Route
              path="reservas"
              element={
                <AdminReservationsPage />
              }
            />

            <Route
              path="cobros"
              element={<AdminBillingPage />}
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
