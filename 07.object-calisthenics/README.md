# Object Calisthenics
## `GildedRose`
Prenez 3 minutes pour lire ce code en silence :

```typescript
class GildedRose {
  items: Array<Item>;
  constructor(items = [] as Array<Item>) { this.items = items; }

  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name != 'Aged Brie' && this.items[i].name != 'Backstage passes to a TAFKAL80ETC concert') {
        if (this.items[i].quality > 0) {
          if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
            this.items[i].quality = this.items[i].quality - 1
          }
        }
      } else {
        if (this.items[i].quality < 50) {
          this.items[i].quality = this.items[i].quality + 1
          if (this.items[i].name == 'Backstage passes to a TAFKAL80ETC concert') {
            if (this.items[i].sellIn < 11) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1
              }
            }
            if (this.items[i].sellIn < 6) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1
              }
            }
          }
        }
      }
      if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
        this.items[i].sellIn = this.items[i].sellIn - 1;
      }
      if (this.items[i].sellIn < 0) {
        if (this.items[i].name != 'Aged Brie') {
          if (this.items[i].name != 'Backstage passes to a TAFKAL80ETC concert') {
            if (this.items[i].quality > 0) {
              if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
                this.items[i].quality = this.items[i].quality - 1
              }
            }
          } else {
            this.items[i].quality = this.items[i].quality - this.items[i].quality
          }
        } else {
          if (this.items[i].quality < 50) {
            this.items[i].quality = this.items[i].quality + 1
          }
        }
      }
    }
  }
}
```

Puis en groupe :
- Qu'est-ce qui rend ce code **difficile à lire** ? Listez tout ce qui vous gêne.
- Que fait-il, selon vous ?

> On met les réponses en commun — puis on découvre les 9 règles qui auraient évité ça.

## Object Calisthenics

Les Object Calisthenics sont **9 règles de discipline d'écriture** proposées par Jeff Bay dans *ThoughtWorks Anthology* (2008).

> "Just as physical calisthenics are exercises to build strength and flexibility, these coding exercises help build better object-oriented code."
> — Jeff Bay

L'objectif n'est pas de les appliquer toutes en permanence, mais de s'en servir comme **contraintes d'entraînement** pour développer de bons réflexes de conception.

---

### Règle 1 — Un seul niveau d'indentation par méthode

Une méthode ne doit pas dépasser un niveau d'imbrication. Si c'est le cas, extrayez une méthode.

**Pourquoi ?** Plus l'indentation est profonde, plus la logique est enchevêtrée — et plus elle est difficile à tester et à comprendre isolément.

#### ❌ Avant

```typescript
function printTopScorers(groups: Group[]): void {
    for (const group of groups) {
        for (const team of group.teams) {
            for (const player of team.players) {
                if (player.goals > 3) {
                    console.log(`${player.name} - ${player.goals} buts`);
                }
            }
        }
    }
}
```

#### ✅ Après

```typescript
function printTopScorers(groups: Group[]): void {
    groups.flatMap(g => g.teams)
          .flatMap(t => t.players)
          .filter(isTopScorer)
          .forEach(printPlayer);
}

const isTopScorer = (player: Player): boolean => player.goals > 3;
const printPlayer = (player: Player): void =>
    console.log(`${player.name} - ${player.goals} buts`);
```

---

### Règle 2 — Ne pas utiliser le mot-clé `else`

Si vous avez un `if` avec un `return` ou une exception, le `else` est superflu. Supprimez-le.

**Pourquoi ?** Le `else` force le lecteur à garder deux branches en tête simultanément. Les *early returns* aplatissent la logique et réduisent la charge cognitive.

#### ❌ Avant

```typescript
function getMatchStatus(score: Score): string {
    if (score.home > score.away) {
        return "Victoire domicile";
    } else if (score.home < score.away) {
        return "Victoire extérieur";
    } else {
        return "Match nul";
    }
}
```

#### ✅ Après

```typescript
function getMatchStatus(score: Score): string {
    if (score.home > score.away) return "Victoire domicile";
    if (score.home < score.away) return "Victoire extérieur";
    return "Match nul";
}
```

---

### Règle 3 — Encapsuler les primitives et les chaînes

Tout type primitif porteur d'une règle métier doit être encapsulé dans un *Value Object*.

**Pourquoi ?** Un `number` seul n'a aucune contrainte. Un `MinuteDeJeu` sait qu'il doit être entre 0 et 120 — il se valide lui-même et rend le code expressif.

#### ❌ Avant

```typescript
function addGoal(scorer: string, minute: number, teamId: string): void {
    if (minute < 0 || minute > 120) throw new Error("Minute invalide");
    // ... logique métier
}
```

#### ✅ Après

