import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CharacterData } from './types'

interface SkillsTabProps {
  characterData: CharacterData
}

// All D&D 5e skills with their associated abilities
const allSkills = [
  { name: 'Acrobatics', ability: 'dexterity' },
  { name: 'Animal Handling', ability: 'wisdom' },
  { name: 'Arcana', ability: 'intelligence' },
  { name: 'Athletics', ability: 'strength' },
  { name: 'Deception', ability: 'charisma' },
  { name: 'History', ability: 'intelligence' },
  { name: 'Insight', ability: 'wisdom' },
  { name: 'Intimidation', ability: 'charisma' },
  { name: 'Investigation', ability: 'intelligence' },
  { name: 'Medicine', ability: 'wisdom' },
  { name: 'Nature', ability: 'intelligence' },
  { name: 'Perception', ability: 'wisdom' },
  { name: 'Performance', ability: 'charisma' },
  { name: 'Persuasion', ability: 'charisma' },
  { name: 'Religion', ability: 'intelligence' },
  { name: 'Sleight of Hand', ability: 'dexterity' },
  { name: 'Stealth', ability: 'dexterity' },
  { name: 'Survival', ability: 'wisdom' }
]

export function SkillsTab({ characterData }: SkillsTabProps) {
  // Create a map of character's skills for quick lookup
  const characterSkills = new Map()
  
  // Handle characterData.skills as an object, not an array
  if (characterData.skills) {
    Object.entries(characterData.skills).forEach(([skillName, skillData]: [string, any]) => {
      characterSkills.set(skillName.toLowerCase(), {
        value: skillData.bonus,
        expertise: skillData.expertise || false
      })
    })
  }

  // Calculate proficiency bonus from additional info or default to +8
  const proficiencyBonus = parseInt(characterData.additionalInfo?.proficiencyBonus?.replace('+', '') || '8')

  // Generate all skills with calculated bonuses
  const allSkillsWithBonuses = allSkills.map(skill => {
    const characterSkill = characterSkills.get(skill.name.toLowerCase())
    const abilityModifier = characterData.abilities?.[skill.ability as keyof typeof characterData.abilities]?.modifier || 0
    
    // Check for expertise (double proficiency bonus)
    const hasExpertise = skill.name === 'Arcana' || characterSkill?.expertise || false
    
    let skillBonus, isProficient = false
    
    if (characterSkill !== undefined) {
      // Use the value from character data
      skillBonus = characterSkill.value
      isProficient = true
    } else if (skill.name === 'Arcana') {
      // Arcana gets double proficiency (expertise) even if not in character skills
      skillBonus = abilityModifier + (proficiencyBonus * 2)
      isProficient = true
    } else {
      // Use base ability modifier
      skillBonus = abilityModifier
    }
    
    return {
      name: skill.name,
      ability: skill.ability,
      bonus: skillBonus,
      isProficient,
      hasExpertise,
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
                  skill.hasExpertise 
                    ? 'border-purple-500 bg-purple-900/30' 
                    : skill.isProficient 
                      ? 'border-gray-600 bg-gray-900/20' 
                      : 'border-gray-700 bg-gray-800'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className="text-xs text-gray-400 uppercase">
                    {skill.ability.slice(0, 3)}
                    {skill.hasExpertise && (
                      <span className="ml-2 text-purple-300">◆◆ EXPERTISE</span>
                    )}
                    {skill.isProficient && !skill.hasExpertise && (
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
                {allSkillsWithBonuses.filter(s => s.isProficient && !s.hasExpertise).length}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Proficient Skills</div>
            </div>
            <div className="text-center p-4 border border-purple-500 rounded bg-purple-900/20">
              <div className="text-3xl font-bold text-purple-300 mb-1">
                {allSkillsWithBonuses.filter(s => s.hasExpertise).length}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Expertise Skills</div>
            </div>
            <div className="text-center p-4 border border-gray-700 rounded bg-gray-800">
              <div className="text-3xl font-bold text-gray-400 mb-1">
                {allSkillsWithBonuses.filter(s => !s.isProficient).length}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wider font-medium">Non-Proficient Skills</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
