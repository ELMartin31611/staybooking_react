import { ShieldCheck } from 'lucide-react'

export default function AdminPlaceholderPage() {
  return (
    <section className="rounded-2xl border bg-white p-8">
      <ShieldCheck className="size-10 text-primary" />

      <h1 className="mt-4 text-3xl font-bold">
        Dashboard administrativo
      </h1>

      <p className="mt-3 text-muted-foreground">
        Estructura provisional para el futuro panel protegido por rol ADMIN.
      </p>
    </section>
  )
}