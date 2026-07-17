import { BrowserRouter, Route, Routes } from 'react-router-dom'

import {
  AdminLayout,
  PrivateLayout,
  PublicLayout,
} from '@/presentation/components/layout'
import AdminPlaceholderPage from '@/presentation/pages/admin/AdminPlaceholderPage'
import LoginPlaceholderPage from '@/presentation/pages/auth/LoginPlaceholderPage'
import ForbiddenPage from '@/presentation/pages/ForbiddenPage'
import NotFoundPage from '@/presentation/pages/NotFoundPage'
import PrivatePlaceholderPage from '@/presentation/pages/profile/PrivatePlaceholderPage'
import ComingSoonPage from '@/presentation/pages/public/ComingSoonPage'
import WelcomePage from '@/presentation/pages/public/WelcomePage'

import ProtectedRoute from './ProtectedRoute'

export default function AppRouter() {
  const isAuthenticated = false
  const userRole: string | null = null

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<WelcomePage />} />

          <Route
            path="hoteles"
            element={
              <ComingSoonPage
                title="Catálogo de hoteles"
                description="El catálogo real será implementado en su rama correspondiente."
              />
            }
          />

          <Route
            path="servicios"
            element={
              <ComingSoonPage
                title="Servicios"
                description="Los servicios de habitaciones estarán disponibles próximamente."
              />
            }
          />
        </Route>

        <Route path="/login" element={<LoginPlaceholderPage />} />
        <Route path="/403" element={<ForbiddenPage />} />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<PrivateLayout />}>
            <Route
              path="/perfil"
              element={<PrivatePlaceholderPage />}
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