import { Navigate, Outlet, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  isAuthenticated: boolean
  userRole?: string | null
  allowedRoles?: readonly string[]
}

export default function ProtectedRoute({
  isAuthenticated,
  userRole = null,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation()

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}${location.hash}`

    return (
      <Navigate
        to="/login"
        state={{ from }}
        replace
      />
    )
  }

  if (
    allowedRoles &&
    (!userRole || !allowedRoles.includes(userRole))
  ) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}