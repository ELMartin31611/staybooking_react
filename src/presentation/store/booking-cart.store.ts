import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AddRoomSelectionDto } from '@/application/dto/add-room-selection.dto'
import { RoomSelectionUseCase } from '@/application/use-cases/room-selection.use-case'
import type {
  BookingCartSummary,
  RoomSelection,
} from '@/domain/entities/room-selection.entity'

interface BookingCartState {
  selections: RoomSelection[]
  summary: BookingCartSummary
  checkIn: string
  checkOut: string

  addSelection: (
    selection: AddRoomSelectionDto,
  ) => void
  removeSelection: (roomId: number) => void
  updateQuantity: (
    roomId: number,
    quantity: number,
  ) => void
  setDates: (
    checkIn: string,
    checkOut: string,
  ) => void
  clearCart: () => void
}

const roomSelectionUseCase =
  new RoomSelectionUseCase()

const emptySummary: BookingCartSummary = {
  totalRooms: 0,
  subtotal: 0,
}

export const useBookingCartStore =
  create<BookingCartState>()(
    persist(
      (set) => ({
        selections: [],
        summary: emptySummary,
        checkIn: '',
        checkOut: '',

        addSelection: (selection) => {
          set((state) => {
            const selections =
              roomSelectionUseCase.add(
                state.selections,
                selection,
              )

            return {
              selections,
              summary:
                roomSelectionUseCase.summary(
                  selections,
                ),
            }
          })
        },

        removeSelection: (roomId) => {
          set((state) => {
            const selections =
              roomSelectionUseCase.remove(
                state.selections,
                roomId,
              )

            return {
              selections,
              summary:
                roomSelectionUseCase.summary(
                  selections,
                ),
            }
          })
        },

        updateQuantity: (
          roomId,
          quantity,
        ) => {
          set((state) => {
            const selections =
              roomSelectionUseCase.updateQuantity(
                state.selections,
                roomId,
                quantity,
              )

            return {
              selections,
              summary:
                roomSelectionUseCase.summary(
                  selections,
                ),
            }
          })
        },

        setDates: (
          checkIn,
          checkOut,
        ) => {
          set({
            checkIn,
            checkOut,
          })
        },

        clearCart: () => {
          set({
            selections: [],
            summary: emptySummary,
            checkIn: '',
            checkOut: '',
          })
        },
      }),
      {
        name: 'staybooking-booking-cart',

        partialize: (state) => ({
          selections: state.selections,
          summary: state.summary,
          checkIn: state.checkIn,
          checkOut: state.checkOut,
        }),
      },
    ),
  )