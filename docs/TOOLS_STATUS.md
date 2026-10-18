# Tool scope and legacy components

- `tools/text-workshop/`: current dialogue/source editor and its tests, including selected-result batch word replacement. Source analysis/preview does not execute all game conditions. Supply an explicit local game path; old path defaults in retained source are not portable configuration.
- `tools/state-editor/`: current registered-field character editor source; not a universal save editor or the future Mod Studio design.
- `tools/qa/`, `tools/apply_mods.ps1`, `tools/qsp_dump.py`: QSP reading, controlled patching and stated checks. Some tests need external runtime/browser/engine dependencies and matching fixtures.
- `tools/release/`: current 2.4 installer PowerShell/C# source and checks; no installer binary is distributed in this source repository.
- Root `build/` and `installer/`: legacy SNKmod/FIX6/R3 tool source. Its pinned baseline and package version do not rebuild the present snapshot.
- `tools/cut-addition/`: partial older staged copy, missing local modules; not a standalone supported app. Use the complete Text Workshop implementation for current code reference.
- Other one-off scripts are source references; review paths, prerequisites and intended staging context before executing them.

No developer server, browser or application is opened by cloning this repository. Full game assets, engine, external packs, personal saves, local settings and private work logs are omitted.
