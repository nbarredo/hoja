import type { GameState } from './gameState';

// Since we're in a client-side environment, we'll provide utilities 
// to export/import the updated JSON data
export class FilePersistenceManager {
  private static instance: FilePersistenceManager;

  static getInstance(): FilePersistenceManager {
    if (!FilePersistenceManager.instance) {
      FilePersistenceManager.instance = new FilePersistenceManager();
    }
    return FilePersistenceManager.instance;
  }

  // Export the current game state as a downloadable JSON file
  async exportGameState(gameState: GameState): Promise<void> {
    try {
      // Use different paths for development vs production
      const isDevelopment = import.meta.env.DEV;
      const jsonPath = isDevelopment ? '/velsirion.json' : '/hoja/velsirion.json';
      
      // Fetch the current velsirion.json data
      const response = await fetch(jsonPath);
      const velsirionData = await response.json();

      // Update the gameState section with current values
      velsirionData.gameState = {
        hitPoints: {
          current: gameState.hitPoints.current
        },
        shields: {
          psychicShield: {
            current: gameState.shields.psychicShield?.current || gameState.shields.psychicShield?.points || 2000
          },
          towerShield: {
            current: gameState.shields.towerShield?.current || gameState.shields.towerShield?.points || 1000
          },
          magicShield: {
            current: gameState.shields.magicShield?.current || gameState.shields.magicShield?.points || 500
          }
        },
        spellSlots: Object.fromEntries(
          Object.entries(gameState.spellSlots).map(([level, slot]) => [
            level,
            { used: slot.used }
          ])
        ),
        longRestAbilities: Object.fromEntries(
          Object.entries(gameState.longRestAbilities).map(([name, ability]) => [
            name,
            { used: ability.used }
          ])
        ),
        legendaryResistances: {
          used: gameState.legendaryResistances.used
        },
        lastUpdated: gameState.lastUpdated
      };

      // Create a downloadable file
      const dataStr = JSON.stringify(velsirionData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'velsirion.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('Game state exported to velsirion.json');
    } catch (error) {
      console.error('Error exporting game state:', error);
    }
  }

  // Import game state from an uploaded JSON file
  async importGameState(file: File): Promise<GameState | null> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.gameState) {
        throw new Error('No gameState found in imported file');
      }

      // Convert the JSON gameState back to our GameState format
      const gameState: GameState = {
        hitPoints: {
          maximum: data.combat?.hitPoints?.maximum || 3567,
          current: data.gameState.hitPoints?.current || data.combat?.hitPoints?.maximum || 3567
        },
        shields: {
          psychicShield: { 
            points: 2000, 
            current: data.gameState.shields?.psychicShield?.current || 2000, 
            source: "Escamas de Eccen", 
            canBeHealed: false 
          },
          towerShield: { 
            points: 1000, 
            current: data.gameState.shields?.towerShield?.current || 1000, 
            source: "Resistencia de la Torre Blanca", 
            canBeHealed: false, 
            special: "Indestructible" 
          },
          magicShield: { 
            points: 500, 
            current: data.gameState.shields?.magicShield?.current || 500, 
            source: "High Magic Armor", 
            canBeHealed: false 
          }
        },
        spellSlots: {},
        longRestAbilities: {},
        legendaryResistances: {
          total: 14,
          used: data.gameState.legendaryResistances?.used || 0
        },
        lastUpdated: data.gameState.lastUpdated || Date.now()
      };

      // Build spell slots
      if (data.spellcasting?.spellSlots) {
        Object.entries(data.spellcasting.spellSlots).forEach(([level, slot]: [string, any]) => {
          gameState.spellSlots[level] = {
            total: slot.total,
            used: data.gameState.spellSlots?.[level]?.used || 0
          };
        });
      }

      // Build long rest abilities
      const defaultAbilities = {
        "Perfect Strike": { total: 3, used: 0 },
        "Chronal Shift": { total: 2, used: 0 },
        "Momentary Stasis": { total: 1, used: 0 },
        "Convergent Future": { total: 1, used: 0 },
        "Legendary Resistance": { total: 4, used: 0 },
        "Ataque Entrópico": { total: 3, used: 0 },
        "Fuego Puro": { total: 3, used: 0 },
        "Escudo de la Última Esperanza": { total: 3, used: 0 }
      };

      Object.entries(defaultAbilities).forEach(([name, ability]) => {
        gameState.longRestAbilities[name] = {
          total: ability.total,
          used: data.gameState.longRestAbilities?.[name]?.used || 0
        };
      });

      return gameState;
    } catch (error) {
      console.error('Error importing game state:', error);
      return null;
    }
  }

  // Auto-export function that can be called periodically
  setupAutoExport(gameStateManager: any, intervalMinutes: number = 5): void {
    setInterval(() => {
      const state = gameStateManager.getState();
      this.exportGameState(state);
    }, intervalMinutes * 60 * 1000);
  }
}

export const filePersistenceManager = FilePersistenceManager.getInstance();
