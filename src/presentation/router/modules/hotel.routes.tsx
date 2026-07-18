import type { RouteObject } from 'react-router-dom'

import HotelDetailPage from '@/presentation/pages/catalog/HotelDetailPage'

export const hotelRoutes: RouteObject[] = [
  {
    path: 'hoteles/:hotelId',
    element: <HotelDetailPage />,
  },
]