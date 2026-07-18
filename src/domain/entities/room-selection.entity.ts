export interface RoomSelection {
  roomId: number
  hotelId: number
  roomTypeId: number
  roomNumber: string
  roomTypeName: string
  pricePerNight: number
  quantity: number
  imageUrl: string | null
}

export interface BookingCartSummary {
  totalRooms: number
  subtotal: number
}