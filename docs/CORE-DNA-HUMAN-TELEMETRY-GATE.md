# Core DNA Human Telemetry Validation Contract — v0.6.5

Status: VALIDATION GATE ONLY — no gameplay-rule change.

## Purpose
Distinguish deliberate gravity-CHAIN learning from incidental/random dropping using passive session telemetry. This contract cannot itself freeze Core DNA; it defines the evidence required for a freeze decision.

## Inputs
Use only `TenDropTelemetry()` fields:
- drops
- tens2 / tens3
- chains2 / chains3
- maxChain
- firstChainDrop
- chainsAfterFirst
- chainEvents [{drop, level, depth}]
- dropsByLevel [L1, L2, L3, L4, L5] — locked-drop exposure by level; sum must equal `drops`

No board oracle, recommended column, complement hint, future RNG, or player self-report is required for the primary classification.

## Session validity
A session is VALID when:
1. telemetry was reset before play;
2. >= 60 locked drops, unless Game Over occurs after >= 30;
3. no automation/bot input;
4. no rule/physics/config change during the session;
5. telemetry accounting is internally consistent: per-level exposure sums to total drops, CHAIN events reference exposed levels, and duplicate same-drop CHAIN events are invalid.

Otherwise classify INCOMPLETE and exclude from freeze evidence.

## Behavioral classes
### NO_DISCOVERY
No CHAIN x2+ occurred.

### INCIDENTAL
At least one CHAIN x2+ occurred, but there is no repeat after first discovery (`chainsAfterFirst = 0`).

### EMERGING_DISCOVERY
At least one repeat occurs after first discovery, but evidence is too sparse for deliberate classification.

### DELIBERATE_SIGNAL
All must hold:
1. `firstChainDrop != null`;
2. `chainsAfterFirst >= 2`;
3. at least two post-discovery CHAIN events occur at distinct later drop indices;
4. at least one post-discovery CHAIN is depth >= 2;
5. repeats are not duplicate telemetry for the same resolution/drop.

### STRONG_DELIBERATE_SIGNAL
DELIBERATE_SIGNAL plus either:
- post-discovery CHAIN rate >= 2x pre-discovery observed CHAIN rate using equalized exposure, or
- >= 3 post-discovery CHAIN events with at least one depth >= 3.

This is deliberately conservative: a single spectacular cascade is not proof of mastery.

## Cohort gate
Do not FREEZE from one player/session.

Minimum directional human evidence before Core DNA freeze:
- >= 5 valid independent human sessions;
- >= 3 sessions reach DELIBERATE_SIGNAL or stronger;
- no evidence that spam/random baseline equals or exceeds the human post-discovery repeat pattern;
- early 1–5/1–6 TEN-3 learning and late 1–8/1–9 CHAIN opportunity remain consistent with engine diagnostics;
- no recurring usability failure that prevents players understanding the base exact-10 rule.

If the cohort misses this gate, keep Core DNA NOT FROZEN and diagnose discoverability before changing physics.

## Rule-change decision
- If players discover CHAIN and repeat it: KEEP current gravity/rules.
- If players rarely discover it but those who discover it repeat it: KEEP physics; tune presentation/feedback only, without answer hints.
- If discovery occurs but repetition does not rise above incidental baseline: investigate strategic legibility/incentive.
- If human deliberate behavior remains indistinguishable from spam after adequate exposure: Core DNA rule requires correction before Character System v0.7.

## Character System gate
Character System v0.7 may begin only after the Core DNA freeze decision. Character reactions may communicate state/emotion, but must not become placement/complement/CHAIN-answer hints.
