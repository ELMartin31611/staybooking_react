import { env } from './env'

export const apiConfig = {
  baseURL: env.apiBaseUrl,
  timeout: 15_000,

  endpoints: {
    auth: {
      login: 'login/',
      register: 'register/',
      refresh: 'token/refresh/',
      profile: 'perfil/',
    },

    customers: {
      profiles: 'perfiles/',
      customers: 'clientes/',
      addresses: 'direcciones/',
      documents: 'documentos/',
    },

    catalog: {
      hotels: 'hoteles/',
      hotelAddresses: 'direcciones-hotel/',
      roomTypes: 'tipos-habitacion/',
      rooms: 'habitaciones/',
      beds: 'camas/',
      roomTypeBeds: 'tipos-habitacion-camas/',
      images: 'imagenes-habitacion/',
      services: 'servicios/',
      roomTypeServices: 'tipos-habitacion-servicios/',
    },

    rates: {
      seasons: 'temporadas/',
      roomRates: 'tarifas-habitacion/',
    },

    reservations: {
      reservations: 'reservas/',
      rooms: 'reserva-habitaciones/',
      guests: 'huespedes-reserva/',
    },

    billing: {
      payments: 'pagos/',
      invoices: 'facturas/',
    },

    system: {
      health: 'health/',
      notifications: 'notificaciones-sistema/',
    },
  },
} as const