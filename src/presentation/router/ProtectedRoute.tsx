import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

import { localTokenStorage } from '@/infrastructure/storage/local-token-storage'
import { localUserStorage } from '@/infrastructure/storage/local-user-storage'

interface ProtectedRouteProps {
  allowedRoles?: readonly string[]
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation()

  /*
   * La sesión se consulta cada vez que React Router
   * evalúa una ruta protegida.
   *
   * Esto permite reconocer inmediatamente los tokens
   * guardados después del login.
   */
  const isAuthenticated =
    localTokenStorage.hasTokens()

  const userRole =
    localUserStorage.getUser()?.rol ?? null

  if (!isAuthenticated) {
    const from = [
      location.pathname,
      location.search,
      location.hash,
    ].join('')

    return (
      <Navigate
        to="/login"
        state={{ from }}
        replace
      />
    )
  }

  if (
    allowedRoles
    && (
      !userRole
      || !allowedRoles.includes(userRole)
    )
  ) {
    return (
      <Navigate
        to="/403"
        replace
      />
    )
  }

  return <Outlet />
}