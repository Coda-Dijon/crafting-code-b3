# Activité — Identifier les types de tests
On travaille sur une application de **Yams** (Yahtzee) en ligne.
Les joueurs peuvent lancer 5 dés, garder certains dés entre les lancers, et scorer des combinaisons. 
L'application expose une API REST et persiste les scores en base de données.

Pour chacun des snippets ci-dessous, identifiez le **type de test** et **justifiez** votre réponse.

## Code métier de référence

> Le code ci-dessous est celui de l'application. Les tests portent sur ces modules.

```typescript
// types.ts
type Valeur = 1 | 2 | 3 | 4 | 5 | 6
type Des = [Valeur, Valeur, Valeur, Valeur, Valeur]
type Categorie =
  | 'as' | 'deux' | 'trois' | 'quatre' | 'cinq' | 'six'
  | 'brelan' | 'full' | 'carre' | 'petite-suite' | 'grande-suite' | 'yams' | 'chance'

interface Score {
  joueur: string
  total: number
  date: Date
}

interface ResultatLancer {
  des: Des
  lancersRestants: number
  lancerId: string
}
```

```typescript
// yams-scorer.ts
export function calculerBrelan(des: Des): number {
  const comptage = new Map<number, number>()
  for (const d of des) comptage.set(d, (comptage.get(d) ?? 0) + 1)
  for (const [valeur, count] of comptage)
    if (count >= 3) return valeur * 3
  return 0
}

export function estYams(des: Des): boolean {
  return des.every(d => d === des[0])
}

export function calculerToutesLesCombinaisons(des: Des): Record<Categorie, number> { /* ... */ }
```

```typescript
// game-service.ts
export class GameService {
  constructor(private readonly repo: ScoreRepository) {}

  async terminerPartie(joueur: string, total: number): Promise<void> {
    await this.repo.sauvegarder({ joueur, total, date: new Date() })
  }

  async getClassement(): Promise<Score[]> {
    return this.repo.findAll({ orderBy: 'total', direction: 'desc' })
  }
}
```

```typescript
// score-repository.ts
export class InMemoryScoreRepository implements ScoreRepository {
  private store: Score[] = []
  async sauvegarder(score: Score): Promise<void> { this.store.push(score) }
  async findAll(options: QueryOptions): Promise<Score[]> { /* ... */ }
}

export class PostgresScoreRepository implements ScoreRepository {
  constructor(private readonly db: Database) {}
  async sauvegarder(score: Score): Promise<void> { /* INSERT INTO scores ... */ }
  async findAll(options: QueryOptions): Promise<Score[]> { /* SELECT ... */ }
}
```

## Les Snippets

### Snippet A

```typescript
import { describe, it, expect } from 'vitest'
import { calculerBrelan } from './yams-scorer'

describe('calculerBrelan', () => {
  it('retourne la somme des dés du brelan', () => {
    expect(calculerBrelan([3, 3, 3, 5, 1])).toBe(9)
  })

  it('retourne 0 quand il n\'y a pas de brelan', () => {
    expect(calculerBrelan([1, 2, 3, 4, 5])).toBe(0)
  })

  it('retourne le score du carré quand 4 dés identiques', () => {
    expect(calculerBrelan([4, 4, 4, 4, 2])).toBe(12)
  })
})
```

### Snippet B

```typescript
import { describe, it, expect, vi } from 'vitest'
import { GameService } from './game-service'

describe('GameService', () => {
  it('sauvegarde le score à la fin d\'une partie', async () => {
    const repo = {
      sauvegarder: vi.fn().mockResolvedValue(undefined),
      findAll: vi.fn(),
    }

    const service = new GameService(repo)
    await service.terminerPartie('Alice', 247)

    expect(repo.sauvegarder).toHaveBeenCalledOnce()
    expect(repo.sauvegarder).toHaveBeenCalledWith({
      joueur: 'Alice',
      total: 247,
      date: expect.any(Date),
    })
  })
})
```

### Snippet C

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { GameService } from './game-service'
import { InMemoryScoreRepository } from './score-repository'

