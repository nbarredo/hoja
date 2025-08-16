# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (outputs to dist/ with .nojekyll for GitHub Pages)
- `npm run lint` - Run ESLint with TypeScript support
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages (requires predeploy build)

## Project Architecture

This is a React + TypeScript D&D character sheet application for a specific character named "Velsirion". The application uses a hybrid state management approach with two coexisting systems:

### State Management Architecture

**Two-Layer State System:**
1. **Legacy Context System** (`src/contexts/CharacterContext.tsx`) - Original React Context implementation (deprecated but still present)
2. **Current Game State System** (`src/lib/gameState*.ts`) - Modern singleton-based state management with persistence

The current system uses:
- `GameStateManager` singleton (`src/lib/gameState.ts`) for centralized state management
- `useGameState` hook (`src/hooks/useGameState.ts`) as the React interface
- Automatic localStorage persistence with debounced saves
- File import/export functionality via `filePersistence.ts`

### Character Data Architecture

**Static vs Dynamic Data:**
- **Static Character Data**: Base stats, equipment, spells loaded from JSON (`public/velsirion.json`)
- **Dynamic Game State**: Current HP, shield points, spell slot usage, ability uses - persisted in localStorage

**Key Components:**
- `App.tsx` - Main application with tabbed interface (Main, Skills, Magic, Items, Dragon Powers, Defenses, Shields)
- Character sheet tabs in `src/components/character-sheet/` - Each tab handles a specific aspect of the character
- UI components in `src/components/ui/` - Reusable shadcn/ui components

### Data Flow

1. Static character data loaded from JSON file during application initialization
2. Dynamic game state loaded from localStorage or defaults to initial values
3. User interactions trigger actions through `useGameState` hook
4. State changes are automatically persisted and subscribers notified
5. Long Rest functionality resets all dynamic state to full values

### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with shadcn/ui components and CSS variables for theming
- **State**: Custom singleton pattern with React hooks integration
- **Persistence**: localStorage with file import/export capabilities
- **Deployment**: GitHub Pages via gh-pages package

### Key Features

- Dark/light theme toggle with localStorage persistence
- Real-time state synchronization across UI components
- Long Rest functionality to reset all resources
- File-based state backup and restore
- Responsive tabbed interface for different character aspects

### File Structure Notes

- `/src/lib/database*.ts` - Data loading and transformation utilities
- `/src/components/character-sheet/` - Character-specific UI components
- `/public/velsirion.json` - Static character data file
- Vite configured with `/hoja/` base path for GitHub Pages deployment