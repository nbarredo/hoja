import velsirionDataImport from '../../data/velsirion.json'
import type { CharacterData, Shields } from '@/components/character-sheet/types'

// Export the imported data
export const velsirionData = velsirionDataImport

// Convert the updated velsirion.json data to our expected format
export const transformUpdatedCharacterData = (data: any): CharacterData => {
  // Extract features from the structure
  const features = []
  
  // Add eaten magic items features
  if (data.features?.eatenMagicItems) {
    features.push({
      category: "Eaten Magic Items Bonuses",
      abilities: data.features.eatenMagicItems.bonuses.map((bonus: any) => ({
        name: bonus.name,
        description: bonus.effect
      }))
    })
  }
  
  // Add class features
  if (data.features?.classFeatures?.chronurgyWizard) {
    features.push({
      category: "Chronurgy Wizard Features",
      abilities: data.features.classFeatures.chronurgyWizard
    })
  }
  
  // Add racial traits
  if (data.features?.racialTraits?.gemGreatwyrm) {
    features.push({
      category: "Gem Greatwyrm Features",
      abilities: data.features.racialTraits.gemGreatwyrm
    })
  }
  
  if (data.features?.racialTraits?.dragonAbilities) {
    features.push({
      category: "Unique Dragon Abilities",
      abilities: data.features.racialTraits.dragonAbilities
    })
  }
  
  // Add path of white moon
  if (data.features?.pathOfWhiteMoon) {
    features.push({
      category: "El Camino de la Luna Blanca",
      abilities: data.features.pathOfWhiteMoon
    })
  }
  
  // Add Ambarios training
  if (data.features?.ambariosTraining) {
    features.push({
      category: "Ambarios Magic Techniques",
      abilities: data.features.ambariosTraining
    })
  }
  
  // Add feats
  if (data.feats) {
    features.push({
      category: "Feats",
      abilities: data.feats.map((feat: any) => ({
        name: feat.name,
        description: feat.effects.join('\n')
      }))
    })
  }

  // Add permanent spells
  if (data.permanentSpells) {
    features.push({
      category: "Permanent Active Spells",
      abilities: data.permanentSpells.map((spell: any) => ({
        name: spell.name,
        description: `Duration: ${spell.duration}\n${spell.effects.join('\n')}`
      }))
    })
  }

  // Build speed string from the updated structure
  const speedParts = []
  if (data.combat.speed.walking) speedParts.push(data.combat.speed.walking)
  if (data.combat.speed.burrow) speedParts.push(`burrow ${data.combat.speed.burrow}`)
  if (data.combat.speed.flying) speedParts.push(`fly ${data.combat.speed.flying}`)
  if (data.combat.speed.swimming) speedParts.push(`swim ${data.combat.speed.swimming}`)

  return {
    name: data.character.name,
    subtitle: `Level ${data.character.level} ${data.character.race} • ${data.character.class} • ${data.character.subclass}`,
    abilities: {
      strength: data.abilityScores.strength,
      dexterity: data.abilityScores.dexterity,
      constitution: data.abilityScores.constitution,
      intelligence: data.abilityScores.intelligence,
      wisdom: data.abilityScores.wisdom,
      charisma: data.abilityScores.charisma
    },
    combat: {
      ac: data.combat.armorClass.total,
      hp: data.combat.hitPoints.maximum,
      initiative: data.combat.initiative,
      speed: speedParts.join(', ')
    },
    shields: {
      psychic: data.combat.shields.psychicShield.points,
      tower: data.combat.shields.towerShield.points,
      magic: data.combat.shields.magicShield.points
    },
    spellcasting: {
      saveDC: data.spellcasting.spellSaveDC,
      attackBonus: data.spellcasting.spellAttackBonus,
      counterspellBonus: data.spellcasting.counterspellBonus,
      note: data.spellcasting.specialNotes
    },
    spellSlots: data.spellcasting.spellSlots,
    attacks: [
      ...data.attacks.meleeAttacks.map((attack: any) => ({
        name: attack.name,
        attackBonus: attack.attackBonus,
        damage: `${attack.damage} ${attack.damageType}`,
        description: attack.special.join(', ')
      })),
      ...data.attacks.specialAttacks.map((attack: any) => ({
        name: attack.name,
        uses: attack.uses,
        description: attack.effect
      })),
      {
        name: data.attacks.breathWeapon.name,
        damage: data.attacks.breathWeapon.damage.total,
        saveDC: data.attacks.breathWeapon.saveDC.withCollar,
        description: data.attacks.breathWeapon.special.join(', ')
      }
    ],
    skills: Object.entries(data.skills).map(([name, skill]: [string, any]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: skill.bonus
    })),
    saves: Object.entries(data.abilityScores).map(([name, ability]: [string, any]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: ability.savingThrow,
      proficient: ability.proficient
    })),
    artifacts: data.equipment.artifacts.map((artifact: any) => ({
      name: artifact.name,
      description: artifact.effects.join('\n')
    })),
    legendaryItems: data.equipment.legendaryItems.map((item: any) => ({
      name: item.name,
      description: item.effects.join('\n')
    })),
    features,
    immunities: [...data.immunities.damageTypes, ...data.immunities.conditions],
    resistances: data.resistances.special,
    regeneration: `${data.regeneration.forest}/turn (forest), ${data.regeneration.nearTrees}/turn (near trees), ${data.regeneration.otherwise}/turn (otherwise)`,
    legendaryResistances: {
      total: 14,
      used: 0,
      sources: ["Heart of Ryu (10)", "Great Wyrm (4)"]
    },
    additionalInfo: {
      proficiencyBonus: `+${data.character.proficiencyBonus}`,
      languages: data.languages.join(', '),
      senses: data.senses.join(', '),
      challengeRating: ''
    }
  }
}

// Get character data - using the updated JSON structure
export const getCharacterData = (): CharacterData => {
  return transformUpdatedCharacterData(velsirionData)
}

// For now, we'll use local state for updates since we're in a static environment
// In a real app, these would persist to a backend or local storage
export const updateHP = (newHP: number) => {
  // This would update the database
  console.log('Updating HP to:', newHP)
}

export const updateShields = (shields: Shields) => {
  // This would update the database
  console.log('Updating shields:', shields)
}
