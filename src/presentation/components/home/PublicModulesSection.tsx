import {
  BookOpen,
  CheckCircle2,
  Code2,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const modules = [
  {
    title: 'Cómo funciona',
    description:
      'Mira el flujo real de StayBooking: buscas fechas, comparas habitaciones disponibles y confirmas tu estancia con datos del servidor.',
    badge: 'App en acción',
    icon: BookOpen,
    image: '/staybooking-how-it-works.png',
    imageAlt: 'Persona usando la app StayBooking en el celular',
    to: '/sobre/como-funciona',
  },
  {
    title: 'Creadores',
    description:
      'Conoce a Martin Borja, Dayana Pisco y Eduardo Vega: estudiantes de cuarto semestre detrás de la experiencia completa.',
    badge: 'Equipo',
    icon: UsersRound,
    image: '/staybooking-team.png',
    imageAlt: 'Equipo de desarrollo colaborando frente a laptops',
    to: '/sobre/equipo',
  },
  {
    title: 'Tecnología',
    description:
      'Django, React + TypeScript y Flutter trabajando juntos: API real, web rápida y base lista para móvil.',
    badge: 'Tech stack',
    icon: Code2,
    image: '/staybooking-tech.png',
    imageAlt: 'Escritorio de programación con código y pantallas de app',
    to: '/sobre/tecnologia',
  },
]

export function PublicModulesSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 text-foreground">
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-violet-400/8 blur-3xl dark:bg-violet-500/12" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/8 blur-3xl dark:bg-primary/12" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Contenido público
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Historia, creadores y tecnología
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
            Tres miradas al proyecto: cómo se reserva, quién lo construyó y con qué stack corre de punta a punta.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {modules.map((module, index) => (
            <Link
              key={module.title}
              to={module.to}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8"
            >
              <div
                className={[
                  'h-1 w-full shrink-0',
                  index === 0
                    ? 'bg-gradient-to-r from-primary to-violet-500'
                    : index === 1
                      ? 'bg-gradient-to-r from-violet-500 to-fuchsia-400'
                      : 'bg-gradient-to-r from-fuchsia-400 to-primary',
                ].join(' ')}
              />

              <div className="relative h-52 overflow-hidden sm:h-56">
                <img
                  src={module.image}
                  alt={module.imageAlt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                <div className="absolute bottom-4 left-5 rounded-full border border-white/40 bg-white/85 px-3 py-1 text-xs font-bold text-foreground backdrop-blur dark:bg-card/85">
                  StayBooking
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary dark:bg-primary/12">
                  <module.icon className="size-3.5" />
                  {module.badge}
                </span>

                <h3 className="text-xl font-bold text-foreground">{module.title}</h3>

                <p className="flex-1 text-sm leading-7 text-muted-foreground">
                  {module.description}
                </p>

                <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <CheckCircle2 className="size-4" />
                  Conocer más
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
