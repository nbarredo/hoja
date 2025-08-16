import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useGameState } from '@/hooks/useGameState'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { BasicStatsTab } from '@/components/character-sheet/BasicStatsTab'
import { SkillsTabComponent } from '@/components/character-sheet/Skills'
import { MagicTab } from '@/components/character-sheet/MagicTab'
import { MagicItemsTab } from '@/components/character-sheet/MagicItemsTab'
import { DragonPowersTab } from '@/components/character-sheet/DragonPowersTab'
import { DefensesTab } from '@/components/character-sheet/DefensesTab'
import { ShieldsTab } from '@/components/character-sheet/ShieldsTab'

function App() {
  const { characterData, actions, isLoading, error } = useGameState()

  const handleLongRest = async () => {
    console.log('Long Rest button clicked!')
    try {
      await actions.longRest()
      console.log('Long Rest completed successfully, refreshing page...')
      // Refresh the page to reset all local state
      window.location.reload()
    } catch (error) {
      console.error('Long Rest failed:', error)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading character data...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">Error: {error}</div>
  }

  if (!characterData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="velsirion-ui-theme">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto p-6 relative z-10">
          {/* Character Header */}
          <div className="mb-8 border-b border-border/50 pb-6 backdrop-blur-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-6xl font-bold tracking-wide bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
                  {characterData.name}
                </h1>
                <p className="text-2xl text-muted-foreground font-medium bg-gradient-to-r from-muted-foreground to-muted-foreground/70 bg-clip-text text-transparent">
                  {characterData.subtitle}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <ModeToggle />
                <Button 
                  onClick={handleLongRest}
                  variant="default"
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 text-white font-semibold"
                >
                  🌙 Long Rest
                </Button>
                <Button 
                  onClick={() => actions.reset()}
                  variant="secondary"
                  size="sm"
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 text-white"
                  title="Reset all state (for debugging)"
                >
                  🔄 Reset
                </Button>
              </div>
            </div>
          </div>          {/* Main Tabs */}
          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-gradient-to-r from-muted/40 via-muted/30 to-muted/40 p-2 rounded-xl border border-border/50 shadow-xl mb-8 h-16 backdrop-blur-md">
              <TabsTrigger 
                value="main" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg font-semibold text-base px-6 py-3 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-muted/20"
              >
                Main
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg font-semibold text-base px-6 py-3 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-muted/20"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger 
                value="magic" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg font-semibold text-base px-6 py-3 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-muted/20"
              >
                Magic
              </TabsTrigger>
              <TabsTrigger 
                value="items" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg font-semibold text-base px-6 py-3 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-muted/20"
              >
                Magic Items
              </TabsTrigger>
              <TabsTrigger 
                value="dragon" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg font-semibold text-base px-6 py-3 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-muted/20"
              >
                Dragon Powers
              </TabsTrigger>
              <TabsTrigger 
                value="defenses" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg font-semibold text-base px-6 py-3 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-muted/20"
              >
                Defenses
              </TabsTrigger>
              <TabsTrigger 
                value="shields" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/90 data-[state=active]:to-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg font-semibold text-base px-6 py-3 data-[state=active]:transform data-[state=active]:scale-105 hover:bg-muted/20"
              >
                Shields
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

          <TabsContent value="shields">
            <ShieldsTab characterData={characterData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ThemeProvider>
  )
}

export default App
