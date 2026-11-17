# Mockup library

## Rule

The seller drew every interface, machine and character in code, at real geometry, from a read of the live page or a
reference. Copy the nearest one into the new reel's `scenes/`, put `// Copied from <path>` on its first line, and adapt
it (copy, size, colours, states). Never build these from scratch. Logic moves to `src/engine` only after two reels use
it (`taste.md`). When nothing here fits, draw the new one the same way (real geometry, page read on a date in its
header) and add it to this list.

Paths are under `engine/full-visual/reels/`.

## Interfaces

| Component | Path | Draws |
|---|---|---|
| `ChromeWindow` | `chrome-fingerprinting-us/scenes/parts.tsx:59-101` | Chrome window: traffic lights, tab, omnibox, caret, tint |
| Chrome → Firefox | `chrome-fingerprinting-us/scenes/CtaWindow.tsx` | the same window turning into Firefox Proton in place (`k` 0..1) |
| Page in a tab | `chrome-fingerprinting-us/scenes/SoundPage.tsx`, `HookBits.tsx` | AliExpress homepage at desktop geometry; favicon; a stamp that becomes a badge |
| Blog post | `chrome-fingerprinting-us/scenes/BlogPost.tsx` | Blogger dark theme, lines broken by hand so a highlight runs line by line |
| GitHub repo card | `chrome-fingerprinting-us/scenes/KnownBits.tsx` | pinned-repo card at GitHub's geometry; a dated timeline pin |
| `DeviceCard` | `chrome-fingerprinting-us/scenes/parts.tsx:124`, `FingerprintBits.tsx` | a laptop card that splits into three and folds back |
| Claude chat | `distillation-us/scenes/ClaudeChat.tsx` | claude.ai dark theme, user bubble, reply (checked against Mobbin) |
| Reply and prompt cards | `distillation-us/scenes/OpeningBits.tsx`, `TrainingKit.tsx` (`AnswerCard`) | chat reply card, prompt bubble, a stream between two marks, marks with velocity blur |
| macOS app window | `distillation-us/scenes/DistillKit.tsx`, `DistillPicker.tsx`, `DistillTable.tsx`, `DistillTrain.tsx` | one window with a stepper; pop-up menu; dataset table; training card with loss curve |
| Model page with tabs | `distillation-us/scenes/LimitsBits.tsx` (`Window`), `LimitsCards.tsx`, `LimitsEval.tsx` | browser-geometry model page, capacity gauge, a quiz tab |
| Report page | `distillation-us/scenes/ReportPage.tsx`, `hf-incident/scenes/ReportPage.tsx` | a real report page, header and text verbatim |
| Instagram profile | `chrome-fingerprinting-us/scenes/CtaProfile.tsx`; with app top bar `distillation-us/scenes/CtaProfile.tsx` | portrait, three counts, handle, bio, Follow and Message |
| Instagram comments | `hf-incident/scenes/CtaBits.tsx`, `Cta.tsx` | comment sheet, input bar, send button, DM banner. Seller only: our CTA taps like, share and follow, never a comment or DM |

## Machines and objects

