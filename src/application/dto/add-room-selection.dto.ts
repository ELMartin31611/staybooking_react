export interface AddRoomSelectionDto {
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

  adults?: number
  children?: number
}