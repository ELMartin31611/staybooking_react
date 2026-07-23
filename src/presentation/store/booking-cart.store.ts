import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AddRoomSelectionDto } from '@/application/dto/add-room-selection.dto'
import { RoomSelectionUseCase } from '@/application/use-cases/room-selection.use-case'
import type {
  BookingServiceSelection,
  BookingCartSummary,
  RoomSelection,
} from '@/domain/entities/room-selection.entity'

interface BookingCartState {
  selections: RoomSelection[]
  services: BookingServiceSelection[]
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

  addService: (
    service: Omit<BookingServiceSelection, 'quantity'>,
  ) => void
  updateServiceQuantity: (
    serviceId: number,
    quantity: number,
  ) => void
  removeService: (serviceId: number) => void

  setDates: (
    checkIn: string,
    checkOut: string,
  ) => void

  clearSelections: () => void
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
  referenceServicesSubtotal: 0,
}

function calculateSummary(
  selections: RoomSelection[],
  services: BookingServiceSelection[],
): BookingCartSummary {
  return {
    ...roomSelectionUseCase.summary(selections),
    referenceServicesSubtotal: services.reduce(
      (subtotal, service) =>
        subtotal + service.unitPrice * service.quantity,
      0,
    ),
  }
}

export const useBookingCartStore =
  create<BookingCartState>()(
    persist(
      (set) => ({
        selections: [],
        services: [],
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
              summary: calculateSummary(selections, state.services),
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
              services: state.services.filter((service) =>
                selections.some((selection) =>
                  service.roomTypeIds.includes(selection.roomTypeId),
                ),
              ),
              summary: calculateSummary(
                selections,
                state.services.filter((service) =>
                  selections.some((selection) =>
                    service.roomTypeIds.includes(selection.roomTypeId),
                  ),
                ),
              ),
            }
          })
        },

        addService: (service) => {
          set((state) => {
            const existing = state.services.find(
              (item) => item.serviceId === service.serviceId,
            )
            const services = existing
              ? state.services.map((item) =>
                  item.serviceId === service.serviceId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
                )
              : [...state.services, { ...service, quantity: 1 }]
            return {
              services,
              summary: calculateSummary(state.selections, services),
            }
          })
        },

        updateServiceQuantity: (serviceId, quantity) => {
          set((state) => {
            const normalizedQuantity = Math.min(20, quantity)
            const services = normalizedQuantity < 1
              ? state.services.filter((item) => item.serviceId !== serviceId)
              : state.services.map((item) =>
                  item.serviceId === serviceId
                    ? { ...item, quantity: normalizedQuantity }
                    : item,
                )
            return {
              services,
              summary: calculateSummary(state.selections, services),
            }
          })
        },

        removeService: (serviceId) => {
          set((state) => {
            const services = state.services.filter(
              (item) => item.serviceId !== serviceId,
            )
            return {
              services,
              summary: calculateSummary(state.selections, services),
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
              summary: calculateSummary(selections, state.services),
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

        clearSelections: () => {
          set({
            selections: [],
            services: [],
            summary: emptySummary,
          })
        },

        clearCart: () => {
          set({
            selections: [],
            services: [],
            summary: emptySummary,
            checkIn: '',
            checkOut: '',
          })
        },
      }),
      {
        name: 'staybooking-booking-cart',
        version: 4,

        migrate: (
          persistedState,
          version,
        ) => {
          const state =
            persistedState as BookingCartState

          if (version < 4) {
            return {
              ...state,
              selections: [],
              services: [],
              summary: emptySummary,
            }
          }

          return state
        },
      },
    ),
  )