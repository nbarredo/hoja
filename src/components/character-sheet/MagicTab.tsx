import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CharacterData } from './types'

interface MagicTabProps {
  characterData: CharacterData
}

export function MagicTab({ characterData }: MagicTabProps) {
  return (
    <div className="space-y-6">
      {/* Spell Slots */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Spell Slots</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-11 gap-3">
            {characterData.spellSlots && Object.entries(characterData.spellSlots).map(([level, slots]) => (
              <div key={level} className="text-center p-3 border border-gray-700 rounded bg-gray-800">
                <div className="text-2xl font-bold text-white mb-1">{slots}</div>
                <div className="text-xs text-gray-300 uppercase font-medium">Level {level}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spellcasting Stats */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Spellcasting</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">{characterData.spellcasting?.saveDC}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Spell Save DC</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">+{characterData.spellcasting?.attackBonus}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Spell Attack</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">+{characterData.spellcasting?.counterspellBonus}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Counterspell</div>
            </div>
          </div>
          {characterData.spellcasting?.note && (
            <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded">
              <p className="text-sm text-gray-300 font-medium">{characterData.spellcasting.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attacks */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Attacks</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {characterData.attacks?.map((attack, index) => (
              <div key={index} className="border border-gray-700 rounded p-4 bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white text-lg">{attack.name}</h4>
                  <div className="flex gap-2">
                    {attack.attackBonus && (
                      <Badge variant="outline" className="border-gray-600 text-white bg-gray-700 font-bold">
                        +{attack.attackBonus}
                      </Badge>
                    )}
                    {attack.damage && (
                      <Badge variant="outline" className="border-gray-600 text-white bg-gray-700 font-bold">
                        {attack.damage}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-gray-200 font-medium">{attack.description}</p>
                {attack.uses && (
                  <div className="mt-2 text-sm text-gray-300 font-medium">Uses: {attack.uses}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permanent Spells */}
      {characterData.features && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-xl font-bold text-white">Permanent Active Spells</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {characterData.features
                .filter(category => category.category === "Permanent Active Spells")
                .map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    {category.abilities.map((spell, spellIndex) => (
                      <div key={spellIndex} className="border border-gray-700 rounded p-4 bg-gray-800">
                        <h4 className="font-bold text-white text-lg mb-2">{spell.name}</h4>
                        <p className="text-gray-200 font-medium">{spell.description}</p>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ambarios Magic Techniques */}
      {characterData.features && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-xl font-bold text-white">Ambarios Magic Techniques</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {characterData.features
                .filter(category => category.category === "Ambarios Magic Techniques")
                .map((category, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-3">
                    {category.abilities.map((technique, techniqueIndex) => (
                      <div key={techniqueIndex} className="border border-gray-700 rounded p-3 bg-gray-800">
                        <h5 className="font-bold text-white text-sm mb-1">{technique.name}</h5>
                        <p className="text-gray-200 text-sm">{technique.description}</p>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
