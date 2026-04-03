# Atelier : Craft ou pas Craft ?
## Situation 1 — Le pipeline rouge “temporairement”
Le pipeline CI de l'équipe est rouge depuis 3 jours.

La cause : un test d’intégration flaky + un problème de configuration Docker.

L’équipe dit :

> “On sait d’où ça vient. On corrigera après la release.”

En attendant :

* Les PR sont mergées quand même.
* On vérifie “à la main” que ça passe en local.
* Le slack #ci-alert est muté.

La release est prévue dans 5 jours.

**Questions pour le groupe :**

* Est-ce acceptable ? Dans quelles conditions ?
* Quel est le vrai risque ?
* Que ferait une équipe Craft ?

---

## Situation 2 — Les tests qui “ralentissent”

Une dizaine de tests automatisés échouent depuis quelques jours.
Ils sont instables (dépendance à l’heure système + données partagées).

Contexte :

* Un gros client attend une nouvelle feature.
* La démo est dans 48h.
* Le PO insiste : “On ne peut pas rater ça.”

Proposition en daily :

> “On commente les tests pour l’instant. On les réactivera après.”

Quelqu’un ajoute :

> “De toute façon, on sait que ça marche.”

**Questions :**

* Est-ce un compromis acceptable ?
* Quelle alternative existe ?
* Qu’est-ce que ça dit de notre rapport à la qualité ?

---

## Situation 3 — La refacto qu’on repousse

Le module d’export PDF est devenu difficile à maintenir :

* 1 200 lignes dans un seul fichier
* Conditions imbriquées
* Duplication importante

À chaque modification, il faut :

* 2 heures pour comprendre
* 1 heure pour tester manuellement

Un dév propose :

> “On devrait refactorer avant d’ajouter la nouvelle option.”

Réponse :

> “On n’a pas le temps. On ajoutera juste un `if` de plus.”

**Questions :**

* Où est la dette ?
* Quel est le coût invisible ?
* Comment un artisan déciderait ?

---

## Situation 4 — Code Review express

Une PR de 1 500 lignes est ouverte :

* Nouvelle feature stratégique
* Deadline proche

Message dans Slack :

> “Quelqu’un peut valider rapidement ?”

La review dure 6 minutes.
Commentaire laissé :

> “Looks Good to ME”

Personne n’a exécuté le code localement.

**Questions :**

* Est-ce vraiment une review ?
* Qu’est-ce qu’on valide exactement ?
* Quelle est la responsabilité individuelle ici ?

---

## Situation 5 — “Ça marche en prod”

Un bug mineur est signalé par un utilisateur :

* Cas rare
* Aucun impact critique
* Corrigé rapidement… directement en production

Pas de test ajouté.
Pas de reproduction automatisée.
Pas d’analyse post-mortem.

Justification :

> “C’était trop petit pour en faire toute une histoire.”

**Questions :**
* Quelle opportunité a été manquée ?
* Que ferait un Software Crafter ?

---

## Faire émerger les pratiques :

* TDD
* Refactoring continu
* Clean Code
* Pair Programming
* Code Review exigeante
* CI/CD robuste
* Ownership produit
* Documentation vivante


> “Si c'était un produit artisanal, à quoi verrait-on la différence ?”

Faire formuler :

* Lisibilité du code
* Tests explicites
* Architecture intentionnelle
* Dette technique maîtrisée
* Feedback rapide
