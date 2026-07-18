import type { RouteObject } from 'react-router-dom'

import HotelsCatalogPage from '@/presentation/pages/catalog/HotelsCatalogPage'

export const catalogRoutes: RouteObject[] = [
  {
    path: 'hoteles',
    element: <HotelsCatalogPage />,
  },
]
