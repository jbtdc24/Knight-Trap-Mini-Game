⚔️ Knight Trap: The Ascension 💣

This is a Next.js starter project for Knight Trap: The Ascension, an endless tactical survival game built on a classic 8x8 chessboard. The core objective is to outwit AI-controlled Shadow Knights by maximizing score gain and survival through strategic use of bombs.

💻 Technology Stack

The project leverages modern frontend tools for high-performance 2D gameplay:

Framework: Next.js
Library: React
Rendering: Pixi.js (for smooth, high-performance 2D graphics)
Language: TypeScript

🎯 Core Gameplay Mechanics

Every Knight (White or Shadow) leaves a bomb on the square they move from.

Activation: The bomb is proximity-activated. If any Knight moves onto the square, it detonates.

Bomb Lifespan: Initially 3 White Knight moves, increasing by +1 move duration for every single capture.

Shadow Knight Death: If a Shadow Knight hits a bomb, it is destroyed, grants a capture bonus, and respawns after 3 White Knight moves.

2. The Gain Multiplier (Score Escalation)

The multiplier applies to all future points earned, not the current score.

Trigger: The Gain Multiplier increases linearly by +x1 every time a total of two Shadow Knights are captured or destroyed.

Impact: Safe Moves (+10 points) and Captures (+25 bonus points) are multiplied by the current Gain Multiplier.

3. Shadow Knight AI

The AI is programmed to be a trap-setter, not a constant pursuer.

Behavior: Shadow Knights actively avoid the White Knight while laying bombs.

Lethal Capture: If the White Knight moves into the Shadow Knight's direct L-move capture range, the AI will instantly prioritize capture.

Vulnerability: The AI cannot detect bombs, making them susceptible to player traps.

⚠️ Instant Loss

The game ends immediately if the White Knight is TRAPPED, activates a BOMB, or is CAPTURED.