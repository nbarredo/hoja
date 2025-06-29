import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameState } from '@/hooks/useGameState'
import type { CharacterData } from './types'

interface MagicTabProps {
  characterData: CharacterData
}

export function MagicTab({ characterData: _propCharacterData }: MagicTabProps) {
  const { characterData, state, actions, isLoading, error } = useGameState()
  
  // Local state for immediate UI updates
  const [localSpellSlots, setLocalSpellSlots] = useState<any>({})
  const [localAbilities, setLocalAbilities] = useState<any>({})

  // Sync local state with global state when it changes
  useEffect(() => {
    if (state?.spellSlots) {
      setLocalSpellSlots(state.spellSlots)
    }
  }, [state?.spellSlots])

  useEffect(() => {
    if (state?.longRestAbilities) {
      setLocalAbilities(state.longRestAbilities)
    }
  }, [state?.longRestAbilities])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!state || !characterData || !localSpellSlots || Object.keys(localSpellSlots).length === 0) {
    return <div>No game state available</div>
  }

  const handleSpellSlotClick = async (level: string) => {
    console.log('Spell slot clicked:', level, 'Current state before:', localSpellSlots[level])
    
    // Update local state immediately for instant UI feedback
    const currentSlot = localSpellSlots[level]
    if (currentSlot && currentSlot.used < currentSlot.total) {
      setLocalSpellSlots(prev => ({
        ...prev,
        [level]: { ...currentSlot, used: currentSlot.used + 1 }
      }))
      
      // Sync with database
      await actions.useSpellSlot(level)
    }
    console.log('Spell slot clicked complete:', level)
  }

  const handleSpellSlotRestore = async (level: string) => {
    console.log('Spell slot restore:', level, 'Current state before:', localSpellSlots[level])
    
    // Update local state immediately for instant UI feedback
    const currentSlot = localSpellSlots[level]
    if (currentSlot && currentSlot.used > 0) {
      setLocalSpellSlots(prev => ({
        ...prev,
        [level]: { ...currentSlot, used: currentSlot.used - 1 }
      }))
      
      // Sync with database
      await actions.restoreSpellSlot(level)
    }
    console.log('Spell slot restore complete:', level)
  }

  const handleAbilityUse = async (abilityName: string) => {
    console.log('Ability used:', abilityName, 'Current state before:', localAbilities[abilityName])
    
    // Update local state immediately for instant UI feedback
    const currentAbility = localAbilities[abilityName]
    if (currentAbility && currentAbility.used < currentAbility.total) {
      setLocalAbilities(prev => ({
        ...prev,
        [abilityName]: { ...currentAbility, used: currentAbility.used + 1 }
      }))
      
      // Sync with database
      await actions.useAbility(abilityName)
    }
    console.log('Ability use complete:', abilityName)
  }

  return (
    <div className="space-y-6">
      {/* Spell Slots */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Spell Slots</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-11 gap-3">
            {Object.entries(localSpellSlots).map(([level, slot]) => {
              const typedSlot = slot as { used: number; total: number }
              return (
              <div key={`spell-level-${level}`} className="text-center p-3 border border-gray-700 rounded bg-gray-800">
                <div className="text-xs text-gray-300 uppercase font-medium mb-2">Level {level}</div>
                <div className="flex flex-wrap gap-1 justify-center mb-2">
                  {Array.from({ length: typedSlot.total }, (_, index) => (
                    <button
                      key={`${level}-${index}`}
                      onClick={() => {
                        if (index < typedSlot.used) {
                          // Restore this slot
                          handleSpellSlotRestore(level)
                        } else {
                          // Use this slot
                          handleSpellSlotClick(level)
                        }
                      }}
                      className={`w-7 h-7 rounded-lg border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
                        index < typedSlot.used
                          ? 'bg-gray-600 border-gray-500 hover:bg-gray-500' // Used
                          : 'bg-blue-600 border-blue-500 hover:bg-blue-700 hover:border-blue-400' // Available
                      }`}
                      title={index < typedSlot.used ? 'Click to restore' : 'Click to use'}
                    />
                  ))}
                </div>
                <div className="text-sm text-white">
                  {typedSlot.total - typedSlot.used}/{typedSlot.total}
                </div>
              </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Spellcasting Stats */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Spellcasting</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">{(characterData as any).spellcasting?.spellSaveDC || 'N/A'}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Spell Save DC</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">+{(characterData as any).spellcasting?.spellAttackBonus || 'N/A'}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Spell Attack</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">+{(characterData as any).spellcasting?.counterspellBonus || 'N/A'}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Counterspell</div>
            </div>
          </div>
          {(characterData as any).spellcasting?.specialNotes && (
            <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded">
              <p className="text-sm text-gray-300 font-medium">{(characterData as any).spellcasting.specialNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Limited Use Abilities */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Limited Use Abilities (Per Long Rest)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(localAbilities).map(([abilityName, ability]) => {
              const typedAbility = ability as { used: number; total: number }
              return (
              <div key={`ability-${abilityName}`} className="p-4 border border-gray-700 rounded bg-gray-800">
                <h4 className="font-bold text-white text-sm mb-2">{abilityName}</h4>
                <div className="flex flex-wrap gap-1 mb-2">
                  {Array.from({ length: typedAbility.total }, (_, index) => (
                    <button
                      key={`${abilityName}-${index}`}
                      onClick={() => {
                        if (index < typedAbility.used) {
                          // Can't restore individual uses, only via long rest
                          return
                        } else {
                          handleAbilityUse(abilityName)
                        }
                      }}
                      className={`w-5 h-5 rounded-md border-2 transition-all duration-200 shadow-sm ${
                        index < typedAbility.used
                          ? 'bg-gray-600 border-gray-500 cursor-not-allowed' // Used
                          : 'bg-green-600 border-green-500 hover:bg-green-700 hover:border-green-400 cursor-pointer' // Available
                      }`}
                      title={index < typedAbility.used ? 'Used (restore with long rest)' : 'Click to use'}
                    />
                  ))}
                </div>
                <div className="text-xs text-white">
                  {typedAbility.total - typedAbility.used}/{typedAbility.total} remaining
                </div>
              </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Attacks */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Attacks</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {characterData.attacks?.meleeAttacks?.map((attack: any, index: number) => (
              <div key={index} className="border border-gray-700 rounded p-4 bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white text-lg">{attack.name}</h4>
                  <div className="flex gap-2">
                    {attack.attackBonus && (
                      <Badge variant="outline" className="border-gray-600 text-white bg-gray-700 font-bold">
                        +{attack.attackBonus}
                      </Badge>
                    )}
                    {attack.damage && (
                      <Badge variant="outline" className="border-gray-600 text-white bg-gray-700 font-bold">
                        {attack.damage}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-gray-200 font-medium">{attack.damageType}</p>
                {attack.special && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-300 font-medium">Special:</div>
                    <ul className="text-sm text-gray-400 ml-4">
                      {attack.special.map((specialEffect: string, idx: number) => (
                        <li key={idx} className="list-disc">{specialEffect}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permanent Spells */}
      {characterData.permanentSpells && Array.isArray(characterData.permanentSpells) && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-xl font-bold text-white">Permanent Active Spells</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {characterData.permanentSpells.map((spell: any, spellIndex: number) => (
                <div key={spellIndex} className="border border-gray-700 rounded p-4 bg-gray-800">
                  <h4 className="font-bold text-white text-lg mb-2">{spell.name}</h4>
                  <p className="text-gray-300 text-sm mb-2">Duration: {spell.duration}</p>
                  <div className="space-y-1">
                    {spell.effects?.map((effect: string, effectIndex: number) => (
                      <p key={effectIndex} className="text-gray-200 text-sm">• {effect}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ambarios Magic Techniques */}
      {characterData.ambariosTraining && Array.isArray(characterData.ambariosTraining) && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-xl font-bold text-white">Ambarios Magic Techniques</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {characterData.ambariosTraining.map((technique: any, techniqueIndex: number) => (
                <div key={techniqueIndex} className="border border-gray-700 rounded p-3 bg-gray-800">
                  <h5 className="font-bold text-white text-sm mb-1">{technique.name}</h5>
                  <p className="text-gray-200 text-sm">{technique.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
