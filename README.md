# Jackodinn Portfolio

An interactive 3D RPG-style portfolio: walk around a small town with a
MOBA-style angled camera and enter buildings to see projects, skills,
experience and contact info. A plain **classic view** (`#/classic`) shows the
same content without the game.

**Stack:** Vite · React · TypeScript · React Three Fiber · drei · Rapier (physics) · Zustand

## Getting started

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
npm run lint
```

**Controls:** WASD / arrow keys or click/tap the ground to walk · `E` / Enter to
enter a building · `Esc` to close.

## Editing content

All content lives in **`src/data/portfolio.ts`**. Both the 3D world and the
classic view read from it. Put images and your résumé PDF in `public/` and
reference them by relative path (e.g. `projects/app.png`, `resume.pdf`).

## Project structure

```
src/
  data/portfolio.ts    ← all portfolio content (edit this)
  game/
    layout.ts          ← where landmarks sit in the world
    Game.tsx           ← canvas, lights, physics
    World.tsx          ← ground, roads, trees, boundaries
    Building.tsx       ← landmark building + interaction zone
    Player.tsx         ← character movement + follow camera
    controls.ts        ← keyboard mapping
  store/useGameStore.ts← game state (nearby landmark, open panel, move target)
  ui/
    Hud.tsx            ← overlay: title, prompt, help, panel
    InfoPanel.tsx      ← dialog opened from a building
    ClassicView.tsx    ← non-game version of the portfolio
    sections.tsx       ← content blocks shared by panels and classic view
```

## Branches

| Branch      | Purpose |
|-------------|---------|
| `main`      | Production. Holds the latest released website features. Only updated by merging `workspace` once changes are bug-free and deployment is confirmed. Every push deploys to GitHub Pages. |
| `workspace` | Development. All work is committed here first, then merged into `main` via a pull request. Every push is built and linted by CI. |
| `context`   | Prompt log. Contains a single file, `context.md`, recording every prompt as `{title} - {date} - {agent & model}`. |
