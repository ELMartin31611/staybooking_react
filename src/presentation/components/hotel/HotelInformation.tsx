import type { HotelAddress } from '@/domain/entities/hotel-address.entity'
import type { HotelDetail } from '@/domain/entities/hotel-detail.entity'

interface HotelInformationProps {
  hotel: HotelDetail
  address: HotelAddress | null
}

export default function HotelInformation({
  hotel,
  address,
}: HotelInformationProps) {
  const locationParts = address
    ? [
        address.direccion,
        address.ciudad,
        address.provincia,
        address.pais,
      ].filter(Boolean)
    : []

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">
        Información del hotel
      </h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <InformationItem
          label="Dirección"
          value={
            locationParts.length > 0
              ? locationParts.join(', ')
              : 'Dirección no disponible'
          }
        />

        <InformationItem
          label="Código postal"
          value={address?.codigo_postal || 'No disponible'}
        />

        <InformationItem
          label="Teléfono"
          value={hotel.telefono || 'No disponible'}
        />

        <InformationItem
          label="Correo electrónico"
          value={hotel.email || 'No disponible'}
        />

        <InformationItem
          label="Sitio web"
          value={hotel.sitio_web || 'No disponible'}
        />

        <InformationItem
          label="Mascotas"
          value={
            hotel.permite_mascotas
              ? 'Permitidas'
              : 'No permitidas'
          }
        />
      </div>

      {address?.referencia && (
        <div className="mt-5 rounded-xl bg-muted p-4">
          <p className="text-sm font-medium">
            Referencia
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {address.referencia}
          </p>
        </div>
      )}
    </section>
  )
}

interface InformationItemProps {
  label: string
  value: string
}

function InformationItem({
  label,
  value,
}: InformationItemProps) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-words font-medium">
        {value}
      </p>
    </div>
  )
}