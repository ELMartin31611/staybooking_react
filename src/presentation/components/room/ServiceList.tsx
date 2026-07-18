import type { RoomTypeService } from '@/domain/entities/room-type-service.entity'
import type { Service } from '@/domain/entities/service.entity'
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
    <div className="space-y-3">
      <h3 className="font-semibold">
        Servicios disponibles
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {assignedServices.map(
          ({ relation, service }) => {
            const price =
              relation.precio_personalizado ||
              service.precio_extra

            return (
              <Card key={relation.id}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium">
                      {service.nombre}
                    </p>

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
                </CardContent>
              </Card>
            )
          },
        )}
      </div>
    </div>
  )
}