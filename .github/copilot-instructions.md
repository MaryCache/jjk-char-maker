# JJK Character Maker - AI Copilot Instructions

## Project Overview

**jjk-char-maker** is a Vue 3 + TypeScript character sheet creator for the **Jujutsu Kaisen TRPG** system. It's a responsive, single-page web application that generates formatted character data for TRPG gameplay.

- **Tech Stack**: Vue 3 (Composition API), TypeScript, Vite, Tailwind CSS
- **Build**: `npm run dev` (dev server), `npm run build` (compile + bundle)
- **Key File**: `src/components/CharacterForm.vue` (root component state)

---

## Architecture & Data Flow

### Core State Management (CharacterForm.vue)

The **entire character state** lives in a single `reactive()` object in `CharacterForm.vue` (lines 21–35):
- `state.sheet: CharacterSheet` — the character data model
- `state.poolAlloc: number` — curse power allocation (converted to actual pool via `poolFromAlloc()`)
- `state.hasInnate`, `state.hasTrait` — toggles for optional 1-item-max fields

**Why monolithic?** No external state manager (Pinia/Vuex). The form drives UI, derived computeds sync ancillary values in `syncDerived()` (lines 63–94).

### Data Model (types.ts)

```typescript
CharacterSheet
├─ name, ruby, sex, age, rank, total, bio
├─ human: HumanStats (life, str, agi, int, sense)
├─ jujutsu: JujutsuStats (pool, efficiency, maxOutput)
├─ innate: LearnedItem[] (0 or 1 item, with research level)
├─ traits: LearnedItem[] (0 or 1 item, with research level)
├─ generic: slots/capacity + adjustments
├─ body: GenericGroup (skill section)
└─ arts: GenericGroup (always has "呪力操作" as fixed item)
```

**Key constraint**: "呪力操作" (curse manipulation) is **auto-inserted** into arts and **never consumes** slots/capacity.

### Computed Properties & Validation

All derived values computed in real-time:
- `usedSlotsTotal`, `usedCapTotal` — item counts (excluding fixed art)
- `slotsTotal`, `capTotal` — available capacity (derived from `int` and `sense`)
- `overSlots`, `overCap` — validation flags (red warnings in UI)
- `text1`, `text2`, `text3` — formatted output blocks for copying

**Recalc trigger**: `syncDerived()` called in watchers; functions like `poolFromAlloc()` called directly in templates/computeds.

---

## Key Patterns & Conventions

### 1. **Stat Derivation Hierarchy**

```
Human Stats (int + sense)
└─> Base Slots/Capacity (halfRoundUp of max)
    └─> Applied to all GenericGroups (body, arts, shared generic)
```

See `syncDerived()` lines 63–77. Changes to `int` or `sense` cascade to all skill sections.

### 2. **Fixed Art Validation**

`ensureFixedArt()` (line 45–47) guarantees "呪力操作" always exists in `arts.items`:
- Inserted at position 0 if missing
- Filtered out from `artsUserItems` computed to hide it from usage calcs
- Must be manually excluded in capacity/slot math

### 3. **One-Item-Max Fields**

`innate` and `traits` allow 0 or 1 item (toggled via `hasInnate`/`hasTrait`):
- If toggle ON and array empty → create placeholder `{name:"", research:1}`
- If toggle OFF → clear array entirely
- Logic in `syncDerived()` lines 80–90

### 4. **Number Coercion in Calcs**

Input fields use `+i.research` (unary +) or `Number()` to safely cast strings to numbers before arithmetic. See `usedCapBody` computed (line 53).

### 5. **Display vs. Internal Values**

- `pool` stored as actual value (e.g., 20 = 4 alloc × 5)
- `poolAlloc` is allocation input; UI displays preview via `poolPreview` computed
- Output text uses final `pool` value, not allocation

---

## Output Text Generation (format.ts)

Three formatted blocks generated via:
- `buildText1()` — character sheet (stats, skills, bio)
- `buildText2()` — play state (current HP, exploration scores)
- `buildText3()` — growth tracking (caps, reward points)

**Pattern**: Lines array → joined with `\n` → wrapped in triple backticks. See `copyBlock()` utility (normalizes line breaks).

**Exploration scores** (line 17): Derived from human stats (sight, pursuit, reasoning, intuition, concealment) using fixed formulas.

---

## Component Hierarchy

```
App.vue
└─ CharacterForm.vue (master state)
   ├─ SharedHud.vue (fixed position HUD, slots/capacity bars)
   ├─ SharedGenericCard.vue (generic shared pool editor)
   ├─ SectionCard.vue (body/arts skill sections)
   ├─ Accordion.vue (collapsible group)
   └─ PreviewTabs.vue (text output previewer)
      └─ TextPreview.vue (rendered text block)
```

