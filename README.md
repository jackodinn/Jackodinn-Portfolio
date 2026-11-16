# Jackodinn Portfolio

An interactive 3D RPG-style portfolio set in a rainy neon **cyberpunk city**:
walk an animated character around with a MOBA-style angled camera and enter
storefronts to see projects, skills, experience and contact info. A plain **classic view** (`#/classic`) shows the
same content without the game.

**Stack:** Vite · React · TypeScript · React Three Fiber · drei · Rapier (physics) · postprocessing (bloom) · Zustand

## Getting started

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build locally
npm run lint
```

**Controls:** WASD / arrow keys or click/tap the ground to walk · `E` / Enter to
enter a building · `Esc` to close · mouse wheel to zoom · **Outfit** button to
change the character's look.

## Editing content

All content lives in **`src/data/portfolio.ts`**. Both the 3D world and the
classic view read from it. Put images and your résumé PDF in `public/` and
reference them by relative path (e.g. `projects/app.png`, `resume.pdf`).

## Project structure

```
src/
  data/portfolio.ts    ← all portfolio content (edit this)
  game/
    layout.ts          ← where landmarks sit in the world, neon palette
    Game.tsx           ← canvas, night lighting, physics, bloom
    World.tsx          ← wet streets, plaza, avenue, lamps, boundaries
    Building.tsx       ← neon storefront + interaction zone
    Skyline.tsx        ← instanced background skyscrapers + billboards
    Rain.tsx           ← rain particles
    Player.tsx         ← movement, follow camera, zoom
    Character.tsx      ← rigged avatar + Idle/Run animation blending
    avatar.ts          ← character model URL + outfit (skin) list
    textures.ts        ← procedural window texture, neon materials
    controls.ts        ← keyboard mapping
  store/useGameStore.ts← game state (nearby landmark, open panel, move target)
  ui/
    Hud.tsx            ← overlay: title, prompt, help, panel
    InfoPanel.tsx      ← dialog opened from a building
    ClassicView.tsx    ← non-game version of the portfolio
    sections.tsx       ← content blocks shared by panels and classic view
```

## Changing the character

- **Default outfit:** set `DEFAULT_SKIN` in `src/game/avatar.ts`.
- **Your own avatar:** export a rigged glTF/GLB with animation clips named
  `Idle` and `Run`, put it in `public/models/`, and point `CHARACTER_URL` at it.
  The character is auto-scaled to ~1.9 m.

## Credits

- Character model, animations and skins: [Kenney — Animated Characters 1–3](https://kenney.nl/assets/animated-characters-1)
  (CC0). Converted from FBX to GLB; licence in `public/models/`.
- Font: [Rajdhani](https://fonts.google.com/specimen/Rajdhani) (OFL), via Google Fonts.

## Branches

| Branch      | Purpose |
|-------------|---------|
| `main`      | Production. Holds the latest released website features. Only updated by merging `workspace` once changes are bug-free and deployment is confirmed. Every push deploys to GitHub Pages. |
| `workspace` | Development. All work is committed here first, then merged into `main` via a pull request. Every push is built and linted by CI. |
| `context`   | Prompt log. Contains a single file, `context.md`, recording every prompt as `{title} - {date} - {agent & model}`. |