describe('GameService + InMemoryScoreRepository', () => {
  let service: GameService

  beforeEach(() => {
    const repository = new InMemoryScoreRepository()
    service = new GameService(repository)
  })

  it('enregistre une partie et la retrouve dans le classement', async () => {
    await service.terminerPartie('Alice', 247)
    await service.terminerPartie('Bob', 189)
    await service.terminerPartie('Charlie', 302)

    const classement = await service.getClassement()

    expect(classement[0].joueur).toBe('Charlie')
    expect(classement[1].joueur).toBe('Alice')
    expect(classement[2].joueur).toBe('Bob')
  })
})
```

### Snippet D

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { GameService } from './game-service'
import { PostgresScoreRepository } from './score-repository'
import { createTestDatabase, dropTestDatabase } from './test-helpers'

describe('GameService + PostgresScoreRepository', () => {
  let service: GameService
  let db: Database

  beforeAll(async () => {
    db = await createTestDatabase()
    await db.migrate()
    service = new GameService(new PostgresScoreRepository(db))
  })

  afterAll(async () => {
    await dropTestDatabase(db)
  })

  it('persiste le score entre deux instances de service', async () => {
    await service.terminerPartie('Alice', 247)

    const gameService = new GameService(new PostgresScoreRepository(db))
    const classement = await gameService.getClassement()

    expect(classement[0].joueur).toBe('Alice')
  })
})
```

### Snippet E

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from './app'
import { database } from './database'

describe('Parcours joueur — E2E', () => {
  beforeAll(async () => {
    await database.migrate()
  })

  afterAll(async () => {
    await database.reset()
    await database.close()
  })

  it('joue un tour complet et consulte le classement', async () => {
    // 1. Créer une partie
    const { body: partie } = await request(app)
      .post('/api/parties')
      .send({ joueur: 'Alice' })
      .expect(201)

    // 2. Premier lancer de dés
    const { body: lancer } = await request(app)
      .post(`/api/parties/${partie.id}/lancers`)
      .expect(200)

    expect(lancer.des).toHaveLength(5)
    expect(lancer.lancersRestants).toBe(2)

    // 3. Scorer la catégorie "chance"
    const { body: score } = await request(app)
      .post(`/api/parties/${partie.id}/scores`)
      .send({ categorie: 'chance' })
      .expect(200)

    expect(score.total).toBeGreaterThan(0)

    // 4. Vérifier le classement
    const { body: classement } = await request(app)
      .get('/api/classement')
      .expect(200)

    expect(classement[0].joueur).toBe('Alice')
  })
})
```

### Snippet F

```typescript
import { describe, it, expect } from 'vitest'
import { genererFeuilleDeSCore } from './score-card'

describe('Feuille de score', () => {
  it('génère la feuille de score au bon format', () => {
    const scores = {
      as: 3,
      deux: null,
      trois: 9,
      quatre: null,
      cinq: 20,
      six: null,
      brelan: 15,
      full: 25,
      'petite-suite': null,
      'grande-suite': null,
      carre: null,
      yams: null,
      chance: 22,
    }

    const feuille = genererFeuilleDeSCore('Alice', scores)

    expect(feuille).toMatchSnapshot()
  })
})
```

### Snippet G

```typescript
import { bench, describe } from 'vitest'
import { calculerToutesLesCombinaisons, lancerDes } from './yams-scorer'

describe('Performance du moteur de scoring', () => {
  bench('calculer toutes les combinaisons pour un lancer', () => {
    const des = [2, 3, 3, 5, 6] as const
    calculerToutesLesCombinaisons(des)
  })

  bench('simuler 1 000 tours complets', () => {
    for (let i = 0; i < 1000; i++) {
      const des = lancerDes(5)
      calculerToutesLesCombinaisons(des)
    }
  })
})
```

### Snippet H

```typescript
import { describe, it, expect } from 'vitest'
import { estYams } from './yams-scorer'

// Contexte : un bug en production a rendu estYams() toujours vraie
// quand tous les dés valaient 1. Corrigé en version 2.1.4.

describe('estYams — non-régression bug #412', () => {
  it('retourne true pour cinq 1', () => {
    expect(estYams([1, 1, 1, 1, 1])).toBe(true)
  })

  it('retourne false pour [1, 1, 1, 1, 2]', () => {
    expect(estYams([1, 1, 1, 1, 2])).toBe(false)
  })

  it('retourne false pour tous les dés différents', () => {
    expect(estYams([1, 2, 3, 4, 5])).toBe(false)
  })
})
```

## Tableau de synthèse à compléter

| Snippet | Type de test | Indice principal |
|---------|--------------|------------------|
| A       | ?            | ?                |
| B       | ?            | ?                |
| C       | ?            | ?                |
| D       | ?            | ?                |
| E       | ?            | ?                |
| F       | ?            | ?                |
| G       | ?            | ?                |
| H       | ?            | ?                |
