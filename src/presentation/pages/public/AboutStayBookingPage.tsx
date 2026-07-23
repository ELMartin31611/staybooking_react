import {
  ArrowLeft,
  Blocks,
  Code2,
  Database,
  Globe2,
  Layers3,
  ShieldCheck,
  Smartphone,
  UsersRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/presentation/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card'

const pages = {
  'como-funciona': {
    eyebrow: 'Módulos públicos',
    title: 'Cómo funciona StayBooking',
    description:
      'Una experiencia de reserva clara: eliges fechas, comparas habitaciones reales, personalizas tu estancia y recibes una confirmación respaldada por el servidor.',
    icon: Blocks,
    heroImage: '/staybooking-how-it-works.png',
    heroAlt: 'Persona reservando hoteles desde la app StayBooking',
  },
  equipo: {
    eyebrow: 'Proyecto final',
    title: 'El equipo detrás de StayBooking',
    description:
      'Somos estudiantes de cuarto semestre de Desarrollo de Software construyendo una experiencia de hospedaje completa, visual y confiable.',
    icon: UsersRound,
    heroImage: '/staybooking-team.png',
    heroAlt: 'Equipo de desarrolladores trabajando juntos',
  },
  tecnologia: {
    eyebrow: 'Arquitectura',
    title: 'Tecnología pensada para reservar mejor',
    description:
      'Un ecosistema web y móvil que prioriza contratos claros, datos reales y una interfaz rápida para viajeros y administración.',
    icon: Code2,
    heroImage: '/staybooking-tech.png',
    heroAlt: 'Estación de trabajo con código React y pantallas de app',
  },
} as const

const workflow: Array<{
  title: string
  description: string
  icon: LucideIcon
  image: string
}> = [
  {
    title: 'Busca',
    description:
      'Indica las fechas y el hotel. StayBooking consulta disponibilidad real para evitar reservas de habitaciones ocupadas.',
    icon: Globe2,
    image: '/staybooking-how-it-works.png',
  },
  {
    title: 'Elige',
    description:
      'Compara habitaciones, capacidad, servicios incluidos y extras compatibles antes de añadirlas a tu selección.',
    icon: Layers3,
    image: '/staybooking-home-story.png',
  },
  {
    title: 'Confirma',
    description:
      'Registra a los huéspedes y revisa el resumen. El servidor valida precios, fechas, tarifas y disponibilidad.',
    icon: ShieldCheck,
    image: '/staybooking-home-technology.png',
  },
  {
    title: 'Disfruta',
    description:
      'Procesa el pago académico, consulta tu factura y revisa el detalle completo de tu estancia cuando quieras.',
    icon: Blocks,
    image: '/staybooking-about-hotel-bg.png',
  },
]

const technologies: Array<{
  title: string
  detail: string
  icon: LucideIcon
  image: string
}> = [
  {
    title: 'Django REST Framework',
    detail:
      'Backend y API segura. Gestiona autenticación, disponibilidad, tarifas, reservas, pagos, facturas y archivos multimedia.',
    icon: Database,
    image: '/staybooking-tech.png',
  },
  {
    title: 'React + TypeScript',
    detail:
      'Experiencia web responsive. Presenta hoteles, reservas y administración con datos reales y componentes reutilizables.',
    icon: Code2,
    image: '/staybooking-how-it-works.png',
  },
  {
    title: 'Flutter',
    detail:
      'Experiencia móvil. La arquitectura permite extender el mismo contrato de API a una aplicación para huéspedes y administración.',
    icon: Smartphone,
    image: '/staybooking-home-technology.png',
  },
]

const team = [
  {
    name: 'Martin Borja',
    role: 'Líder de proyecto · Full stack (backend, frontend y móvil)',
    detail:
      'Lideró la visión del producto, la arquitectura y la integración de punta a punta. Impulsó backend con Django, frontend con React, la experiencia móvil con Flutter, el despliegue y la unión de todos los módulos para que StayBooking se sienta como una app real.',
    image: '/staybooking-team.png',
    imagePosition: 'object-[20%_30%]',
  },
  {
    name: 'Dayana Pisco',
    role: 'Desarrollo de software · Frontend y backend',
    detail:
      'Trabajó pantallas, componentes y flujos de usuario conectados a la API. Aportó claridad visual y usabilidad para que buscar, comparar y reservar se sienta natural en cada paso.',
    image: '/staybooking-home-team.png',
    imagePosition: 'object-[55%_35%]',
  },
  {
    name: 'Eduardo Vega',
    role: 'Desarrollo de software · Backend, frontend y móvil',
    detail:
      'Fortaleció servicios, integración técnica y calidad del código. Participó en la evolución de las experiencias web y móvil para mantener coherencia entre capas del sistema.',
    image: '/staybooking-team.png',
    imagePosition: 'object-[75%_40%]',
  },
]

export default function AboutStayBookingPage() {
  const section = useParams().section as keyof typeof pages
  const page = pages[section] ?? pages['como-funciona']
  const Icon = page.icon

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <Button variant="ghost" asChild>
        <Link to="/">
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Link>
      </Button>

      <header className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-card shadow-sm">
        <div className="relative h-52 overflow-hidden sm:h-64 lg:h-72">
          <img
            src={page.heroImage}
            alt={page.heroAlt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/55 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-card/90 via-card/40 to-transparent" />
        </div>

        <div className="relative -mt-24 space-y-4 px-6 pb-8 sm:-mt-28 sm:px-10 sm:pb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {page.eyebrow}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary shadow-sm backdrop-blur sm:size-16">
              <Icon className="size-7 sm:size-8" />
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              {page.title}
            </h1>
          </div>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            {page.description}
          </p>
        </div>
      </header>

      {section === 'como-funciona' && (
        <section className="grid gap-5 md:grid-cols-2">
          {workflow.map(({ title, description, icon: StepIcon, image }, index) => (
            <Card key={title} className="overflow-hidden border-border/80">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  0{index + 1}
                </span>
              </div>
              <CardContent className="p-5">
                <StepIcon className="size-6 text-primary" />
                <h2 className="mt-3 text-xl font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {section === 'equipo' && (
        <section className="grid gap-5 md:grid-cols-3">
          {team.map((member) => (
            <Card key={member.name} className="overflow-hidden border-border/80">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className={`h-full w-full object-cover ${member.imagePosition}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/10" />
              </div>
              <CardContent className="relative p-6">
                <div className="-mt-12 mb-3 flex size-14 items-center justify-center rounded-3xl border-4 border-card bg-primary text-primary-foreground shadow-md">
                  <UsersRound className="size-6" />
                </div>
                <h2 className="text-xl font-bold">{member.name}</h2>
                <p className="mt-1 text-sm font-semibold text-primary">{member.role}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{member.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {section === 'tecnologia' && (
        <section className="grid gap-5 md:grid-cols-3">
          {technologies.map(({ title, detail, icon: TechIcon, image }) => (
            <Card key={title} className="overflow-hidden border-border/80">
              <div className="relative h-40 overflow-hidden">
                <img src={image} alt={title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>
              <CardHeader>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <TechIcon className="size-6" />
                </div>
                <CardTitle className="mt-4">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  )
}
