# Knight Trap - Arcade Survival Game

A high-speed arcade survival and score attack game built with React.js and Pixi.js.

## Game Features

### Core Mechanics
- **6x6 Grid Board**: Navigate your white knight (♘) on a chess board
- **AI Opponents**: Two black knights (♞) that actively try to trap you
- **Dynamic Void System**: Previously occupied squares become deadly red void tiles
- **Rapid Timer**: Make moves before the timer expires or lose instantly
- **Power-ups**: Collect special abilities to survive longer

### Scoring System
- **+1 point** for each safe, legal move
- **+10 points** for capturing a black knight
- **Void Depth**: Increases every 5 captures (max 20), making more squares dangerous

### Power-ups
- **⭐ Time Warp**: Instantly resets the move timer
- **🛡️ Void Shield**: Grants 2 moves of protection from void creation
- **⚡ Aether Blast**: Teleports both black knights to opposite corners

### AI Behavior
The black knights use tactical AI that:
- Minimizes your safe escape routes
- Actively tries to force checkmate-like traps
- Respawns instantly when captured

## How to Play

1. **Movement**: Click on valid squares to move your white knight (L-shape moves only)
2. **Avoid Void**: Never land on red void tiles - they're instant death!
3. **Capture Enemies**: Move onto black knights to capture them for points
4. **Collect Power-ups**: Walk over power-up icons to activate them
5. **Survive**: Make moves before the timer expires and avoid getting trapped

## Installation & Running

### Option 1: Direct HTML (Recommended)
Simply open `index.html` in a modern web browser. All dependencies are loaded via CDN.

### Option 2: Local Server
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or use simple server
npm start
```

## Technical Details

- **Framework**: React.js for state management and UI
- **Graphics**: Pixi.js for high-performance 2D rendering
- **Styling**: Tailwind CSS for responsive design
- **Architecture**: Single-file React component with Pixi.js canvas integration

## Game States

- **Playing**: Normal gameplay state
- **Game Over**: Triggered by timer expiry, void tile landing, or being trapped
- **Paused**: Not implemented in current version

## Browser Requirements

- Modern browser with ES6+ support
- WebGL support for Pixi.js rendering
- JavaScript enabled

## Controls

- **Mouse/Touch**: Click/tap on valid squares to move
- **Power-ups**: Click on power-up icons when your knight is on them

Enjoy the challenge of Knight Trap!
