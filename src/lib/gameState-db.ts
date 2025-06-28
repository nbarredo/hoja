import { databaseManager } from './database-lowdb'

export interface GameState {
  hitPoints: {
    maximum: number
    current: number
  }
  shields: Record<string, {
    points: number
    current: number
    source: string
    canBeHealed: boolean
    special?: string
  }>
  spellSlots: Record<string, {
    total: number
    used: number
  }>
  longRestAbilities: Record<string, {
    total: number
    used: number
  }>
  legendaryResistances: {
    total: number
    used: number
  }
  lastUpdated: number
}

class DatabaseGameStateManager {
  private static instance: DatabaseGameStateManager
  private listeners: Set<() => void> = new Set()

  private constructor() {}

  static getInstance(): DatabaseGameStateManager {
    if (!DatabaseGameStateManager.instance) {
      DatabaseGameStateManager.instance = new DatabaseGameStateManager()
    }
    return DatabaseGameStateManager.instance
  }

  // Subscribe to state changes
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Notify all listeners of state changes
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener())
  }

  async getCharacterData(): Promise<any> {
    return await databaseManager.getCharacterData()
  }

  async getState(): Promise<GameState> {
    return await databaseManager.getGameState()
  }

  async updateHP(current: number): Promise<void> {
    await databaseManager.updateHP(current)
    this.notifyListeners()
  }

  async updateShield(shieldType: string, current: number): Promise<void> {
    await databaseManager.updateShield(shieldType, current)
    this.notifyListeners()
  }

  async useSpellSlot(level: string): Promise<void> {
    const gameState = await databaseManager.getGameState()
    const slot = gameState.spellSlots[level]
    if (slot && slot.used < slot.total) {
      await databaseManager.updateSpellSlot(level, slot.used + 1)
      this.notifyListeners()
    }
  }

  async restoreSpellSlot(level: string): Promise<void> {
    const gameState = await databaseManager.getGameState()
    const slot = gameState.spellSlots[level]
    if (slot && slot.used > 0) {
      await databaseManager.updateSpellSlot(level, slot.used - 1)
      this.notifyListeners()
    }
  }

  async useLongRestAbility(name: string): Promise<void> {
    const gameState = await databaseManager.getGameState()
    const ability = gameState.longRestAbilities[name]
    if (ability && ability.used < ability.total) {
      await databaseManager.updateLongRestAbility(name, ability.used + 1)
      this.notifyListeners()
    }
  }

  async restoreLongRestAbility(name: string): Promise<void> {
    const gameState = await databaseManager.getGameState()
    const ability = gameState.longRestAbilities[name]
    if (ability && ability.used > 0) {
      await databaseManager.updateLongRestAbility(name, ability.used - 1)
      this.notifyListeners()
    }
  }

  async useLegendaryResistance(): Promise<void> {
    const gameState = await databaseManager.getGameState()
    if (gameState.legendaryResistances.used < gameState.legendaryResistances.total) {
      await databaseManager.updateLegendaryResistances(gameState.legendaryResistances.used + 1)
      this.notifyListeners()
    }
  }

  async restoreLegendaryResistance(): Promise<void> {
    const gameState = await databaseManager.getGameState()
    if (gameState.legendaryResistances.used > 0) {
      await databaseManager.updateLegendaryResistances(gameState.legendaryResistances.used - 1)
      this.notifyListeners()
    }
  }

  async longRest(): Promise<void> {
    await databaseManager.longRest()
    this.notifyListeners()
  }

  async exportData(): Promise<string> {
    return await databaseManager.exportData()
  }

  async importData(data: any): Promise<void> {
    await databaseManager.importData(data)
    this.notifyListeners()
  }
}

export const gameStateManager = DatabaseGameStateManager.getInstance()
