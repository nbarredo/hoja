import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGameState } from '@/hooks/useGameState'
import type { CharacterData } from './types'

interface MagicTabProps {
  characterData: CharacterData
}

export function MagicTab({ characterData }: MagicTabProps) {
  const { state, actions } = useGameState()

  const handleSpellSlotClick = (level: string) => {
    actions.useSpellSlot(level)
  }

  const handleSpellSlotRestore = (level: string) => {
    actions.restoreSpellSlot(level)
  }

  const handleAbilityUse = (abilityName: string) => {
    actions.useAbility(abilityName)
  }

  return (
    <div className="space-y-6">
      {/* Spell Slots */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Spell Slots</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-11 gap-3">
            {Object.entries(state.spellSlots).map(([level, slot]) => (
              <div key={level} className="text-center p-3 border border-gray-700 rounded bg-gray-800">
                <div className="text-xs text-gray-300 uppercase font-medium mb-2">Level {level}</div>
                <div className="flex flex-wrap gap-1 justify-center mb-2">
                  {Array.from({ length: slot.total }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (index < slot.used) {
                          // Restore this slot
                          handleSpellSlotRestore(level)
                        } else {
                          // Use this slot
                          handleSpellSlotClick(level)
                        }
                      }}
                      className={`w-7 h-7 rounded-lg border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
                        index < slot.used
                          ? 'bg-gray-600 border-gray-500 hover:bg-gray-500' // Used
                          : 'bg-blue-600 border-blue-500 hover:bg-blue-700 hover:border-blue-400' // Available
                      }`}
                      title={index < slot.used ? 'Click to restore' : 'Click to use'}
                    />
                  ))}
                </div>
                <div className="text-sm text-white">
                  {slot.total - slot.used}/{slot.total}
                </div>
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

      {/* Limited Use Abilities */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Limited Use Abilities (Per Long Rest)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(state.longRestAbilities).map(([abilityName, ability]) => (
              <div key={abilityName} className="p-4 border border-gray-700 rounded bg-gray-800">
                <h4 className="font-bold text-white text-sm mb-2">{abilityName}</h4>
                <div className="flex flex-wrap gap-1 mb-2">
                  {Array.from({ length: ability.total }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (index < ability.used) {
                          // Can't restore individual uses, only via long rest
                          return
                        } else {
                          handleAbilityUse(abilityName)
                        }
                      }}
                      className={`w-5 h-5 rounded-md border-2 transition-all duration-200 shadow-sm ${
                        index < ability.used
                          ? 'bg-gray-600 border-gray-500 cursor-not-allowed' // Used
                          : 'bg-green-600 border-green-500 hover:bg-green-700 hover:border-green-400 cursor-pointer' // Available
                      }`}
                      title={index < ability.used ? 'Used (restore with long rest)' : 'Click to use'}
                    />
                  ))}
                </div>
                <div className="text-xs text-white">
                  {ability.total - ability.used}/{ability.total} remaining
                </div>
              </div>
            ))}
          </div>
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
