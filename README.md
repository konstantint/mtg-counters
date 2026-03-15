# Magic: The Gathering Life Counter

A two-player, mobile-first web application for tracking life totals and various counters in Magic: The Gathering. The interface is split into two halves, one for each player, with a central utility bar.

## Features
* **Split-Screen Interface**: Player 2's area is rotated 180 degrees for easy reading across the table.
* **Rapid-Tap Life Counters**: Tap the left or right side of a player's screen to decrease or increase life. Features temporary delta counters (e.g., `+3`, `-2`) for rapid tapping.
* **Secondary Counters**: Track Poison, Energy, Experience, and Commander Damage.
* **Utilities**: Built-in d20 roller and coin flipper.
* **Customization**: Choose player background colors and starting life totals (20, 30, or 40).
* **State Persistence**: Automatically saves game state to local storage so you never lose your progress if the page reloads.

## Building the App

This project is built using React and Vite.

### Prerequisites
* Node.js (v18 or higher recommended)
* npm
* Make (optional, for using the Makefile)

### Using Make
You can use the provided `Makefile` to easily install dependencies and build the project:

```bash
# Install dependencies and build the project
make build

# Clean the build output and node_modules
make clean
```

### Using npm directly
Alternatively, you can use npm commands directly:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Deployment (GitHub Pages)

When you run `make build` or `npm run build`, the compiled static files will be placed in the `dist/` directory. 

To deploy to GitHub Pages:
1. Build the project.
2. Push the contents of the `dist/` directory to the `gh-pages` branch of your repository.

*(Note: If deploying to a subpath like `https://username.github.io/repo-name/`, you may need to set the `base` property in `vite.config.ts` to `/repo-name/` before building).*
