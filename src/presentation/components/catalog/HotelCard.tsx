import type { HotelPreview } from '@/domain/entities/hotel-preview.entity'
import { HotelPreviewCard } from '@/presentation/components/home/HotelPreviewCard'

interface HotelCardProps {
  hotel: HotelPreview
  onViewHotel: (hotel: HotelPreview) => void
  onReserve: (hotel: HotelPreview) => void
}

export function HotelCard({
  hotel,
  onViewHotel,
  onReserve,
}: HotelCardProps) {
  return (
    <HotelPreviewCard
      hotel={hotel}
      onViewHotel={onViewHotel}
      onReserve={onReserve}
    />
  )
}
