# Original dialogue design — historical reference

These papers describe the 15 October 2026 v1 dialogue design handed over from Claude's design work. They preserve the origin of the Wayward-inspired contextual approach. They are not a specification of every feature implemented in the current 2.4 alpha.

| Paper | Purpose |
| --- | --- |
| `DIALOGUE_GENERATION_RULES.md` | Initial authoring rules: subject versus voice, nine profiles, speaking style, emotional depth, memory layers, and proposed question/portrait coverage. |
| `IMPLEMENTATION_HANDOFF.md` | Initial technical proposal: existing-value calculations, append-only placement, helper/data locations, staged implementation, and unresolved source checks. |
| `DIALOGUE_BOOK_v1.md` | Optional original authored sample bank. Its inclusion is evidence of an authored draft, not proof every row is active in the current game. |

The initial design required no new persistent state and described short additions around original replies. The delivered system later added recent-choice history, composed whole responses, expanded/revised its bank, and redistributed some material between questions. The layer interpretation was also refined during implementation. Portrait additions, family-vocabulary expansion, teaching-method responses, and future-module references in v1 must not be assumed to exist in the present game.

See [the current English architecture guide](../../DIALOGUE_ARCHITECTURE.md) and its linked implementation contracts before changing code. In any disagreement, the snapshot QSP and current contracts describe delivered behavior. Old source line numbers, machine paths, role assignments, and implementation-stage instructions are historical.
