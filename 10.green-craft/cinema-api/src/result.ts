// ─── Result monad ─────────────────────────────────────────────────────────────
//
// Encode explicitement le succès et l'échec dans le type de retour.
// Pas d'allocation de stack trace, pas de déroulement d'exception,
// pas de try/catch dans le code appelant.

export type Success<T> = { ok: true; value: T }
export type Failure<E extends string> = { ok: false; error: E }
export type Result<T, E extends string> = Success<T> | Failure<E>

export const ok = <T>(value: T): Success<T> => ({ ok: true, value })
export const fail = <E extends string>(error: E): Failure<E> => ({ ok: false, error })
