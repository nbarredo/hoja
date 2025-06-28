import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { CharacterData } from './types'

interface MagicItemsTabProps {
  characterData: CharacterData
}

export function MagicItemsTab({ characterData }: MagicItemsTabProps) {
  return (
    <div className="space-y-6">
      {/* Artifacts */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Artifacts</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {characterData.artifacts?.map((artifact, index) => (
              <div key={index} className="border border-gray-700 rounded p-4 bg-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-white text-lg">{artifact.name}</h4>
                  <Badge variant="outline" className="border-yellow-600 text-yellow-200 bg-yellow-900/20 font-bold">
                    Artifact
                  </Badge>
                </div>
                <p className="text-gray-200 font-medium">{artifact.description}</p>
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
            {characterData.legendaryItems?.map((item, index) => (
              <div key={index} className="border border-gray-700 rounded p-4 bg-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-white text-lg">{item.name}</h4>
                  <Badge variant="outline" className="border-orange-600 text-orange-200 bg-orange-900/20 font-bold">
                    Legendary
                  </Badge>
                </div>
                <p className="text-gray-200 font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipment Features (from velsirion_json.json) */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Equipment Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] p-6">
            <div className="space-y-6">
              {/* This would need to be populated from the more detailed velsirion_json.json data */}
              <div className="text-gray-300 font-medium">
                <p>Detailed equipment information would be loaded from the expanded character data structure.</p>
                <p className="mt-2">This includes artifact effects, legendary item abilities, and equipment bonuses.</p>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
