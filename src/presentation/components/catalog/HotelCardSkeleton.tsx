import { Card, CardContent, CardFooter } from '@/presentation/components/ui/card'

export function HotelCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-3xl border border-border py-0 shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-muted" />

      <CardContent className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
      </CardContent>

      <CardFooter className="flex justify-end gap-3 border-t border-border bg-muted/25 p-5">
        <div className="h-9 w-14 animate-pulse rounded-xl bg-muted" />
        <div className="h-9 w-20 animate-pulse rounded-xl bg-muted" />
      </CardFooter>
    </Card>
  )
}
