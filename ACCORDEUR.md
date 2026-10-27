# Guide de Test de l'Accordeur 🎵

## Instructions de Test

### 1. Démarrage de l'Application
```bash
npm run dev
```

### 2. Accès à l'Accordeur
- Ouvrir l'application dans le navigateur
- Cliquer sur l'onglet "Accordeur" (icône 🎤)
- Autoriser l'accès au microphone quand demandé

### 3. Tests de Fonctionnement

#### Test Basique
1. Cliquer sur "Démarrer l'accordeur"
2. Jouer une note sur votre guitare
3. Vérifier que l'aiguille bouge et affiche la note

#### Test des Modes
1. **Mode Auto** : L'accordeur détecte automatiquement toute note
2. **Mode Corde** : Sélectionner une corde spécifique (E, A, D, G, B, E)

#### Test Son de Référence
1. Sélectionner une corde en mode "Corde"
2. Cliquer sur "Jouer le son de référence"
3. Écouter la note cible pour accorder votre guitare

### 4. Tests Techniques (Console)

Ouvrir la console du navigateur (F12) et exécuter :

```javascript
// Tests rapides
runQuickTests()

// Tests complets (plus long)
runTunerTests()
```

### 5. Mode Débogage

Ajouter `?debug=1` à l'URL pour voir :
- Forme d'onde en temps réel
- Analyse spectrale FFT
- Métriques de performance

Exemple : `http://localhost:5173/?debug=1`

## Paramètres Recommandés

### Pour Guitare Acoustique
- Calibration A4 : 440 Hz
- Sensibilité : 80%
- Seuil de bruit : -40 dB

### Pour Guitare Électrique
- Calibration A4 : 440 Hz
- Sensibilité : 85%
- Seuil de bruit : -35 dB

### Environnement Bruyant
- Sensibilité : 70%
- Seuil de bruit : -30 dB

## Résolution de Problèmes

### L'accordeur ne démarre pas
- Vérifier les permissions microphone dans le navigateur
- Essayer de recharger la page
- Vérifier qu'aucune autre app n'utilise le micro

### Détection instable
- Jouer les notes plus clairement
- Réduire le bruit ambiant
- Ajuster le seuil de bruit dans les paramètres avancés

### Pas de détection
- Augmenter la sensibilité
- Vérifier le niveau du micro
- S'assurer que l'instrument est audible

### Fausses détections
- Réduire la sensibilité
- Augmenter le seuil de bruit
- Éviter de parler près du micro

## Accordages Supportés

- **Standard** : E-A-D-G-B-E
- **Drop D** : D-A-D-G-B-E  
- **DADGAD** : D-A-D-G-A-D
- **Open G** : D-G-D-G-B-D
- **Open D** : D-A-D-F#-A-D

## Performances Attendues

### Précision
- ±3 cents sur signaux propres
- ±5 cents en conditions normales
- ±10 cents en environnement bruyant

### Latence
- < 50ms sur Chrome/Firefox récents
- < 80ms sur navigateurs plus anciens
- Variable selon l'appareil

### Robustesse
- Fonctionne jusqu'à SNR 15dB
- Détection vocale pour éviter interférences
- Filtrage automatique des signaux faibles

## Notes Techniques

L'accordeur utilise :
- **Algorithme YIN** pour la détection de pitch
- **AudioWorklet** pour le traitement temps réel
- **Lissage exponentiel** pour la stabilité
- **Porte de bruit** pour filtrer les parasites

Développé spécifiquement pour les guitares avec optimisations pour les fréquences 82-659 Hz.
