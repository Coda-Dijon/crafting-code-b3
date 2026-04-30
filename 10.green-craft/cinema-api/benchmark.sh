#!/usr/bin/env bash
# ─── Cinema API Benchmark ─────────────────────────────────────────────────────
# Démarre les deux serveurs, lance les benchmarks, affiche un récapitulatif.

set -e

N=2000    # nombre total de requêtes
C=20      # concurrence (requêtes parallèles)

BOOKING_TAKEN=/tmp/booking-taken.json
BOOKING_MISSING=/tmp/booking-missing.json

# ─── Payloads ─────────────────────────────────────────────────────────────────

cat > "$BOOKING_TAKEN" <<EOF
{
  "screeningId": "SCR-001",
  "row": "A",
  "seatNumber": 2,
  "customerEmail": "test@cinema.fr"
}
EOF

cat > "$BOOKING_MISSING" <<EOF
{
  "screeningId": "SCR-999",
  "row": "A",
  "seatNumber": 1,
  "customerEmail": "test@cinema.fr"
}
EOF

# ─── Démarrage des serveurs ───────────────────────────────────────────────────

echo "Démarrage des serveurs..."
npx ts-node src/server-exceptions.ts &
PID_EXCEPTIONS=$!

npx ts-node src/server-result.ts &
PID_RESULT=$!

cleanup() {
  echo ""
  echo "Arrêt des serveurs (PID $PID_EXCEPTIONS et $PID_RESULT)..."
  kill "$PID_EXCEPTIONS" "$PID_RESULT" 2>/dev/null || true
}
trap cleanup EXIT

wait_for_port() {
  local port=$1
  local retries=20
  until nc -z localhost "$port" 2>/dev/null; do
    retries=$((retries - 1))
    if [ "$retries" -eq 0 ]; then
      echo "Timeout : le serveur sur le port $port ne répond pas." >&2
      exit 1
    fi
    sleep 0.3
  done
}

wait_for_port 3000
wait_for_port 3001
echo "Les deux serveurs sont prêts."
echo ""

# ─── Extraction des métriques ab ─────────────────────────────────────────────
# Retourne : "rps mean_ms p99_ms" extraits de la sortie ab

run_ab_get() {
  local port=$1
  ab -n $N -c $C -s 10 "http://localhost:${port}/api/screenings/SCR-001" 2>&1
}

run_ab_post() {
  local port=$1
  local payload=$2
  ab -n $N -c $C -T "application/json" -p "$payload" -s 10 \
     "http://localhost:${port}/api/bookings" 2>&1
}

extract() {
  local output=$1
  local rps mean p99
  rps=$(echo "$output"  | grep "Requests per second" | awk '{printf "%.0f", $4}')
  mean=$(echo "$output" | grep "Time per request"    | head -1 | awk '{printf "%.1f", $4}')
  p99=$(echo "$output"  | grep "^ *99%"              | awk '{print $2}')
  echo "${rps} ${mean} ${p99:-n/a}"
}

# ─── Lancement des benchmarks ─────────────────────────────────────────────────

echo "Mesures en cours..."

OUT_A_GET=$(run_ab_get  3000)
OUT_B_GET=$(run_ab_get  3001)
OUT_A_TAKEN=$(run_ab_post  3000 "$BOOKING_TAKEN")
OUT_B_TAKEN=$(run_ab_post  3001 "$BOOKING_TAKEN")
OUT_A_MISSING=$(run_ab_post 3000 "$BOOKING_MISSING")
OUT_B_MISSING=$(run_ab_post 3001 "$BOOKING_MISSING")

# ─── Calcul du gain relatif ───────────────────────────────────────────────────

gain_rps() {
  # gain en % de req/s : (B - A) / A * 100
  awk "BEGIN { printf \"%+.0f%%\", ($2 - $1) / $1 * 100 }"
}

gain_lat() {
  # gain en % de latence : (A - B) / A * 100  (négatif = amélioration)
  awk "BEGIN { printf \"%+.0f%%\", ($2 - $1) / $1 * 100 }"
}

