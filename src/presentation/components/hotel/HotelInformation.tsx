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
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Información del hotel
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
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
        <div className="mt-6 rounded-2xl border border-border bg-muted/50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Referencia de ubicación
          </p>

          <p className="mt-1.5 text-sm font-semibold text-muted-foreground leading-relaxed">
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
    <div className="rounded-2xl border border-border bg-muted/40 p-4 transition-colors hover:bg-muted/70">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-bold text-foreground">
        {value}
      </p>
    </div>
  )
}