import { Card, CardContent, CardFooter } from '@/presentation/components/ui/card'

export function HotelCardSkeleton() {
  return (
    <Card className="overflow-hidden py-0">
      <div className="aspect-[16/10] animate-pulse bg-muted" />

      <CardContent className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-3 border-t p-5">
        <div className="h-9 animate-pulse rounded-md bg-muted" />
        <div className="h-9 animate-pulse rounded-md bg-muted" />
      </CardFooter>
    </Card>
  )
}
