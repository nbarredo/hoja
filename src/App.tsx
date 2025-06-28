import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGameState } from '@/hooks/useGameState'
import { BasicStatsTab } from '@/components/character-sheet/BasicStatsTab'
import { SkillsTabComponent } from '@/components/character-sheet/Skills'
import { MagicTab } from '@/components/character-sheet/MagicTab'
import { MagicItemsTab } from '@/components/character-sheet/MagicItemsTab'
import { DragonPowersTab } from '@/components/character-sheet/DragonPowersTab'
import { DefensesTab } from '@/components/character-sheet/DefensesTab'

function App() {
  const { characterData, actions, isLoading, error } = useGameState()

  const handleLongRest = async () => {
    await actions.longRest()
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading character data...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">Error: {error}</div>
  }

  if (!characterData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Character Header */}
        <div className="mb-8 border-b border-gray-800 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold tracking-wide mb-2 text-white">
                {characterData.name}
              </h1>
              <p className="text-xl text-gray-300 font-medium">
                {characterData.subtitle}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleLongRest}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                🌙 Long Rest
              </button>
              <button 
                onClick={() => actions.reset()}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-sm"
                title="Reset all state (for debugging)"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="main" className="w-full">
          <TabsList className="bg-gray-900 border border-gray-800 mb-8">
            <TabsTrigger 
              value="main" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-300 hover:text-white transition-colors"
            >
              Main
            </TabsTrigger>
            <TabsTrigger 
              value="skills" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-300 hover:text-white transition-colors"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger 
              value="magic" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-300 hover:text-white transition-colors"
            >
              Magic
            </TabsTrigger>
            <TabsTrigger 
              value="items" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-300 hover:text-white transition-colors"
            >
              Magic Items
            </TabsTrigger>
            <TabsTrigger 
              value="dragon" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-300 hover:text-white transition-colors"
            >
              Dragon Powers
            </TabsTrigger>
            <TabsTrigger 
              value="defenses" 
              className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-300 hover:text-white transition-colors"
            >
              Defenses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <BasicStatsTab characterData={characterData} />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsTabComponent characterData={characterData} />
          </TabsContent>

          <TabsContent value="magic">
            <MagicTab characterData={characterData} />
          </TabsContent>

          <TabsContent value="items">
            <MagicItemsTab characterData={characterData} />
          </TabsContent>

          <TabsContent value="dragon">
            <DragonPowersTab characterData={characterData} />
          </TabsContent>

          <TabsContent value="defenses">
            <DefensesTab characterData={characterData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
