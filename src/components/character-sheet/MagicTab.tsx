import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  const [localLegendaryResistances, setLocalLegendaryResistances] = useState<any>({ total: 0, used: 0 })

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

  useEffect(() => {
    if (state?.legendaryResistances) {
      console.log('Syncing legendary resistances from global state:', state.legendaryResistances)
      setLocalLegendaryResistances(state.legendaryResistances)
    }
  }, [state?.legendaryResistances])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!state || !characterData) {
    return <div>No game state available</div>
  }

  console.log('MagicTab render - Local legendary resistances:', localLegendaryResistances)
  console.log('MagicTab render - Global legendary resistances:', state.legendaryResistances)

  const handleSpellSlotClick = async (level: string) => {
    console.log('Spell slot clicked:', level, 'Current state before:', localSpellSlots[level])
    
    // Update local state immediately for instant UI feedback
    const currentSlot = localSpellSlots[level]
    if (currentSlot && currentSlot.used < currentSlot.total) {
      setLocalSpellSlots((prev: any) => ({
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
      setLocalSpellSlots((prev: any) => ({
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
      setLocalAbilities((prev: any) => ({
        ...prev,
        [abilityName]: { ...currentAbility, used: currentAbility.used + 1 }
      }))
      
      // Sync with database
      await actions.useAbility(abilityName)
    }
    console.log('Ability use complete:', abilityName)
  }

  const handleLegendaryResistanceUse = async () => {
    console.log('Legendary Resistance used, Current state before:', localLegendaryResistances)
    
    // Update local state immediately for instant UI feedback
    if (localLegendaryResistances.used < localLegendaryResistances.total) {
      setLocalLegendaryResistances((prev: any) => ({
        ...prev,
        used: prev.used + 1
      }))
      
      // Sync with database
      await actions.useLegendaryResistance()
    }
    console.log('Legendary Resistance use complete')
  }

  const handleLegendaryResistanceRestore = async () => {
    console.log('Legendary Resistance restored, Current state before:', localLegendaryResistances)
    
    // Update local state immediately for instant UI feedback
    if (localLegendaryResistances.used > 0) {
      setLocalLegendaryResistances((prev: any) => ({
        ...prev,
        used: prev.used - 1
      }))
      
      // Sync with database
      await actions.restoreLegendaryResistance()
    }
    console.log('Legendary Resistance restore complete')
  }

  return (
    <div className="space-y-6">
      {/* Spell Slots */}
      {localSpellSlots && Object.keys(localSpellSlots).length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xl font-bold text-foreground">Spell Slots</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-11 gap-3">
              {Object.entries(localSpellSlots).map(([level, slot]) => {
                const typedSlot = slot as { used: number; total: number }
                return (
                <div key={`spell-level-${level}`} className="text-center p-3 border border-border rounded bg-muted">
                  <div className="text-xs text-muted-foreground uppercase font-medium mb-2">Level {level}</div>
                  <div className="flex flex-wrap gap-1 justify-center mb-2">
                    {Array.from({ length: typedSlot.total }, (_, index) => (
                      <Button
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
                        variant="ghost"
                        size="sm"
                        className={`w-7 h-7 p-0 rounded-lg border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
                          index < typedSlot.used
                            ? 'bg-muted border-border hover:bg-muted/80' // Used
                            : 'bg-primary border-primary/50 hover:bg-primary/90 hover:border-primary/70' // Available
                        }`}
                        title={index < typedSlot.used ? 'Click to restore' : 'Click to use'}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-foreground">
                    {typedSlot.total - typedSlot.used}/{typedSlot.total}
                  </div>
                </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spellcasting Stats */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl font-bold text-foreground">Spellcasting</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-border rounded bg-muted">
              <div className="text-3xl font-bold text-foreground mb-1">{(characterData as any).spellcasting?.spellSaveDC || 'N/A'}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Spell Save DC</div>
            </div>
            <div className="text-center p-4 border border-border rounded bg-muted">
              <div className="text-3xl font-bold text-foreground mb-1">+{(characterData as any).spellcasting?.spellAttackBonus || 'N/A'}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Spell Attack</div>
            </div>
            <div className="text-center p-4 border border-border rounded bg-muted">
              <div className="text-3xl font-bold text-foreground mb-1">+{(characterData as any).spellcasting?.counterspellBonus || 'N/A'}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Counterspell</div>
            </div>
          </div>
          {(characterData as any).spellcasting?.specialNotes && (
            <div className="mt-4 p-3 bg-muted border border-border rounded">
              <p className="text-sm text-muted-foreground font-medium">{(characterData as any).spellcasting.specialNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Limited Use Abilities */}
      {localAbilities && Object.keys(localAbilities).length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xl font-bold text-foreground">Limited Use Abilities (Per Long Rest)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(localAbilities).map(([abilityName, ability]) => {
                const typedAbility = ability as { used: number; total: number }
                return (
                <div key={`ability-${abilityName}`} className="p-4 border border-border rounded bg-muted">
                  <h4 className="font-bold text-foreground text-sm mb-2">{abilityName}</h4>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {Array.from({ length: typedAbility.total }, (_, index) => (
                      <Button
                        key={`${abilityName}-${index}`}
                        onClick={() => {
                          if (index < typedAbility.used) {
                            // Can't restore individual uses, only via long rest
                            return
                          } else {
                            handleAbilityUse(abilityName)
                          }
                        }}
                        variant="ghost"
                        size="sm"
                        className={`w-5 h-5 p-0 rounded-md border-2 transition-all duration-200 shadow-sm ${
                          index < typedAbility.used
                            ? 'bg-muted border-border cursor-not-allowed' // Used
                            : 'bg-green-600 border-green-500 hover:bg-green-700 hover:border-green-400 cursor-pointer' // Available
                        }`}
                        title={index < typedAbility.used ? 'Used (restore with long rest)' : 'Click to use'}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-foreground">
                    {typedAbility.total - typedAbility.used}/{typedAbility.total} remaining
                  </div>
                </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legendary Resistances */}
      <Card key={`legendary-${localLegendaryResistances.used}-${localLegendaryResistances.total}`} className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl font-bold text-foreground">Legendary Resistances</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 border border-yellow-600 rounded bg-yellow-50 dark:bg-yellow-900/20">
              <div className="text-4xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">
                {localLegendaryResistances.total - localLegendaryResistances.used}
              </div>
              <div className="text-lg font-bold text-yellow-800 dark:text-yellow-100 mb-1">Available</div>
              <div className="text-sm text-muted-foreground mb-4">
                {localLegendaryResistances.used}/{localLegendaryResistances.total} Used
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => {
                    console.log('Legendary Resistance Use button clicked!', localLegendaryResistances)
                    handleLegendaryResistanceUse()
                  }}
                  disabled={localLegendaryResistances.used >= localLegendaryResistances.total}
                  variant="destructive"
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm"
                >
                  Use Resistance
                </Button>
                <Button
                  onClick={() => {
                    console.log('Legendary Resistance Restore button clicked!', localLegendaryResistances)
                    handleLegendaryResistanceRestore()
                  }}
                  disabled={localLegendaryResistances.used <= 0}
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                >
                  Restore
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-foreground text-lg">Legendary Resistance</h4>
              <div className="border border-border rounded p-4 bg-muted">
                <p className="text-foreground text-sm mb-2">
                  <strong>3/Day:</strong> If Velsirion fails a saving throw, he can choose to succeed instead.
                </p>
                <p className="text-muted-foreground text-xs">
                  This powerful ability allows automatic success on failed saves, but can only be used a limited number of times per day.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attacks */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl font-bold text-foreground">Attacks</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {characterData.attacks?.meleeAttacks?.map((attack: any, index: number) => (
              <div key={index} className="border border-border rounded p-4 bg-muted">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-foreground text-lg">{attack.name}</h4>
                  <div className="flex gap-2">
                    {attack.attackBonus && (
                      <Badge variant="outline" className="border-border text-foreground bg-background font-bold">
                        +{attack.attackBonus}
                      </Badge>
                    )}
                    {attack.damage && (
                      <Badge variant="outline" className="border-border text-foreground bg-background font-bold">
                        {attack.damage}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-foreground font-medium">{attack.damageType}</p>
                {attack.special && (
                  <div className="mt-2">
                    <div className="text-sm text-foreground font-medium">Special:</div>
                    <ul className="text-sm text-muted-foreground ml-4">
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
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xl font-bold text-foreground">Permanent Active Spells</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {characterData.permanentSpells.map((spell: any, spellIndex: number) => (
                <div key={spellIndex} className="border border-border rounded p-4 bg-muted">
                  <h4 className="font-bold text-foreground text-lg mb-2">{spell.name}</h4>
                  <p className="text-muted-foreground text-sm mb-2">Duration: {spell.duration}</p>
                  <div className="space-y-1">
                    {spell.effects?.map((effect: string, effectIndex: number) => (
                      <p key={effectIndex} className="text-foreground text-sm">• {effect}</p>
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
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xl font-bold text-foreground">Ambarios Magic Techniques</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {characterData.ambariosTraining.map((technique: any, techniqueIndex: number) => (
                <div key={techniqueIndex} className="border border-border rounded p-3 bg-muted">
                  <h5 className="font-bold text-foreground text-sm mb-1">{technique.name}</h5>
                  <p className="text-foreground text-sm">{technique.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
