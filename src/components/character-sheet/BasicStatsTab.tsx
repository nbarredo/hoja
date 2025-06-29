import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGameState } from '@/hooks/useGameState'
import type { CharacterData } from './types'

interface BasicStatsTabProps {
  characterData: CharacterData
}

export function BasicStatsTab({ characterData: _propCharacterData }: BasicStatsTabProps) {
  const { characterData, state, actions, isLoading, error } = useGameState()
  const [hpAdjustment, setHpAdjustment] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Ability Scores</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {abilityScores && Object.entries(abilityScores).map(([ability, data]: [string, any]) => (
              <Card key={ability} className="bg-gray-800 border-gray-600">
                <CardContent className="p-4 text-center">
                  <div className="text-xs text-gray-300 uppercase tracking-widest mb-2 font-bold">
                    {ability.slice(0, 3)}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{data.score}</div>
                  <div className="text-lg text-white font-mono font-bold">
                    {data.modifier >= 0 ? '+' : ''}{data.modifier}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Physical Stats - AC, HP, Initiative, Speed */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Physical Stats</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">{combat?.armorClass?.total || 'N/A'}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Armor Class</div>
            </div>
            
            {/* Trackable HP */}
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">
                {state.hitPoints.current}/{state.hitPoints.maximum}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium mb-3">Hit Points</div>
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
                  className="w-16 px-2 py-1 text-xs bg-gray-700 text-white border border-gray-600 rounded text-center"
                  min="0"
                  step="1"
                />
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    const amount = parseInt(hpAdjustment)
                    if (!isNaN(amount)) handleHPChange(amount, true)
                  }}
                  className="px-3 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 shadow-sm"
                >
                  − Damage
                </button>
                <button
                  onClick={() => {
                    const amount = parseInt(hpAdjustment)
                    if (!isNaN(amount)) handleHPChange(amount, false)
                  }}
                  className="px-3 py-1 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 shadow-sm"
                >
                  + Heal
                </button>
              </div>
            </div>
            
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">+{combat?.initiative || 'N/A'}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Initiative</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-lg font-bold text-white mb-1">
                {combat?.speed ? formatSpeed(combat.speed) : 'N/A'}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Speed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legendary Resistances */}
      {state.legendaryResistances && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-xl font-bold text-white">Legendary Resistances</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 border border-yellow-600 rounded bg-yellow-900/20">
                <div className="text-4xl font-bold text-yellow-300 mb-2">
                  {state.legendaryResistances.total - state.legendaryResistances.used}
                </div>
                <div className="text-lg font-bold text-yellow-100 mb-1">Available</div>
                <div className="text-sm text-gray-300 mb-4">
                  {state.legendaryResistances.used}/{state.legendaryResistances.total} Used
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => actions.useLegendaryResistance()}
                    disabled={state.legendaryResistances.used >= state.legendaryResistances.total}
                    className="px-4 py-2 text-sm font-medium bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200 shadow-sm"
                  >
                    Use Resistance
                  </button>
                  <button
                    onClick={() => actions.restoreLegendaryResistance()}
                    disabled={state.legendaryResistances.used <= 0}
                    className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors duration-200 shadow-sm"
                  >
                    Restore
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-white text-lg">Legendary Resistance</h4>
                <div className="border border-gray-700 rounded p-4 bg-gray-800">
                  <div className="text-xs text-gray-400 mb-1">LEGENDARY RESISTANCE</div>
                  <div className="text-sm text-gray-300">
                    If you fail a saving throw, you can choose to succeed instead. You can use this feature {state.legendaryResistances.total} times per day.
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
              <button
                onClick={handleExportData}
                className="w-full px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 shadow-sm"
              >
                📥 Export to JSON File
              </button>
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
