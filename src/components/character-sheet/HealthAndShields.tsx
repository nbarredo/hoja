import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Heart, Plus, Minus } from 'lucide-react';
import type { Shields } from './types';

interface HealthAndShieldsProps {
  hp: number;
  maxHp: number;
  shields: Shields;
  onHpChange: (newHp: number) => void;
  onShieldChange: (type: keyof Shields, delta: number) => void;
}

export function HealthAndShields({ 
  hp, 
  maxHp, 
  shields, 
  onHpChange, 
  onShieldChange 
}: HealthAndShieldsProps) {
  const updateShield = (type: keyof Shields, delta: number) => {
    const maxValues = { psychic: 2000, tower: 1000, magic: 500 };
    const currentValue = shields[type];
    const newValue = Math.max(0, Math.min(maxValues[type], currentValue + delta));
    onShieldChange(type, newValue - currentValue);
  };

  return (
    <Card className="border-red-800/50 bg-gray-900/70 backdrop-blur-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-100">
          <Heart className="w-5 h-5 text-red-400 animate-pulse" />
          Health & Shields
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main HP */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-red-300 font-medium">Hit Points</span>
            <span className="text-red-100 font-bold text-lg">{hp} / {maxHp}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="icon"
              variant="outline"
              className="h-8 w-8 border-red-800/50 hover:bg-red-900/30 hover:border-red-600/70 transition-all duration-300"
              onClick={() => onHpChange(Math.max(0, hp - 100))}
            >
              <Minus className="w-4 h-4 text-red-400" />
            </Button>
            <div className="flex-1 relative">
              <Progress 
                value={(hp / maxHp) * 100} 
                className="h-6 bg-gray-800 border border-red-800/30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-500/20 rounded-full" />
            </div>
            <Button 
              size="icon"
              variant="outline"
              className="h-8 w-8 border-green-800/50 hover:bg-green-900/30 hover:border-green-600/70 transition-all duration-300"
              onClick={() => onHpChange(Math.min(maxHp, hp + 100))}
            >
              <Plus className="w-4 h-4 text-green-400" />
            </Button>
          </div>
        </div>

        <Separator className="bg-red-800/30" />

        {/* Shields */}
        <div className="space-y-3">
          {/* Psychic Shield */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-red-300 text-sm">Psychic Shield</span>
              <span className="text-red-100 text-sm font-medium">{shields.psychic} / 2000</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="icon"
                variant="ghost"
                className="h-6 w-6 hover:bg-red-900/20"
                onClick={() => updateShield('psychic', -100)}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Progress 
                value={(shields.psychic / 2000) * 100} 
                className="flex-1 h-4 bg-gray-800"
                indicatorClassName="bg-red-500"
              />
              <Button 
                size="icon"
                variant="ghost"
                className="h-6 w-6 hover:bg-red-900/20"
                onClick={() => updateShield('psychic', 100)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Tower Shield */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-red-300 text-sm">Tower Shield</span>
              <span className="text-red-100 text-sm font-medium">{shields.tower} / 1000</span>
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
              <span className="text-red-300 text-sm">Magic Shield</span>
              <span className="text-red-100 text-sm font-medium">{shields.magic} / 500</span>
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
  );
}
