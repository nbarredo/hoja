import { useState, useEffect } from 'react';
import { gameStateManager, GameState } from '@/lib/gameState';

export function useGameState() {
  const [state, setState] = useState<GameState>(gameStateManager.getState());

  useEffect(() => {
    const unsubscribe = gameStateManager.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    state,
    actions: {
      damageHP: (amount: number) => gameStateManager.damageHP(amount),
      healHP: (amount: number) => gameStateManager.healHP(amount),
      damageShield: (shieldType: string, amount: number) => gameStateManager.damageShield(shieldType, amount),
      healShield: (shieldType: string, amount: number) => gameStateManager.healShield(shieldType, amount),
      useSpellSlot: (level: string) => gameStateManager.useSpellSlot(level),
      restoreSpellSlot: (level: string) => gameStateManager.restoreSpellSlot(level),
      useAbility: (abilityName: string) => gameStateManager.useAbility(abilityName),
      useLegendaryResistance: () => gameStateManager.useLegendaryResistance(),
      restoreLegendaryResistance: () => gameStateManager.restoreLegendaryResistance(),
      longRest: () => gameStateManager.longRest(),
      reset: () => gameStateManager.reset(),
      exportToFile: () => gameStateManager.exportToFile(),
      importFromFile: (file: File) => gameStateManager.importFromFile(file),
    }
  };
}
