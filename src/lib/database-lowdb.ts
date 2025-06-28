// Simple JSON database using localStorage as fallback for browser compatibility
import type { GameState } from './gameState'

// Database schema
interface DatabaseSchema {
  character: any // The static character data from velsirion.json
  gameState: GameState
}

class DatabaseManager {
  private static instance: DatabaseManager
  private data: DatabaseSchema | null = null
  private isInitialized = false
  private readonly DB_KEY = 'velsirion-character-db'

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Try to load from localStorage first
      const savedData = localStorage.getItem(this.DB_KEY)
      if (savedData) {
        this.data = JSON.parse(savedData)
      }

      // If no saved data or missing character data, initialize with default data
      if (!this.data || !this.data.character) {
        // Import the velsirion data
        const response = await fetch('/velsirion.json')
        if (!response.ok) {
          throw new Error(`Failed to fetch velsirion.json: ${response.status}`)
        }
        const velsirionData = await response.json()
        
        this.data = {
          character: velsirionData,
          gameState: this.data?.gameState || this.getDefaultGameState(velsirionData)
        }
        
        await this.save()
      }

      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize database:', error)
      throw error
    }
  }

  private async save(): Promise<void> {
    if (this.data) {
      localStorage.setItem(this.DB_KEY, JSON.stringify(this.data))
    }
  }

  private getDefaultGameState(characterData: any): GameState {
    return {
      hitPoints: {
        maximum: characterData.combat?.hitPoints?.maximum || 3567,
        current: characterData.combat?.hitPoints?.current || characterData.combat?.hitPoints?.maximum || 3567
      },
      shields: {
        psychicShield: { 
          points: 2000, 
          current: characterData.gameState?.shields?.psychicShield?.current || 2000, 
          source: "Escamas de Eccen", 
          canBeHealed: false 
        },
        towerShield: { 
          points: 1000, 
          current: characterData.gameState?.shields?.towerShield?.current || 1000, 
          source: "Resistencia de la Torre Blanca", 
          canBeHealed: false, 
          special: "Indestructible" 
        },
        magicShield: { 
          points: 500, 
          current: characterData.gameState?.shields?.magicShield?.current || 500, 
          source: "High Magic Armor", 
          canBeHealed: false 
        }
      },
      spellSlots: {
        "1st": { total: 4, used: characterData.gameState?.spellSlots?.["1st"]?.used || 0 },
        "2nd": { total: 3, used: characterData.gameState?.spellSlots?.["2nd"]?.used || 0 },
        "3rd": { total: 3, used: characterData.gameState?.spellSlots?.["3rd"]?.used || 0 },
        "4th": { total: 3, used: characterData.gameState?.spellSlots?.["4th"]?.used || 0 },
        "5th": { total: 3, used: characterData.gameState?.spellSlots?.["5th"]?.used || 0 },
        "6th": { total: 3, used: characterData.gameState?.spellSlots?.["6th"]?.used || 0 },
        "7th": { total: 2, used: characterData.gameState?.spellSlots?.["7th"]?.used || 0 },
        "8th": { total: 2, used: characterData.gameState?.spellSlots?.["8th"]?.used || 0 },
        "9th": { total: 2, used: characterData.gameState?.spellSlots?.["9th"]?.used || 0 },
        "10th": { total: 1, used: characterData.gameState?.spellSlots?.["10th"]?.used || 0 },
        "11th": { total: 1, used: characterData.gameState?.spellSlots?.["11th"]?.used || 0 }
      },
      longRestAbilities: {
        "Perfect Strike": { total: 3, used: characterData.gameState?.longRestAbilities?.["Perfect Strike"]?.used || 0 },
        "Chronal Shift": { total: 2, used: characterData.gameState?.longRestAbilities?.["Chronal Shift"]?.used || 0 },
        "Momentary Stasis": { total: 1, used: characterData.gameState?.longRestAbilities?.["Momentary Stasis"]?.used || 0 },
        "Convergent Future": { total: 1, used: characterData.gameState?.longRestAbilities?.["Convergent Future"]?.used || 0 },
        "Legendary Resistance": { total: 4, used: characterData.gameState?.longRestAbilities?.["Legendary Resistance"]?.used || 0 },
        "Ataque Entrópico": { total: 3, used: characterData.gameState?.longRestAbilities?.["Ataque Entrópico"]?.used || 0 },
        "Fuego Puro": { total: 3, used: characterData.gameState?.longRestAbilities?.["Fuego Puro"]?.used || 0 },
        "Escudo de la Última Esperanza": { total: 3, used: characterData.gameState?.longRestAbilities?.["Escudo de la Última Esperanza"]?.used || 0 }
      },
      legendaryResistances: {
        total: 14,
        used: characterData.gameState?.legendaryResistances?.used || 0
      },
      lastUpdated: Date.now()
    }
  }

  async getCharacterData(): Promise<any> {
    await this.initialize()
    return this.data!.character
  }

  async getGameState(): Promise<GameState> {
    await this.initialize()
    return this.data!.gameState
  }

  async updateGameState(updates: Partial<GameState>): Promise<void> {
    await this.initialize()
    this.data!.gameState = {
      ...this.data!.gameState,
      ...updates,
      lastUpdated: Date.now()
    }
    await this.save()
  }

  async updateSpellSlot(level: string, used: number): Promise<void> {
    await this.initialize()
    if (this.data!.gameState.spellSlots[level]) {
      this.data!.gameState.spellSlots[level].used = used
      this.data!.gameState.lastUpdated = Date.now()
      await this.save()
    }
  }

  async updateLongRestAbility(name: string, used: number): Promise<void> {
    await this.initialize()
    if (this.data!.gameState.longRestAbilities[name]) {
      this.data!.gameState.longRestAbilities[name].used = used
      this.data!.gameState.lastUpdated = Date.now()
      await this.save()
    }
  }

  async updateHP(current: number): Promise<void> {
    await this.initialize()
    this.data!.gameState.hitPoints.current = current
    this.data!.gameState.lastUpdated = Date.now()
    await this.save()
  }

  async updateShield(shieldType: string, current: number): Promise<void> {
    await this.initialize()
    if (this.data!.gameState.shields[shieldType]) {
      this.data!.gameState.shields[shieldType].current = current
      this.data!.gameState.lastUpdated = Date.now()
      await this.save()
    }
  }

  async updateLegendaryResistances(used: number): Promise<void> {
    await this.initialize()
    this.data!.gameState.legendaryResistances.used = used
    this.data!.gameState.lastUpdated = Date.now()
    await this.save()
  }

  async longRest(): Promise<void> {
    await this.initialize()
    const gameState = this.data!.gameState
    
    // Restore HP to maximum
    gameState.hitPoints.current = gameState.hitPoints.maximum
    
    // Restore all spell slots
    Object.keys(gameState.spellSlots).forEach(level => {
      gameState.spellSlots[level].used = 0
    })
    
    // Restore all long rest abilities
    Object.keys(gameState.longRestAbilities).forEach(name => {
      gameState.longRestAbilities[name].used = 0
    })
    
    // Restore legendary resistances
    gameState.legendaryResistances.used = 0
    
    gameState.lastUpdated = Date.now()
    await this.save()
  }

  async exportData(): Promise<string> {
    await this.initialize()
    return JSON.stringify(this.data, null, 2)
  }

  async importData(data: any): Promise<void> {
    this.data = data
    await this.save()
  }
}

export const databaseManager = DatabaseManager.getInstance()
