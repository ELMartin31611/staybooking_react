export interface AddRoomSelectionDto {
  roomId: number
  hotelId: number
  roomTypeId: number
  roomNumber: string
  roomTypeName: string
  pricePerNight: number
  imageUrl: string | null
  quantity?: number
}