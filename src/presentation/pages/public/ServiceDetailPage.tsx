import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { createRoomCatalogUseCase } from '@/infrastructure/factories/room-catalog.factory'
import { ErrorState, Loader } from '@/presentation/components/common'
import { Badge } from '@/presentation/components/ui/badge'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'

const roomCatalogUseCase = createRoomCatalogUseCase()

function formatPrice(value: string): string {
  const amount = Number(value)

  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Incluido sin costo adicional'
  }

  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export default function ServiceDetailPage() {
  const serviceId = Number(useParams().serviceId)
  const servicesQuery = useQuery({
    queryKey: ['catalog', 'services'],
    queryFn: () => roomCatalogUseCase.getServices(),
    staleTime: 60_000,
  })

  if (servicesQuery.isPending) {
    return <Loader message="Cargando servicio..." />
  }

  if (servicesQuery.isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ErrorState
          title="No pudimos cargar el servicio"
          message="Comprueba tu conexión e inténtalo nuevamente."
          onRetry={() => { void servicesQuery.refetch() }}
        />
      </div>
    )
  }

  const service = servicesQuery.data?.find(
    (item) => item.id === serviceId && item.is_active,
  )

  if (!service) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold">Servicio no encontrado</h1>
            <p className="mt-2 text-muted-foreground">
              El servicio no está disponible o ya no se encuentra activo.
            </p>
            <Button className="mt-5" variant="outline" asChild>
              <Link to="/hoteles">Ver hoteles</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const isIncluded = Number(service.precio_extra) <= 0

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
      <Button variant="ghost" asChild>
        <Link to="/hoteles">
          <ArrowLeft className="size-4" />
          Volver a hoteles
        </Link>
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge variant={isIncluded ? 'secondary' : 'outline'}>
                {isIncluded ? 'Incluido' : 'Servicio extra'}
              </Badge>
              <CardTitle className="mt-4 text-3xl">{service.nombre}</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                {service.tipo_servicio || 'Servicio para huéspedes'}
              </p>
            </div>
            <Sparkles className="size-10 text-primary" aria-hidden="true" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          <p className="leading-7 text-muted-foreground">
            {service.descripcion || 'Información disponible durante la reserva.'}
          </p>
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">Precio</p>
            <p className="mt-1 text-xl font-bold">
              {formatPrice(service.precio_extra)}
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-primary/5 p-4 text-sm">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
            <p>
              La compatibilidad y el total definitivo se validan en el
              servidor al seleccionar una habitación y crear la reserva.
            </p>
          </div>
          <Button asChild>
            <Link to="/reserva/seleccion">Elegir habitación y reservar</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
