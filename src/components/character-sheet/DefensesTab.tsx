import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameState } from '@/hooks/useGameState'
import type { CharacterData } from './types'

interface DefensesTabProps {
  characterData: CharacterData
}

export function DefensesTab({ characterData: _propCharacterData }: DefensesTabProps) {
  const { characterData, state, isLoading, error } = useGameState()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!state || !characterData) {
    return <div>No game state available</div>
  }

  // Type cast to access actual JSON structure
  const immunities = (characterData as any).immunities;
  const resistances = (characterData as any).resistances;
  const regeneration = (characterData as any).regeneration;

  return (
    <div className="space-y-6">
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
            {immunities?.damageTypes && (
              <div>
                <h4 className="text-lg font-bold text-white mb-3">Damage Types</h4>
                <div className="flex flex-wrap gap-2">
                  {immunities.damageTypes.map((immunity: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-red-600 text-red-200 bg-red-900/20 font-bold">
                      {immunity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {immunities?.conditions && (
              <div>
                <h4 className="text-lg font-bold text-white mb-3">Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {immunities.conditions.map((condition: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-yellow-600 text-yellow-200 bg-yellow-900/20 font-bold">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
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
            {resistances?.special?.map((resistance: string, index: number) => (
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
          <div className="space-y-3">
            {regeneration && (
              <>
                <div className="border border-gray-700 rounded p-4 bg-gray-800">
                  <h4 className="font-bold text-white mb-2">In Forest</h4>
                  <p className="text-white font-medium">{regeneration.forest}</p>
                </div>
                <div className="border border-gray-700 rounded p-4 bg-gray-800">
                  <h4 className="font-bold text-white mb-2">Near Trees</h4>
                  <p className="text-white font-medium">{regeneration.nearTrees}</p>
                </div>
                <div className="border border-gray-700 rounded p-4 bg-gray-800">
                  <h4 className="font-bold text-white mb-2">Otherwise</h4>
                  <p className="text-white font-medium">{regeneration.otherwise}</p>
                </div>
              </>
            )}
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
              <p className="text-white font-bold text-2xl">{(characterData as any).combat?.armorClass?.total || 'N/A'}</p>
              <div className="text-sm text-gray-300 mt-2">
                Natural Armor: {(characterData as any).combat?.armorClass?.breakdown?.naturalArmor || 'N/A'} + 
                Collar: {(characterData as any).combat?.armorClass?.breakdown?.collarDeRyu || 'N/A'} + 
                Korlak: {(characterData as any).combat?.armorClass?.breakdown?.korlakBonus || 'N/A'} + 
                Ring: {(characterData as any).combat?.armorClass?.breakdown?.anilloDeFuriell || 'N/A'}
              </div>
            </div>
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Proficiency Bonus</h4>
              <p className="text-white font-bold text-2xl">+{(characterData as any).character?.proficiencyBonus || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
