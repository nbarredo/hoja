import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CharacterData } from './types'

interface DragonPowersTabProps {
  characterData: CharacterData
}

export function DragonPowersTab({ characterData }: DragonPowersTabProps) {
  return (
    <div className="space-y-6">
      {/* Dragon Features */}
      {characterData.features && (
        <div className="space-y-6">
          {characterData.features
            .filter(category => 
              category.category.includes("Dragon") || 
              category.category.includes("Gem Greatwyrm") ||
              category.category.includes("Chronurgy") ||
              category.category.includes("El Camino de la Luna Blanca") ||
              category.category.includes("Eyestone")
            )
            .map((category, categoryIndex) => (
              <Card key={categoryIndex} className="bg-gray-900 border-gray-700">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-xl font-bold text-white">{category.category}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {category.abilities.map((ability, abilityIndex) => (
                      <div key={abilityIndex} className="border border-gray-700 rounded p-4 bg-gray-800">
                        <h4 className="font-bold text-white text-lg mb-2">{ability.name}</h4>
                        <p className="text-gray-200 font-medium whitespace-pre-wrap">{ability.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Regeneration */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Regeneration</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">500</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Forest (per turn)</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">200</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Near Trees (per turn)</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">100</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Otherwise (per turn)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Senses and Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-xl font-bold text-white">Senses</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 px-3 border-b border-gray-800">
                <span className="text-white font-medium">Blindsight</span>
                <span className="text-white font-bold">60 ft</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 border-b border-gray-800">
                <span className="text-white font-medium">Darkvision</span>
                <span className="text-white font-bold">120 ft</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3">
                <span className="text-white font-medium">Passive Perception</span>
                <span className="text-white font-bold">22</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-xl font-bold text-white">Languages</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="py-2 px-3 border-b border-gray-800">
                <span className="text-white font-medium">Common</span>
              </div>
              <div className="py-2 px-3 border-b border-gray-800">
                <span className="text-white font-medium">Draconic</span>
              </div>
              <div className="py-2 px-3">
                <span className="text-white font-medium">Telepathy 120 ft</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
