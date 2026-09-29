# TEN DROP — Deep Gameplay QC v0.3

Date: 2026-09-30  
Scope: engine semantics before cosmetic polish.

## QC matrix

| Area | Result | Finding / invariant |
|---|---|---|
| Make-10 resolution | PASS after fix | Every orthogonal complement edge is one Make-10. Cells clear once even if shared by multiple valid edges. |
| Multi-pair semantics | P1 FIXED | Previous implementation inferred Tens as clearedCells/2 and undercounted overlapping pairs such as 9-1-9. |
| Gravity | PASS | Each column compacts downward while preserving vertical order. |
| Cascade | PASS | Resolve repeats until no Make-10 edge remains; each additional wave increments chain. |
| Scoring | PASS after fix | Score is now 100 × valid pair edges × cascade wave. Shared cells are not double-cleared but each valid pair is rewarded. |
| Fair-Bag | P1 FIXED | Replaced two-copy 18-bag with shuffled one-copy 1-9 bag to structurally bound drought without board-aware rescue RNG. |
| Preview | PASS | NOW + NEXT + NEXT consumes the same generated queue; preview is not rerolled. |
| Level progression | PASS after prior + current fixes | Score objective is level-local; duplicate clear scheduling guarded; stale level timers are cancelled on restart. |
| Game Over | PASS with design note | Spawn is center-column. A blocked spawn cell ends the run; this is consistent with current falling-piece model. |
| Restart | P0 FIXED | Old async cascade/resolve work can no longer mutate a fresh run; run token invalidates stale work. |
| Input race | PASS after isolation | Input is ignored while resolution is locked; stale async transitions cannot revive after reset. |
| Chapter transition | PASS | Board/score persist across levels; objective baseline resets appropriately. |

## Canonical multi-pair rule

A **Make-10** is a valid orthogonal edge, not two consumed cells.

Example:

`9 — 1 — 9`

This contains **2 Make-10 pairs** and **3 unique cleared Numberlings**.

Therefore the engine tracks:
- pair count for Tens/objectives/scoring;
- unique-cell count for Clear Numberlings objectives.

## Scoring v0.3

For cascade wave `w`:

`score += validPairCount × 100 × w`

This preserves a simple 100-point base pair while rewarding both simultaneous multi-pair setups and true cascades.

## Fair-Bag v0.3

Sequence generation uses one shuffled copy of 1–9 per bag.

Properties:
- every 9 generated pieces contain each number exactly once;
- no board-state rescue manipulation;
- NOW/NEXT/NEXT remains truthful;
- uncertainty remains within each shuffled bag;
- cross-boundary drought is structurally much lower than the former 18-piece/two-copy bag.

This is still a prototype balancing rule, not a final retention-tuned RNG.

## Remaining gameplay questions requiring human feel-test

These cannot be settled by source-level correctness alone:
1. Is 850 ms automatic fall comfortable or annoying?
2. Does 6×9 create enough planning depth?
3. Is center-only spawn intuitive?
4. Is NOW + NEXT + NEXT too much information?
5. Are Make-10s too frequent or too sparse with 9-bag?
6. Is 100 × pair × wave scoring understandable?
7. Are Level 1–5 objectives paced around 2–4 minutes?
8. Does clearing all simultaneous edges feel fair when one Numberling participates in two pairs?
9. Does a chain ×2 feel intentionally buildable rather than accidental?
10. Does Game Over feel attributable to player decisions?

## Gate

Engine correctness: **GO after fixes, pending CI/device regression.**  
Gameplay feel / retention: **NOT FROZEN** until real-device playtest.
