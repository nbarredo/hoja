import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGameState } from '@/hooks/useGameState'
import { velsirionData } from '@/lib/database'
import type { CharacterData } from './types'

interface BasicStatsTabProps {
  characterData: CharacterData
}

export function BasicStatsTab({ characterData }: BasicStatsTabProps) {
  const { state, actions } = useGameState()
  const [hpAdjustment, setHpAdjustment] = useState('')
  const [shieldAdjustments, setShieldAdjustments] = useState<{[key: string]: string}>({})

  const handleHPChange = (amount: number, isDamage: boolean) => {
    if (isDamage) {
      actions.damageHP(amount)
    } else {
      actions.healHP(amount)
    }
    setHpAdjustment('')
  }

  const handleShieldChange = (shieldType: string, amount: number, isDamage: boolean) => {
    if (isDamage) {
      actions.damageShield(shieldType, amount)
    } else {
      actions.healShield(shieldType, amount)
    }
    setShieldAdjustments(prev => ({ ...prev, [shieldType]: '' }))
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
            {characterData.abilities && Object.entries(characterData.abilities).map(([ability, data]) => (
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
              <div className="text-3xl font-bold text-white mb-1">{characterData.combat.ac}</div>
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
                  type="text"
                  placeholder="Amount"
                  value={hpAdjustment}
                  onChange={(e) => setHpAdjustment(e.target.value)}
                  className="w-16 px-2 py-1 text-xs bg-gray-700 text-white border border-gray-600 rounded text-center"
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
              <div className="text-3xl font-bold text-white mb-1">+{characterData.combat.initiative}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Initiative</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-lg font-bold text-white mb-1">{characterData.combat.speed}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Speed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shields */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Shields</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(state.shields).map(([shieldType, shield]) => (
              <div key={shieldType} className="text-center p-4 border border-gray-700 rounded bg-gray-800">
                <div className="text-2xl font-bold text-white mb-1">
                  {shield.current}/{shield.points}
                </div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium mb-1">
                  {shieldType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className="text-xs text-gray-400 mb-3">{shield.source}</div>
                {shield.special && (
                  <div className="text-xs text-yellow-400 mb-3">{shield.special}</div>
                )}
                <div className="flex justify-center mb-3">
                  <input
                    type="text"
                    placeholder="Amount"
                    value={shieldAdjustments[shieldType] || ''}
                    onChange={(e) => setShieldAdjustments(prev => ({ ...prev, [shieldType]: e.target.value }))}
                    className="w-16 px-2 py-1 text-xs bg-gray-700 text-white border border-gray-600 rounded text-center"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      const amount = parseInt(shieldAdjustments[shieldType] || '0')
                      if (!isNaN(amount)) handleShieldChange(shieldType, amount, true)
                    }}
                    className="px-3 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 shadow-sm"
                  >
                    − Damage
                  </button>
                  {shield.canBeHealed && (
                    <button
                      onClick={() => {
                        const amount = parseInt(shieldAdjustments[shieldType] || '0')
                        if (!isNaN(amount)) handleShieldChange(shieldType, amount, false)
                      }}
                      className="px-3 py-1 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 shadow-sm"
                    >
                      + Heal
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legendary Resistances */}
      {characterData.legendaryResistances && (
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
                <h4 className="font-bold text-white text-lg">Sources</h4>
                {characterData.legendaryResistances.sources.map((source, index) => (
                  <div key={index} className="flex items-center py-2 px-3 border border-gray-700 rounded bg-gray-800">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-white font-medium">{source}</span>
                  </div>
                ))}
                <div className="mt-4 p-3 border border-gray-700 rounded bg-gray-800">
                  <div className="text-xs text-gray-400 mb-1">LEGENDARY RESISTANCE</div>
                  <div className="text-sm text-gray-300">
                    If you fail a saving throw, you can choose to succeed instead. You can use this feature {characterData.legendaryResistances.total} times per day.
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
            {characterData.saves?.map((save) => (
              <div key={save.name} className="text-center p-4 border border-gray-700 rounded bg-gray-800">
                <div className="text-2xl font-bold text-white mb-1">
                  {save.value >= 0 ? '+' : ''}{save.value}
                </div>
                <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">{save.name}</div>
                {save.proficient && (
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
                  <span className="text-white font-bold">{characterData.additionalInfo?.proficiencyBonus}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3">
                  <span className="text-gray-300 font-medium">Artifacts HP Bonus</span>
                  <span className="text-white font-bold">+{velsirionData.equipment.artifacts.length * 100} HP</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-3">Senses & Languages</h4>
              <div className="space-y-2">
                <div className="py-2 px-3 border-b border-gray-800">
                  <span className="text-gray-300 font-medium">Senses: </span>
                  <span className="text-white">{characterData.additionalInfo?.senses}</span>
                </div>
                <div className="py-2 px-3">
                  <span className="text-gray-300 font-medium">Languages: </span>
                  <span className="text-white">{characterData.additionalInfo?.languages}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
