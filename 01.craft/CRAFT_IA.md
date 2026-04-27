## Le Craft à l'heure de l'IA
### 1. L’IA change la façon de coder… mais pas ce que “bien coder” veut dire

- Les outils comme Copilot, ChatGPT ou CodeWhisperer permettent de produire du code très vite.
- Mais **vitesse ≠ productivité**.
- Le vrai enjeu est : **est-ce que le logiciel est correct, maintenable et aligné avec le besoin métier ?**

### 2. La productivité est une propriété du système, pas du clavier

- Produire du code plus vite peut **augmenter les bugs, la dette technique et les régressions**.
- La vraie productivité = livrer **des changements sûrs, compréhensibles et faciles à faire évoluer**.
- Sans bonnes pratiques, l’IA **accélère surtout le chaos**.

### 3. Les développeurs passent surtout leur temps à comprendre, pas à taper

- Moins de **25 % du temps** est consacré à écrire du code.
- Le reste est passé à :
    - lire du code
    - comprendre le système
    - analyser des bugs
    - discuter du besoin
- Si le code est mal structuré, **l’IA n’aide pas — elle empire le problème**.

### 4. Ce qui rend un code difficile à comprendre

Les principaux freins à la productivité :

- Mauvaise modularisation
- Noms flous ou incohérents
- Complexité excessive
- Peu ou pas de tests utiles
- Tests mauvais ou verbeux
- Duplication de logique

L’IA génère plus de code, mais **ne corrige aucun de ces problèmes**.

### 5. L’IA transforme un langage flou en code précis… souvent mal

- Les humains écrivent des **prompts vagues**.
- L’IA se base sur un **code existant souvent mal conçu**.
- Résultat : elle **reproduit et amplifie les mauvais patterns** :
    - grosses classes encore plus grosses
    - duplications
    - abstractions manquantes
- **Un mauvais code engendre plus de mauvais code.**

### 6. L’IA accélère la perte de compréhension

- Quand l’IA écrit le code :
    - le développeur **n’a pas fait l’effort mental** de conception
    - il **ne comprend parfois pas ce qu’il a “écrit”**
- La connaissance :
    - n’est plus dans la tête des gens
    - elle est “dans l’outil”
- Le système devient un **black box** pour l’équipe.

### 7. L’IA casse la discipline des revues de code

- Les PR deviennent :
    - énormes
    - complexes
    - impossibles à revoir sérieusement
- Les reviewers **survolent ou valident sans comprendre**.
- Cela détruit :
    - la qualité
    - le partage de connaissance
    - la cohérence du design

Le craftsmanship recommande : **petits changements, bien délimités et compréhensibles.**

### 8. La perte de sémantique est le vrai danger

- Le code doit exprimer :
    - le **métier**
    - les **intentions**
    - les **responsabilités**
- Sans structure claire (DDD, modules, bons noms), l’IA :
    - introduit du **drift sémantique**
    - multiplie les incohérences
- Le système fonctionne… mais **n’a plus de sens**.

### 9. Les tests avec l’IA : danger ou opportunité

- Beaucoup génèrent :
    - le code d’abord
    - les tests après avec l’IA

> Les tests deviennent une **validation de bugs**, pas une aide au design.

Mais bien utilisée :

- L’IA peut aider à faire du **TDD guidé par le sens**
- Les tests peuvent redevenir :
    - une **spécification**
    - un **outil de conception**

### 10. Le Craft est encore plus important avec l’IA

Il apporte :

- Clarté du code
- Intentions explicites
- Bons tests
- Bon découpage
- Revue et responsabilité

L’IA devient alors :

> **un amplificateur de qualité, pas un amplificateur de désordre.**
>

### 11. Conclusion

- L’IA est un **moteur**
- Le Software Craftsmanship est une **boussole**

Sans craftsmanship :

> On va vite… mais dans la mauvaise direction.
>

Avec craftsmanship :

> On va plus vite **et** on construit quelque chose de durable.
>

*“AI is the engine. Craftsmanship is the compass.”*