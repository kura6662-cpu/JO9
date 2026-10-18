# Project intent and implementation scope

This document describes the direction of SAnk's Korean JO9 2.4 alpha as represented by the 19 October 2026 source snapshot. The current playable working copy is the technical authority for the snapshot. Plans and earlier prototypes must not be described as delivered behavior.

## Direction

The project began with a Korean retranslation of JO9 2.3, consulting Russian and English text. Its broader goal is to improve the game's presentation, character development, and interactions while preserving its fictional setting and the author's intended mechanics. Changes should describe and implement the agreed game behavior, preserve manual edits, and record their actual technical effects.

The current release combines revised UI and artwork with contextual conversations, companion combat, expanded traits, clearer character information, household-management improvements, world descriptions, and fixes to existing systems. The in-game language is Korean and the supported start is male-protagonist only.

## Dialogue: inherited idea and implemented system

The original direction was handed over from Claude and inspired by Wayward's contextual-text approach. It separates **subject selection** from **voice**: background and circumstances determine what is relevant, while personality and speaking style determine how it is expressed. The retained [v1 design](dialogue/design-original/README.md) proposed short additions around original replies, using existing state without new persistent state variables; it is an initial design, not a full description of the later implementation.

During implementation, the memory model was clarified as:

| Design layer | Intended meaning | Current source of information |
| --- | --- | --- |
| Long-term | Origins, background, innate characterization | Existing game definitions and stored background text |
| Medium-term | Present relationship with the protagonist and underlying emotional attitude | Existing relationship and character-state values |
| Short-term | Recent events and immediate reactions | Existing action records, interpreted within the current relationship |

A favorable recent event does not by itself replace a hostile underlying relationship. This is a rule for interpreting and selecting speech; the dialogue output helpers do not change relationship, mood, training, or other gameplay values to force a particular response.

The delivered system uses prewritten fragments and the game's original topic-selection conditions. It supports the main question routes 1111–1118, including background, impressions, requests, wishes, dislikes, mood, and assessment of another character. Later refinements group complete utterances by context, route some subjects to more appropriate questions, and connect reviewed assessment combinations into natural speech.

The implementation retains original fallbacks and the priority of unique or custom stored stories. It records recent selected fragment signatures to reduce immediate repetition and refreshes cached dialogue definitions when older saves need current definitions. It does not add an independent long-term or medium-term event database, promise three candidates for every state, cover every conversation or narration path, or use an external AI service during play.

This working interpretation also refines the old layer terminology: v1 grouped recent counters and moodlets as medium-term; the current design treats the present relationship as the underlying attitude within which recent reactions are expressed. Current composition and recent-choice state extend beyond v1's append-only, zero-new-state scope. See [Dialogue architecture](DIALOGUE_ARCHITECTURE.md).

The dialogue documentation is a dependency map as well as a description: data banks, selectors, output hooks, cache checks, and history-confirmation points work together. Removing one marked block is not automatically a safe way to remove a feature. Use an exact reverse patch or reviewed baseline restoration and check the current file for later edits.

## Practical boundaries for modders

- Work from the supplied current QSP and an exact known baseline. Historical QSRC and a wholesale replay of old patch records are not substitutes for the current working copy.
- Keep presentation values in CSS and state-dependent game text/output decisions in QSP. Features may depend on matching CSS, JSON, images, and engine extensions.
- Preserve Korean display text and existing internal identifiers unless localization is deliberately undertaken. English identifier and resource normalization remains deferred; renamed persistent state needs an explicit save-migration plan.
- Preserve credits and distinguish SAnk's work from original and third-party components. The public snapshot does not establish new ownership or a universal license.
- Separate verified static/engine checks from actual save-loading, visual, dialogue-quality, and gameplay checks. Document the input and limits of each result.

## Future work

Near-term work is continued alpha playtesting, dialogue-pool expansion, additional conversation coverage, balance adjustment, and CG replacement. A brothel module is planned; its design and initial UI planning exist, but the module is not part of this release.

Longer-term ideas include freeing developed characters, housing and shop roles, romance, stronger relationships between characters, more substantial endings, and rival slave traders. These are directions for future development, not working features in this snapshot.
