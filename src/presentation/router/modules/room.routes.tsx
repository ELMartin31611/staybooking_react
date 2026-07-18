import type { RouteObject } from 'react-router-dom'

import RoomDetailPage from '@/presentation/pages/catalog/RoomDetailPage'

export const roomRoutes: RouteObject[] = [
  {
    path: 'habitaciones/:roomId',
    element: <RoomDetailPage />,
  },
]