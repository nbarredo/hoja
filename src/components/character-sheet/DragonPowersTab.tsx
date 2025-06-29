import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CharacterData } from './types'

interface DragonPowersTabProps {
  characterData: CharacterData
}

export function DragonPowersTab({ characterData }: DragonPowersTabProps) {
  // Transform the features object into an array format for filtering
  const getAllFeatures = () => {
    const featureCategories = []
    
    // Cast features to any to handle the mismatch between types and actual JSON structure
    const features = characterData.features as any
    
    if (features) {
      // Add racial traits
      if (features.racialTraits) {
        Object.entries(features.racialTraits).forEach(([categoryName, featuresArray]: [string, any]) => {
          if (Array.isArray(featuresArray)) {
            featureCategories.push({
              category: `Racial Traits: ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}`,
              abilities: featuresArray
            })
          }
        })
      }
      
      // Add dragon abilities
      if (features.dragonAbilities) {
        featureCategories.push({
          category: "Dragon Abilities",
          abilities: features.dragonAbilities
        })
      }
      
      // Add class features
      if (features.classFeatures) {
        Object.entries(features.classFeatures).forEach(([className, featuresArray]: [string, any]) => {
          if (Array.isArray(featuresArray)) {
            featureCategories.push({
              category: `${className.charAt(0).toUpperCase() + className.slice(1)} Features`,
              abilities: featuresArray
            })
          }
        })
      }
      
      // Add path features
      if (features.pathOfWhiteMoon) {
        featureCategories.push({
          category: "Path of White Moon",
          abilities: features.pathOfWhiteMoon
        })
      }
      
      // Add training features
      if (features.ambariosTraining) {
        featureCategories.push({
          category: "Ambarios Training",
          abilities: features.ambariosTraining
        })
      }
    }
    
    return featureCategories
  }

  const featureCategories = getAllFeatures()

  return (
    <div className="space-y-6">
      {/* Dragon Features */}
      {featureCategories.length > 0 && (
        <div className="space-y-6">
          {featureCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="bg-gray-900 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-xl font-bold text-white">{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {category.abilities.map((ability: any, abilityIndex: number) => (
                    <div key={abilityIndex} className="border border-gray-700 rounded p-4 bg-gray-800">
                      <h4 className="font-bold text-white text-lg mb-2">{ability.name}</h4>
                      <p className="text-gray-200 font-medium whitespace-pre-wrap">{ability.description}</p>
                      {ability.uses && <p className="text-gray-400 text-sm mt-2">Uses: {ability.uses}</p>}
                      {ability.source && <p className="text-gray-400 text-sm mt-1">Source: {ability.source}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Special Defensive Dragon Powers */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Special Defensive Powers</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Multiattack Enhancement</h4>
              <p className="text-gray-200">Enhanced multiattack capabilities from draconic heritage.</p>
              <p className="text-gray-400 text-sm mt-2">Source: Dragon Powers</p>
            </div>
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Explosive Crystal</h4>
              <p className="text-gray-200">Crystalline explosive abilities that can be deployed tactically.</p>
              <p className="text-gray-400 text-sm mt-2">Source: Dragon Powers</p>
            </div>
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Psychic Power</h4>
              <p className="text-gray-200">Enhanced psychic abilities from draconic mental prowess.</p>
              <p className="text-gray-400 text-sm mt-2">Source: Dragon Powers</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
