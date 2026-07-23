import { CheckCircle2, Hotel, Layers3, Route } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BackendConnectionStatus } from '@/presentation/components/common'
import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'

const completedItems = [
  {
    title: 'Arquitectura limpia',
    description: 'Domain, Application, Infrastructure y Presentation.',
    icon: Layers3,
  },
  {
    title: 'Navegación preparada',
    description: 'Layouts públicos, privados y administrativos.',
    icon: Route,
  },
  {
    title: 'Tema StayBooking',
    description: 'Tailwind y shadcn configurados con el color principal.',
    icon: Hotel,
  },
]

export default function WelcomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <CheckCircle2 className="size-4" />
          Estructura base preparada
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Bienvenido a{' '}
          <span className="text-primary">StayBooking</span>
        </h1>

        <p className="mt-5 text-lg text-muted-foreground">
          Esta es la pantalla provisional del esqueleto. El Home con hoteles
          reales se construirá en la rama FE-00-HOME-BASE.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/hoteles">Ver sección de hoteles</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link to="/login">Ir al login provisional</Link>
          </Button>
        </div>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {completedItems.map((item) => {
          const Icon = item.icon

          return (
            <Card key={item.title}>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>

                <CardTitle>{item.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div className="mt-10">
        <BackendConnectionStatus />
      </div>
    </section>
  )
}