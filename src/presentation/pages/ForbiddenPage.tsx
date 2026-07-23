import { ShieldX } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/presentation/components/ui/button'

export default function ForbiddenPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background blobs */}
      <div className="absolute -top-32 left-1/2 size-[500px] -translate-x-1/2 rounded-full bg-rose-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 size-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Error code */}
        <p className="text-[7rem] font-black leading-none tracking-tighter bg-gradient-to-br from-rose-700 via-rose-500 to-rose-300 bg-clip-text text-transparent select-none">
          403
        </p>

        {/* Icon */}
        <div className="mt-4 flex size-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 shadow-lg shadow-rose-500/10 dark:bg-rose-950/30">
          <ShieldX className="size-8" />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Acceso denegado
        </h1>

        <p className="mt-3 max-w-md text-base font-medium text-muted-foreground">
          No tienes el rol necesario para entrar a esta sección.
          Si crees que esto es un error, contacta al administrador.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="rounded-xl bg-gradient-to-r from-primary to-[#d70466] hover:opacity-90 font-bold h-11 px-6 text-white shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <Link to="/">← Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}