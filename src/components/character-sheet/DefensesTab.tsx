import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { CharacterData } from './types'

interface DefensesTabProps {
  characterData: CharacterData
}

export function DefensesTab({ characterData }: DefensesTabProps) {
  return (
    <div className="space-y-6">
      {/* Shields */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Shields</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {characterData.shields && Object.entries(characterData.shields).map(([shieldType, value]) => (
              <div key={shieldType} className="border border-gray-700 rounded p-4 bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg text-white font-bold capitalize">{shieldType.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-2xl font-bold text-white">{value}</span>
                </div>
                <Progress value={100} className="h-3 bg-gray-900" />
              </div>
            ))}
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
              <h4 className="text-lg font-bold text-white mb-3">Damage Types</h4>
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

      {/* Additional Defense Info */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Additional Defense Info</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Challenge Rating</h4>
              <p className="text-white font-bold text-2xl">26 (90,000 XP)</p>
            </div>
            <div className="border border-gray-700 rounded p-4 bg-gray-800">
              <h4 className="font-bold text-white text-lg mb-2">Proficiency Bonus</h4>
              <p className="text-white font-bold text-2xl">+8</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
