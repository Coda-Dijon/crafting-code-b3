# Le Craft à l'heure du numérique responsable

> En binôme, discutez 2 minutes :

- Avez-vous déjà mesuré l'impact environnemental d'une fonctionnalité que vous avez développée ?
- Pensez-vous que la façon dont on écrit le code peut avoir un impact sur la consommation énergétique ?
- Connaissez-vous des référentiels ou outils liés à l'éco-conception numérique ?

---

## Le numérique : un impact qui compte

Le numérique représente aujourd'hui **4 % des émissions mondiales de gaz à effet de serre**, et ce chiffre double tous les 15 ans. Contrairement aux idées reçues, la majorité de cet impact vient des **terminaux utilisateurs** (fabrication + usage), pas des datacenters.

En tant que développeurs, nous n'agissons pas directement sur la fabrication des terminaux — mais nous agissons sur **leur durée de vie utile** : un service lourd force les utilisateurs à renouveler leurs appareils plus tôt.

> Écrire du code sobre, c'est allonger la durée de vie des équipements.

[![craft-numerique.webp](img/craft-numerique.webp)](https://www.canva.com/design/DAG-Lh-bBpQ/XW8FqN_gcMzxpInRqeZwOg/edit?utm_content=DAG-Lh-bBpQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

### Manifeste pour  l’artisanat logiciel responsable
- Des logiciels bien conçus **ET** aussi `sobres et durables`.
  - `Action immédiate` : évaluer chaque choix technique sous l’angle de l'éco-conception.
- Ajouter constamment de la `valeur respectueuse des ressources`.
  - `Action immédiate` : effectuer la revue d’un produit avec un outil (Green IT Analyser, creedengo, ...).
- Plus qu’une communauté de professionnels, une communauté dédiée à un `numérique soutenable`.
  - `Action immédiate` : organiser 1 coding dojo afin de lancer une communauté de pratique “green coding”
- Des partenariats productifs permettant de co-construire des `solutions conscientes de leur impact environnemental et sociétal`.
  - Action immédiate :  systématiser la question : Quelle est la valeur ? Pour qui ?

---

## Les référentiels

### RGESN — Référentiel Général d'Écoconception de Services Numériques

Le [RGESN](https://www.arcep.fr/la-regulation/grands-dossiers-thematiques-transverses/lempreinte-environnementale-du-numerique/le-referentiel-general-decoconception-de-services-numeriques-rgesn.html) est le référentiel de l'État français pour l'écoconception des services numériques. Il couvre **79 critères** répartis en 8 thématiques :

| Thématique     | Exemples de critères                                       |
|----------------|------------------------------------------------------------|
| Stratégie      | Le service a une politique d'écoconception documentée      |
| Spécifications | Les fonctionnalités sont réduites au strict nécessaire     |
| Architecture   | Mutualisation des ressources, pas de serveur dédié inutile |
| UX/UI          | Pas d'autoplay vidéo, animations réduites                  |
| Contenus       | Images compressées, formats adaptés                        |
| Frontend       | Minification, lazy loading, pas de frameworks inutiles     |
| Backend        | Requêtes optimisées, pas de données inutiles               |
| Hébergement    | Énergie renouvelable, PUE bas                              |

### RGAA — Référentiel Général d'Amélioration de l'Accessibilité

Le [RGAA](https://accessibilite.numerique.gouv.fr/) est le pendant accessibilité du RGESN. Il définit les critères pour rendre les services numériques accessibles à tous (handicap visuel, moteur, cognitif...).

> Accessibilité et écoconception sont complémentaires : un service léger et bien structuré est souvent plus accessible.

### NumÉcoDiag

[NumÉcoDiag](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-numerique-responsable/) est l'outil de diagnostic proposé par la DINUM pour évaluer la maturité d'une organisation sur le numérique responsable.

---

## Mesurer l'impact de nos services

### EcoIndex

[EcoIndex](https://www.ecoindex.fr/) mesure l'empreinte environnementale d'une page web selon 3 métriques :

- **Nombre de requêtes HTTP**
- **Taille de la page** (Ko)
- **Nombre d'éléments DOM**

Score de A (sobre) à G (gourmand). Il est intégrable en CI :

```yaml
# GitHub Actions
- name: EcoIndex analysis
  uses: ythirion/greenit-analysis-action@main
  with:
    urls: |
      https://mon-service.fr
      https://mon-service.fr/reservations
```

Plus d'infos [ici](https://github.com/ythirion/greenit-analysis-action/).

### Lighthouse / Web Vitals

Les [Core Web Vitals](https://web.dev/vitals/) de Google mesurent la performance perçue :

- **LCP** (Largest Contentful Paint) — temps de chargement du contenu principal
- **FID / INP** (Interaction to Next Paint) — réactivité
- **CLS** (Cumulative Layout Shift) — stabilité visuelle

Un mauvais score = expérience dégradée = consommation CPU prolongée sur le terminal.

Comment les intégrer [ici](https://github.com/Coda-Dijon/speedlify)

### Apache Benchmark (ab)

Pour les APIs backend, `ab` permet de mesurer le débit et la latence sous charge :

```bash
# 1000 requêtes, 10 en parallèle
ab -n 1000 -c 10 http://localhost:3000/api/screenings

# Avec corps JSON (réservation)
ab -n 1000 -c 10 -T application/json \
   -p /tmp/booking.json \
   http://localhost:3000/api/bookings
```

---

## Exceptions vs Result : un impact mesurable

Les **exceptions** en JavaScript/TypeScript (et dans la plupart des runtimes) sont coûteuses :

- Elles déroulent la **call stack** complète
- Elles allouent de la mémoire pour capturer le contexte d'erreur
- Elles interrompent le flux d'exécution de façon non-locale
- Le garbage collector travaille plus

Pour les **cas d'erreur prévisibles** (réservation impossible, place déjà prise, film non trouvé...), les exceptions sont un anti-pattern **fonctionnel et énergétique**.

> Une erreur métier n'est pas une exception — c'est un résultat attendu.

La monade **Result** (ou `Either`) encode explicitement le succès et l'échec dans le type de retour :

```typescript
type Result<T, E> = Success<T> | Failure<E>
```

---

## Cinema API — Démonstration

### Contexte

Une API de gestion de cinéma avec deux endpoints :
- `GET /api/screenings/:id` — récupérer une séance
- `POST /api/bookings` — réserver une place

On compare deux implémentations sous charge avec Apache Benchmark.

### Arborescence

```
cinema-api/
├── src/
│   ├── domain.ts              # Types métier + base in-memory (séances, places, réservations)
│   ├── result.ts              # Monade Result<T, E> — ok() / fail()
│   ├── server-exceptions.ts   # Version A : erreurs métier via throw  (port 3000)
│   └── server-result.ts       # Version B : erreurs métier via Result (port 3001)
├── benchmark.sh               # Script Apache Benchmark — compare les deux versions
├── package.json
└── tsconfig.json
```

### Version A — Avec exceptions

```
POST /api/bookings
  → throw new SeatAlreadyTakenException()   ← erreur prévisible traitée comme exception
  → throw new ScreeningNotFoundException()  ← idem
```

### Version B — Avec monade Result

```
POST /api/bookings
  → return Failure("SEAT_ALREADY_TAKEN")    ← erreur encodée dans le type
  → return Failure("SCREENING_NOT_FOUND")   ← idem
```

### Lancer le benchmark

```bash
cd cinema-api
npm install
npm run start:exceptions   # port 3000
npm run start:result        # port 3001

# Dans un autre terminal
npm run benchmark
```

### Résultats typiques

| Métrique          | Exceptions | Result | Gain |
|-------------------|------------|--------|------|
| Requests/sec      | ~2 800     | ~4 200 | +50% |
| Mean latency (ms) | 3.6        | 2.4    | −33% |
| p99 latency (ms)  | 12         | 6      | −50% |
| CPU (%)           | ~45        | ~28    | −38% |

> Ces chiffres varient selon la machine — l'important est d'observer l'**ordre de grandeur**.

---

## Bonnes pratiques d'écoconception backend

### Ne pas transférer ce qu'on n'utilise pas

```typescript
// ❌ Sélectionner tout
const films = await db.query('SELECT * FROM films')

// ✅ Sélectionner ce dont on a besoin
const films = await db.query('SELECT id, title, duration FROM films')
```

### Paginer les résultats

```typescript
// ❌ Retourner toutes les séances
GET /api/screenings

// ✅ Paginer
GET /api/screenings?page=1&limit=20
```

### Cache et idempotence

Les données qui ne changent pas souvent ne doivent pas être recalculées à chaque requête :

```typescript
// Cache HTTP côté client
res.setHeader('Cache-Control', 'public, max-age=3600')

// Cache applicatif
const screening = await cache.getOrFetch(
  `screening:${id}`,
  () => screeningRepository.findById(id),
  { ttl: 60 }
)
```

### Lazy loading et compression

```typescript
// Activer gzip/brotli sur Express
import compression from 'compression'
app.use(compression())
```

---

## Conclusion

### Ce qu'on retient

- Le **RGESN** et le **RGAA** sont les deux référentiels clés de l'État pour l'écoconception et l'accessibilité
- **EcoIndex** et **Lighthouse** mesurent l'impact côté frontend ; **Apache Benchmark** côté backend
- Les **exceptions pour des cas métier prévisibles** sont un anti-pattern fonctionnel ET énergétique
- Le craft (code propre, pas de sur-ingénierie, pas de données inutiles) est **naturellement sobre**

### Questions pour la suite

- Dans votre projet, y a-t-il des endpoints qui retournent plus de données que nécessaire ?
- Utilisez-vous des exceptions pour des cas d'erreur prévisibles ?
- Avez-vous déjà mesuré le score EcoIndex de votre service en production ?

---

## Ressources

- [RGESN](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-general-ecoconception/)
- [RGAA — accessibilite.numerique.gouv.fr](https://accessibilite.numerique.gouv.fr/)
- [EcoIndex](https://www.ecoindex.fr/)
- [GreenIT Analysis Action (CI)](https://github.com/ythirion/greenit-analysis-action/)
- [NumÉcoDiag — DINUM](https://ecoresponsable.numerique.gouv.fr/publications/referentiel-numerique-responsable/)
- [Vidéo - Le Craft à l'heure du numérique responsable](https://youtu.be/HlDfaTf-6-E?si=m5Xcmu9Ri3kLXCNm)
- [Exceptions vs Errors](https://xtrem-tdd.netlify.app/Flavours/Design/avoid-exceptions#exceptions-vs-errors)
- [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)
- [Eco-conception en Java par Marc Bouvier](https://github.com/Coda-Dijon/java_ecoconception)
- [Mesurer l'impact de l'usage de l'IA - Ecologits](https://ecologits.ai/latest/)