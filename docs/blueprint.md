# **App Name**: Knight Trap: The Ascension

## Core Features:

- Board Initialization: Initialize an 8x8 chessboard with the White Knight and two Shadow Knights in starting positions.
- Knight Movement: Allow the player to move the White Knight to any valid square, following chess Knight movement rules. Show valid and invalid moves clearly.
- AI Shadow Knight Movement: Implement AI for the two Shadow Knights to aggressively pursue and trap the White Knight.
- Bomb Placement: Place a delayed bomb on each square the White Knight lands on.
- Fuse Length Escalation: Increase the fuse length of bombs based on the number of captured Shadow Knights.
- Scoring System: Implement a scoring system that awards points for safe moves and capturing Shadow Knights. Also implement the Score Multiplier escalation for capturing 5 Shadow Knights, making all earned points worth more.
- Game Over Conditions: Detect and end the game when any loss condition is met (trapped, bomb detonation, captured).

## Style Guidelines:

- A muted, desaturated purple (#7B54A6) is used for key UI elements like the "High Score" and "Score" boxes, as well as the 'X' and central emblem on the title plate, and the "Void Meter" elements. This color evokes a magical or ethereal strategy theme.
- A warm, gradient background transitions from a deep, muted orange-red at the top to a darker, more desaturated red-brown towards the bottom (#5B3A2C). This creates a twilight or sunset atmosphere with floating islands.
- A vibrant orange-yellow (#F39C12) is to be used for notifications or visual indicators like move glows or explosions.
- Headline font: 'Space Grotesk', sans-serif, for the game title and section headings. Body font: 'Inter', sans-serif, for displaying game information such as scores, fuse lengths, multipliers, and game instructions.
- Use clean, minimalist icons to represent game elements and actions.
- Maintain a clean and organized layout to emphasize essential game information.
- Implement subtle animations for Knight movement, bomb placements, explosions, and UI updates.