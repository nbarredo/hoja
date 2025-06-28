import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CharacterData } from './types'

interface BasicStatsTabProps {
  characterData: CharacterData
}

export function BasicStatsTab({ characterData }: BasicStatsTabProps) {
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
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">{characterData.combat.hp}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Hit Points</div>
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
                  <span className="text-gray-300 font-medium">Challenge Rating</span>
                  <span className="text-white font-bold">{characterData.additionalInfo?.challengeRating}</span>
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
