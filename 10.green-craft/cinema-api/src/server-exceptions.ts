/**
 * VERSION A — Avec exceptions
 *
 * Les erreurs métier prévisibles (siège déjà pris, séance introuvable)
 * sont traitées comme des exceptions — ce qu'elles ne sont PAS.
 *
 * Conséquences :
 *  - Déroulement de la call stack à chaque erreur
 *  - Allocation mémoire pour capturer le contexte d'erreur
 *  - Pression accrue sur le garbage collector
 *  - Latence p99 dégradée sous charge
 */
import express, { Request, Response } from "express"
import { v4 as uuid } from "uuid"
import { screenings, bookings, BookingRequest, Seat } from "./domain"

const app = express()
app.use(express.json())

// ─── Custom exceptions ────────────────────────────────────────────────────────

class ScreeningNotFoundException extends Error {
  constructor(screeningId: string) {
    super(`Screening not found: ${screeningId}`)
    this.name = "ScreeningNotFoundException"
  }
}

class SeatNotFoundException extends Error {
  constructor(row: string, number: number) {
    super(`Seat not found: ${row}${number}`)
    this.name = "SeatNotFoundException"
  }
}

class SeatAlreadyTakenException extends Error {
  constructor(row: string, number: number) {
    super(`Seat ${row}${number} is already taken`)
    this.name = "SeatAlreadyTakenException"
  }
}

class InvalidBookingRequestException extends Error {
  constructor(reason: string) {
    super(`Invalid booking request: ${reason}`)
    this.name = "InvalidBookingRequestException"
  }
}

function findScreening(screeningId: string) {
  const screening = screenings.get(screeningId)
  if (!screening) throw new ScreeningNotFoundException(screeningId)
  return screening
}

function findSeat(seats: Seat[], row: string, number: number): Seat {
  const seat = seats.find((s) => s.row === row && s.number === number)
  if (!seat) throw new SeatNotFoundException(row, number)
  return seat
}

function validateRequest(req: BookingRequest): void {
  if (!req.screeningId) throw new InvalidBookingRequestException("screeningId is required")
  if (!req.row) throw new InvalidBookingRequestException("row is required")
  if (!req.seatNumber) throw new InvalidBookingRequestException("seatNumber is required")
  if (!req.customerEmail) throw new InvalidBookingRequestException("customerEmail is required")
}

function bookSeat(request: BookingRequest) {
  validateRequest(request)

  const screening = findScreening(request.screeningId)
  const seat = findSeat(screening.seats, request.row, request.seatNumber)

  if (seat.status === "taken") {
    throw new SeatAlreadyTakenException(request.row, request.seatNumber)
  }

  seat.status = "taken"

  const booking = {
    id: uuid(),
    screeningId: request.screeningId,
    seat,
    customerEmail: request.customerEmail,
    bookedAt: new Date().toISOString(),
  }
  bookings.push(booking)
  return booking
}

app.get("/api/screenings/:id", (req: Request, res: Response) => {
  try {
    const screening = findScreening(req.params.id)
    res.json(screening)
  } catch (e) {
    if (e instanceof ScreeningNotFoundException) {
      res.status(404).json({ error: e.message })
    } else {
      res.status(500).json({ error: "Internal server error" })
    }
  }
})

app.post("/api/bookings", (req: Request, res: Response) => {
  try {
    const booking = bookSeat(req.body as BookingRequest)
    res.status(201).json(booking)
  } catch (e) {
    if (e instanceof InvalidBookingRequestException) {
      res.status(400).json({ error: e.message })
    } else if (e instanceof ScreeningNotFoundException) {
      res.status(404).json({ error: e.message })
    } else if (e instanceof SeatNotFoundException) {
      res.status(404).json({ error: e.message })
    } else if (e instanceof SeatAlreadyTakenException) {
      res.status(409).json({ error: e.message })
    } else {
      res.status(500).json({ error: "Internal server error" })
    }
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`[exceptions] Cinema API listening on http://localhost:${PORT}`)
})