```typescript
class MinuteDeJeu {
    private constructor(private readonly value: number) {}

    static of(value: number): MinuteDeJeu {
        if (value < 0 || value > 120)
            throw new Error(`Minute invalide : ${value}`);
        return new MinuteDeJeu(value);
    }

    toString(): string { return `${this.value}'`; }
}

class JerseyNumber {
    private constructor(private readonly value: number) {}

    static of(value: number): JerseyNumber {
        if (value < 1 || value > 99)
            throw new Error(`Numéro de maillot invalide : ${value}`);
        return new JerseyNumber(value);
    }
}

function addGoal(scorer: PlayerName, minute: MinuteDeJeu): void {
    // La validité est garantie par les types eux-mêmes
}
```

---

### Règle 4 — Collections de première classe

Toute classe qui contient une collection ne doit contenir **que** cette collection (et la logique qui lui est propre).

**Pourquoi ?** Regrouper collection et comportement évite de disperser la logique de filtrage ou d'agrégation à travers tout le code.

#### ❌ Avant

```typescript
class ChampionsLeague {
    teams: Team[] = [];
    schedule: Match[] = [];

    getGroupWinners(): Team[] {
        return this.teams.filter(t => t.points >= 12);
    }

    getUnplayedMatches(): Match[] {
        return this.schedule.filter(m => !m.played);
    }
}
```

#### ✅ Après

```typescript
class Teams {
    private constructor(private readonly items: Team[]) {}

    static of(teams: Team[]): Teams { return new Teams([...teams]); }

    groupWinners(): Teams {
        return new Teams(this.items.filter(t => t.points >= 12));
    }

    count(): number { return this.items.length; }

    [Symbol.iterator]() { return this.items[Symbol.iterator](); }
}

class Schedule {
    private constructor(private readonly matches: Match[]) {}

    static of(matches: Match[]): Schedule { return new Schedule([...matches]); }

    unplayed(): Schedule {
        return new Schedule(this.matches.filter(m => !m.played));
    }
}
```

---

### Règle 5 — Un seul point par ligne

Ne chaînez pas plusieurs appels sur une seule ligne. Chaque ligne ne doit contenir qu'un seul `.` d'accès aux propriétés ou méthodes d'un objet *étranger*.

**Pourquoi ?** Chaque point supplémentaire est une dépendance cachée. C'est la [Loi de Déméter](https://fr.wikipedia.org/wiki/Loi_de_D%C3%A9m%C3%A9ter) : ne parlez qu'à vos amis directs.

> Exception : le *method chaining* sur un même objet (ex: builder, fluent API) est accepté.

#### ❌ Avant

```typescript
const topScorer = tournament.currentPhase.groups[0].teams[0].topScorer.name;
```

#### ✅ Après

```typescript
const group   = tournament.getCurrentGroup();
const team    = group.getLeader();
const scorer  = team.getTopScorer();
const name    = scorer.getName();
```

Ou mieux : déléguez la navigation à l'objet lui-même.

```typescript
const name = tournament.getLeadingTopScorerName();
```

---

### Règle 6 — Ne pas abréger

Pas de `t` pour `team`, pas de `pl` pour `player`, pas de `mgr` pour `manager`.

**Pourquoi ?** Les abréviations masquent l'intention. Si vous ressentez le besoin d'abréger, c'est souvent le signe que la méthode fait trop de choses.

#### ❌ Avant

```typescript
function calcPts(t: Team, res: MatchResult): number {
    let pts = 0;
    if (res === "W") pts = 3;
    else if (res === "D") pts = 1;
    return t.pts + pts;
}
```

#### ✅ Après

```typescript
function calculateUpdatedPoints(team: Team, result: MatchResult): number {
    const earnedPoints = pointsFor(result);
    return team.totalPoints + earnedPoints;
}

function pointsFor(result: MatchResult): number {
    if (result === MatchResult.Win)  return 3;
    if (result === MatchResult.Draw) return 1;
    return 0;
}
```

---

### Règle 7 — Garder les entités petites

- Classes : **< 50 lignes**
- Packages / modules : **< 10 fichiers**

**Pourquoi ?** Une classe courte a une seule responsabilité. Au-delà de 50 lignes, posez-vous la question : fait-elle trop de choses ?

#### ❌ Avant

```typescript
class MatchManager {
    // Score, arbitres, alignements, statistiques,
    // événements, VAR, composition d'équipes...
    // → 300 lignes, 20 méthodes
}
```

#### ✅ Après

```typescript
class Match {
    // Score, statut → ~30 lignes
}
class Lineup {
    // Titulaires, remplaçants → ~25 lignes
}
class MatchEvents {
    // Buts, cartons, remplacements → ~30 lignes
}
class VARDecision {
    // Décisions VAR → ~20 lignes
}
```

---

### Règle 8 — Pas plus de deux variables d'instance par classe

Une classe ne doit pas avoir plus de deux champs. Au-delà, regroupez-les en objets cohérents.

**Pourquoi ?** Forcer cette contrainte pousse à identifier les concepts qui vont naturellement ensemble — et à les nommer.

#### ❌ Avant

```typescript
class Player {
    name: string;
    age: number;
    nationality: string;
    clubName: string;
    clubLeague: string;
    goals: number;
    assists: number;
    minutesPlayed: number;
}
```

#### ✅ Après

```typescript
class Player {
    constructor(
        private readonly identity: PlayerIdentity,   // name, age, nationality
        private readonly stats: PlayerStats          // goals, assists, minutesPlayed
    ) {}
}

