
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, ShieldCheck, Zap } from 'lucide-react';
import type { Ability } from './types';

interface AbilitiesProps {
  abilities: Ability[];
}

export function Abilities({ abilities }: AbilitiesProps) {
  return (
    <Card className="border-red-800/50 bg-gray-900/70 backdrop-blur-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-100">
          <Target className="w-5 h-5 text-red-400" />
          Ability Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {abilities.map((ability) => (
            <div key={ability.name} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-indigo-600/20 rounded-lg blur-xl group-hover:from-red-600/30 group-hover:to-indigo-600/30 transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-red-700/50 rounded-lg p-4 text-center hover:border-red-600/70 hover:shadow-lg hover:shadow-red-600/20 transition-all duration-300">
                <div className="text-xs text-red-400 font-semibold tracking-wider">{ability.name}</div>
                <div className="text-2xl font-bold text-white mt-1 bg-gradient-to-br from-white to-red-100 bg-clip-text text-transparent">{ability.score}</div>
                <div className="text-sm text-red-300 font-medium">+{ability.modifier}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface CombatStatsProps {
  ac: number;
  initiative: number;
  speed: string;
  regeneration: string;
}

export function CombatStats({ ac, initiative, speed, regeneration }: CombatStatsProps) {
  return (
    <Card className="border-red-800/50 bg-gray-900/70 backdrop-blur-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-100">
          <ShieldCheck className="w-5 h-5 text-red-400" />
          Combat Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-red-700/30 hover:border-red-600/50 transition-all duration-300">
            <span className="text-red-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Armor Class
            </span>
            <Badge className="bg-gradient-to-r from-red-600/30 to-red-700/30 text-red-100 border-red-600/50 text-lg px-4 py-1 font-bold shadow-lg">
              {ac}
            </Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-blue-700/30 hover:border-blue-600/50 transition-all duration-300">
            <span className="text-blue-300 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Initiative
            </span>
            <Badge className="bg-gradient-to-r from-blue-600/30 to-blue-700/30 text-blue-100 border-blue-600/50 text-lg px-4 py-1 font-bold shadow-lg">
              +{initiative}
            </Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-green-700/30 hover:border-green-600/50 transition-all duration-300">
            <span className="text-green-300 font-medium">Speed</span>
            <span className="text-green-100 font-bold">{speed}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-emerald-700/30 hover:border-emerald-600/50 transition-all duration-300">
            <span className="text-emerald-300 font-medium">Regeneration</span>
            <span className="text-emerald-200 font-bold animate-pulse">{regeneration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
