# TEN DROP — CURRENT

**Status:** Playable Web Prototype v0.3 — implementation branch ready for device testing  
**Last updated:** 2026-09-29  
**Decision:** GO — playable v0.3 implemented on `prototype-v0.3`; device gameplay QC required before Android production.

## 1. Product Thesis

TEN DROP is a one-thumb casual number puzzle built around **complementary-number cascades** rather than equal-number merging.

- Primary market: Number Puzzle / Number Match / Drop Number.
- “Make 10” is the gameplay hook, not the primary acquisition keyword.
- Core differentiation: **drop + sum-to-10 + gravity + cascade**.
- Avoid positioning as a school/math-learning game.

Working store title: **Ten Drop: Number Puzzle**

Working short description: **Drop numbers, make 10 and trigger satisfying chain combos.**

## 2. Core Gameplay

- Board: **6 columns × 9 rows**.
- Numbers: 1–9.
- One active Numberling falls automatically.
- One-thumb controls: left, right, hard drop.
- Complement pairs: 1+9, 2+8, 3+7, 4+6, 5+5.
- Orthogonally touching complements clear.
- Gravity collapses the board.
- Newly touching complements trigger another wave.
- Additional waves increase combo multiplier.
- Run ends when the board cannot accept a new piece.

## 3. v0.3 Engagement Architecture

Core emotional loop:

**DROP → spot possible 10 → setup → SNAP → 10! → CASCADE → reaction → tension → CLEAR → progression → one more run**

### Near-10 Character Tension
Numberlings may subtly glance/react toward useful complements without revealing the exact move. This must never become forced auto-hinting.

### Escalating Cascade
- ×1: clean jelly pop.
- ×2: stronger snap/bounce.
- ×3: **TEN-TASTIC!**
- ×4: stronger character/board celebration.
- ×5+: candidate **FEVER 10**.

### PERFECT TEN
Strong multi-wave cascades created by genuine play may trigger **PERFECT TEN!** as a mastery moment.

### Fair-Bag RNG
- Avoid unreasonable number droughts.
- Maintain healthy long-run 1–9 distribution.
- Preserve uncertainty.
- Never guarantee a rescue number.
- Avoid hidden outcome manipulation.

### Trustworthy Preview
Candidate: **NOW + NEXT + NEXT**.
Previewed pieces must never silently change.

### No Forced Auto-Hint
Hints, if introduced later, are optional/delayed and must not interrupt active decisions.

## 4. Numberlings

Approved visual DNA:
- Cute 3D squishy/jelly.
- Fluid/liquid silhouettes.
- Highly glossy.
- Squash-and-stretch.
- Expressive kawaii faces.
- Number remains dominant/readable.
- Dark midnight/navy background.
- Approx. **70% readability / 30% personality**.

Colors:
1 Sky Blue; 2 Violet; 3 Lime Green; 4 Orange; 5 Sunny Yellow; 6 Coral Red; 7 Turquoise/Cyan; 8 Hot Pink; 9 Indigo.

Complement pairs must remain visually distinct.

## 5. Progression

Micro-levels create natural progression without changing the simple core rule.

Initial chapter prototype:
1. **Make 5 Tens**
2. **Clear 16 Numberlings**
3. **Reach 600 Score**
4. **Make CHAIN ×2**
5. **Make 10 Tens**
6. **CHAPTER CLEAR**

Objective families may later include score, Tens, clears, cascades, survival drops, limited drops, and carefully designed combinations.

Do not introduce blockers until the core loop passes retention testing.

## 6. Monetization Direction

No real ads in v0.3.

Future principle: **Flow-Protected Monetization**.

- Never interrupt active play, thinking, drop, gravity, complement resolution or cascade.
- Chapter completion is an eligible ad opportunity, not a mandatory ad.
- Respect minimum time/session spacing.
- Do not sacrifice strong player flow for one extra impression.
- Rewarded actions remain optional and state the benefit clearly.
- Potential rewarded continue: one bounded recovery such as Continue Once / +3 Drops.

Principle: **Player flow > one extra ad impression.**

## 7. v0.3 Playable Gate

Implementation status: **BUILT — pending real-device gameplay QC.**

Implemented/test targets:
1. Live-drop 6×9 board.
2. Numberling gameplay presentation.
3. Left/right/hard-drop responsiveness.
4. Complement-to-10 detection.
5. Gravity and cascades.
6. Near-10 reactions.
7. Escalating cascade feedback.
8. PERFECT TEN and candidate FEVER 10.
9. Fair-Bag RNG.
10. NOW + NEXT + NEXT preview.
11. Score/high score/restart.
12. Five micro-level objectives.
13. Chapter Clear / natural-break placeholder.
14. No real AdMob.

Success criteria:
- Controls understood within seconds.
- Numbers instantly readable.
- Planning matters more than luck.
- Cascades feel satisfying.
- Tension rises without feeling unfair.
- Player wants another run.
- Progression supports rather than hides the core loop.

## 8. Later Retention Layer

Only after the core gate passes:
- Daily Ten / deterministic daily challenge.
- Streaks.
- Achievements.
- Cosmetic collection.
- Themes/skins/trails.
- Weekly challenges.
- Leaderboards/social if justified by data.

Do not use meta-progression to hide a weak core loop.

## 9. Production Sequence

**Playable web v0.3 → gameplay QC → balancing/retention gate → Android architecture → analytics → consent/privacy → AdMob → Play Store/ASO assets.**

## Source-of-Truth Rule

This file is the **canonical project state** for TEN DROP.

Repository: **wiztechid/ten-drop**

All approved gameplay, visual, progression, monetization, ASO or production decisions must be reflected here. Brainstorming is not canonical until approved/frozen.

GitHub is now the canonical project home. The previous Google Drive copy is historical/reference only and should not be maintained in parallel.


## 10. Implementation Snapshot — v0.3

Branch: `prototype-v0.3`

Implemented:
- Dependency-free HTML/CSS/JS playable vertical slice.
- Mobile buttons + swipe controls + keyboard fallback.
- 6×9 live-drop board, Make-10 resolution, gravity and cascades.
- Two-copy shuffled 1–9 Fair-Bag prototype.
- Immutable NOW + NEXT + NEXT queue.
- CSS jelly Numberling placeholders with approved number colors.
- TEN-TASTIC, FEVER 10 and PERFECT TEN feedback states.
- Five micro-level objectives and Chapter Clear natural-break placeholder.
- Persistent local high score.
- Progression guard prevents duplicate level-clear scheduling.
- Score objective measures score earned within its level rather than lifetime chapter score.

Not yet production-approved:
- Real-device feel and retention.
- Final Numberling art/animation.
- Audio/haptics.
- Analytics.
- AdMob.
