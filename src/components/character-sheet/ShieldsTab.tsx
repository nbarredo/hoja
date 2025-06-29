import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useGameState } from '@/hooks/useGameState'
import type { CharacterData } from './types'

interface ShieldsTabProps {
  characterData: CharacterData
}

export function ShieldsTab({ characterData: _propCharacterData }: ShieldsTabProps) {
  const { characterData, state, actions, isLoading, error } = useGameState()
  const [shieldAdjustments, setShieldAdjustments] = useState<{[key: string]: string}>({})

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!state || !characterData) {
    return <div>No game state available</div>
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
      {/* Active Shields */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Active Shields</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(state.shields).map(([shieldType, shield]) => (
              <div key={shieldType} className="border border-gray-700 rounded p-6 bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg text-white font-bold capitalize">
                    {shieldType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="text-2xl font-bold text-white">
                    {shield.current}/{shield.points}
                  </span>
                </div>
                <Progress 
                  value={(shield.current / shield.points) * 100} 
                  className="h-4 bg-gray-900 mb-4" 
                />
                <div className="text-sm text-gray-300 mb-4">
                  Source: {shield.source}
                  {shield.special && <div className="text-yellow-400 mt-1">Special: {shield.special}</div>}
                </div>
                
                {/* Shield Controls */}
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <input
                      type="text"
                      placeholder="Amount"
                      value={shieldAdjustments[shieldType] || ''}
                      onChange={(e) => setShieldAdjustments(prev => ({ ...prev, [shieldType]: e.target.value }))}
                      className="w-20 px-3 py-2 text-sm bg-gray-700 text-white border border-gray-600 rounded text-center"
                    />
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        const amount = parseInt(shieldAdjustments[shieldType] || '0')
                        if (!isNaN(amount) && amount > 0) handleShieldChange(shieldType, amount, true)
                      }}
                      className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 shadow-sm"
                    >
                      − Damage
                    </button>
                    {shield.canBeHealed && (
                      <button
                        onClick={() => {
                          const amount = parseInt(shieldAdjustments[shieldType] || '0')
                          if (!isNaN(amount) && amount > 0) handleShieldChange(shieldType, amount, false)
                        }}
                        className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 shadow-sm"
                      >
                        + Heal
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shield Information */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Shield Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Psychic Shield</h4>
              <p className="text-gray-200 mb-2">Source: Escamas de Eccen</p>
              <p className="text-gray-300 text-sm">Protects against psychic damage and mental effects.</p>
            </div>
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Tower Shield</h4>
              <p className="text-gray-200 mb-2">Source: Resistencia de la Torre Blanca</p>
              <p className="text-gray-300 text-sm">Indestructible shield providing constant protection.</p>
              <div className="text-yellow-400 text-sm mt-1">Special: Indestructible</div>
            </div>
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Magic Shield</h4>
              <p className="text-gray-200 mb-2">Source: High Magic Armor</p>
              <p className="text-gray-300 text-sm">Provides protection against magical attacks.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shield Usage Notes */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Shield Mechanics</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="p-3 border border-gray-700 rounded bg-gray-800">
              <div className="text-xs text-gray-400 mb-1">DAMAGE ORDER</div>
              <div className="text-sm text-gray-300">
                Damage is applied to shields first, then to hit points. Shields absorb damage in order of priority.
              </div>
            </div>
            <div className="p-3 border border-gray-700 rounded bg-gray-800">
              <div className="text-xs text-gray-400 mb-1">REGENERATION</div>
              <div className="text-sm text-gray-300">
                Some shields can be healed or regenerate over time. Check individual shield properties for healing capabilities.
              </div>
            </div>
            <div className="p-3 border border-gray-700 rounded bg-gray-800">
              <div className="text-xs text-gray-400 mb-1">SPECIAL PROPERTIES</div>
              <div className="text-sm text-gray-300">
                Indestructible shields cannot be damaged by normal means. Some shields have special resistances or interactions.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
