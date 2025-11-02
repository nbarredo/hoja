import { useState, useEffect } from 'react'
import { gameStateManager, type GameState } from '../lib/gameState-db'

export function useGameState() {
  const [characterData, setCharacterData] = useState<any>(null)
  const [state, setState] = useState<GameState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [charData, gameState] = await Promise.all([
          gameStateManager.getCharacterData(),
          gameStateManager.getState()
        ])
        setCharacterData(charData)
        setState(gameState)
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
        setState(newState)
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

    damageHP: async (amount: number) => {
      if (state?.hitPoints) {
        const newHP = Math.max(0, state.hitPoints.current - amount)
        await gameStateManager.updateHP(newHP)
      }
    },

    healHP: async (amount: number) => {
      if (state?.hitPoints) {
        const newHP = Math.min(state.hitPoints.maximum, state.hitPoints.current + amount)
        await gameStateManager.updateHP(newHP)
      }
    },

    updateShield: async (shieldType: string, current: number) => {
      try {
        await gameStateManager.updateShield(shieldType, current)
      } catch (err) {
        console.error('Failed to update shield:', err)
      }
    },

    damageShield: async (shieldType: string, amount: number) => {
      if (state?.shields?.[shieldType]) {
        const shield = state.shields[shieldType]
        const newCurrent = Math.max(0, shield.current - amount)
        await gameStateManager.updateShield(shieldType, newCurrent)
      }
    },

    healShield: async (shieldType: string, amount: number) => {
      if (state?.shields?.[shieldType]) {
        const shield = state.shields[shieldType]
        const newCurrent = Math.min(shield.points, shield.current + amount)
        await gameStateManager.updateShield(shieldType, newCurrent)
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

    useAbility: async (name: string) => {
      try {
        await gameStateManager.useLongRestAbility(name)
      } catch (err) {
        console.error('Failed to use ability:', err)
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

    reset: async () => {
      try {
        await gameStateManager.longRest() // Reset is essentially a long rest
      } catch (err) {
        console.error('Failed to reset:', err)
      }
    },

    exportToFile: async () => {
      try {
        const data = await gameStateManager.exportData()
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'velsirion-character-data.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Failed to export data:', err)
        throw err
      }
    },

    importFromFile: async (file: File) => {
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        await gameStateManager.importData(data)
        return true
      } catch (err) {
        console.error('Failed to import data:', err)
        return false
      }
    }
  }

  return {
    characterData,
    state,
    isLoading,
    error,
    actions
  }
}
