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

export interface BookingServiceSelection {
  serviceId: number
  roomTypeIds: number[]
  name: string
  description: string
  imageUrl: string | null
  unitPrice: number
  currency: string
  quantity: number
}

export interface BookingCartSummary {
  totalRooms: number
  totalAdults: number
  totalChildren: number
  totalExtraGuests: number
  referencePricePerNight: number
  referenceServicesSubtotal: number
}