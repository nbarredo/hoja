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
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-7xl mx-auto p-6">
          {/* Character Header */}
          <div className="mb-8 border-b border-border pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-bold tracking-wide mb-2 text-foreground">
                  {characterData.name}
                </h1>
                <p className="text-xl text-muted-foreground font-medium">
                  {characterData.subtitle}
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <ModeToggle />
                <Button 
                  onClick={handleLongRest}
                  variant="default"
                  size="lg"
                  className="shadow-lg hover:shadow-xl"
                >
                  🌙 Long Rest
                </Button>
                <Button 
                  onClick={() => actions.reset()}
                  variant="secondary"
                  size="sm"
                  className="shadow-lg hover:shadow-xl"
                  title="Reset all state (for debugging)"
                >
                  🔄 Reset
                </Button>
              </div>
            </div>
          </div>          {/* Main Tabs */}
          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-muted/30 p-1 rounded-lg border border-border shadow-lg mb-8 h-14">
              <TabsTrigger 
                value="main" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md text-muted-foreground hover:text-foreground transition-all duration-200 rounded-md font-medium text-base px-6 py-3 data-[state=active]:border data-[state=active]:border-border"
              >
                Main
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md text-muted-foreground hover:text-foreground transition-all duration-200 rounded-md font-medium text-base px-6 py-3 data-[state=active]:border data-[state=active]:border-border"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger 
                value="magic" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md text-muted-foreground hover:text-foreground transition-all duration-200 rounded-md font-medium text-base px-6 py-3 data-[state=active]:border data-[state=active]:border-border"
              >
                Magic
              </TabsTrigger>
              <TabsTrigger 
                value="items" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md text-muted-foreground hover:text-foreground transition-all duration-200 rounded-md font-medium text-base px-6 py-3 data-[state=active]:border data-[state=active]:border-border"
              >
                Magic Items
              </TabsTrigger>
              <TabsTrigger 
                value="dragon" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md text-muted-foreground hover:text-foreground transition-all duration-200 rounded-md font-medium text-base px-6 py-3 data-[state=active]:border data-[state=active]:border-border"
              >
                Dragon Powers
              </TabsTrigger>
              <TabsTrigger 
                value="defenses" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md text-muted-foreground hover:text-foreground transition-all duration-200 rounded-md font-medium text-base px-6 py-3 data-[state=active]:border data-[state=active]:border-border"
              >
                Defenses
              </TabsTrigger>
              <TabsTrigger 
                value="shields" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md text-muted-foreground hover:text-foreground transition-all duration-200 rounded-md font-medium text-base px-6 py-3 data-[state=active]:border data-[state=active]:border-border"
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
