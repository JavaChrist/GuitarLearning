# Guitar Learning - Accordeur de Guitare 🎸

Application d'apprentissage de la guitare avec accordeur intégré haute précision, développée avec Vite + React + TypeScript + Tailwind CSS.

## 🎵 Fonctionnalités de l'Accordeur

### Détection de Pitch Haute Précision
- **Algorithmes YIN et MPM** : Détection de fréquence fondamentale avec précision ≤ ±3 cents
- **Plage étendue** : Support complet de E2 à C6 (82-2093 Hz)
- **Latence ultra-faible** : < 50-80ms du microphone à l'affichage
- **AudioWorklet** : Traitement audio dans un thread séparé pour des performances optimales

### Modes d'Accordage
- **Mode Automatique** : Détection automatique de la note jouée
- **Mode Corde Spécifique** : Accordage ciblé corde par corde
- **Accordages Prédéfinis** :
  - Standard (E-A-D-G-B-E)
  - Drop D
  - DADGAD
  - Open G
  - Open D

### Interface Utilisateur Intuitive
- **Aiguille analogique** : Jauge fluide -50 à +50 cents avec animations 60fps
- **LEDs de qualité** : Indicateurs visuels Trop bas / Juste / Trop haut
- **Affichage note** : Note détectée avec octave et fréquence
- **Design responsive** : Optimisé mobile-first avec support tactile

### Fonctionnalités Avancées
- **Calibration A4** : Réglable de 415 à 466 Hz (baroque à moderne)
- **Son de référence** : Oscillateur WebAudio intégré
- **Porte de bruit** : Filtrage intelligent des signaux faibles
- **Détection vocale** : Évite les interférences de la voix
- **Retour haptique** : Vibration quand l'accordage est juste

## 🏗️ Architecture Technique

### Structure des Fichiers
```
src/
├── pages/
│   └── TunerPage.tsx              # Page principale de l'accordeur
├── components/tuner/
│   ├── Needle.tsx                 # Aiguille analogique avec animation
│   ├── PitchReadout.tsx          # Affichage note + fréquence
│   ├── QualityLED.tsx            # Indicateurs visuels d'accordage
│   ├── StringSelector.tsx        # Sélection mode/corde/accordage
│   ├── Controls.tsx              # Contrôles calibration/paramètres
│   └── SpectrumDebug.tsx         # Débogage FFT (mode ?debug=1)
├── tuner/
│   ├── TunerEngine.ts            # Moteur principal
│   ├── PitchDetector.ts          # Détection YIN/MPM
│   ├── filters/
│   │   └── NoiseGate.ts          # Filtrage du bruit
│   └── tests/
│       └── synth.ts              # Tests avec signaux synthétiques
├── hooks/
│   └── useReferenceAudio.ts      # Hook audio de référence
└── public/
    └── tuner-audio-worklet.js    # AudioWorklet pour performances
```

### Moteur de Détection
- **PitchDetector.ts** : Implémentation YIN et MPM avec interpolation parabolique
- **TunerEngine.ts** : Mapping fréquence/note, gestion d'état, lissage
- **NoiseGate.ts** : Porte de bruit avec détection vocale

### Traitement Audio
- **getUserMedia** : Accès microphone avec paramètres optimisés
- **AudioWorklet** : Traitement temps réel (fallback ScriptProcessorNode)
- **Fenêtrage Hanning** : Réduction des artefacts spectraux
- **Lissage exponentiel** : Stabilisation de l'affichage

## 🧪 Tests et Validation

### Tests Automatisés
Le système inclut une suite de tests complète avec signaux synthétiques :

```typescript
import { PitchDetector } from './tuner/PitchDetector'
import { TunerTester } from './tuner/tests/synth'

const detector = new PitchDetector()
const tester = new TunerTester()

// Test de précision sur les fréquences de guitare
const results = await tester.runFullTestSuite(detector)
```

### Critères de Validation
- **Précision fréquence** : ≤ 0.5% d'erreur sur les notes de guitare
- **Précision cents** : ≤ ±3 cents sur signaux propres
- **Stabilité** : Écart-type < 5 cents sur 2 secondes
- **Robustesse bruit** : Fonctionnel avec SNR ≥ 20dB

