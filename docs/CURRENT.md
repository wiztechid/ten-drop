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
- Shuffled one-copy 1–9 Fair-Bag prototype.
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


## Post-Deployment Smoke QC — 2026-09-30

Live GitHub Pages deployment confirmed by real-device screenshot.

Observed working: page render, 6×9 board, active falling Numberling, score/best HUD, Level 1 objective/progress, bottom controls, deployed CSS/JS runtime.

P1 found and patched: NOW/NEXT mini Numberling inherited absolute board positioning and escaped the preview container to the upper-left viewport. Preview slots now establish their own positioning context and mini Numberlings use relative positioning. Tablet/landscape viewport received a small responsive-height polish.

Status: **LIVE — post-patch device recheck required before v0.3 visual freeze.**


## Deep Gameplay QC — 2026-09-30

Engine audit found and fixed three correctness/fairness defects on `deep-gameplay-qc-v0.3`:
- P0 stale async cascade/level work could corrupt a restarted run; fixed with run-token isolation and cancellable level transition timer.
- P1 multi-pair Make-10 semantics undercounted overlapping valid pairs; engine now separates valid pair edges from unique cleared cells.
- P1 two-copy 18-bag allowed excessive cross-boundary drought; changed to shuffled one-copy 1–9 bag without board-aware rescue RNG.

Scoring contract: `valid pairs × 100 × cascade wave`.

Engine correctness is **GO pending CI/device regression**. Gameplay feel/retention remains **NOT FROZEN** until real-device playtest.


### Adversarial Gameplay Gate

Executable adversarial CI added to PR #2 and bound to the same shared `js/core.js` used by the live browser game. Covered: overlapping `9-1-9`, simultaneous pairs, deterministic chain ×2 and ×3, gravity ordering, Fair-Bag permutation/boundary, restart-during-cascade token invalidation, stale level-clear invalidation, and center-spawn top-out semantics.

GitHub Actions `TEN DROP Smoke Gate` run #17: **PASS** on syntax, adversarial engine tests, static entrypoint and core invariants.


## UX / Gameplay Friction Audit v0.3 — 2026-09-30

Three gameplay-friction changes implemented on `friction-audit-v0.3` without cosmetic redesign:
1. Spawn fairness: virtual entry row gives the player horizontal agency before top-out; blocked center alone no longer means immediate Game Over.
2. Level continuity: each newly reached level begins on a clean board; retry preserves current level identity.
3. Flow: Levels 1–4 use a short non-blocking clear transition (~900 ms); blocking modal remains only for Game Over and Chapter Clear.

Status: **pending CI + real-device regression before merge/freeze.**


## Experimental Branch — Engagement Gimmick v0.4

Stable baseline remains v0.3 on `main`. Branch `engagement-gimmick-v0.4` tests three skill-derived gimmicks without changing core Make-10 semantics:
- TEN FUSION feedback on successful match waves.
- CHAIN ×3 activates bounded FEVER 10 for the next 3 locked drops with ×2 score only.
- LAST DROP gives one 1.4-second player-controlled clutch entry opportunity when the selected top entry is blocked but another column remains open.

No RNG rescue, booster, blocker, wildcard, ad, or permanent meta-system is added. v0.4 must beat v0.3 in real-device feel before any merge decision.


### v0.4 Preview Gate

Deep Gimmick QC Pass 2 completed. Smoke Gate #32 PASS on head 408d1f428e3683c80ce997ec7bfeea385f91491e before preview-workflow addition. v0.4 remains experimental and unmerged. An isolated GitHub Actions preview artifact workflow packages the branch after syntax + adversarial tests, without changing the production GitHub Pages source on main.

A/B rule: compare stable v0.3 production against the exact v0.4 artifact build. Evaluate Make-10 satisfaction, intentional pursuit of CHAIN ×3, LAST DROP clutch comprehension, and immediate desire to replay after Game Over. Each gimmick receives KEEP / TUNE / KILL independently; the package is not all-or-nothing.


## v0.5 Signature Gameplay — IN DEVELOPMENT

Built from v0.4 synthetic real-browser playtest findings. Scope is deliberately narrow: make the existing identity legible rather than add new power-ups.

Implemented candidate feedback surfaces:
- TEN FUSION now has a short explicit 10! fusion beat in addition to board pulse.
- FEVER has persistent remaining-drop HUD and updates on consumption/activation.
- Existing complementary/near-match cells receive subtle chain-planning emphasis; no automatic move recommendation and no RNG manipulation.
- Virtual entry piece is visibly rendered above the board, making LAST DROP state spatially understandable.
- During LAST DROP, actually safe top-row entry columns receive a restrained highlight; player must still move manually.
- Board top-load escalates warning → critical feedback as stack pressure increases.

