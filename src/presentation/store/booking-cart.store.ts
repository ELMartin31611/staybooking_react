import { create } from 'zustand'

import type { AddRoomSelectionDto } from '@/application/dto/add-room-selection.dto'
import { RoomSelectionUseCase } from '@/application/use-cases/room-selection.use-case'
import type {
  BookingCartSummary,
  RoomSelection,
} from '@/domain/entities/room-selection.entity'

interface BookingCartState {
  selections: RoomSelection[]
  summary: BookingCartSummary

  addSelection: (selection: AddRoomSelectionDto) => void
  removeSelection: (roomId: number) => void
  updateQuantity: (roomId: number, quantity: number) => void
  clearCart: () => void
}

const roomSelectionUseCase = new RoomSelectionUseCase()

const emptySummary: BookingCartSummary = {
  totalRooms: 0,
  subtotal: 0,
}

export const useBookingCartStore = create<BookingCartState>(
  (set) => ({
    selections: [],
    summary: emptySummary,

    addSelection: (selection) => {
      set((state) => {
        const selections = roomSelectionUseCase.add(
          state.selections,
          selection,
        )

        return {
          selections,
          summary: roomSelectionUseCase.summary(selections),
        }
      })
    },

    removeSelection: (roomId) => {
      set((state) => {
        const selections = roomSelectionUseCase.remove(
          state.selections,
          roomId,
        )

        return {
          selections,
          summary: roomSelectionUseCase.summary(selections),
        }
      })
    },

    updateQuantity: (roomId, quantity) => {
      set((state) => {
        const selections =
          roomSelectionUseCase.updateQuantity(
            state.selections,
            roomId,
            quantity,
          )

        return {
          selections,
          summary: roomSelectionUseCase.summary(selections),
        }
      })
    },

    clearCart: () => {
      set({
        selections: [],
        summary: emptySummary,
      })
    },
  }),
)