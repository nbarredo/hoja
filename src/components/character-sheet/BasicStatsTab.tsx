import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGameState } from '@/hooks/useGameState'
import type { CharacterData } from './types'

interface BasicStatsTabProps {
  characterData: CharacterData
}

export function BasicStatsTab({ characterData: _propCharacterData }: BasicStatsTabProps) {
  const { characterData, state, actions, isLoading, error } = useGameState()
  const [hpAdjustment, setHpAdjustment] = useState('')
  const [localLegendaryResistances, setLocalLegendaryResistances] = useState<any>({ total: 0, used: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync local state with global state when it changes
  useEffect(() => {
    if (state?.legendaryResistances) {
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

  // Get ability scores from the correct path in JSON
  const abilityScores = (characterData as any).abilityScores;
  const combat = (characterData as any).combat;

  // Helper function to format speed object
  const formatSpeed = (speedObj: any) => {
    if (typeof speedObj === 'string') return speedObj;
    const speedParts = [];
    if (speedObj.walking) speedParts.push(speedObj.walking);
    if (speedObj.burrow) speedParts.push(`burrow ${speedObj.burrow}`);
    if (speedObj.flying) speedParts.push(`fly ${speedObj.flying}`);
    if (speedObj.swimming) speedParts.push(`swim ${speedObj.swimming}`);
    return speedParts.join(', ');
  }

  const handleHPChange = (amount: number, isDamage: boolean) => {
    if (isDamage) {
      actions.damageHP(amount)
    } else {
      actions.healHP(amount)
    }
    setHpAdjustment('')
  }

  const handleLegendaryResistanceUse = async () => {
    console.log('BasicStatsTab - Legendary Resistance used, Current state before:', localLegendaryResistances)
    
    // Update local state immediately for instant UI feedback
    if (localLegendaryResistances.used < localLegendaryResistances.total) {
      setLocalLegendaryResistances((prev: any) => ({
        ...prev,
        used: prev.used + 1
      }))
      
      // Sync with database
      await actions.useLegendaryResistance()
    }
    console.log('BasicStatsTab - Legendary Resistance use complete')
  }

  const handleLegendaryResistanceRestore = async () => {
    console.log('BasicStatsTab - Legendary Resistance restored, Current state before:', localLegendaryResistances)
    
    // Update local state immediately for instant UI feedback
    if (localLegendaryResistances.used > 0) {
      setLocalLegendaryResistances((prev: any) => ({
        ...prev,
        used: prev.used - 1
      }))
      
      // Sync with database
      await actions.restoreLegendaryResistance()
    }
    console.log('BasicStatsTab - Legendary Resistance restore complete')
  }

  const handleExportData = async () => {
    try {
      await actions.exportToFile()
      console.log('Game state exported successfully!')
    } catch (error) {
      console.error('Failed to export game state:', error)
    }
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const success = await actions.importFromFile(file)
        if (success) {
          console.log('Game state imported successfully!')
        } else {
          console.error('Failed to import game state')
        }
      } catch (error) {
        console.error('Error importing game state:', error)
      }
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Ability Scores */}
      <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50 shadow-xl">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-purple-500/10">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Ability Scores</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {abilityScores && Object.entries(abilityScores).map(([ability, data]: [string, any]) => (
              <Card key={ability} className="bg-gradient-to-br from-card to-muted/50 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-4 text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-bold">
                    {ability.slice(0, 3)}
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-1">{data.score}</div>
                  <div className="text-lg text-foreground font-mono font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    {data.modifier >= 0 ? '+' : ''}{data.modifier}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Physical Stats - AC, HP, Initiative, Speed */}
      <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50 shadow-xl">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-blue-500/10">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Physical Stats</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 border border-border/50 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">{combat?.armorClass?.total || 'N/A'}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Armor Class</div>
            </div>
            
            {/* Trackable HP */}
            <div className="text-center p-6 border border-border/50 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
                {state.hitPoints.current}/{state.hitPoints.maximum}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Hit Points</div>
              <div className="flex justify-center mb-3">
                <input
                  type="number"
                  placeholder="Amount"
                  value={hpAdjustment}
                  onChange={(e) => {
                    // Only allow positive numbers
                    const value = e.target.value
                    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
                      setHpAdjustment(value)
                    }
                  }}
                  className="w-16 px-2 py-1 text-xs bg-background text-foreground border border-border rounded text-center"
                  min="0"
                  step="1"
                />
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => {
                    const amount = parseInt(hpAdjustment)
                    if (!isNaN(amount)) handleHPChange(amount, true)
                  }}
                  variant="destructive"
                  size="sm"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  − Damage
                </Button>
                <Button
                  onClick={() => {
                    const amount = parseInt(hpAdjustment)
                    if (!isNaN(amount)) handleHPChange(amount, false)
                  }}
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
                >
                  + Heal
                </Button>
              </div>
            </div>
            
            <div className="text-center p-6 border border-border/50 rounded-lg bg-gradient-to-br from-yellow-500/10 to-amber-500/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-2">+{combat?.initiative || 'N/A'}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Initiative</div>
            </div>
            <div className="text-center p-6 border border-border/50 rounded-lg bg-gradient-to-br from-cyan-500/10 to-teal-500/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
                {combat?.speed ? formatSpeed(combat.speed) : 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Speed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legendary Resistances */}
      {localLegendaryResistances && (
        <Card key={`basic-legendary-${localLegendaryResistances.used}-${localLegendaryResistances.total}`} className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-xl font-bold text-white">Legendary Resistances</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 border border-yellow-600 rounded bg-yellow-900/20">
                <div className="text-4xl font-bold text-yellow-300 mb-2">
                  {localLegendaryResistances.total - localLegendaryResistances.used}
                </div>
                <div className="text-lg font-bold text-yellow-100 mb-1">Available</div>
                <div className="text-sm text-gray-300 mb-4">
                  {localLegendaryResistances.used}/{localLegendaryResistances.total} Used
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={handleLegendaryResistanceUse}
                    disabled={localLegendaryResistances.used >= localLegendaryResistances.total}
                    variant="destructive"
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm"
                  >
                    Use Resistance
                  </Button>
                  <Button
                    onClick={handleLegendaryResistanceRestore}
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
                <h4 className="font-bold text-white text-lg">Legendary Resistance</h4>
                <div className="border border-gray-700 rounded p-4 bg-gray-800">
                  <div className="text-xs text-gray-400 mb-1">LEGENDARY RESISTANCE</div>
                  <div className="text-sm text-gray-300">
                    If you fail a saving throw, you can choose to succeed instead. You can use this feature {localLegendaryResistances.total} times per day.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saving Throws */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Saving Throws</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {abilityScores && Object.entries(abilityScores).map(([ability, data]: [string, any]) => (
              <div key={ability} className="text-center p-4 border border-gray-700 rounded bg-gray-800">
                <div className="text-2xl font-bold text-white mb-1">
                  {data.savingThrow >= 0 ? '+' : ''}{data.savingThrow}
                </div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">{ability.slice(0, 3)}</div>
                {data.proficient && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-2"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Character Information */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Character Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-white text-lg mb-3">Basic Info</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 border-b border-gray-800">
                  <span className="text-gray-300 font-medium">Proficiency Bonus</span>
                  <span className="text-white font-bold">+{(characterData as any).character?.proficiencyBonus || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3">
                  <span className="text-gray-300 font-medium">Artifacts HP Bonus</span>
                  <span className="text-white font-bold">+{((characterData as any).equipment?.artifacts?.length || 0) * 100} HP</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-3">Senses & Languages</h4>
              <div className="space-y-2">
                <div className="py-2 px-3 border-b border-gray-800">
                  <span className="text-gray-300 font-medium">Senses: </span>
                  <span className="text-white">{(characterData as any).senses?.join(', ') || 'N/A'}</span>
                </div>
                <div className="py-2 px-3">
                  <span className="text-gray-300 font-medium">Languages: </span>
                  <span className="text-white">{(characterData as any).languages?.join(', ') || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Data Management</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-white text-lg">Export Game State</h4>
              <p className="text-sm text-gray-300 mb-3">
                Download the current game state as an updated velsirion.json file
              </p>
              <Button
                onClick={handleExportData}
                className="w-full"
                variant="default"
              >
                📥 Export to JSON File
              </Button>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white text-lg">Import Game State</h4>
              <p className="text-sm text-gray-300 mb-3">
                Load game state from a velsirion.json file
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="w-full px-3 py-2 text-sm bg-gray-700 text-white border border-gray-600 rounded-md file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gray-600 file:text-white file:text-sm hover:file:bg-gray-500"
              />
            </div>
          </div>
          <div className="mt-4 p-3 border border-gray-700 rounded bg-gray-800">
            <div className="text-xs text-gray-400 mb-1">PERSISTENCE INFO</div>
            <div className="text-sm text-gray-300">
              Game state is automatically saved to localStorage and exported to JSON on changes. 
              Use export/import to transfer data between sessions or backup your progress.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