### Fréquences de Test
- E2 (82.41 Hz) - 6ème corde
- A2 (110.00 Hz) - 5ème corde  
- D3 (146.83 Hz) - 4ème corde
- G3 (196.00 Hz) - 3ème corde
- B3 (246.94 Hz) - 2ème corde
- E4 (329.63 Hz) - 1ère corde
- A4 (440.00 Hz) - Référence
- E5 (659.25 Hz) - 12ème frette

## 🚀 Installation et Utilisation

### Prérequis
- Node.js 18+
- Navigateur moderne avec support WebAudio
- Microphone fonctionnel
- HTTPS requis pour getUserMedia (automatique en production)

### Installation
```bash
npm install
npm run dev
```

### Utilisation
1. Ouvrir l'application
2. Naviguer vers l'onglet "Accordeur" 🎤
3. Autoriser l'accès au microphone
4. Choisir le mode (Auto/Corde spécifique)
5. Jouer une note et ajuster selon l'aiguille

### Mode Débogage
Ajouter `?debug=1` à l'URL pour afficher :
- Forme d'onde temporelle
- Analyse spectrale FFT
- Métriques de performance

## ⚙️ Configuration

### Paramètres Disponibles
- **Calibration A4** : 415-466 Hz (défaut: 440 Hz)
- **Sensibilité** : 10-99% (défaut: 80%)
- **Seuil de bruit** : -60 à 0 dB (défaut: -40 dB)
- **Seuils d'accordage** :
  - Juste : ±5 cents (vert)
  - Acceptable : ±15 cents (orange)
  - Désaccordé : >±15 cents (rouge)

### Sauvegarde
Les paramètres sont automatiquement sauvegardés dans `localStorage`.

## 🎯 Limitations et Conseils

### Limitations Techniques
- **Instruments** : Optimisé pour guitare acoustique/électrique
- **Environnement** : Nécessite un environnement relativement calme
- **Polyphonie** : Détection monophonique uniquement
- **Latence** : Variable selon le navigateur et l'appareil

### Conseils d'Utilisation
- **Environnement calme** : Évitez les bruits de fond
- **Notes claires** : Jouez les notes distinctement, une par une
- **Distance microphone** : 20-50cm de l'instrument
- **Tension progressive** : Accordez en montant progressivement
- **Vérification** : Contrôlez l'accordage sur plusieurs octaves

### Dépannage
- **Pas de détection** : Vérifiez les permissions microphone
- **Détection instable** : Augmentez le seuil de bruit
- **Fausses détections** : Réduisez la sensibilité
- **Latence élevée** : Utilisez un navigateur récent (Chrome/Firefox)

## 🔧 Développement

### Scripts Disponibles
```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Aperçu du build
npm run deploy   # Déploiement Vercel
```

### Tests
```bash
# Tests unitaires (à implémenter)
npm run test

# Tests manuels avec signaux synthétiques
# Utiliser la classe TunerTester dans la console du navigateur
```

### Architecture PWA
- Service Worker pour le cache
- Manifest pour l'installation
- Icônes adaptatives
- Support hors-ligne partiel

## 📱 Compatibilité

### Navigateurs Supportés
- ✅ Chrome 88+ (recommandé)
- ✅ Firefox 84+
- ✅ Safari 14.1+
- ✅ Edge 88+
- ❌ Internet Explorer (non supporté)

### Appareils
- 📱 **Mobile** : iOS 14.5+, Android 8+
- 💻 **Desktop** : Windows, macOS, Linux
- 🎧 **Audio** : Microphone intégré ou externe

## 🤝 Contribution

Les contributions sont les bienvenues ! Zones d'amélioration prioritaires :
- Tests unitaires automatisés
- Support d'autres instruments
- Algorithmes de détection alternatifs
- Amélioration de l'UI/UX
- Optimisations performances

## 📄 Licence

Ce projet est sous licence MIT. Voir `LICENSE` pour plus de détails.

---

**Guitar Learning** - Développé avec ❤️ pour les musiciens
