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

  removeSelection: (
    roomId: number,
  ) => void

  updateGuests: (
    roomId: number,
    adults: number,
    children: number,
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
  totalAdults: 0,
  totalChildren: 0,
  totalExtraGuests: 0,
  referencePricePerNight: 0,
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
                roomSelectionUseCase
                  .summary(selections),
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
                roomSelectionUseCase
                  .summary(selections),
            }
          })
        },

        updateGuests: (
          roomId,
          adults,
          children,
        ) => {
          set((state) => {
            const selections =
              roomSelectionUseCase
                .updateGuests(
                  state.selections,
                  roomId,
                  adults,
                  children,
                )

            return {
              selections,
              summary:
                roomSelectionUseCase
                  .summary(selections),
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
        version: 3,

        migrate: (
          persistedState,
          version,
        ) => {
          const state =
            persistedState as BookingCartState

          if (version < 3) {
            return {
              ...state,
              selections: [],
              summary: emptySummary,
            }
          }

          return state
        },
      },
    ),
  )