class PlayerIdentity {
    constructor(
        private readonly name: PlayerName,
        private readonly club: Club               // name + league
    ) {}
}

class PlayerStats {
    constructor(
        private readonly goals: number,
        private readonly assists: number
    ) {}

    totalContributions(): number { return this.goals + this.assists; }
}
```

---

### Règle 9 — Pas de getters / setters / propriétés publiques

N'exposez pas l'état interne d'un objet. Dites-lui quoi **faire**, ne lui demandez pas ses données.

**Pourquoi ?** C'est le principe *"Tell, don't ask"*. Un objet qui expose ses entrailles ne contrôle plus ses invariants — n'importe qui peut le mettre dans un état incohérent.

#### ❌ Avant

```typescript
class Score {
    homeGoals: number = 0;
    awayGoals: number = 0;
}

// Partout dans le code :
score.homeGoals++;
if (score.homeGoals > score.awayGoals) { ... }
```

#### ✅ Après

```typescript
class Score {
    private constructor(
        private readonly home: number,
        private readonly away: number
    ) {}

    static initial(): Score { return new Score(0, 0); }

    homeScores(): Score { return new Score(this.home + 1, this.away); }
    awayScores(): Score { return new Score(this.home, this.away + 1); }

    isHomeWinning(): boolean { return this.home > this.away; }
    isDraw(): boolean        { return this.home === this.away; }

    display(): string { return `${this.home} - ${this.away}`; }
}

// Utilisation :
let score = Score.initial();
score = score.homeScores();
console.log(score.display()); // "1 - 0"
```

---

## Récapitulatif

| # | Règle                               | Bénéfice principal                        |
|---|-------------------------------------|-------------------------------------------|
| 1 | Un niveau d'indentation par méthode | Méthodes courtes et testables             |
| 2 | Pas de `else`                       | Logique aplatie, early returns            |
| 3 | Encapsuler les primitives           | Validation centralisée, types expressifs  |
| 4 | Collections de première classe      | Comportement co-localisé avec les données |
| 5 | Un seul point par ligne             | Respect de la Loi de Déméter              |
| 6 | Ne pas abréger                      | Code auto-documenté                       |
| 7 | Entités petites                     | Single Responsibility naturel             |
| 8 | Max 2 variables d'instance          | Cohésion forcée, nouveaux concepts        |
| 9 | Pas de getters/setters              | Encapsulation réelle, Tell don't Ask      |

---

## La Communauté de l'Anneau

Le projet se trouve dans le répertoire [`lotr/`](lotr/).

Le code de `FellowshipOfTheRingService` viole plusieurs Object Calisthenics. En binôme :

1. **Identifiez** quelles règles sont violées et où
2. **Appliquez** les règles une par une, dans l'ordre — committer après chaque règle
3. Commencez par les règles les plus visibles : **#6** (abréviations), **#1** (indentation), **#2** (else), **#3** (primitives)

```csharp
public class FellowshipOfTheRingService
{
    private List<Character> members = new List<Character>();

    public void AddMember(Character character)
    {
        if (character == null)
        {
            throw new ArgumentNullException(nameof(character), "Character cannot be null.");
        }
        else if (string.IsNullOrWhiteSpace(character.N))
        {
            throw new ArgumentException("Character must have a name.");
        }
        else if (string.IsNullOrWhiteSpace(character.R))
        {
            throw new ArgumentException("Character must have a race.");
        }
        else if (character.W == null)
        {
            throw new ArgumentException("Character must have a weapon.");
        }
        else if (string.IsNullOrWhiteSpace(character.W.Name))
        {
            throw new ArgumentException("A weapon must have a name.");
        }
        else if (character.W.Damage <= 0)
        {
            throw new ArgumentException("A weapon must have a damage level.");
        }
        else
        {
            bool exists = false;
            foreach (var member in members)
            {
                if (member.N == character.N)
                {
                    exists = true;
                    break;
                }
            }

            if (exists)
            {
                throw new InvalidOperationException(
                    "A character with the same name already exists in the fellowship.");
            }
            else
            {
                members.Add(character);
            }
        }
    }

