import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Heart, Shield, Swords, Sparkles, Star, Zap,
  Plus, Minus, Flame, Moon, Crown, Gem,
  Wand2, Target, Activity, Book, Scroll,
  Clock, ChevronRight, Sword, ShieldCheck
} from 'lucide-react';

export default function CharacterSheet() {
  const [hp, setHp] = useState(3567);
  const [shields, setShields] = useState({
    psychic: 2000,
    tower: 1000,
    magic: 500
  });
  
  const [spellSlots, setSpellSlots] = useState({
    1: Array(4).fill(false),
    2: Array(3).fill(false),
    3: Array(3).fill(false),
    4: Array(3).fill(false),
    5: Array(3).fill(false),
    6: Array(3).fill(false),
    7: Array(2).fill(false),
    8: Array(2).fill(false),
    9: Array(2).fill(false),
    10: Array(1).fill(false),
    11: Array(1).fill(false)
  });

  const toggleSpellSlot = (level, index) => {
    setSpellSlots(prev => ({
      ...prev,
      [level]: prev[level].map((used, i) => i === index ? !used : used)
    }));
  };

  const updateShield = (type, delta) => {
    const maxValues = { psychic: 2000, tower: 1000, magic: 500 };
    setShields(prev => ({
      ...prev,
      [type]: Math.max(0, Math.min(maxValues[type], prev[type] + delta))
    }));
  };

  const abilities = [
    { name: "STR", score: 28, modifier: 9 },
    { name: "DEX", score: 20, modifier: 5 },
    { name: "CON", score: 28, modifier: 9 },
    { name: "INT", score: 32, modifier: 11 },
    { name: "WIS", score: 19, modifier: 4 },
    { name: "CHA", score: 23, modifier: 6 }
  ];

  const skills = [
    { name: "Arcana", value: 29, ability: "INT" },
    { name: "Athletics", value: 17, ability: "STR" },
    { name: "History", value: 29, ability: "INT" },
    { name: "Insight", value: 12, ability: "WIS" },
    { name: "Investigation", value: 19, ability: "INT" },
    { name: "Perception", value: 12, ability: "WIS" },
    { name: "Persuasion", value: 14, ability: "CHA" },
    { name: "Religion", value: 19, ability: "INT" },
    { name: "Stealth", value: 13, ability: "DEX" }
  ];

  const saves = [
    { name: "Strength", value: 13, proficient: false },
    { name: "Dexterity", value: 17, proficient: true },
    { name: "Constitution", value: 21, proficient: true },
    { name: "Intelligence", value: 22, proficient: true },
    { name: "Wisdom", value: 16, proficient: true },
    { name: "Charisma", value: 18, proficient: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-purple-800/50 bg-gray-900/90 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              VELSIRION ASTAROTH XEPHER
            </CardTitle>
            <CardDescription className="text-purple-300 text-lg mt-2 flex flex-wrap justify-center gap-2 md:gap-4">
              <span className="flex items-center gap-1">
                <Gem className="w-4 h-4" />
                Level 23 Gem Greatwyrm
              </span>
              <span className="text-purple-500">•</span>
              <span className="flex items-center gap-1">
                <Wand2 className="w-4 h-4" />
                Chronurgy Wizard
              </span>
              <span className="text-purple-500">•</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                Aprendiz de Ambarios
              </span>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full bg-gray-900/90 border border-purple-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-900/50">
              <Target className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="combat" className="data-[state=active]:bg-purple-900/50">
              <Swords className="w-4 h-4 mr-2" />
              Combat
            </TabsTrigger>
            <TabsTrigger value="magic" className="data-[state=active]:bg-purple-900/50">
              <Sparkles className="w-4 h-4 mr-2" />
              Magic
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-purple-900/50">
              <Activity className="w-4 h-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="equipment" className="data-[state=active]:bg-purple-900/50">
              <Crown className="w-4 h-4 mr-2" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-purple-900/50">
              <Scroll className="w-4 h-4 mr-2" />
              Features
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Abilities */}
              <Card className="border-purple-800/50 bg-gray-900/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-100">
                    <Target className="w-5 h-5 text-purple-400" />
                    Ability Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {abilities.map((ability) => (
                      <div key={ability.name} className="relative group">
                        <div className="absolute inset-0 bg-purple-600/20 rounded-lg blur-xl group-hover:bg-purple-600/30 transition-all" />
                        <div className="relative bg-gray-800/90 border border-purple-700/50 rounded-lg p-4 text-center hover:border-purple-600/70 transition-all">
                          <div className="text-xs text-purple-400 font-semibold">{ability.name}</div>
                          <div className="text-2xl font-bold text-white mt-1">{ability.score}</div>
                          <div className="text-sm text-purple-300">+{ability.modifier}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Combat Stats */}
              <Card className="border-purple-800/50 bg-gray-900/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-100">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Combat Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-purple-300 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Armor Class
                      </span>
                      <Badge className="bg-purple-600/20 text-purple-200 border-purple-600/50 text-lg px-3">
                        47
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-purple-300 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Initiative
                      </span>
                      <Badge className="bg-blue-600/20 text-blue-200 border-blue-600/50 text-lg px-3">
                        +21
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-purple-300">Speed</span>
                      <span className="text-purple-100 font-medium">60 ft, fly 120 ft</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-purple-300">Regeneration</span>
                      <span className="text-green-400 font-medium">500/turn (forest)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* HP and Shields */}
              <Card className="border-purple-800/50 bg-gray-900/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-100">
                    <Heart className="w-5 h-5 text-purple-400" />
                    Health & Shields
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main HP */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300 font-medium">Hit Points</span>
                      <span className="text-purple-100 font-bold">{hp} / 3567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-red-800/50 hover:bg-red-900/20"
                        onClick={() => setHp(Math.max(0, hp - 100))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Progress 
                        value={(hp / 3567) * 100} 
                        className="flex-1 h-6 bg-gray-800"
                      />
                      <Button 
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 border-green-800/50 hover:bg-green-900/20"
                        onClick={() => setHp(Math.min(3567, hp + 100))}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator className="bg-purple-800/30" />

                  {/* Shields */}
                  <div className="space-y-3">
                    {/* Psychic Shield */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300 text-sm">Psychic Shield</span>
                        <span className="text-purple-100 text-sm font-medium">{shields.psychic} / 2000</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 hover:bg-purple-900/20"
                          onClick={() => updateShield('psychic', -100)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Progress 
                          value={(shields.psychic / 2000) * 100} 
                          className="flex-1 h-4 bg-gray-800"
                          indicatorClassName="bg-purple-500"
                        />
                        <Button 
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 hover:bg-purple-900/20"
                          onClick={() => updateShield('psychic', 100)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Tower Shield */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300 text-sm">Tower Shield</span>
                        <span className="text-purple-100 text-sm font-medium">{shields.tower} / 1000</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 hover:bg-gray-700/20"
                          onClick={() => updateShield('tower', -100)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Progress 
                          value={(shields.tower / 1000) * 100} 
                          className="flex-1 h-4 bg-gray-800"
                          indicatorClassName="bg-gray-500"
                        />
                        <Button 
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 hover:bg-gray-700/20"
                          onClick={() => updateShield('tower', 100)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Magic Shield */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-300 text-sm">Magic Shield</span>
                        <span className="text-purple-100 text-sm font-medium">{shields.magic} / 500</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 hover:bg-blue-900/20"
                          onClick={() => updateShield('magic', -50)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Progress 
                          value={(shields.magic / 500) * 100} 
                          className="flex-1 h-4 bg-gray-800"
                          indicatorClassName="bg-blue-500"
                        />
                        <Button 
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 hover:bg-blue-900/20"
                          onClick={() => updateShield('magic', 50)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Immunities & Resistances */}
            <Card className="border-purple-800/50 bg-gray-900/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-100">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  Defenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-amber-900/20 to-orange-900/10 rounded-lg border border-amber-700/30 hover:border-amber-600/50 transition-all">
                    <h4 className="text-amber-300 font-semibold mb-2">Anillo de lo Inevitable</h4>
                    <p className="text-amber-100/80 text-sm">Time manipulation, fate control, resistance to all damage</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-900/20 to-orange-900/10 rounded-lg border border-amber-700/30 hover:border-amber-600/50 transition-all">
                    <h4 className="text-amber-300 font-semibold mb-2">Vara del Último Efreet</h4>
                    <p className="text-amber-100/80 text-sm">+5 DC to all spells, +200 fire damage, 3 Igneous Wishes</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-900/20 to-orange-900/10 rounded-lg border border-amber-700/30 hover:border-amber-600/50 transition-all">
                    <h4 className="text-amber-300 font-semibold mb-2">Libro de Ambarios</h4>
                    <p className="text-amber-100/80 text-sm">Advanced magic techniques, 3 Amber archmagic scrolls</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-900/20 to-orange-900/10 rounded-lg border border-amber-700/30 hover:border-amber-600/50 transition-all">
                    <h4 className="text-amber-300 font-semibold mb-2">Armadura El Legado de los Ancestros</h4>
                    <p className="text-amber-100/80 text-sm">+25 AC (does not stack), forest regeneration, hero spirits</p>
                  </div>
                </div>grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline" className="border-red-600/50 text-red-400">
                        Immunities
                      </Badge>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["Super Fire", "Super Lightning", "Magical Attacks", "Critical Hits"].map((immunity) => (
                        <Badge 
                          key={immunity} 
                          className="bg-red-950/50 text-red-200 border-red-800/50 font-normal"
                        >
                          {immunity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline" className="border-blue-600/50 text-blue-400">
                        Resistances
                      </Badge>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["All Damage Types", "Magic Resistance"].map((resistance) => (
                        <Badge 
                          key={resistance} 
                          className="bg-blue-950/50 text-blue-200 border-blue-800/50 font-normal"
                        >
                          {resistance}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Combat Tab */}
          <TabsContent value="combat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attacks */}
              <Card className="border-purple-800/50 bg-gray-900/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-100">
                    <Swords className="w-5 h-5 text-purple-400" />
                    Attacks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Claw Attacks */}
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-r from-purple-900/20 to-purple-800/10 rounded-lg border border-purple-700/30">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-purple-100 font-semibold">Garra de Yrkaryn (Right)</h4>
                        <Badge className="bg-purple-600/30 text-purple-200">+27</Badge>
                      </div>
                      <p className="text-purple-300 text-sm mb-1">
                        <span className="text-purple-400">Damage:</span> 1d100+29 Super Slashing
                      </p>
                      <p className="text-purple-200 text-sm italic">
                        Auto-dispels magic up to level 9
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-900/20 to-purple-800/10 rounded-lg border border-purple-700/30">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-purple-100 font-semibold">Garra de Myastan (Left)</h4>
                        <Badge className="bg-purple-600/30 text-purple-200">+27</Badge>
                      </div>
                      <p className="text-purple-300 text-sm mb-1">
                        <span className="text-purple-400">Damage:</span> 1d100+29 Super Sacred
                      </p>
                      <p className="text-green-300 text-sm italic">
                        Heals you for damage dealt
                      </p>
                    </div>
                  </div>

                  {/* Breath Weapon */}
                  <Separator className="bg-purple-800/30" />
                  
                  <div className="p-4 bg-gradient-to-r from-red-900/20 to-orange-900/10 rounded-lg border border-red-700/30">
                    <h4 className="text-orange-100 font-semibold mb-3 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-400" />
                      Singularity Breath
                    </h4>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <span className="text-orange-300 text-sm">Damage</span>
                        <p className="text-orange-100 font-semibold">10d8+1000 force</p>
                      </div>
                      <div>
                        <span className="text-orange-300 text-sm">Save DC</span>
                        <p className="text-orange-100 font-semibold">65</p>
                      </div>
                    </div>
                    <p className="text-orange-200 text-sm italic">
                      Hyper damage, auto-recharge
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Saving Throws */}
              <Card className="border-purple-800/50 bg-gray-900/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-100">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Saving Throws
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {saves.map((save) => (
                      <div 
                        key={save.name}
                        className={`p-3 rounded-lg border ${
                          save.proficient 
                            ? 'bg-purple-900/20 border-purple-700/50' 
                            : 'bg-gray-800/30 border-gray-700/30'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={save.proficient ? 'text-purple-200' : 'text-gray-400'}>
                            {save.name}
                          </span>
                          <span className={`font-bold text-lg ${
                            save.proficient ? 'text-purple-100' : 'text-gray-300'
                          }`}>
                            +{save.value}
                          </span>
                        </div>
                        {save.proficient && (
                          <Badge variant="outline" className="mt-1 text-xs border-purple-600/50 text-purple-300">
                            Proficient
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Magic Tab */}
          <TabsContent value="magic" className="space-y-6">
            {/* Spellcasting Stats */}
            <Card className="border-purple-800/50 bg-gray-900/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-100">
                  <Wand2 className="w-5 h-5 text-purple-400" />
                  Spellcasting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 p-6 rounded-lg border border-purple-700/50 text-center">
                    <div className="text-purple-300 text-sm mb-1">Spell Save DC</div>
                    <div className="text-4xl font-bold text-purple-100">42</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-6 rounded-lg border border-blue-700/50 text-center">
                    <div className="text-blue-300 text-sm mb-1">Spell Attack</div>
                    <div className="text-4xl font-bold text-blue-100">+26</div>
                  </div>
                  <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 p-6 rounded-lg border border-pink-700/50 text-center">
                    <div className="text-pink-300 text-sm mb-1">Counterspell</div>
                    <div className="text-4xl font-bold text-pink-100">+2</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-900/20 rounded-lg border border-purple-700/30">
                  <p className="text-purple-200 italic">
                    Evil dragons and their worshippers have disadvantage on saves
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Spell Slots */}
            <Card className="border-purple-800/50 bg-gray-900/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-100">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Spell Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(spellSlots).map(([level, slots]) => (
                    <div key={level} className="flex items-center gap-4 p-2 rounded-lg hover:bg-purple-900/10 transition-colors">
                      <div className="w-20 text-purple-300 font-medium">
                        Level {level}
                      </div>
                      <div className="flex gap-2 flex-1">
                        {slots.map((used, i) => (
                          <button
                            key={i}
                            onClick={() => toggleSpellSlot(level, i)}
                            className={`
                              w-10 h-10 rounded-full border-2 transition-all duration-200
                              flex items-center justify-center
                              ${used
                                ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                                : 'bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500 hover:border-purple-400 shadow-lg shadow-purple-500/30'
                              }
                            `}
                          >
                            {used && <span className="text-gray-500 text-sm">✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card className="border-purple-800/50 bg-gray-900/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-100">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {skills.map((skill) => (
                    <div 
                      key={skill.name} 
                      className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-900/20 to-transparent rounded-lg border border-purple-800/30 hover:border-purple-700/50 transition-all"
                    >
                      <div>
                        <span className="text-purple-100 font-medium">{skill.name}</span>
                        <span className="text-purple-400 text-xs ml-2">({skill.ability})</span>
                      </div>
                      <Badge className="bg-purple-600/30 text-purple-200 text-base">
                        +{skill.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-6">
            {/* Artifacts */}
            <Card className="border-purple-800/50 bg-gray-900/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-100">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Artifacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md: