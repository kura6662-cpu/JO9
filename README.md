# JO9 2.4 Alpha — Korean Overhaul Source Snapshot

This repository is a history-free source and reference snapshot of **SAnk's Korean Jack-o-nine-tails 2.4 alpha**, prepared on 19 October 2026 for modders who want to study the changes or port selected parts to their own projects. In-game text remains Korean. This is a reference snapshot, rather than a complete English translation or an installer for every JO9 edition.

The project began as an AI-assisted Korean retranslation of 2.3, consulting both Russian and English text, and expanded into UI, artwork, dialogue, gameplay, and bug fixes. The current playable working copy was used as the snapshot authority; older source exports and the previous September UI-patch README do not define this release.

## What is here

| Path | Purpose |
| --- | --- |
| `source/jack.qsp` | Exact current playable QSP snapshot. |
| `source/locations.json` | Canonical readable, lossless decode of the QSP structure, including location fields and actions. |
| `source/locations/` | Optional QSRC reading views; these are not a supported rebuild input. |
| `mods/` | Incremental patch records tied to particular baselines. |
| `tools/`, `tests/` | Source tools and checks, with their relative dependencies retained. |
| `assets/` | Selected reference resources and mod assets. |
| `docs/` | Curated design, feature, and validation documentation. |

The complete game, external image packs, personal saves, local backups, and previous development chat history are outside the scope of this source repository. Obtain the matching playable release separately when you need to compare the complete visual setup.

## Implemented in the 2.4 alpha

- **Companion combat:** A slave or assistant can enter regular fog-patrol combat first, with the protagonist taking over after a companion defeat. Combat outcomes still carry their existing consequences.
- **Traits and character development:** Sixteen new traits, revisions to existing traits, and additional effects and presentation for special attributes.
- **Contextual conversations:** Authored fragments selected using personality, speaking style, relationships, mood, and relevant existing event history. Impression responses, requests, mood, background, and comments about other characters have been revised.
- **UI and household management:** Revised character cards and action buttons, clearer rank and status information, separate room diets, and more useful cryo-storage presentation.
- **Image presentation:** Replacement backgrounds, character art, portraits, and event sequences; image switching and an unobstructed scene-view mode.
- **World text and fixes:** Revised location, character, and quest descriptions, together with fixes to older events, transactions, calculations, and display errors.

The current start is male-protagonist only. The female-protagonist start was removed because its incomplete and faulty paths were outside the maintenance scope of this build.

## Dialogue design and its present limits

The starting point was a **Wayward-inspired design handed over from Claude**. It separates **what a character says**—background, current relationship, and events—from **how they say it**—personality and speaking style. The working interpretation has three layers:

1. Long-term: origins, background, and innate characterization.
2. Medium-term: the current relationship with the protagonist and the character's underlying emotional attitude.
3. Short-term: recent events and immediate reactions, expressed consistently with that relationship.

These are design concepts, not three newly implemented memory databases. The current QSP reads existing character state and action records, selects prewritten fragments, and combines them in supported conversation questions. It also stores a small recent-choice history to reduce repetition. It does not call an external language model or generate unrestricted new dialogue while the game runs.

Original question conditions, relationship calculations, unique character backgrounds, and unrecognized custom stored stories retain their existing paths. Candidate coverage varies by state; original text remains the fallback when an applicable replacement is unavailable. See [Project intent](docs/PROJECT_INTENT.md) and [Dialogue architecture](docs/DIALOGUE_ARCHITECTURE.md) for the inherited design, later changes, scope, and dependencies.

## Porting and compatibility

Port QSP-changing features against the exact target version. Replacing this build's QSP with another mod's QSP discards its changes. UI features may require matching QSP markup, CSS, JSON, and images together; copying a stylesheet or picture alone may be insufficient.

Image-only replacements can be reused where the destination has compatible paths and usage. For images supported by this build's B-cut system, extra versions use the same directory and names such as `picture (2).png`, `picture (3).png`, and `picture (4).png`. Existing B-cuts can already occupy `(2)`. Automatic discovery of these filenames uses this FastQSP build's file-existence extension; standard QSP and WASM engines must not be assumed to support it.

Korean internal identifiers, discriminator strings, and resource filenames remain in use. Normalizing them into English is deferred to future localization work and will require reference auditing and a save-migration design. English documentation does not imply that this migration has happened.

