/**
 * Script de test pour valider l'accordeur
 * À exécuter dans la console du navigateur ou comme module
 */

import { PitchDetector } from '../PitchDetector'
import { TunerTester } from './synth'

/**
 * Exécute les tests de validation de l'accordeur
 */
export async function runTunerTests(): Promise<void> {
  console.log('🎵 === TESTS DE VALIDATION DE L\'ACCORDEUR ===')
  console.log('')

  try {
    // Initialisation
    const pitchDetector = new PitchDetector(48000, 2048, 0.15, 0.8)
    const tester = new TunerTester(48000)

    console.log('🔧 Configuration:')
    console.log('   - Sample Rate: 48kHz')
    console.log('   - Buffer Size: 2048')
    console.log('   - Algorithme: YIN')
    console.log('   - Seuil confiance: 80%')
    console.log('')

    // Test complet
    const results = await tester.runFullTestSuite(pitchDetector)

    // Affichage des résultats de précision
    console.log('📊 === RÉSULTATS DE PRÉCISION ===')
    console.log('')
    
    results.accuracyResults.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌'
      const freq = result.frequency.toFixed(2)
      const detected = result.detectedFrequency.toFixed(2)
      const freqErr = result.frequencyError.toFixed(2)
      const centsErr = result.centsError.toFixed(1)
      const conf = (result.confidence * 100).toFixed(0)

      console.log(`${status} ${result.expectedNote} (${freq}Hz)`)
      console.log(`   Détecté: ${detected}Hz (${result.detectedNote})`)
      console.log(`   Erreur: ${freqErr}% fréq, ${centsErr}¢, confiance ${conf}%`)
      console.log('')
    })

    // Résumé précision
    const passedCount = results.accuracyResults.filter(r => r.passed).length
    const totalCount = results.accuracyResults.length
    const passRate = (passedCount / totalCount * 100).toFixed(1)

    console.log(`📈 Résumé précision: ${passedCount}/${totalCount} tests réussis (${passRate}%)`)
    console.log(`   Erreur fréquence moyenne: ${results.summary.averageFrequencyError.toFixed(2)}%`)
    console.log(`   Erreur cents moyenne: ${results.summary.averageCentsError.toFixed(1)}¢`)
    console.log('')

    // Affichage des résultats de robustesse
    console.log('🔊 === RÉSULTATS ROBUSTESSE AU BRUIT ===')
    console.log('')

    results.noiseResults.forEach(result => {
      const status = result.passed ? '✅' : '❌'
      const snr = result.snr
      const detRate = (result.detectionRate * 100).toFixed(1)
      const conf = (result.averageConfidence * 100).toFixed(0)
      const stab = result.stabilityScore.toFixed(1)

      console.log(`${status} SNR ${snr}dB`)
      console.log(`   Détection: ${detRate}%, Confiance: ${conf}%, Stabilité: ${stab}/100`)
      console.log('')
    })

    // Résumé final
    console.log('🎯 === RÉSUMÉ FINAL ===')
    console.log('')
    
    const overallStatus = results.summary.accuracyPassRate > 0.8 && results.summary.noiseRobustness
    const statusIcon = overallStatus ? '✅' : '❌'
    
    console.log(`${statusIcon} État général: ${overallStatus ? 'SUCCÈS' : 'ÉCHEC'}`)
    console.log(`   - Précision: ${passRate}% (seuil: 80%)`)
    console.log(`   - Robustesse bruit: ${results.summary.noiseRobustness ? 'OUI' : 'NON'}`)
    console.log(`   - Erreur moyenne: ${results.summary.averageCentsError.toFixed(1)}¢ (seuil: 3¢)`)
    console.log('')

    if (overallStatus) {
      console.log('🎉 L\'accordeur est prêt pour la production !')
    } else {
      console.log('⚠️  L\'accordeur nécessite des ajustements')
    }

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error)
  }
}

/**
 * Tests rapides pour validation de base
 */
export async function runQuickTests(): Promise<void> {
  console.log('⚡ Tests rapides de l\'accordeur...')

  const pitchDetector = new PitchDetector()
  const tester = new TunerTester()

  // Test sur La 440Hz uniquement
  const results = await tester.testFrequencyAccuracy(pitchDetector, 0.5, 3)
  const a440Result = results.find(r => Math.abs(r.frequency - 440) < 1)

  if (a440Result) {
    const status = a440Result.passed ? '✅' : '❌'
    console.log(`${status} La 440Hz: ${a440Result.detectedFrequency.toFixed(1)}Hz, ${a440Result.centsError.toFixed(1)}¢`)
  }

  console.log('⚡ Tests rapides terminés')
}

// Export pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).runTunerTests = runTunerTests;
  (window as any).runQuickTests = runQuickTests;
}
