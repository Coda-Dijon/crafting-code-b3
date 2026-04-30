/**
 * VERSION B — Avec monade Result
 *
 * Les erreurs métier prévisibles sont encodées dans le type de retour.
 * Aucune exception n'est levée pour des cas attendus.
 *
 * Bénéfices :
 *  - Zéro allocation de stack trace sur les erreurs métier
 *  - Le compilateur force la gestion de chaque cas d'erreur
 *  - Le code est lisible comme une spécification : "cette fonction peut retourner X ou échouer avec Y"
 *  - Latence p99 stable sous charge
 */
import express, { Request, Response } from "express"
import { v4 as uuid } from "uuid"
import { screenings, bookings, BookingRequest, Seat, Screening } from "./domain"
import { Result, ok, fail } from "./result"

const app = express()
app.use(express.json())

type BookingError =
  | "SCREENING_NOT_FOUND"
  | "SEAT_NOT_FOUND"
  | "SEAT_ALREADY_TAKEN"
  | "INVALID_REQUEST"

function findScreening(screeningId: string): Result<Screening, "SCREENING_NOT_FOUND"> {
  const screening = screenings.get(screeningId)
  return screening ? ok(screening) : fail("SCREENING_NOT_FOUND")
}

function findSeat(
  seats: Seat[],
  row: string,
  number: number
): Result<Seat, "SEAT_NOT_FOUND"> {
  const seat = seats.find((s) => s.row === row && s.number === number)
  return seat ? ok(seat) : fail("SEAT_NOT_FOUND")
}

function validateRequest(
  req: BookingRequest
): Result<BookingRequest, "INVALID_REQUEST"> {
  if (!req.screeningId || !req.row || !req.seatNumber || !req.customerEmail) {
    return fail("INVALID_REQUEST")
  }
  return ok(req)
}

function bookSeat(
  request: BookingRequest
): Result<{ id: string; screeningId: string; seat: Seat; customerEmail: string; bookedAt: string }, BookingError> {
  const validation = validateRequest(request)
  if (!validation.ok) return validation

  const screeningResult = findScreening(request.screeningId)
  if (!screeningResult.ok) return screeningResult

  const seatResult = findSeat(
    screeningResult.value.seats,
    request.row,
    request.seatNumber
  )
  if (!seatResult.ok) return seatResult

  const seat = seatResult.value
  if (seat.status === "taken") return fail("SEAT_ALREADY_TAKEN")

  seat.status = "taken"

  const booking = {
    id: uuid(),
    screeningId: request.screeningId,
    seat,
    customerEmail: request.customerEmail,
    bookedAt: new Date().toISOString(),
  }
  bookings.push(booking)
  return ok(booking)
}

const errorStatus: Record<BookingError, number> = {
  INVALID_REQUEST: 400,
  SCREENING_NOT_FOUND: 404,
  SEAT_NOT_FOUND: 404,
  SEAT_ALREADY_TAKEN: 409,
}

app.get("/api/screenings/:id", (req: Request, res: Response) => {
  const result = findScreening(req.params.id)
  if (result.ok) {
    res.json(result.value)
  } else {
    res.status(404).json({ error: result.error })
  }
})

app.post("/api/bookings", (req: Request, res: Response) => {
  const result = bookSeat(req.body as BookingRequest)
  if (result.ok) {
    res.status(201).json(result.value)
  } else {
    res.status(errorStatus[result.error]).json({error: result.error})
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`[result] Cinema API listening on http://localhost:${PORT}`)
})
