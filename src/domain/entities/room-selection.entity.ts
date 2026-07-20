export interface RoomSelection {
  roomId: number
  hotelId: number
  roomTypeId: number
  roomNumber: string
  roomTypeName: string

  referencePricePerNight: number | null
  currency: string
  imageUrl: string | null

  includedGuestCapacity: number
  extraGuestCapacity: number

  maxAdults: number
  maxChildren: number
  maxGuests: number

  adults: number
  children: number
}

export interface BookingCartSummary {
  totalRooms: number
  totalAdults: number
  totalChildren: number
  totalExtraGuests: number
  referencePricePerNight: number
}