read RPS_A_GET  MEAN_A_GET  P99_A_GET  <<< $(extract "$OUT_A_GET")
read RPS_B_GET  MEAN_B_GET  P99_B_GET  <<< $(extract "$OUT_B_GET")
read RPS_A_TK   MEAN_A_TK   P99_A_TK   <<< $(extract "$OUT_A_TAKEN")
read RPS_B_TK   MEAN_B_TK   P99_B_TK   <<< $(extract "$OUT_B_TAKEN")
read RPS_A_MS   MEAN_A_MS   P99_A_MS   <<< $(extract "$OUT_A_MISSING")
read RPS_B_MS   MEAN_B_MS   P99_B_MS   <<< $(extract "$OUT_B_MISSING")

GAIN_RPS_GET=$(awk "BEGIN { printf \"%+.0f%%\", ($RPS_B_GET  - $RPS_A_GET)  / $RPS_A_GET  * 100 }")
GAIN_RPS_TK=$( awk "BEGIN { printf \"%+.0f%%\", ($RPS_B_TK   - $RPS_A_TK)   / $RPS_A_TK   * 100 }")
GAIN_RPS_MS=$( awk "BEGIN { printf \"%+.0f%%\", ($RPS_B_MS   - $RPS_A_MS)   / $RPS_A_MS   * 100 }")

GAIN_LAT_GET=$(awk "BEGIN { printf \"%+.0f%%\", ($MEAN_B_GET - $MEAN_A_GET) / $MEAN_A_GET * 100 }")
GAIN_LAT_TK=$( awk "BEGIN { printf \"%+.0f%%\", ($MEAN_B_TK  - $MEAN_A_TK)  / $MEAN_A_TK  * 100 }")
GAIN_LAT_MS=$( awk "BEGIN { printf \"%+.0f%%\", ($MEAN_B_MS  - $MEAN_A_MS)  / $MEAN_A_MS  * 100 }")

# ─── Récapitulatif ────────────────────────────────────────────────────────────

pad() { printf "%-38s" "$1"; }
col() { printf "%-18s" "$1"; }

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  RÉCAPITULATIF — Exceptions (A) vs Result (B)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
printf "$(pad 'Scénario')  $(col 'Métrique')  $(col 'Exceptions (A)')  $(col 'Result (B)')  %s\n" "Gain (B vs A)"
echo "──────────────────────────────────────────────────────────────────────────────────────────────"

print_row() {
  local scenario=$1 metric=$2 val_a=$3 val_b=$4 gain=$5
  printf "$(pad "$scenario")  $(col "$metric")  $(col "$val_a")  $(col "$val_b")  %s\n" "$gain"
}

print_row "GET /screenings/:id (nominal)"  "Req/sec"       "$RPS_A_GET req/s"   "$RPS_B_GET req/s"   "$GAIN_RPS_GET"
print_row ""                               "Latence moy."  "${MEAN_A_GET} ms"   "${MEAN_B_GET} ms"   "$GAIN_LAT_GET"
print_row ""                               "p99"           "${P99_A_GET} ms"    "${P99_B_GET} ms"    ""
echo "──────────────────────────────────────────────────────────────────────────────────────────────"
print_row "POST /bookings (siège pris)"    "Req/sec"       "$RPS_A_TK req/s"    "$RPS_B_TK req/s"    "$GAIN_RPS_TK"
print_row ""                               "Latence moy."  "${MEAN_A_TK} ms"    "${MEAN_B_TK} ms"    "$GAIN_LAT_TK"
print_row ""                               "p99"           "${P99_A_TK} ms"     "${P99_B_TK} ms"     ""
echo "──────────────────────────────────────────────────────────────────────────────────────────────"
print_row "POST /bookings (séance absente)" "Req/sec"      "$RPS_A_MS req/s"    "$RPS_B_MS req/s"    "$GAIN_RPS_MS"
print_row ""                               "Latence moy."  "${MEAN_A_MS} ms"    "${MEAN_B_MS} ms"    "$GAIN_LAT_MS"
print_row ""                               "p99"           "${P99_A_MS} ms"     "${P99_B_MS} ms"     ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Le gain est le plus visible sur les scénarios d'erreur (siège pris, séance absente) :"
echo "ce sont des cas prévisibles que les exceptions traitent à un coût inutile."
echo ""
