export interface Ability {
  score: number;
  modifier: number;
}

export interface Abilities {
  strength: Ability;
  dexterity: Ability;
  constitution: Ability;
  intelligence: Ability;
  wisdom: Ability;
  charisma: Ability;
}

export interface Combat {
  ac: number;
  hp: number;
  speed: string;
  initiative: number;
}

export interface Shields {
  psychic: number;
  tower: number;
  magic: number;
}

export interface Spellcasting {
  saveDC: number;
  attackBonus: number;
  counterspellBonus: number;
  note: string;
}

export interface Attack {
  name: string;
  attackBonus?: number;
  damage?: string;
  uses?: string;
  saveDC?: string;
  description: string;
}

export interface Skill {
  name: string;
  value: number;
}

export interface Save {
  name: string;
  value: number;
  proficient: boolean;
}

export interface Item {
  name: string;
  description: string;
}

export interface Feature {
  name: string;
  description: string;
}

export interface FeatureCategory {
  category: string;
  abilities: Feature[];
}

export interface AdditionalInfo {
  proficiencyBonus: string;
  languages: string;
  senses: string;
  challengeRating: string;
}

export interface SpellSlots {
  [key: string]: number;
}

export interface CharacterData {
  name: string;
  subtitle: string;
  abilities: Abilities;
  combat: Combat;
  shields: Shields;
  spellcasting: Spellcasting;
  spellSlots: SpellSlots;
  attacks: Attack[];
  skills: Skill[];
  saves: Save[];
  artifacts: Item[];
  legendaryItems: Item[];
  features: FeatureCategory[];
  immunities: string[];
  resistances: string[];
  regeneration: string;
  additionalInfo: AdditionalInfo;
}
