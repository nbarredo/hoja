import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CharacterData } from './types'

interface SkillsTabProps {
  characterData: CharacterData
}

// All D&D 5e skills with their associated abilities and JSON keys
const allSkills = [
  { name: 'Acrobatics', ability: 'dexterity', jsonKey: 'acrobatics' },
  { name: 'Animal Handling', ability: 'wisdom', jsonKey: 'animalHandling' },
  { name: 'Arcana', ability: 'intelligence', jsonKey: 'arcana' },
  { name: 'Athletics', ability: 'strength', jsonKey: 'athletics' },
  { name: 'Deception', ability: 'charisma', jsonKey: 'deception' },
  { name: 'History', ability: 'intelligence', jsonKey: 'history' },
  { name: 'Insight', ability: 'wisdom', jsonKey: 'insight' },
  { name: 'Intimidation', ability: 'charisma', jsonKey: 'intimidation' },
  { name: 'Investigation', ability: 'intelligence', jsonKey: 'investigation' },
  { name: 'Medicine', ability: 'wisdom', jsonKey: 'medicine' },
  { name: 'Nature', ability: 'intelligence', jsonKey: 'nature' },
  { name: 'Perception', ability: 'wisdom', jsonKey: 'perception' },
  { name: 'Performance', ability: 'charisma', jsonKey: 'performance' },
  { name: 'Persuasion', ability: 'charisma', jsonKey: 'persuasion' },
  { name: 'Religion', ability: 'intelligence', jsonKey: 'religion' },
  { name: 'Sleight of Hand', ability: 'dexterity', jsonKey: 'sleightOfHand' },
  { name: 'Stealth', ability: 'dexterity', jsonKey: 'stealth' },
  { name: 'Survival', ability: 'wisdom', jsonKey: 'survival' }
]

export function SkillsTabComponent({ characterData }: SkillsTabProps) {
  // Create a map of character's skills for quick lookup
  const characterSkills = new Map()
  
  // Handle skills being an object instead of an array
  if (characterData.skills && typeof characterData.skills === 'object') {
    Object.entries(characterData.skills).forEach(([skillName, skillData]: [string, any]) => {
      characterSkills.set(skillName.toLowerCase(), {
        bonus: skillData.bonus || skillData.value || 0,
        expertise: skillData.expertise || false,
        proficient: skillData.proficient || false,
        notes: skillData.notes
      })
    })
  }

  // Calculate proficiency bonus from additional info or default to +8
  const proficiencyBonus = parseInt(characterData.additionalInfo?.proficiencyBonus?.replace('+', '') || '8')

  // Generate all skills with calculated bonuses
  const allSkillsWithBonuses = allSkills.map(skill => {
    const characterSkill = characterSkills.get(skill.jsonKey.toLowerCase())
    const abilityModifier = characterData.abilities?.[skill.ability as keyof typeof characterData.abilities]?.modifier || 0
    
    // If character has this skill defined in the JSON, use those values
    if (characterSkill && characterSkill.bonus !== undefined) {
      return {
        name: skill.name,
        ability: skill.ability,
        bonus: characterSkill.bonus,
        proficient: characterSkill.proficient,
        expertise: characterSkill.expertise || skill.name === 'Arcana', // Arcana gets expertise
        abilityModifier,
        notes: characterSkill.notes
      }
    }
    
    // For Arcana, give it expertise even if not in character data
    if (skill.name === 'Arcana') {
      return {
        name: skill.name,
        ability: skill.ability,
        bonus: abilityModifier + (proficiencyBonus * 2), // Expertise = double proficiency
        proficient: true,
        expertise: true,
        abilityModifier
      }
    }
    
    // Otherwise calculate base ability modifier (not proficient)
    return {
      name: skill.name,
      ability: skill.ability,
      bonus: abilityModifier,
      proficient: false,
      expertise: false,
      abilityModifier
    }
  })

  // Sort skills alphabetically
  allSkillsWithBonuses.sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">All Skills</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allSkillsWithBonuses.map((skill) => (
              <div 
                key={skill.name} 
                className={`flex justify-between items-center py-3 px-4 rounded border ${
                  skill.expertise
                    ? 'border-purple-500 bg-purple-900/30'
                    : skill.proficient 
                    ? 'border-gray-600 bg-gray-900/20' 
                    : 'border-gray-700 bg-gray-800'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className="text-xs text-gray-400 uppercase">
                    {skill.ability.slice(0, 3)}
                    {skill.expertise && (
                      <span className="ml-2 text-purple-300">◆◆ EXPERTISE</span>
                    )}
                    {skill.proficient && !skill.expertise && (
                      <span className="ml-2 text-gray-300">● PROFICIENT</span>
                    )}
                  </span>
                </div>
                <span className="font-mono text-white font-bold text-lg">
                  {skill.bonus >= 0 ? '+' : ''}{skill.bonus}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proficiency Information */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-xl font-bold text-white">Skill Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-white mb-1">+{proficiencyBonus}</div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Proficiency Bonus</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-gray-300 mb-1">
                {allSkillsWithBonuses.filter(s => s.proficient && !s.expertise).length}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Proficient Skills</div>
            </div>
            <div className="text-center p-4 border border-purple-500 rounded bg-purple-900/20">
              <div className="text-3xl font-bold text-purple-300 mb-1">
                {allSkillsWithBonuses.filter(s => s.expertise).length}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Expertise Skills</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-gray-400 mb-1">
                {allSkillsWithBonuses.filter(s => !s.proficient).length}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Non-Proficient Skills</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
