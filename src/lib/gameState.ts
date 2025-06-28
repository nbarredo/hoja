import { velsirionData } from './database';
import { filePersistenceManager } from './filePersistence';

export interface GameState {
  hitPoints: {
    maximum: number;
    current: number;
  };
  shields: {
    [key: string]: {
      points: number;
      current: number;
      source: string;
      canBeHealed: boolean;
      special?: string;
    };
  };
  spellSlots: {
    [key: string]: {
      total: number;
      used: number;
    };
  };
  longRestAbilities: {
    [key: string]: {
      total: number;
      used: number;
    };
  };
  legendaryResistances: {
    total: number;
    used: number;
  };
  lastUpdated: number;
}

// Calculate dynamic HP based on artifacts
const calculateMaxHP = () => {
  const baseHP = 667;
  const corazonDeJinLong = 2000;
  const collarDeRyu = 500;
  const artifactCount = velsirionData.equipment.artifacts.length;
  const hambreDePoder = artifactCount * 100;
  
  return baseHP + corazonDeJinLong + collarDeRyu + hambreDePoder;
};

const getInitialState = (): GameState => {
  // Check if gameState exists in the velsirionData JSON
  const jsonGameState = (velsirionData as any).gameState;
  
  const initialState = {
    hitPoints: {
      maximum: calculateMaxHP(),
      current: jsonGameState?.hitPoints?.current || calculateMaxHP(),
    },
    shields: {
      psychicShield: { 
        points: 2000, 
        current: jsonGameState?.shields?.psychicShield?.current || 2000, 
        source: "Escamas de Eccen", 
        canBeHealed: false 
      },
      towerShield: { 
        points: 1000, 
        current: jsonGameState?.shields?.towerShield?.current || 1000, 
        source: "Resistencia de la Torre Blanca", 
        canBeHealed: false, 
        special: "Indestructible" 
      },
      magicShield: { 
        points: 500, 
        current: jsonGameState?.shields?.magicShield?.current || 500, 
        source: "High Magic Armor", 
        canBeHealed: false 
      },
    },
    spellSlots: {
      "1st": { total: 4, used: jsonGameState?.spellSlots?.["1st"]?.used || 0 },
      "2nd": { total: 3, used: jsonGameState?.spellSlots?.["2nd"]?.used || 0 },
      "3rd": { total: 3, used: jsonGameState?.spellSlots?.["3rd"]?.used || 0 },
      "4th": { total: 3, used: jsonGameState?.spellSlots?.["4th"]?.used || 0 },
      "5th": { total: 3, used: jsonGameState?.spellSlots?.["5th"]?.used || 0 },
      "6th": { total: 3, used: jsonGameState?.spellSlots?.["6th"]?.used || 0 },
      "7th": { total: 2, used: jsonGameState?.spellSlots?.["7th"]?.used || 0 },
      "8th": { total: 2, used: jsonGameState?.spellSlots?.["8th"]?.used || 0 },
      "9th": { total: 2, used: jsonGameState?.spellSlots?.["9th"]?.used || 0 },
      "10th": { total: 1, used: jsonGameState?.spellSlots?.["10th"]?.used || 0 },
      "11th": { total: 1, used: jsonGameState?.spellSlots?.["11th"]?.used || 0 },
    },
    longRestAbilities: {
      "Perfect Strike": { total: 3, used: jsonGameState?.longRestAbilities?.["Perfect Strike"]?.used || 0 },
      "Chronal Shift": { total: 2, used: jsonGameState?.longRestAbilities?.["Chronal Shift"]?.used || 0 },
      "Momentary Stasis": { total: 1, used: jsonGameState?.longRestAbilities?.["Momentary Stasis"]?.used || 0 },
      "Convergent Future": { total: 1, used: jsonGameState?.longRestAbilities?.["Convergent Future"]?.used || 0 },
      "Legendary Resistance": { total: 4, used: jsonGameState?.longRestAbilities?.["Legendary Resistance"]?.used || 0 },
      "Ataque Entrópico": { total: 3, used: jsonGameState?.longRestAbilities?.["Ataque Entrópico"]?.used || 0 },
      "Fuego Puro": { total: 3, used: jsonGameState?.longRestAbilities?.["Fuego Puro"]?.used || 0 },
      "Escudo de la Última Esperanza": { total: 3, used: jsonGameState?.longRestAbilities?.["Escudo de la Última Esperanza"]?.used || 0 },
    },
    legendaryResistances: {
      total: 14,
      used: jsonGameState?.legendaryResistances?.used || 0,
    },
    lastUpdated: jsonGameState?.lastUpdated || Date.now(),
  };
  
  return initialState;
};

const STORAGE_KEY = 'velsirion-character-state';

