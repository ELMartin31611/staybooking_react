import { Construction } from 'lucide-react'

interface ComingSoonPageProps {
  title: string
  description: string
}

export default function ComingSoonPage({
  title,
  description,
}: ComingSoonPageProps) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="size-7" />
      </div>

      <h1 className="mt-5 text-3xl font-bold">{title}</h1>

      <p className="mt-3 text-muted-foreground">{description}</p>
    </section>
  )
}