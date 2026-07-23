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
    <section className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="size-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated icon container */}
        <div className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400/20 to-orange-500/10 shadow-xl shadow-amber-500/10 border border-amber-200/40">
          <Construction className="size-10 text-amber-500" />
        </div>

        {/* Coming soon badge */}
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-400">
          🚧 Próximamente
        </span>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>

        <p className="mt-4 max-w-md text-base font-medium text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Decorative dots */}
        <div className="mt-8 flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
          <span className="size-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
          <span className="size-2 rounded-full bg-primary/30 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </section>
  )
}