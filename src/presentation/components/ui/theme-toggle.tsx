import { useEffect, useState } from 'react'
import { Moon, SunMedium } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/presentation/components/ui/button'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-xl border border-border bg-card/80 text-foreground shadow-sm transition-all duration-200 hover:bg-accent hover:border-primary/40"
        aria-label="Cambiar tema"
      >
        <SunMedium className="size-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-xl border border-border bg-card/80 text-foreground shadow-sm transition-all duration-200 hover:bg-accent hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/40"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {isDark ? <SunMedium className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
