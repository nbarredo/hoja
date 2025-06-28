import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useGameState } from '@/hooks/useGameState'
import { velsirionData } from '@/lib/database'
import type { CharacterData } from './types'

interface DefensesTabProps {
  characterData: CharacterData
}

export function DefensesTab({ characterData }: DefensesTabProps) {
  const { state } = useGameState()

  return (
    <div className="space-y-6">
      {/* Shields */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Shields</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Object.entries(state.shields).map(([shieldType, shield]) => (
              <div key={shieldType} className="border border-gray-700 rounded p-4 bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg text-white font-bold capitalize">
                    {shieldType.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-2xl font-bold text-white">
                    {shield.current}/{shield.points}
                  </span>
                </div>
                <Progress 
                  value={(shield.current / shield.points) * 100} 
                  className="h-3 bg-gray-900" 
                />
                <div className="text-sm text-gray-300 mt-2">
                  Source: {shield.source}
                  {shield.special && <span className="text-yellow-400 ml-2">({shield.special})</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Special Defensive Abilities */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Special Defensive Abilities</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Resistencia de Eccen</h4>
              <p className="text-gray-200">5-6 on 1d6 ignore any damage and gain +1 AC per combat</p>
            </div>
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Resistencia Entrópica</h4>
              <p className="text-gray-200">6 on 1d6 - Returns damage received</p>
              <div className="text-sm text-gray-400 mt-1">Source: Staff of Entropy</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Immunities */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Immunities</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Damage Types & Conditions</h4>
              <div className="flex flex-wrap gap-2">
                {characterData.immunities?.map((immunity, index) => (
                  <Badge key={index} variant="outline" className="border-red-600 text-red-200 bg-red-900/20 font-bold">
                    {immunity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resistances */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Resistances</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {characterData.resistances?.map((resistance, index) => (
              <div key={index} className="border border-gray-700 rounded p-3 bg-gray-800">
                <span className="text-white font-medium">{resistance}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regeneration */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Regeneration</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="border border-gray-700 rounded p-4 bg-gray-800">
            <p className="text-white font-medium">{characterData.regeneration}</p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Defense Info */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Defense Statistics</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Armor Class</h4>
              <p className="text-white font-bold text-2xl">{velsirionData.combat.armorClass.total}</p>
              <div className="text-sm text-gray-300 mt-2">
                Natural Armor: {velsirionData.combat.armorClass.breakdown.naturalArmor} + 
                Collar: {velsirionData.combat.armorClass.breakdown.collarDeRyu} + 
                Korlak: {velsirionData.combat.armorClass.breakdown.korlakBonus} + 
                Ring: {velsirionData.combat.armorClass.breakdown.anilloDeFuriell}
              </div>
            </div>
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Proficiency Bonus</h4>
              <p className="text-white font-bold text-2xl">+{velsirionData.character.proficiencyBonus}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
