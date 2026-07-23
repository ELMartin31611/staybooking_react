import type { RoomTypeService } from '@/domain/entities/room-type-service.entity'
import type { Service } from '@/domain/entities/service.entity'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/presentation/components/ui/badge'
import {
  Card,
  CardContent,
} from '@/presentation/components/ui/card'

interface ServiceListProps {
  roomTypeId: number
  services: Service[]
  roomTypeServices: RoomTypeService[]
}

export default function ServiceList({
  roomTypeId,
  services,
  roomTypeServices,
}: ServiceListProps) {
  const assignedServices = roomTypeServices
    .filter(
      (relation) =>
        relation.tipo_habitacion === roomTypeId,
    )
    .map((relation) => ({
      relation,
      service: services.find(
        (item) => item.id === relation.servicio,
      ),
    }))
    .filter(
      (
        item,
      ): item is {
        relation: RoomTypeService
        service: Service
      } => Boolean(item.service),
    )

  if (assignedServices.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay servicios registrados para este tipo de
        habitación.
      </p>
    )
  }

  return (
    <section className="space-y-4">
      <div>
      <h3 className="text-xl font-semibold">
        Servicios de esta habitación
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Beneficios incluidos y extras compatibles con tu estancia.
      </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {assignedServices.map(
          ({ relation, service }) => {
            const price =
              relation.precio_personalizado ||
              service.precio_extra

            return (
              <Card key={relation.id} className="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {service.imagen_url ? (
                        <img
                          src={service.imagen_url}
                          alt={service.nombre}
                          className="size-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className={`flex size-10 items-center justify-center rounded-xl ${
                          relation.incluido
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {relation.incluido
                            ? <CheckCircle2 className="size-5" />
                            : <Sparkles className="size-5" />}
                        </div>
                      )}
                      <p className="font-medium">{service.nombre}</p>
                    </div>

                    <Badge
                      variant={
                        relation.incluido
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {relation.incluido
                        ? 'Incluido'
                        : `$${Number(price).toFixed(2)}`}
                    </Badge>
                  </div>

                  {service.descripcion && (
                    <p className="text-sm text-muted-foreground">
                      {service.descripcion}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 pt-1 text-sm font-semibold">
                    <Link
                      to={`/servicios/${service.id}`}
                      className="text-primary hover:underline"
                    >
                      Ver servicio
                    </Link>
                    {!relation.incluido && (
                      <Link
                        to="/reserva/seleccion"
                        className="text-foreground hover:text-primary"
                      >
                        Agregar al reservar
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          },
        )}
      </div>
    </section>
  )
}