export class GameStateManager {
  private static instance: GameStateManager;
  private state: GameState;
  private listeners: ((state: GameState) => void)[] = [];
  private saveTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    this.state = this.loadState();
  }

  static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  private loadState(): GameState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Ensure we have the latest HP calculation in case artifacts changed
        parsedState.hitPoints.maximum = calculateMaxHP();
        return parsedState;
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
    return getInitialState();
  }

  private saveState(): void {
    try {
      this.state.lastUpdated = Date.now();
      
      // Debounce localStorage writes to improve performance
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }
      
      this.saveTimeout = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        this.saveTimeout = null;
      }, 100); // 100ms debounce
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }

  private notifyListeners(): void {
    // Notify listeners immediately for better UI responsiveness
    this.listeners.forEach(listener => listener(this.state));
  }

  getState(): GameState {
    // Return a shallow clone with deep clone of nested objects
    return {
      ...this.state,
      hitPoints: { ...this.state.hitPoints },
      shields: { ...this.state.shields },
      spellSlots: { ...this.state.spellSlots },
      longRestAbilities: { ...this.state.longRestAbilities },
      legendaryResistances: { ...this.state.legendaryResistances }
    };
  }

  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // HP Actions
  damageHP(amount: number): void {
    this.state.hitPoints.current = Math.max(0, this.state.hitPoints.current - amount);
    this.saveState();
    this.notifyListeners();
  }

  healHP(amount: number): void {
    this.state.hitPoints.current = Math.min(
      this.state.hitPoints.maximum,
      this.state.hitPoints.current + amount
    );
    this.saveState();
    this.notifyListeners();
  }

  // Shield Actions
  damageShield(shieldType: string, amount: number): void {
    if (this.state.shields[shieldType]) {
      this.state.shields[shieldType].current = Math.max(
        0,
        this.state.shields[shieldType].current - amount
      );
      this.saveState();
      this.notifyListeners();
    }
  }

  healShield(shieldType: string, amount: number): void {
    const shield = this.state.shields[shieldType];
    if (shield && shield.canBeHealed) {
      shield.current = Math.min(shield.points, shield.current + amount);
      this.saveState();
      this.notifyListeners();
    }
  }

  // Spell Slot Actions
  useSpellSlot(level: string): void {
    const slot = this.state.spellSlots[level];
    if (slot && slot.used < slot.total) {
      this.state.spellSlots = {
        ...this.state.spellSlots,
        [level]: { ...slot, used: slot.used + 1 }
      };
      this.saveState();
      this.notifyListeners();
    }
  }

  restoreSpellSlot(level: string): void {
    const slot = this.state.spellSlots[level];
    if (slot && slot.used > 0) {
      this.state.spellSlots = {
        ...this.state.spellSlots,
        [level]: { ...slot, used: slot.used - 1 }
      };
      this.saveState();
      this.notifyListeners();
    }
  }

  // Ability Actions
  useAbility(abilityName: string): void {
    const ability = this.state.longRestAbilities[abilityName];
    if (ability && ability.used < ability.total) {
      ability.used++;
      this.saveState();
      this.notifyListeners();
    }
  }

  // Legendary Resistance Actions
  useLegendaryResistance(): void {
    if (this.state.legendaryResistances.used < this.state.legendaryResistances.total) {
      this.state.legendaryResistances.used++;
      this.saveState();
      this.notifyListeners();
    }
  }

  restoreLegendaryResistance(): void {
    if (this.state.legendaryResistances.used > 0) {
      this.state.legendaryResistances.used--;
      this.saveState();
      this.notifyListeners();
    }
  }

  // Long Rest Action
  longRest(): void {
    // Restore HP to maximum
    this.state.hitPoints.current = this.state.hitPoints.maximum;
    
    // Restore all spell slots
    Object.values(this.state.spellSlots).forEach(slot => {
      slot.used = 0;
    });
    
    // Restore all long rest abilities
    Object.values(this.state.longRestAbilities).forEach(ability => {
      ability.used = 0;
    });
    
    // Restore legendary resistances
    this.state.legendaryResistances.used = 0;
    
    this.saveState();
    this.notifyListeners();
  }

  // Reset to initial state (for debugging)
  reset(): void {
    this.state = getInitialState();
    this.saveState();
    this.notifyListeners();
  }

  // Export current state to JSON file
  async exportToFile(): Promise<void> {
    return filePersistenceManager.exportGameState(this.state);
  }

  // Import state from JSON file
  async importFromFile(file: File): Promise<boolean> {
    const importedState = await filePersistenceManager.importGameState(file);
    if (importedState) {
      this.state = importedState;
      this.saveState();
      this.notifyListeners();
      return true;
    }
    return false;
  }
}

export const gameStateManager = GameStateManager.getInstance();
