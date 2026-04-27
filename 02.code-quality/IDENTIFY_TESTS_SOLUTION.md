# Activité — Identifier les types de tests

### Snippet A — Test unitaire *(Unit Test)*
**Objectif :** Vérifier qu'une unité de logique isolée (fonction, classe) produit le bon résultat pour des entrées données. Chaque test couvre un comportement précis et doit être indépendant des autres.

**Indices :** Aucune dépendance externe. On teste une seule fonction pure (`calculerBrelan`). Pas de base de données, pas de réseau, pas de mock. Rapide, déterministe, isolation totale.

**Pyramide des tests :** Base de la pyramide — le plus nombreux.

### Snippet B — Test unitaire avec doublure de test *(Unit Test + Mock)*

**Objectif :** Vérifier le comportement d'un composant en isolation complète, en remplaçant ses collaborateurs par des doublures contrôlées. Permet de tester les interactions (qui appelle quoi, avec quels arguments) sans déclencher d'effets de bord.

**Indices :** On utilise `vi.fn()` pour remplacer le vrai `ScoreRepository` par un faux. On teste uniquement le comportement de `GameService` en isolation, sans couche d'infrastructure. L'assertion porte sur **l'interaction** (est-ce que `sauvegarder` a été appelé avec les bons arguments ?) et non sur un état.

**Nuance :** C'est toujours un test unitaire, mais orienté comportement (interaction-based testing) plutôt que résultat (state-based testing).

### Snippet C — Test d'intégration *(Integration Test — narrow)*

**Objectif :** Vérifier que deux composants réels fonctionnent correctement ensemble, sans infrastructure externe. Détecte les problèmes à la jonction entre modules (contrats d'interface, sérialisation, logique partagée).

**Indices :** Deux vrais composants collaborent ensemble : `GameService` + `InMemoryScoreRepository`. Pas de mock. Mais toujours en mémoire — pas de base de données réelle, pas de réseau. On vérifie que les deux modules fonctionnent correctement **ensemble**.

**Terminologie Fowler :** *Narrow integration test* (périmètre limité, pas d'infrastructure réelle).

### Snippet D — Test d'intégration *(Integration Test — broad)*

**Objectif :** Vérifier que le code applicatif s'intègre correctement avec une infrastructure réelle (base de données, système de fichiers, service tiers). Détecte les erreurs de configuration, de mapping ORM, de migration ou de requête SQL que les tests in-memory ne peuvent pas attraper.

**Indices :** On utilise une vraie base de données PostgreSQL (de test). Le `beforeAll` lance une migration, le `afterAll` nettoie. Le test traverse l'infrastructure réelle. Plus lent, plus fragile, mais plus fidèle à la production.

**Terminologie Fowler :** *Broad integration test* (infrastructure réelle incluse).

**Risque :** Ces tests sont plus coûteux — à doser dans la pyramide.

### Snippet E — Test End-to-End *(E2E Test)*

**Objectif :** Valider un parcours utilisateur complet à travers toute la stack applicative, exactement comme le ferait un utilisateur réel. Garantit que toutes les couches (routing, authentification, service, base de données) fonctionnent de concert pour un cas d'usage métier critique.

**Indices :** On passe par l'**API HTTP** avec `supertest`. Le test orchestre un scénario utilisateur complet : créer une partie → lancer les dés → scorer → consulter le classement. Toute la stack est en jeu (routing, service, repo, DB).

**Pyramide des tests :** Sommet de la pyramide — peu nombreux, lents, précieux pour valider les parcours critiques.

### Snippet F — Test de snapshot *(Snapshot Test)*

**Objectif :** Figer la structure d'une sortie complexe (objet JSON, HTML, texte formaté) pour détecter toute modification involontaire lors d'un refactoring. Le test ne vérifie pas que la sortie est "correcte", mais qu'elle n'a **pas changé** par rapport à la référence approuvée.

**Indices :** `toMatchSnapshot()` sérialise la valeur retournée et la compare à une référence stockée sur disque (générée au premier run). Utile pour détecter des **régressions involontaires** dans la structure de sortie (HTML, JSON, texte formaté).

**Attention :** Les snapshots doivent être revus lors de chaque modification intentionnelle — ils ne remplacent pas une assertion explicite.

### Snippet G — Test de performance *(Performance Test / Benchmark)*

**Objectif :** Mesurer le temps d'exécution et le débit d'une portion de code pour détecter des régressions de performance ou comparer des approches alternatives. Contrairement aux autres tests, on ne vérifie pas un résultat — on mesure une **vitesse**.

**Indices :** Mot-clé `bench` de Vitest. Pas d'assertion `expect` — on mesure le **temps d'exécution** et le **throughput** (opérations par seconde). Vitest génère un rapport comparatif entre les runs.

**Usage :** Détecter des régressions de performance lors d'un refactoring, ou comparer des implémentations alternatives.

### Snippet H — Test de non-régression *(Regression Test)*

**Objectif :** S'assurer qu'un bug corrigé ne réapparaît jamais. Ces tests sont écrits *après* (ou pendant) la correction d'un incident, et servent de filet de sécurité permanent. Ils documentent aussi l'historique des incidents dans le code.

**Indices :** Le commentaire mentionne un **bug en production** (#412) et la version du correctif. L'objectif est de **verrouiller le comportement corrigé** pour qu'il ne régresse jamais. Structurellement, c'est un test unitaire — mais son intention est différente : il documente un incident passé.

**Bonne pratique :** Tout bug corrigé devrait générer un test de non-régression avant le fix (`TDD` de bug).

## Pour aller plus loin

Quelques types de tests non représentés dans l'activité :

| Type                  | Description                                                                                               | Outil                                              |
|-----------------------|-----------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| **Test de mutation**  | Vérifie que vos tests détectent vraiment les bugs en introduisant volontairement des erreurs dans le code | [Stryker](https://stryker-mutator.io/)             |
| **Test de propriété** | Génère des centaines de cas aléatoires pour trouver des cas limites                                       | [fast-check](https://github.com/dubzzz/fast-check) |
| **Test de contrat**   | Vérifie que producteur et consommateur d'une API partagent le même contrat                                | [Pact](https://pact.io/)                           |
| **Test de charge**    | Simule des milliers d'utilisateurs simultanés                                                             | [k6](https://k6.io/)                               |
| **Test exploratoire** | Manuel, sans script — le testeur explore librement pour trouver ce que les tests automatisés ratent       | —                                                  |
