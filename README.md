# Guitar Learning

Guitar Learning est une application web en français pour apprendre la guitare. Elle propose un accordeur au microphone, une bibliothèque de diagrammes d’accords, des diagrammes de gammes pentatoniques et des exercices de tablature. Tout le contenu est intégré à l’application : il n’y a ni compte, ni serveur, ni base de données.

L’interface s’adresse aux personnes qui débutent ou qui progressent à la guitare. L’écran Paramètres indique que l’application est développée par Christian. Le numéro affiché est 1.0.0, alors que `package.json` indique la version `0.0.0`.

Aucun fichier `AGENTS.md` ou `.cursorrules` n’est présent dans le dépôt. Le guide `ACCORDEUR.md` décrit des essais de l’accordeur ; son exemple d’adresse utilise le port 5173, alors que le serveur de développement est configuré sur le port **3005**.

## Fonctionnalités

La navigation se fait par une barre en bas de l’écran. Les sections sont Accueil, Accords, Gammes, Exercices, Accordeur et Paramètres. Le changement de page reste dans la mémoire du navigateur : l’adresse ne change pas. Les cartes de l’accueil ne sont pas des liens.

### Opérationnelles

- **Accueil.** Présente l’application et oriente vers la barre de navigation.
- **Accords.** Affiche des diagrammes fixes, avec les doigtés, les cordes à vide et les cordes non jouées. Un filtre permet de garder les accords faciles, moyens ou difficiles. Les groupes sont :
  - majeurs : C, G, D, A, E, F ;
  - mineurs : Am, Em, Dm, Bm, Fm, Cm ;
  - septièmes : G7, C7, D7, A7, E7, B7 ;
  - barrés : F, Bm, F#m, B.
- **Gammes pentatoniques.** Deux diagrammes sont disponibles : pentatonique mineure de La et pentatonique majeure de Do. Chaque diagramme propose cinq positions sur le manche. Les notes sont colorées selon leur degré.
- **Accordeur.** Après autorisation du microphone, l’application détecte une note à la fois avec l’algorithme YIN. Elle affiche le nom français de la note, l’octave, la fréquence, une aiguille de −50 à +50 cents et des voyants trop bas, juste et trop haut. Le seuil « juste » est de ±5 cents, le seuil « acceptable » de ±15 cents.
- **Modes d’accordage.** Le mode automatique reconnaît la note jouée. Le mode corde vise une corde précise. Les accordages proposés sont Standard (E-A-D-G-B-E), Drop D, DADGAD, Sol ouvert (Open G) et Ré ouvert (Open D).
- **Réglages de l’accordeur.** La référence du La peut aller de 415 à 466 Hz (440 Hz par défaut). La sensibilité va de 10 % à 99 % (80 % par défaut). Le seuil de bruit va de −60 dB à 0 dB (−40 dB par défaut). Ces réglages sont enregistrés dans le navigateur, sous la clé `tuner-settings`. Un bouton les remet aux valeurs de départ. Sur iPhone et iPad, le premier démarrage utilise une sensibilité de 60 % et un seuil de −35 dB, tant qu’aucun réglage n’a été enregistré.
- **Son de référence de l’accordeur.** Un oscillateur joue la fréquence de la corde choisie, ou 440 Hz si aucune cible n’est définie.
- **Retour du téléphone.** Quand l’accordeur juge la note juste, l’appareil vibre brièvement si le navigateur le permet.
- **Aide en cas de refus du microphone.** Un message explique comment autoriser le micro.
- **Paramètres.** Écran d’information : version affichée, nom du développeur et courte description. Il ne contient aucun réglage.

### Partielles

- **Lecture des exercices.** Cinq tablatures pentatoniques sont proposées, avec un réglage de tempo (60 à 200 BPM) et de volume. Le bouton Play met en évidence la première note. Lors d’un essai dans le navigateur, les notes suivantes ne se succèdent pas : la tablature reste sur la première note pendant que le bouton affiche Pause.
- **Son des exercices.** Le son est un signal synthétique. Sa hauteur correspond à une octave fixe (autour du Do du milieu), et non à la hauteur réelle de la frette indiquée.
- **Exercice « Hammer-on/Pull-off ».** C’est une suite de notes sur les mêmes cordes. Aucun geste particulier n’est animé.
- **Filtres des gammes.** Les boutons Majeure, Mineure et Modale existent, mais aucune gamme n’a ces catégories. Ils affichent « Aucune gamme ne correspond aux filtres sélectionnés ». Seules les deux pentatoniques sont présentes, alors que le titre de la page parle de « Gammes et Modes ».
- **Détection de la voix.** Hors iPhone et iPad, l’accordeur estime si le son ressemble à une voix et peut l’indiquer. Cette estimation est désactivée sur iPhone et iPad. Elle ne coupe pas la détection de note.
- **Second algorithme (MPM).** Il est présent dans le moteur, avec un réglage interne `useYIN`. L’écran affiche toujours « YIN » et ne permet pas de changer d’algorithme.
- **Indication de latence.** L’écran affiche « ~50 ms » comme texte fixe. Ce n’est pas une mesure du moment.
- **Mode debug.** Ajouter `?debug=1` à l’adresse prépare un affichage de forme d’onde et de spectre. Il n’apparaît que lorsque l’accordeur est déjà démarré.
- **Application installable.** Un manifeste et des icônes sont fournis, et l’outil de construction peut générer un service worker. Au chargement de la page, un script retire les service workers et vide les caches. Le fonctionnement hors ligne n’est donc pas actif. Les raccourcis du manifeste (`?page=tuner`, `?page=chords`, `?page=exercises`) rouvrent l’accueil : l’application ne lit pas ces adresses.
- **Tests de l’accordeur.** Des essais sur signaux synthétiques existent dans `src/tuner/tests`. Ils ne sont pas chargés par l’application, et `package.json` ne contient pas de commande `npm test`. Les fonctions de console citées dans `ACCORDEUR.md` ne sont donc pas disponibles dans la page ouverte.

