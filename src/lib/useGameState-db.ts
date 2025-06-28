import { useState, useEffect } from 'react'
import { gameStateManager, type GameState } from './gameState-db'

export function useGameState() {
  const [characterData, setCharacterData] = useState<any>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [charData, state] = await Promise.all([
          gameStateManager.getCharacterData(),
          gameStateManager.getState()
        ])
        setCharacterData(charData)
        setGameState(state)
        setError(null)
      } catch (err) {
        console.error('Failed to load game data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(async () => {
      try {
        const newState = await gameStateManager.getState()
        setGameState(newState)
      } catch (err) {
        console.error('Failed to update state:', err)
      }
    })

    return unsubscribe
  }, [])

  const actions = {
    updateHP: async (current: number) => {
      try {
        await gameStateManager.updateHP(current)
      } catch (err) {
        console.error('Failed to update HP:', err)
      }
    },

    updateShield: async (shieldType: string, current: number) => {
      try {
        await gameStateManager.updateShield(shieldType, current)
      } catch (err) {
        console.error('Failed to update shield:', err)
      }
    },

    useSpellSlot: async (level: string) => {
      try {
        await gameStateManager.useSpellSlot(level)
      } catch (err) {
        console.error('Failed to use spell slot:', err)
      }
    },

    restoreSpellSlot: async (level: string) => {
      try {
        await gameStateManager.restoreSpellSlot(level)
      } catch (err) {
        console.error('Failed to restore spell slot:', err)
      }
    },

    useLongRestAbility: async (name: string) => {
      try {
        await gameStateManager.useLongRestAbility(name)
      } catch (err) {
        console.error('Failed to use long rest ability:', err)
      }
    },

    restoreLongRestAbility: async (name: string) => {
      try {
        await gameStateManager.restoreLongRestAbility(name)
      } catch (err) {
        console.error('Failed to restore long rest ability:', err)
      }
    },

    useLegendaryResistance: async () => {
      try {
        await gameStateManager.useLegendaryResistance()
      } catch (err) {
        console.error('Failed to use legendary resistance:', err)
      }
    },

    restoreLegendaryResistance: async () => {
      try {
        await gameStateManager.restoreLegendaryResistance()
      } catch (err) {
        console.error('Failed to restore legendary resistance:', err)
      }
    },

    longRest: async () => {
      try {
        await gameStateManager.longRest()
      } catch (err) {
        console.error('Failed to perform long rest:', err)
      }
    },

    exportData: async () => {
      try {
        return await gameStateManager.exportData()
      } catch (err) {
        console.error('Failed to export data:', err)
        throw err
      }
    },

    importData: async (data: any) => {
      try {
        await gameStateManager.importData(data)
      } catch (err) {
        console.error('Failed to import data:', err)
        throw err
      }
    }
  }

  return {
    characterData,
    gameState,
    isLoading,
    error,
    ...actions
  }
}
