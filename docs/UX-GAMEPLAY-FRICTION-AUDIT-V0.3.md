# TEN DROP — UX / Gameplay Friction Audit v0.3

Date: 2026-09-30
Scope: gameplay friction only. No cosmetic redesign.

## F1 — Spawn fairness

### Problem
Center-column occupancy could cause immediate Game Over while large playable areas remained elsewhere on the board.

### Fix
Active Numberling now starts on a virtual entry row above the board. While above row 0, horizontal movement remains available. Game Over occurs only when the selected entry column cannot accept the piece when it attempts to enter.

### Principle
Do not auto-select a safe column for the player. Preserve player agency while removing misleading premature top-out.

## F2 — Level continuity

### Problem
A new objective could inherit a board created under the previous objective, while retrying the same level started from a clean board. This made level difficulty/history inconsistent.

### Fix
Every newly reached level starts from a clean 6×9 board. Retry preserves the current level identity but also starts a clean run. Score resets for the new run; BEST remains persistent.

### Principle
A level should test its own objective from a predictable starting state.

## F3 — Modal interruption

### Problem
A blocking modal after every ordinary level interrupted the drop → plan → resolve flow too often.

### Fix
Levels 1–4 use a short non-blocking Level Clear callout and automatically continue after ~900 ms. Chapter Clear and Game Over remain blocking natural pauses.

### Principle
Micro-level completion should reward without turning every objective boundary into a session break.

## Regression contracts
- Blocked center alone is not equivalent to whole-board top-out.
- Player can choose another entry column while piece is above the board.
- New level starts with clean board.
- Game Over retry preserves current level.
- Chapter replay resets to Level 1.
- Ordinary level transition cannot accept input while locked.
- Stale transition timer is invalidated by restart/run token.

## Status
Implementation branch: `friction-audit-v0.3`
Gate: pending CI and real-device regression.
