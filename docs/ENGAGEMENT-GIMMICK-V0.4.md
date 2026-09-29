# TEN DROP — Engagement Gimmick Prototype v0.4

Status: EXPERIMENTAL — does not replace stable v0.3 until real-device feel test wins.
Branch: `engagement-gimmick-v0.4`

## Hypothesis
v0.3 is mechanically correct but emotionally flat. v0.4 tests whether a small set of skill-derived signature moments can create anticipation, mastery and clutch tension without adding booster clutter or changing the core Make-10 rule.

## G1 — TEN FUSION
Every successful Make-10 wave receives a short fusion-impact beat before cells clear.

Purpose:
- Make “10” feel like an event rather than deletion.
- Give the game a recognizable payoff tied directly to its title.
- Preserve exact board semantics from v0.3.

Prototype implementation uses board pulse/callout only. Final Numberling fusion animation is deliberately deferred.

## G2 — CHAIN FEVER
A true cascade reaching CHAIN ×3 activates **FEVER 10 for the next 3 locked drops**.

Prototype reward:
- ×2 score while FEVER is active.
- Exactly three subsequent locked drops maximum.
- No altered RNG.
- No rescue piece.
- No changed match rule.
- No board mutation beyond normal Make-10 resolution.

Why ×3 for prototype:
The gimmick must occur often enough to evaluate. Threshold can be retuned after telemetry/feel testing.

## G3 — LAST DROP
If an entry-row piece is blocked but at least one other top-row column is open:
- trigger **LAST DROP! MOVE!**
- pause automatic entry for 1.4 seconds
- allow the player to move horizontally
- entering a safe column yields **CLUTCH SAVE!**
- failure to move to a safe entry in time causes Game Over.

Boundaries:
- one Last Drop chance per active piece.
- no automatic safe-column selection.
- no rescue if the entire top row is sealed.
- no RNG manipulation.

## Emotional loop under test
**SET UP → DROP → FUSE 10 → CHAIN → FEVER → PRESSURE → LAST DROP → CLUTCH SAVE → ONE MORE RUN**

## Kill criteria
Do not merge v0.4 into stable gameplay if:
- Fusion makes match resolution harder to read.
- FEVER feels random rather than earned.
- Players ignore or misunderstand the 3-drop reward.
- Last Drop feels like an arbitrary timer or creates frustration.
- Gimmicks distract from planning.
- Core Make-10 recognition becomes less clear.

## Success criteria
- A player can describe the gimmick after one short session.
- CHAIN ×3 becomes something the player intentionally tries to build.
- Last Drop produces understandable clutch tension.
- Player wants another run more strongly than in v0.3.
- No regression in fairness, preview truthfulness, RNG, or restart isolation.


## Deep Gimmick QC — Pass 1

Adversarial review found and closed before preview:

### P1 — LAST DROP repeat entitlement
lastDropArmed described countdown state but did not permanently record that the current piece had already consumed its one clutch opportunity. Added separate lastDropUsed state. A successful clutch disarms the countdown but does not restore entitlement for that piece.

### P1 — FEVER cross-level leakage
A CHAIN ×3 that also completed a level could leave FEVER drops active in the next clean-board level. Level transition now clears FEVER and all Last Drop transient state.

### P2 — stale visual pulse
LAST DROP board pulse could survive after clutch/timeout. Pulse state now has deterministic cleanup on spawn, clutch, timeout, level transition and reset.

### FEVER re-trigger semantics
A FEVER-active drop may itself earn CHAIN ×3. This refreshes the bounded counter to 3 via Math.max(feverDrops, 3); it never stacks beyond 3. The score multiplier applies to the full cascade produced by a FEVER-active locked drop.

Status: implementation patched; CI rerun required.
