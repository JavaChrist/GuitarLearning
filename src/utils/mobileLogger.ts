// Logger personnalisé pour affichage mobile
export class MobileLogger {
  private static instance: MobileLogger
  private logCallback: ((message: string) => void) | null = null

  private constructor() {}

  static getInstance(): MobileLogger {
    if (!MobileLogger.instance) {
      MobileLogger.instance = new MobileLogger()
    }
    return MobileLogger.instance
  }

  setCallback(callback: (message: string) => void) {
    this.logCallback = callback
  }

  log(message: string) {
    console.log(message)
    if (this.logCallback) {
      this.logCallback(`${new Date().toLocaleTimeString()}: ${message}`)
    }
  }
}

export const mobileLogger = MobileLogger.getInstance()
