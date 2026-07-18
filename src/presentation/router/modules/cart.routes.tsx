import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const SelectedRoomsPage = lazy(
  () =>
    import(
      '@/presentation/pages/reservations/SelectedRoomsPage'
    ),
)

export const cartRoutes: RouteObject[] = [
  {
    path: '/reserva/seleccion',
    element: <SelectedRoomsPage />,
  },
]