**Props pattern**: Child cards receive data as props, emit events to parent (`@add`, `@remove`, `@update:name`, etc.). Parent updates state via handler functions (`addBodyItem()`, `updateBodyName()`, etc.).

---

## Styling & UX Details

### Tailwind + Custom Classes

- **Dark theme**: `bg-zinc-900`, `border-zinc-700`, `text-white`
- **Responsive**: Use `sm:`, `md:`, `lg:` breakpoints; SharedHud hides on mobile and moves to bottom
- **Cards**: `.card` class with `p-4` padding, dark borders
- **Inputs**: `bg-zinc-800`, `focus:ring-zinc-500`; no full outlines

### Mobile Behaviors

- **SharedHud**: Hidden on small screens (`hidden sm:block`), shows toast warning on overages
- **Layout**: Max-width 7xl with responsive padding
- **Scroll-hide**: HUD auto-hides on downscroll (requestAnimationFrame throttle in SharedHud)

### Animations

- `.skill-*` transitions on add/remove (TransitionGroup in SectionCard)
- `.animate-shake` on warning state
- Fade in/out for toast notifications

---

## Common Tasks

### Adding a New Stat

1. Add field to `HumanStats` or `JujutsuStats` in `types.ts`
2. Initialize in `state.sheet` (CharacterForm.vue line 23–27)
3. Add `input v-model` in template
4. Update `syncDerived()` if dependent on other stats
5. Include in `buildText1/2/3` output lines if needed

### Adding a New Skill Section

1. Create `GenericGroup` field in `CharacterSheet` (e.g., `special: GenericGroup`)
2. Initialize with `slotsMax`, `capacity`, `items: []` in CharacterForm
3. Add to `syncDerived()` to sync derived slots/capacity
4. Render with `<SectionCard>` component, hook events
5. Update usage calc to include in totals (currently only body + arts counted)

### Fixing Capacity Math

See `buildText1()` for the definitive slot/capacity usage formula:
```typescript
usedSlotsBody = items.length
usedCapBody = sum of max(0, research - 1) for each item
// Same for arts, excluding "呪力操作"
```

Always verify in tests or manual calculation before deploying.

---

## Build & Test Commands

```powershell
npm run dev      # Start Vite dev server (HMR enabled)
npm run build    # TypeScript check + Vite bundle (dist/)
npm run preview  # Local preview of built output
```

No dedicated test suite. Validate character output via browser devtools and copy-to-clipboard verification.

---

## File Locations Reference

| Purpose | File |
|---------|------|
| Master state & form logic | `src/components/CharacterForm.vue` |
| Type definitions | `src/types.ts` |
| Game rules (stat calcs, text gen) | `src/lib/rules.ts` |
| Text formatting & output | `src/lib/rules.ts` (buildText1/2/3) |
| Utility helpers | `src/utils/format.ts`, `src/utils/copy.ts` |
| HUD component (bars, warnings) | `src/components/cards/SharedHud.vue` |
| Skill section UI | `src/components/cards/SectionCard.vue` |

---

## Language & Localization

- **UI & comments**: Primarily Japanese (character sheet terms, field labels)
- **Code vars/types**: English (standard practice)
- **Output text**: Japanese (TRPG sheet format)
- No i18n framework in use; consider adding if multi-language support needed

---

## Known Constraints & Gotchas

1. **No external state management** — all state in CharacterForm; difficult to share state with unrelated components
2. **Fixed art auto-insertion** — must always check `artsUserItems` filter, never raw `arts.items`
3. **Monolithic form component** — 330 lines; consider breaking into smaller sub-components as it grows
4. **One-item-max via toggle** — UI awkward if user wants to switch between different innate traits; consider modal/dropdown
5. **No persistence** — localStorage key `"jjk-char-maker:v1"` defined but not yet wired; implement via `watch` + `JSON.stringify`
6. **No undo/redo** — direct mutation only

---

## Future Enhancement Ideas

- **Persistence**: Wire localStorage for save/load (watch state, localStorage.setItem on change)
- **Import/Export**: JSON export via `JSON.stringify(sheet)`, import via file upload
- **Validation**: Stricter type guards on numeric inputs (prevent NaN in research/stats)
- **Components**: Extract PreviewTabs, SectionCard sub-components into smaller presentational units
- **Testing**: Add Vitest + Vue Test Utils for rules.ts functions and component logic
- **Animations**: Enhance skill transitions, stat input feedback
