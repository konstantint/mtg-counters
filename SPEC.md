# Magic: The Gathering Life Counter App Specification

## Overview
A two-player, mobile-first web application for tracking life totals and various counters in Magic: The Gathering. The interface is split into two halves, one for each player, with a central utility bar.

## Layout & Orientation
- **Full Screen**: The app takes up the entire viewport (`h-dvh`, `w-full`), preventing scrolling (`overflow-hidden`).
- **Player 2 Area (Top)**: Rotated 180 degrees so a player sitting across the table can read it.
- **Middle Utility Bar**: A horizontal bar separating the two players.
- **Player 1 Area (Bottom)**: Normal orientation.

## Core Features

### 1. Player Area
Each player area contains:
- **Background Color**: Reflects the player's chosen MTG color (White, Blue, Black, Red, Green, Colorless). Transitions smoothly when changed.
- **Life Total Display**: A massive, centered number showing the current life total.
- **Life Modification Tap Areas**:
  - The left half of the player area decreases life.
  - The right half of the player area increases life.
  - **Delta Counters**: Rapidly tapping either side displays a temporary floating counter (e.g., `+1`, `+2` or `-1`, `-2`) over the tapped area. This counter accumulates with each tap and disappears after 1 second of inactivity.
- **Color Picker (Top Left)**: A button that opens a popup to select the player's background color.
- **Secondary Counters (Bottom)**: A row of icons to track:
  - Poison
  - Energy
  - Experience
  - Commander Damage (tracked specifically against the opponent)
  - Clicking an icon opens a small control panel with `-` and `+` buttons to adjust that specific counter's value.

### 2. Middle Utility Bar
Contains the following controls:
- **Reset Button**: Resets both players' life to the default starting life and clears all secondary counters.
- **d20 Button**: Rolls a 20-sided die and displays the result in a modal.
- **Coin Button**: Flips a coin (Heads/Tails) and displays the result in a modal.
- **Settings Button**: Opens the settings modal.

### 3. Settings Modal
- **Starting Life Selection**: Options to set the default starting life to 20, 30, or 40. Changing this immediately resets the game with the new starting life.
- **Reset Game Now**: A prominent button to manually reset the game.

### 4. Dice/Coin Modal
- A large, centered modal that displays the result of a d20 roll or coin flip.
- Contains an "OK" button to dismiss the modal.

## Technical Requirements

### State Persistence
- All game state (player life, secondary counters, chosen colors, and starting life preference) must be automatically saved to `localStorage`.
- On load, the app must restore the exact state from `localStorage` if it exists.

### Interaction & Performance
- **Zero Touch Delay**: Rapid-fire interactive elements (life tap areas, counter increment/decrement) must use `onPointerDown` instead of `onClick` to bypass the 300ms mobile browser delay and provide immediate response.
- **Intentional Interaction**: Buttons that trigger modals or significant UI state changes (Settings, Reset, Dice/Coin) must use `onClick` to prevent accidental "auto-clicks" on elements that appear or change immediately under the user's finger.
- **Tap Highlights**: Use `framer-motion`'s `whileTap` for immediate, non-sticky visual feedback on buttons and tap areas (avoiding CSS `:active` pseudo-classes which can get stuck on mobile Safari).
- **Touch Handling**: Use `touch-none` and `select-none` CSS classes on interactive areas to prevent accidental zooming, panning, or text selection during rapid tapping.

### Styling & Animation
- **Tailwind CSS**: Used for all styling.
- **Framer Motion**: Used for layout animations, modal popups (`AnimatePresence`), and tap gestures.
- **Lucide React**: Used for all iconography (Settings, Reset, Dice, Droplet, Zap, GraduationCap, ShieldAlert, Palette, X, Plus, Minus).