| Component | Path | Draws |
|---|---|---|
| Steel cell | `hf-incident/scenes/ReportChamber.tsx` | brushed steel, rivets, glass shutter, bolts, lamp, padlock, lit inside; three-quarter top |
| Glass cube | `hf-incident/scenes/ReportCube.tsx` | CSS 3D cube, lid and front pane that lift and slam |
| Server tower | `hf-incident/scenes/FleetTower.tsx` | rack of seven pieces that breaks into particles and restacks |
| Server with window | `hf-incident/scenes/OutServer.tsx`, `OutView.tsx`, `OutParcels.tsx` | tower, sign, cable to a globe; its window widening into a view; parcels down a chute |
| Locker wall | `hf-incident/scenes/LockerWall.tsx`, `LockerRig.tsx`, `LockerNote.tsx` | steel lockers with notes and tabs; a row of cells fed by tubes; a lit sign and counters |
| Cutaway building | `hf-incident/scenes/FileBuilding.tsx`, `FileParcel.tsx` | doll's-house building in one-point perspective, vault door; conveyor and claw |
| Building with gate | `hf-incident/scenes/WeekendGate.tsx`, `WhyHF.tsx` | side face for depth, mark on the roof, lit windows, padlocked gate; archive shelves |
| Street at night | `hf-incident/scenes/InStreet.tsx` | paving on a tilted floor, kerb, a stuttering lamp, dust cone |
| Key ring | `hf-incident/scenes/InKeys.tsx` | split ring with 14 keys |
| Machine and pass | `hf-incident/scenes/PowerMachine.tsx`, `PowerPass.tsx`, `TemplateMachine.tsx` | brass-and-slate box with gear window; lanyard pass; graphite cabinet with gears and lamps |
| Paper things | `hf-incident/scenes/GoBoard.tsx`, `LogsBook.tsx`, `LogsPen.tsx`, `WeekendCal.tsx`, `WhySheet.tsx`, `WhyCards.tsx`, `CaughtBits.tsx` | cork board, logbook and red pen, wall calendar, 898-box test sheet, rubric and answer key, security card and tear-off calendar |
| Layer stack | `distillation-us/scenes/CatchStack.tsx`, `CatchCasing.tsx`, `CatchInside.tsx` | 28 plates in CSS 3D; a casing that closes; the view through a cutaway window |
| Tokens and bars | `distillation-us/scenes/parts.tsx` (`TokenChip`, `ProbBars`), `InsideRow.tsx` | token chips, probability bars |

## Characters and helpers

| Component | Path | Draws |
|---|---|---|
| Agent bot | `hf-incident/scenes/AgentIcon.tsx`, `parts.tsx:30-39` | capsule bot with visor, eyes, blink and states |
| Agent glyph | `hf-incident/scenes/AgentGlyph.tsx` | the same silhouette, light enough for hundreds |
| `Logo` | each reel's `scenes/parts.tsx` | real marks, bare |
| `rand`, `StepStamp` | `hf-incident/scenes/parts.tsx:42,48` | seeded random; a step stamp |
| `mixHex` | `chrome-fingerprinting-us/scenes/parts.tsx:103` | colour mix |

## Hook worlds

| Component | Path | Draws |
|---|---|---|
| Ring fleet | `hf-incident/scenes/HookV5.tsx`, `HookV5Fleet.tsx`, `HookV5Marks.tsx` | a tilted orbit of 700 agents round a spinning mark, hand-projected |
| Copier | `distillation-us/scenes/HookX2.tsx`, `HookX2Machine.tsx`, `HookX2Copies.tsx` | copier on steep glass, scan lamp, copies peeling off |
| Forge | `distillation-us/scenes/HookX3Space.tsx`, `HookX3Forge.tsx`, `HookX3Fx.tsx`, `HookX3Cast.tsx` | a die slamming into hot material, pour, sparks, the cast torn out |
| Glass core | `distillation-us/scenes/HookX4Core.tsx`, `HookX4Ribbon.tsx`, `HookX4Qwen.tsx` | streams inside a glass sphere, a probe, a vessel filling |
| Glass floor | `distillation-us/scenes/HookX5World.tsx`, `HookX5Mark.tsx` | black glass floor, spotlights, marks as glossy slabs with reflections |
| Swarm | `distillation-us/scenes/HookX1World.ts`, `HookX1Swarm.tsx`, `HookX1Marks.tsx` | thousands of avatars in three depth layers round a lit mark |

## Traps

- A component built from scratch when one here is close. Copy, then adapt.
- A copy with no `Copied from` line: the next reel cannot find the source.
- Facts copied with the component. Copy the drawing, never its numbers or text: those come from this reel's sources.
