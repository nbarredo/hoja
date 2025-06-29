import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface SpellSlot {
  total: number;
  used: number;
}

export interface Shield {
  points: number;
  current: number;
  source: string;
  canBeHealed: boolean;
  special?: string;
}

export interface CharacterState {
  hitPoints: {
    maximum: number;
    current: number;
  };
  shields: {
    [key: string]: Shield;
  };
  spellSlots: {
    [key: string]: SpellSlot;
  };
  longRestAbilities: {
    [key: string]: {
      total: number;
      used: number;
    };
  };
}

type CharacterAction =
  | { type: 'DAMAGE_HP'; amount: number }
  | { type: 'HEAL_HP'; amount: number }
  | { type: 'DAMAGE_SHIELD'; shieldType: string; amount: number }
  | { type: 'HEAL_SHIELD'; shieldType: string; amount: number }
  | { type: 'USE_SPELL_SLOT'; level: string }
  | { type: 'RESTORE_SPELL_SLOT'; level: string }
  | { type: 'USE_ABILITY'; abilityName: string }
  | { type: 'LONG_REST' };

const CharacterContext = createContext<{
  state: CharacterState;
  dispatch: React.Dispatch<CharacterAction>;
} | null>(null);

// Calculate dynamic HP based on artifacts
const calculateMaxHP = () => {
  const baseHP = 667;
  const corazonDeJinLong = 2000;
  const collarDeRyu = 500;
  // Using a default artifact count since this context is deprecated
  const artifactCount = 10; // Default value
  const hambreDePoder = artifactCount * 100;
  
  return baseHP + corazonDeJinLong + collarDeRyu + hambreDePoder;
};

const initialState: CharacterState = {
  hitPoints: {
    maximum: calculateMaxHP(),
    current: calculateMaxHP(),
  },
  shields: {
    psychicShield: { points: 2000, current: 2000, source: "Escamas de Eccen", canBeHealed: false },
    towerShield: { points: 1000, current: 1000, source: "Resistencia de la Torre Blanca", canBeHealed: false, special: "Indestructible" },
    magicShield: { points: 500, current: 500, source: "High Magic Armor", canBeHealed: false },
  },
  spellSlots: {
    "1st": { total: 4, used: 0 },
    "2nd": { total: 3, used: 0 },
    "3rd": { total: 3, used: 0 },
    "4th": { total: 3, used: 0 },
    "5th": { total: 3, used: 0 },
    "6th": { total: 3, used: 0 },
    "7th": { total: 2, used: 0 },
    "8th": { total: 2, used: 0 },
    "9th": { total: 2, used: 0 },
    "10th": { total: 1, used: 0 },
    "11th": { total: 1, used: 0 },
  },
  longRestAbilities: {
    "Perfect Strike": { total: 3, used: 0 },
    "Chronal Shift": { total: 2, used: 0 },
    "Momentary Stasis": { total: 1, used: 0 },
    "Convergent Future": { total: 1, used: 0 },
    "Legendary Resistance": { total: 4, used: 0 },
    "Ataque Entrópico": { total: 3, used: 0 },
    "Fuego Puro": { total: 3, used: 0 },
    "Escudo de la Última Esperanza": { total: 3, used: 0 },
  },
};

function characterReducer(state: CharacterState, action: CharacterAction): CharacterState {
  switch (action.type) {
    case 'DAMAGE_HP':
      return {
        ...state,
        hitPoints: {
          ...state.hitPoints,
          current: Math.max(0, state.hitPoints.current - action.amount),
        },
      };
    
    case 'HEAL_HP':
      return {
        ...state,
        hitPoints: {
          ...state.hitPoints,
          current: Math.min(state.hitPoints.maximum, state.hitPoints.current + action.amount),
        },
      };
    
    case 'DAMAGE_SHIELD':
      return {
        ...state,
        shields: {
          ...state.shields,
          [action.shieldType]: {
            ...state.shields[action.shieldType],
            current: Math.max(0, state.shields[action.shieldType].current - action.amount),
          },
        },
      };
    
    case 'HEAL_SHIELD':
      if (!state.shields[action.shieldType].canBeHealed) return state;
      return {
        ...state,
        shields: {
          ...state.shields,
          [action.shieldType]: {
            ...state.shields[action.shieldType],
            current: Math.min(
              state.shields[action.shieldType].points,
              state.shields[action.shieldType].current + action.amount
            ),
          },
        },
      };
    
    case 'USE_SPELL_SLOT':
      if (state.spellSlots[action.level].used >= state.spellSlots[action.level].total) return state;
      return {
        ...state,
        spellSlots: {
          ...state.spellSlots,
          [action.level]: {
            ...state.spellSlots[action.level],
            used: state.spellSlots[action.level].used + 1,
          },
        },
      };
    
    case 'RESTORE_SPELL_SLOT':
      if (state.spellSlots[action.level].used <= 0) return state;
      return {
        ...state,
        spellSlots: {
          ...state.spellSlots,
          [action.level]: {
            ...state.spellSlots[action.level],
            used: state.spellSlots[action.level].used - 1,
          },
        },
      };
    
    case 'USE_ABILITY':
      if (!state.longRestAbilities[action.abilityName] || 
          state.longRestAbilities[action.abilityName].used >= state.longRestAbilities[action.abilityName].total) {
        return state;
      }
      return {
        ...state,
        longRestAbilities: {
          ...state.longRestAbilities,
          [action.abilityName]: {
            ...state.longRestAbilities[action.abilityName],
            used: state.longRestAbilities[action.abilityName].used + 1,
          },
        },
      };
    
    case 'LONG_REST':
      return {
        ...state,
        hitPoints: {
          ...state.hitPoints,
          current: state.hitPoints.maximum,
        },
        spellSlots: Object.fromEntries(
          Object.entries(state.spellSlots).map(([level, slot]) => [
            level,
            { ...slot, used: 0 },
          ])
        ),
        longRestAbilities: Object.fromEntries(
          Object.entries(state.longRestAbilities).map(([name, ability]) => [
            name,
            { ...ability, used: 0 },
          ])
        ),
      };
    
    default:
      return state;
  }
}

export function CharacterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(characterReducer, initialState);

  return (
    <CharacterContext.Provider value={{ state, dispatch }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}
