import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import type { CharacterData } from './types'

interface MagicItemsTabProps {
  characterData: CharacterData
}

export function MagicItemsTab({ characterData }: MagicItemsTabProps) {
  const equipment = (characterData as any).equipment;
  const features = (characterData as any).features;
  
  return (
    <div className="space-y-6">
      {/* Artifacts */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Artifacts</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {equipment?.artifacts?.map((artifact: any, index: number) => (
              <div key={index} className="border border-gray-700 rounded p-4 bg-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-white text-lg">{artifact.name}</h4>
                  <Badge variant="outline" className="border-yellow-600 text-yellow-200 bg-yellow-900/20 font-bold">
                    {artifact.rarity || "Artifact"}
                  </Badge>
                </div>
                {artifact.effects && (
                  <div className="space-y-2">
                    {artifact.effects.map((effect: string, effectIndex: number) => (
                      <div key={effectIndex} className="text-gray-200 text-sm bg-gray-700/50 p-2 rounded">
                        {effect}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legendary Items */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Legendary Items</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {equipment?.legendaryItems?.map((item: any, index: number) => (
              <div key={index} className="border border-gray-700 rounded p-4 bg-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-white text-lg">{item.name}</h4>
                  <Badge variant="outline" className="border-orange-600 text-orange-200 bg-orange-900/20 font-bold">
                    {item.rarity || "Legendary"}
                  </Badge>
                </div>
                {item.effects && (
                  <div className="space-y-2">
                    {item.effects.map((effect: string, effectIndex: number) => (
                      <div key={effectIndex} className="text-gray-200 text-sm bg-gray-700/50 p-2 rounded">
                        {effect}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Eaten Magic Items */}
      {features?.eatenMagicItems && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-xl font-bold text-white">Eaten Magic Items</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded">
              <p className="text-gray-200 text-sm">{features.eatenMagicItems.description}</p>
              <p className="text-gray-300 font-medium mt-2">
                Total Consumed: {features.eatenMagicItems.totalConsumed}
              </p>
            </div>
            <div className="space-y-3">
              {features.eatenMagicItems.bonuses?.map((bonus: any, index: number) => (
                <div key={index} className="border border-gray-700 rounded p-3 bg-gray-800">
                  <h5 className="font-bold text-white text-sm mb-1">{bonus.name}</h5>
                  <p className="text-gray-200 text-sm">{bonus.effect}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