Character plan: final Numberling character system begins after v0.5 mechanics/feel contract passes. Character reactions will then bind to idle, fall, near-complement, Fusion, Chain, FEVER, danger, Last Drop/clutch, clear and Game Over states. Do not finalize character art before these state contracts stabilize.

Status: implementation candidate; requires CI/adversarial regression and real-device feel test before any merge/freeze.


## v0.6.1 Group-to-10 — Intentional Puzzle Contract — 2026-09-30

Experimental branch: `group-to-10-v0.6`. Draft PR #6 remains unmerged; stable production is unchanged.

Approved core experiment:
- A TEN is an orthogonally connected group of exactly **2 or 3 Numberlings** whose values total exactly 10.
- Four-number groups are invalid even when their total is 10.
- Groups over 10 do not clear and carry no penalty.
- Diagonal-only connectivity is invalid.
- A Numberling cannot be consumed by two TEN groups in the same resolution wave.
- Overlapping candidates are resolved deterministically by maximum non-overlapping cleared-cell coverage with deterministic tie-breaking.
- One resolved 2- or 3-number group counts as one TEN for objectives/scoring.
- Gravity and subsequent exact-10 groups continue to create cascade waves.
- Fair-Bag and truthful NOW + NEXT + NEXT remain unchanged.

Intentionality rule:
- The game must make the player think; it must not reveal the answer.
- No partial-sum hint, needed-number/complement hint, recommended-column hint, prospective-gravity hint, or prospective-chain hint.
- The prior `plannedLandingCells` / `chain-ready` landing-answer cue has been removed.
- CHAIN remains a skill reward that the player must infer from board geometry and gravity.

Deep QC:
- Covered L-shape three-number TEN, four-cell T rejection, >10, diagonal rejection, larger connected components with valid 3-cell subsets, overlapping groups, deterministic resolver ties, anti-double-spend, score laundering, 3-number cascade, and dense-board candidate enumeration.
- Initial dense 6×9 enumeration exposed a performance defect (~256.1 ms in CI); candidate search was refactored to canonical memoized connected-set expansion.
- Smoke Gate #67: **PASS** for JavaScript syntax, adversarial engine, static entrypoint, and core invariants.

Preview:
- Isolated `preview-v0.6.1/` snapshot has been published to `main` without modifying stable root gameplay.
- First deployment check returned 404 while GitHub Pages was propagating; LIVE status must be verified before playtest.

Freeze status: **NOT FROZEN**. Next gate is a comparable gameplay feel test asking whether players intentionally build 3-number TENs and engineer gravity CHAINs without hints.


### Core DNA A/B Gate — Instrumentation Upgrade

Direct browser-agent A/B attempts against the live falling-piece UI timed out before producing a complete controlled comparison; incomplete runs are explicitly excluded from evidence.

To avoid subjective screenshot inference, v0.6.1 LAB now exposes read-only session telemetry via `TenDropTelemetry()`: locked drops, 2-number TENs, 3-number TENs, CHAIN ×2+, CHAIN ×3+, and maximum cascade depth. Telemetry does not recommend moves, alter RNG, expose complements, or change gameplay. An adversarial guard prevents the telemetry layer from reintroducing landing/recommended-column hints.

Smoke Gate #75: **PASS** on syntax, adversarial engine, static entrypoint, and core invariants.

Next Core DNA decision must use objective telemetry plus matched deliberate/spam sessions; incomplete browser-agent runs must not be scored as A/B evidence.


### Core DNA Deliberate-vs-Spam Diagnostic — Smoke #83

A deterministic matched-seed engine experiment now runs 100 paired sessions (same Fair-Bag seeds; max 180 drops/session). The deliberate policy evaluates legal placements using the current board plus truthful NEXT/NEXT setup potential; the spam control chooses random legal columns without board strategy. This is a capability diagnostic, not a substitute for human play.

Observed:
- Deliberate: 180.0 avg drops, 44.53 two-number TENs/100 drops, 2.26 three-number TENs/100, 0.06 CHAIN×2+/100, 4684.4 score/100.
- Spam: 165.7 avg drops, 19.50 two-number TENs/100 drops, 9.88 three-number TENs/100, 2.16 CHAIN×2+/100, 3273.4 score/100.
- Deliberate clearly improves survival and score, but **three-number TENs and cascades occur more often under chaotic placement** in this diagnostic.
- Signal: `survival=true`, `ten3Skill=false`, `chainSkill=false`.

Interpretation: v0.6.1 currently demonstrates strategic value in deliberate placement overall, but does **not yet demonstrate that the 3-number rule or CHAIN is itself intentional skill expression**. Three-number TENs may currently function more as incidental board-resolution events than planned constructions. Therefore v0.6.1 remains **NOT FROZEN as Core DNA**.

Do not solve this with auto-hints. The next design experiment should test incentive/board-rule changes that make preserving/building a 3-number TEN strategically worthwhile while retaining player inference. Any such change requires a separate experimental revision and matched diagnostic before human feel validation.
