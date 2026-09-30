# TEN DROP — CHANGELOG

## 2026-09-29

### Project initialization
- Established **wiztechid/ten-drop** as the canonical project repository.
- Moved canonical project state to `docs/CURRENT.md`.
- Google Drive master becomes historical/reference only.

### Gameplay v0.3 approved
- Live-drop 6×9 board.
- Complement-to-10 matching.
- Gravity/cascade loop.
- Fair-Bag RNG direction.
- NOW + NEXT + NEXT preview.
- Near-10 Numberling reactions.
- Escalating cascade feedback.
- TEN-TASTIC, PERFECT TEN and candidate FEVER 10.
- Five-level micro-progression chapter.
- Flow-Protected Monetization principles.
- Real ads explicitly deferred until after gameplay validation.

### 2026-09-30 — Post-deployment smoke QC
- Confirmed live GitHub Pages render on a real device.
- Fixed P1 preview Numberling escaping NOW/NEXT slots.
- Added small tablet/landscape viewport polish.
- Visual freeze remains pending post-patch device confirmation.

### 2026-09-30 — Preview containment hotfix v0.3.1
- Real-device recheck showed the preview escape persisted.
- Added explicit high-specificity preview containment independent from board absolute positioning.
- Cache-busted CSS and JS references in the live entrypoint to prevent stale mobile assets.


### 2026-09-30 — Group-to-10 v0.6.1
- Extended Make-10 from pair-only to connected groups, then capped the approved experiment at **2–3 Numberlings**.
- Exact-10 four-number groups are explicitly invalid.
- Added deterministic non-overlap resolver and anti-double-spend semantics.
- Added adversarial coverage for shape/connectivity, overlap/ties, scoring, cascades and dense-board performance.
- Fixed candidate-enumeration performance using canonical memoized connected-set expansion after the first dense-board gate measured ~256.1 ms.
- Removed automatic landing/chain-ready answer cue; no partial-sum, complement, recommended-column, or prospective-chain hints are permitted.
- Smoke Gate #67 passed.
- Published isolated `preview-v0.6.1/`; production root remains unchanged.
- v0.6.1 remains experimental and unmerged pending gameplay feel validation.


## 2026-09-30 — v0.6.4 Human Discoverability Instrumentation
- Added passive first-CHAIN and post-discovery CHAIN telemetry.
- Added per-event level/depth capture and clean-session telemetry reset.
- Added adversarial guard preventing hint/recommendation leakage.
- Smoke Gate #109: **PASS**.
- Runtime rules/physics and Number Unlock Progression unchanged.
- Core DNA remains NOT FROZEN pending human behavioral validation.
