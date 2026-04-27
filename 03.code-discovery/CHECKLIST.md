## Outside-In Discovery
### Lire le `README` / la documentation associée
- [ ] Un `README.md` existe-t-il ? Quelles infos te semblent importantes ?
- [ ] Y a-t-il une documentation expliquant comment lancer / comprendre le système ?
- [ ] Les décisions d'architecture ou les concepts métier sont-ils expliqués ?
- [ ] Si absent : quelles questions restent sans réponses ?

### Inspecter les pipelines CI/CD
- [ ] Y a-t-il un `.github/workflows/`, `.gitlab-ci.yml` ou une config CI équivalente ?
- [ ] Les builds/tests sont-ils déclenchés automatiquement sur push ou PR ?
- [ ] Les releases/déploiements sont-ils automatisés ?
- [ ] Des quality gates sont-elles configurées (tests, linting, vérifications de sécurité) ?
- [ ] Quelle est la durée de la feedback loop ?

> La CI/CD révèle comment le code est validé, testé et livré — et le niveau de confiance de l'équipe dans son processus.

### Inspecter l'historique Git
- [ ] Lancer `git log --oneline` et parcourir :
    - [ ] Les messages de commit sont-ils significatifs ?
    - [ ] L'activité est-elle récente ? Régulière ?
- [ ] Chercher des signes de churn ou de features abandonnées

### Compiler le code
- [ ] Le système peut-il être buildé et exécuté ?
- [ ] Y a-t-il des scripts de build ou des étapes d'installation automatisées ?
- [ ] Des blocages ou frictions lors de l'installation ?
- [ ] Première impression : le système "accueille-t-il" un nouveau développeur ?

#### Analyser les warnings de compilation
- [ ] Des technologies dépréciées ou des frameworks non maintenus ?
- [ ] Des vulnérabilités de sécurité signalées lors de l'installation ou du build ?
- [ ] Diversité de langages ou complexité de stack (ex. C#, VB.NET, JS) ?
- [ ] Ces signaux indiquent-ils de la dette technique ou un manque de maintenance ?

### Explorer l'UI
- [ ] Lancer l'application et identifier ses fonctionnalités principales

### Analyser la structure du code
- [ ] Faire correspondre les fonctionnalités aux composants ou APIs concernés
- [ ] Analyser la structure des dossiers : modularité claire ou code spaghetti ?
- [ ] Repérer les nommages vagues (`Manager`, `Helper`, etc.)
- [ ] Peut-on identifier où réside la logique métier ?

### Lister et analyser les dépendances
- [ ] Lister les dépendances back-end (`dotnet list ...`)
- [ ] Lister les dépendances front-end (`npm list --depth=0`)
- [ ] Identifier les points d'intégration : APIs, BDD, brokers (Kafka, Redis…)
- [ ] Les librairies sont-elles à jour ? Sécurisées ? Maintenues ?

### Dependencies freshness
- [ ] Installer et lancer [`libyear`](https://libyear.com/)
- [ ] Vérifier le drift des dépendances
- [ ] Prioriser les mises à jour critiques si nécessaire

### Collecter des métriques (si applicable)
> ⚠️ Chaque projet est différent — certains ont déjà des outils comme SonarCloud ou Stryker configurés.
D'autres nécessiteront d'installer les outils en local. Adapter en conséquence.

- [ ] Chercher des dashboards ou sorties CI existants (quality gates, badges, etc.)
- [ ] Consulter la couverture de tests (si disponible)
    - [ ] Quel est le taux de couverture ?
    - [ ] Les tests sont-ils significatifs ?
- [ ] Vérifier les résultats des tests de mutation (si disponibles)
- [ ] Lancer ou consulter les rapports d'analyse statique (`SonarCloud`, `ESLint`, etc.)
    - [ ] Code smells, bugs, complexité, duplications ?

### Identifier les Hotspots (Behavioral Code Analysis)
Utiliser [CodeScene](https://codescene.com/) ou [git truck](https://github.com/git-truck/git-truck) pour :
- [ ] Identifier les fichiers complexes et fréquemment modifiés
- [ ] Repérer les candidats au refactoring
- [ ] Visualiser les knowledge islands (fichiers à auteur unique)

### RGESN — Écoconception du service numérique
- [ ] Les images et médias sont-ils compressés et dimensionnés au plus juste ?
- [ ] Du code mort ou des fonctionnalités inutilisées sont-ils présents (JS chargé mais non exécuté, routes jamais appelées) ?
- [ ] Les dépendances front-end sont-elles maîtrisées — pas de librairie lourde pour un usage marginal ?
- [ ] Y a-t-il une stratégie de cache pour réduire les requêtes réseau répétées ?
- [ ] Les appels API sont-ils filtrés et paginés, ou charge-t-on systématiquement trop de données ?
- [ ] L'application est-elle mesurée avec un outil d'impact environnemental (`EcoIndex`, `GreenIT Analysis`) ?
- ...

### RGAA — Accessibilité du service numérique
- [ ] Les images ont-elles des attributs `alt` pertinents ?
- [ ] La navigation au clavier est-elle fonctionnelle (focus visible, ordre logique) ?
- [ ] Les contrastes de couleurs respectent-ils les ratios minimaux ?
- [ ] Les composants interactifs exposent-ils les bons rôles `ARIA` ?
- [ ] Des tests automatisés d'accessibilité sont-ils en place (`axe-core`, `Lighthouse`, `Wave`) ?

### Réflexion finale
- [ ] À quoi ressemblerait l'onboarding sur ce projet ?
- [ ] Quel est ton niveau de confiance pour faire un changement aujourd'hui ?
- [ ] Qu'améliorerais-tu en premier : la documentation, les tests, la structure ?
