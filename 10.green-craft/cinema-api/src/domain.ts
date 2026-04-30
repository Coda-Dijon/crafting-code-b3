export type SeatStatus = "available" | "taken"

export interface Seat {
  row: string
  number: number
  status: SeatStatus
}

export interface Screening {
  id: string
  filmTitle: string
  startTime: string
  room: string
  seats: Seat[]
}

export interface Booking {
  id: string
  screeningId: string
  seat: Seat
  customerEmail: string
  bookedAt: string
}

export interface BookingRequest {
  screeningId: string
  row: string
  seatNumber: number
  customerEmail: string
}

export const screenings: Map<string, Screening> = new Map([
  [
    "SCR-001",
    {
      id: "SCR-001",
      filmTitle: "Dune: Part Two",
      startTime: "2026-03-25T20:30:00",
      room: "Salle 1",
      seats: [
        { row: "A", number: 1, status: "available" },
        { row: "A", number: 2, status: "taken" },
        { row: "A", number: 3, status: "available" },
        { row: "B", number: 1, status: "available" },
        { row: "B", number: 2, status: "available" },
      ],
    },
  ],
  [
    "SCR-002",
    {
      id: "SCR-002",
      filmTitle: "The Substance",
      startTime: "2026-03-25T22:00:00",
      room: "Salle 2",
      seats: [
        { row: "A", number: 1, status: "available" },
        { row: "A", number: 2, status: "available" },
      ],
    },
  ],
])

export const bookings: Booking[] = []
