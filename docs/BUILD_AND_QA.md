# Source editing and QA

This repository is a source snapshot. It does not contain a verified recipe for rebuilding the complete 2.4 game from a pristine 2.3 installation and every historical patch. The exact `source/jack.qsp` is the starting reference; `source/locations.json` is its lossless readable decode. Optional QSRC views are for reading, not a supported rebuild path.

## Prepare a change

1. Make a separate working copy of the matching game. Keep independent QSP and save backups.
2. Read the current QSP immediately before editing and record its SHA-256. Confirm that decoding and re-encoding without edits is byte-identical.
3. Prepare an exact incremental patch against that baseline. Preserve manual edits and record location, field, old/new text, expected occurrence count, and before/after hashes.
4. Put only this change's patch files in a selected patch directory, ordered by filename. Do not point at the entire historical `mods/` directory.
5. Preview with the existing PowerShell patch tool on a disposable QSP copy:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/apply_mods.ps1 -Qsp '<working-copy-jack.qsp>' -ModsDir '<selected-patches>' -DryRun
```

The patch tool checks exact edit occurrences, round-trip structure, names, and final line boundaries. Its printed historical hashes are informational; the release checker below pins the selected first/last patch hashes against actual baseline/candidate inputs. Review a diff and the documented feature dependencies before applying a change.

## Run the release check

For the full check, provide Node.js, Windows PowerShell, the matching installed FastQSP executable, the game's supporting files, a representative save containing both character roles, the exact baseline, and the selected patch set. Use explicit paths. Output must be outside all protected input/game/save directories.

```powershell
node tools/qa/release-check.cjs `
  --candidate '<candidate-jack.qsp>' `
  --baseline '<immediately-before-this-change-jack.qsp>' `
  --mods-dir '<selected-patches>' `
  --engine '<matching-game>/engine/jack.exe' `
  --game-dir '<matching-game>' `
  --state-save '<representative-save.sav>' `
  --cache-revision 2 `
  --mirror '<actual-distribution-jack.qsp>' `
  --out '<isolated-diagnostic-output>'
```

The snapshot's trait-cache revision is documented as 2. Re-read the actual `jo9_traits_revision` target if changing that contract; this is not the dialogue-bank revision. Omit `--mirror` during development if no distribution copy exists and report that it was not checked. When validating a distribution, use its actual QSP as the mirror.

The checker writes a new `run-*` directory with `report.json` and `report.md`. It checks structure and exact read/write round trip, line/marker boundaries, exact selected-patch replay and idempotence, specified real-engine paths, optional distribution equality, and preservation of input hashes. The real-engine probe runs instrumented disposable copies and waits for completion markers.

| Verdict | Meaning |
| --- | --- |
| `PASS` | All required checks for the selected full profile passed. |
| `FAIL` | At least one check failed; do not release the candidate. |
| `INCOMPLETE` | A required input/check was absent; do not treat as a successful release check. |
| `STATIC_PASS` | Only the explicitly selected structural profile passed; no full engine-run claim. |

Check both the process exit code and report verdict. A fast structural-only command is:

```powershell
node tools/qa/release-check.cjs --candidate '<candidate-jack.qsp>' --profile static --out '<isolated-diagnostic-output>'
```

## What remains to verify

Add feature-specific tests for changed calculations, boundary conditions, selectors, or state effects. Existing tests can depend on a particular baseline, a QSP/WASM package, browser installation, or other documented inputs; a missing dependency is not a passed test.

The release checker covers nine defined paths: home, new-game initialization, both character roles in the trait editor, old-cache refresh, daily progression, two city conversations, and combat-menu entry. It does not prove all combat outcomes or balance. Representative state is imported for probes; the tool does not certify actual save-selection UI, CRC compatibility, or restoration of every saved script.

Check real save loading, new-game choices, screen layout, missing images, affected gameplay, and dialogue quality separately. Recorded historical test totals describe their own input files. Run appropriate current checks before claiming a port or change works.

## Keep private runtime material out of Git

Diagnostic copies can contain values from the representative save. Do not publish `run-*` directories, diagnostic QSPs, copied save state, runtime backups, personal target configuration, or logs containing state text. Publish only reviewed reports without private state. The original input QSP and saves must remain unchanged by validation.

For detailed implementation and command behavior, see the retained [QSP validation reference](QSP_RELEASE_VALIDATION.md).