### Simulées

- Le texte d’accueil parle de diagrammes d’accords interactifs, de gammes majeures et mineures pour improviser, et d’exercices adaptés au niveau. Les diagrammes d’accords sont des images fixes, les gammes disponibles sont uniquement pentatoniques, et les exercices ne suivent pas une progression enregistrée.
- L’exercice nommé hammer-on et pull-off reprend le même lecteur que les autres tablatures.

### Prévues

L’écran Exercices annonce, sous le titre « Prochainement » :

- exercices d’arpèges animés ;
- gammes majeures et mineures en exercice ;
- techniques de bending et de vibrato ;
- métronome visuel ;
- suivi des progrès ;
- exercices de rythme.

Aucune de ces fonctions n’est implémentée. Il n’y a pas de compte, d’historique ni de personnalisation.

## Stack

- React 19 et TypeScript
- Vite 7
- Tailwind CSS 4
- Lucide React pour les icônes
- Web Audio et `getUserMedia` pour le microphone et les sons
- AudioWorklet (`public/tuner-audio-worklet.js`), avec repli sur `ScriptProcessorNode`, notamment sur iPhone et iPad
- `vite-plugin-pwa` pour le manifeste

L’application est une seule page. Les données d’accords, de gammes et d’exercices sont des fichiers TypeScript dans `src/data`.

## Installation

Prérequis : Node.js compatible avec Vite 7. Le projet ne déclare pas de version minimale dans `package.json`. Un navigateur récent avec accès au microphone est nécessaire pour l’accordeur. En ligne, le navigateur exige une adresse sécurisée (HTTPS) pour le microphone.

```bash
npm install
npm run dev
```

Le serveur de développement écoute sur le port **3005** et accepte les connexions du réseau local :

```text
http://localhost:3005/
```

## Configuration

Aucune variable d’environnement n’est lue par l’application. Les fichiers `.env` sont ignorés par Git, mais aucun n’est fourni et aucun nom de variable n’est utilisé.

Les seuls réglages persistants sont ceux de l’accordeur, stockés localement dans le navigateur.

## Commandes

```bash
npm run dev       # serveur de développement, port 3005
npm run build     # vérification TypeScript puis construction
npm run preview   # aperçu du dossier construit
npm run deploy    # construction puis commande Vercel de production
```

La commande `deploy` est définie, mais le dépôt ne contient pas de fichier de configuration Vercel ni d’adresse publique. Elle ne doit pas être lancée pour vérifier le projet en local.

Il n’existe pas de commande de test. Aucun fichier `LICENSE` n’est présent : la licence reste à confirmer.

## Limites utiles

- L’accordeur traite une note à la fois. Il est prévu pour une guitare, dans un endroit plutôt calme.
- La plage acceptée par le détecteur va d’environ 70 Hz à 2 200 Hz.
- Les précisions en cents citées dans d’anciennes notes sont des critères des essais synthétiques. Elles ne sont pas mesurées dans l’interface.
- L’accueil et les conseils restent des textes : ils ne lancent pas les pages, un métronome ou une piste d’accompagnement.

## Structure utile

```text
src/
├── App.tsx                         # choix de la page affichée
├── components/
│   ├── Home.tsx, Chords.tsx, Scales.tsx, Exercises.tsx, Settings.tsx
│   ├── ChordDiagram.tsx, ScaleDiagram.tsx, AnimatedTablature.tsx
│   └── tuner/                      # aiguille, voyants, cordes, réglages
├── pages/TunerPage.tsx
├── data/                           # accords, gammes, exercices
├── tuner/                          # moteur, détection, filtre, essais
└── hooks/useReferenceAudio.ts
public/
├── manifest.json
└── tuner-audio-worklet.js
```
