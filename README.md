# masterJGS

A modern, modular React + TypeScript application using Vite, TurboRepo, and a custom UI component library.

## Project Structure

```
apps/
  client/
    src/
      assets/         # Static assets (e.g., images, SVGs)
      components/     # App-specific React components
        layout/         # Layout components (e.g., DashboardLayout)
        pages/          # Page-level components, organized by feature
          dashboard/      # Dashboard page
          brokerage/      # Brokerage management (with Segment, Ticker, Client subfeatures)
          script/         # Script management (with Script, Client subfeatures)
          common/         # Shared/common page components
      store/           # Zustand stores for state management
      App.tsx          # Main app component, sets up routing
      main.tsx         # Entry point, renders the app
      vite-env.d.ts    # Vite environment types
packages/
  ui/                # Shared UI component library (used across apps)
    src/
      components/      # Reusable UI components (Button, Table, Dialog, etc.)
      styles/          # Shared global styles (Tailwind, animations)
      hooks/           # Shared React hooks
      icons/           # Shared icon components
      lib/             # Utility functions
  utils/             # Shared utility functions
  types/             # Shared TypeScript types
  typescript-config/ # Shared TypeScript config
  eslint-config/     # Shared ESLint config
  db/                # (If present) Database utilities/config
```

## Key Features

- **Monorepo** managed with TurboRepo for scalable development.
- **Vite** for fast development and builds.
- **React 19** with TypeScript for type-safe UI.
- **Custom UI library** (`@repo/ui`) with reusable components and styles.
- **Tailwind CSS** and `tw-animate-css` for utility-first styling and smooth animations.
- **Zustand** for state management.
- **Feature-based structure**: Each major feature (Dashboard, Brokerage, Script) is organized in its own directory with subcomponents.

## Installation

### Prerequisites

- **Node.js** v20 or higher
- **pnpm** (recommended) or npm/yarn

### Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/OceanLab-Technology/masterJGS.git
   cd masterJGS
   ```

2. **Install dependencies (monorepo root):**
   ```sh
   pnpm install
   ```

3. **Run the development server:**
   ```sh
   pnpm dev
   ```

   This will start the Vite dev server for the client app.

### Useful Scripts

- `pnpm build` – Build all packages and apps
- `pnpm lint` – Lint all code
- `pnpm format` – Format code with Prettier

## Usage

- Visit `http://localhost:5173` (or the port shown in your terminal) to view the app.
- The main navigation and sidebar provide access to Dashboard, Brokerage Management, and Script Management features.

## Custom UI Library

The `@repo/ui` package contains all shared UI components (buttons, tables, dialogs, etc.), styles, and icons. You can import these into your app components for a consistent look and feel.

## Contributing

1. Fork the repo and create your branch.
2. Make your changes.
3. Run lint and tests.
4. Submit a pull request.

---