## Working with the source

Use a disposable copy of the matching playable game and keep separate backups of QSP and saves. Inspect the current QSP before changing it. Readable source exports are useful references; the maintained editing workflow changes the current encoded QSP and checks a byte-identical read/write round trip. Do not rebuild an older export over the current file.

Patch records in `mods/` describe incremental changes against particular baselines. They are not a guarantee that replaying every historical patch over any vanilla or 2.4 file will recreate this snapshot. Select only the changes belonging to the baseline you actually have, and respect their expected occurrence counts and hashes. Preserve later manual edits.

Useful starting points:

- [Source editing and QA](docs/BUILD_AND_QA.md): English workflow and portable command examples.
- [QSP release validation](docs/QSP_RELEASE_VALIDATION.md): detailed implementation reference for structural checks, exact patch replay, real FastQSP smoke paths, input preservation, and validation limits.
- [Original dialogue design](docs/dialogue/design-original/README.md): the retained v1 design is historical context, rather than a specification of every current output path.
- [Dialogue implementation](docs/slave-voice/2026-10-18_ARGON_REVISED_DIALOGUE.md): selected-topic wrappers, fallback behavior, cache refresh, and recent-choice state.
- [Impression flow and topic routing](docs/slave-voice/2026-10-18_IMPRESSION_FLOW_AND_ROUTES.md): contextual page composition and routing between questions.
- [Character-assessment speech](docs/slave-voice/2026-10-18_RELATION_SEMANTIC_SPEECH.md): reviewed wording and context-aware connections without changing relationship calculations.
- [Windows image slots](docs/WINDOWS_IMAGE_SLOTS_20261018.md): image naming, engine requirements, saved selection, and editor/installer dependencies.
- [CSS responsibilities](docs/CSS_2_4_POLICY_20261015.md): keep layout and visual styling in CSS; keep game text and state-dependent output decisions in QSP.

See [Tool status](docs/TOOLS_STATUS.md) for current helpers, legacy packaging and partial staged copies.

Some retained technical manuals are Korean and contain historical example paths. Supply your own explicit paths and use the current snapshot as the authority. Old test totals and recorded PASS results describe their documented inputs; they are not fresh validation of your port.

## Validation

The release-check tool requires Node.js, its repository dependencies, Windows PowerShell, a matching FastQSP executable, a representative save, and a known baseline plus the selected patch set for a full release check. Run it in an isolated diagnostic copy and keep output outside the game directory. Follow [the English QA guide](docs/BUILD_AND_QA.md) for the full command and required arguments.

A structural-only check is available:

```powershell
node tools/qa/release-check.cjs --candidate '<path-to-jack.qsp>' --profile static --out '<diagnostic-output-folder>'
```

`STATIC_PASS` is not an engine-run PASS. The full check verifies specified engine paths; it does not certify all gameplay, save-loading UI/CRC behavior, every dialogue combination, or visual layout. Keep those checks explicit and separate. Diagnostic QSPs, copied save state, runtime backups, and private configuration must not be committed.

## Plans

The alpha still needs playtesting, dialogue expansion, balance work, and replacement artwork. Planned work includes applying contextual composition to more conversations and reactions, and a brothel module whose design and initial UI planning exist but whose gameplay module is not included here.

Longer-term ideas include freeing developed characters, homes and shop roles for freed characters, romance, deeper relationships between characters, more substantial endings, and rival traders. These are future directions, not delivered features. There is no promise of parity with Wayward's dialogue coverage.

## Credits and reuse

**2.4 Korean overhaul: SAnk.**

Thanks to **Old Huntsman**, **Graylor** for FastQSP, and the original developers and contributors, including **Beaver14, Crushboss, Fugitive Red, qwertyu12359, Powerairmax, Lokplart, ImperatorAugustus, Mars & Jinn, RedGreen3, Teletube**, and the wider community.

Thanks to **한글을사랑합시다**, the **사서고생분들 / Dona Patch team** for the Korean 2.3 release, and **smsfbatalovehandle** for the AI girl pack. Preserve the existing in-game credits and any bundled component notices when adapting the work.

SAnk has invited reuse and adaptation of SAnk's own image replacements, UI work, and other changes. This statement does not assign a new license to the original game, engine, external packs, or other third-party material. No repository-wide license is invented by this snapshot; consult each component's existing terms and credits.