    public void UpdateCharacterWeapon(string name, string newWeapon, int damage)
    {
        foreach (var character in members)
        {
            if (character.N == name)
            {
                character.W = new Weapon
                {
                    Name = newWeapon,
                    Damage = damage
                };
                break;
            }
        }
    }

    public void RemoveMember(string name)
    {
        Character characterToRemove = null;
        foreach (var character in members)
        {
            if (character.N == name)
            {
                characterToRemove = character;
                break;
            }
        }

        if (characterToRemove == null)
        {
            throw new InvalidOperationException($"No character with the name '{name}' exists in the fellowship.");
        }
        else
        {
            members.Remove(characterToRemove);
        }
    }

    public void MoveMembersToRegion(List<string> memberNames, string region)
    {
        foreach (var name in memberNames)
        {
            foreach (var character in members)
            {
                if (character.N == name)
                {
                    if (character.C == "Mordor" && region != "Mordor")
                    {
                        throw new InvalidOperationException(
                            $"Cannot move {character.N} from Mordor to {region}. Reason: There is no coming back from Mordor.");
                    }
                    else
                    {
                        character.C = region;
                        if (region != "Mordor") Console.WriteLine($"{character.N} moved to {region}.");
                        else Console.WriteLine($"{character.N} moved to {region} 💀.");
                    }
                }
            }
        }
    }

    public void PrintMembersInRegion(string region)
    {
        List<Character> charactersInRegion = new List<Character>();
        foreach (var character in members)
        {
            if (character.C == region)
            {
                charactersInRegion.Add(character);
            }
        }

        if (charactersInRegion.Count > 0)
        {
            Console.WriteLine($"Members in {region}:");
            foreach (var character in charactersInRegion)
            {
                Console.WriteLine($"{character.N} ({character.R}) with {character.W.Name}");
            }
        }
        else if (charactersInRegion.Count == 0)
        {
            Console.WriteLine($"No members in {region}");
        }
    }

    public override string ToString()
    {
        var result = "Fellowship of the Ring Members:\n";
        foreach (var member in members)
        {
            result += $"{member.N} ({member.R}) with {member.W.Name} in {member.C}" + "\n";
        }

        return result;
    }
}
```

> **Conseil :** ne cherchez pas à tout corriger d'un coup. Une règle à la fois, avec les tests qui passent à chaque étape.

## Conclusion

Les Object Calisthenics ne sont pas des lois absolues — ce sont des **contraintes d'entraînement**.

Appliquées en kata, elles développent des réflexes :
- Extraire plutôt qu'imbriquer
- Nommer plutôt qu'abréger
- Encapsuler plutôt qu'exposer
- Décomposer plutôt qu'empiler

> "The power of the calisthenics is not in following them blindly, but in the conversations they provoke."

### Ce qu'on retient

- Un objet bien encapsulé **se valide lui-même** — pas besoin de gardes partout
- Les Value Objects rendent les **bugs impossibles à l'exécution** et les tests triviaux
- Des méthodes courtes à un seul niveau sont **testables unitairement sans mock**
- Tell, don't ask : **donnez des ordres à vos objets**, ne leur arrachez pas leurs données

## Ressources

- Série d'articles sur GoatReview :
  - [Object Calisthenics #1: Elevating Code Quality with 9 Powerful Rules](https://goatreview.com/object-calisthenics-9-rules-clean-code/)
  - [Object Calisthenics #2: Bringing Order to Chaos by Pierre](https://goatreview.com/object-calisthenics-9-rules-clean-code-implementation-pierre/)
  - [Object Calisthenics #3: Bringing Order to Chaos by Yoan](https://goatreview.com/object-calisthenics-9-rules-clean-code-implementation-yoan/)
  - [Object Calisthenics #4: Implementations explanations](https://goatreview.com/object-calisthenics-9-rules-clean-code-explanations/)
  - [Object Calisthenics #5: Other points of views](https://goatreview.com/object-calisthenics-5-other-points-of-views/)
- [Object Calisthenics — Jeff Bay (ThoughtWorks Anthology)](https://pragprog.com/titles/twa/thoughtworks-anthology/)
- [The ThoughtWorks Anthology — PDF extract](https://www.cs.helsinki.fi/u/luontola/tdd-2019/ext/ObjectCalisthenics.pdf)
- [Object Calisthenics — William Durand](https://williamdurand.fr/2013/06/03/object-calisthenics/)
- [Object Calisthenics applied to TypeScript](https://javflores.github.io/object-calisthenics/)
