import velsirionData from '../data/velsirion.json'

console.log('Testing velsirion data import:')
console.log('AC from JSON:', velsirionData.combat.armorClass.total)
console.log('Spell DC from JSON:', velsirionData.spellcasting.spellSaveDC)
console.log('HP from JSON:', velsirionData.combat.hitPoints.maximum)

export { velsirionData }
