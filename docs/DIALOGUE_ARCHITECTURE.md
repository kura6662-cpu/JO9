# Dialogue architecture: original design and current behavior

This is an English reading guide to the dialogue system in the 19 October 2026 source snapshot. The supplied QSP is authoritative. Original design papers explain intent; the later implementation documents explain the delivered contracts.

## The original design

The 15 October v1 handoff, authored through Claude's dialogue-design work, applied a Wayward-inspired contextual-text idea to JO9's existing variables. Its central separation was:

- **What to say:** choose a relevant subject from background, relationships, recent activity, moodlets, and immediate circumstances.
- **How to say it:** calculate one of nine character profiles from `temper + sensitivity` and `ego + pride`, then use occupation-based speaking style and an emotional-disclosure depth.
- **What to preserve:** original replies, refusal paths, existing conditions, and gameplay state.

The v1 memory-layer terminology used long-term for background and durable attitude, medium-term for recent counters/moodlets, and short-term for today's events and physical circumstances. It proposed small authored additions around original answers, recommended existing `#dynamic` and `#txt_man` locations for helpers/data, and required no new persistent state variables. Its proposed question and portrait coverage, family-based vocabulary expansion, teaching-method reactions, and future-module hooks are not a list of features delivered in the present snapshot.

The retained [original design index](dialogue/design-original/README.md) explains the status of those papers. Their old line numbers, append-only contracts, and zero-new-state rule must not be applied as if they describe the current code.

## The current interpretation

The final release describes three conceptual layers:

1. **Long-term:** origins, background, and innate characterization.
2. **Medium-term:** the current relationship with the protagonist and the underlying emotional attitude.
3. **Short-term:** recent events and immediate reactions, interpreted consistently with that relationship.

The current source uses existing game values and action records for these concepts. It has no separate newly created long-term/medium-term memory database. A new favorable event can be mentioned without rewriting a hostile relationship into an affectionate one.

The output is selected and composed from authored text. There is no external LLM request at runtime. Pool coverage varies: a stored row does not mean that row is selectable in every state, and the source does not promise unlimited variety or a fixed minimum number of candidates for every state.

## Current code map

| Component | Input and result | State and dependencies |
| --- | --- | --- |
| `$voice_profile` | Existing character attributes and occupation produce a profile and speaking style. | Reads existing values. |
| `$voice_depth_level` | Existing character values and emotional category produce permitted depth. | Reads existing values. |
| `$voice_pick_fragment` | Topic/role, profile, style, relationship, depth, guards, and recent history select eligible authored fragments. The current optional question argument filters routed material. | Uses the text bank and recent-choice signatures. Candidate fallback progressively relaxes recent-repeat exclusion. |
| `$voice_impression(question)` | Original semantic conditions activate material, then select and route it for supported impression/request/wish/mood output. | Preserves original conditions; creates temporary composed pages. |
| `$voice_native(group, originalText, optionalSpeaker)` | Wraps an already selected original topic with applicable authored core/detail text; returns the original text when no replacement applies. | Preserves the original selection path. The actual speaker is explicit for character assessments. |
| `$voice_native_stored(category, storedText)` | Exact, unique identification of a known generic stored background permits rephrasing of that fact. | Custom, ambiguous, empty, or unrecognized stored text passes through. Stored biography is not overwritten. |
| `$voice_native_moods` | Rephrases known already-selected mood pages. | Preserves original mood-list order and fallback pages; does not recalculate mood. |
| `$voice_flow_pack` and routing data | Selected complete utterances are ordered by context and packed into pages; routed utterances go to the appropriate question. | Does not resample dialogue or write history. A length target moves complete utterances rather than cutting sentences. |
| `$voice_relation_line` / `$voice_relation_continue` | Reviewed exact matches adjust wording, repeated leading cues, and recognized adjacent assessment combinations. | Does not resample or alter relationship calculations. Temporary per-response context is cleared. |

The principal hooks are in `interaction`, `chose_answer`, `interaction_result`, and `origins_relations`; definitions/data are in `#dynamic` and `#txt_man`. Read the current implementation documents for exact arguments and markers before editing.

## Topic coverage and preservation

The revised bank is connected to questions 1111–1118: background, impressions, requests/refusals, wishes, dislikes, mood, and both directions of assessment between characters. This is coverage of supported original question routes, not a rewrite of every conversation, portrait, narration, or event.

Impression output has since been grouped by context and some utterances moved to requests, wishes, and mood. Existing concrete requests and original mood entries retain their priority. Only an otherwise isolated generic “nothing requested/wanted” fallback is removed when a real additional request/wish is displayed. Refused conversations do not append the success-path material.

Unique character stories and relationship backgrounds retain their original priority. Unknown custom stored background text is passed through. Original text also remains available when the authored pool has no eligible replacement.

## Saved history and cached definitions

Unlike the initial zero-new-state design, the delivered implementation stores small recent-choice signatures in existing character arrays, including `jo9_voice_last1_*` / `jo9_voice_last2_*` topic/group keys. These are repetition records, not an event-memory database. History is confirmed when selected speech is actually displayed; hidden, superseded, or failed-to-display material must not consume the same history as a spoken response. Character-array movement uses the existing character-instance mechanisms.

Dialogue bank revision checks and function markers refresh definitions cached in older saves. They are not a blanket save-compatibility guarantee or a migration of all saved scripts. Re-enter a question after restarting the game to execute current code; a saved old screen can still display its previous HTML until refreshed.

## Maintenance and verification

Treat helpers, data, output hooks, cache checks, and history confirmation as linked dependencies. A comment marker is a navigation boundary, not proof that its block can safely be deleted alone. Use a reviewed reverse patch or known baseline, and preserve subsequent manual edits.

Read these current documents in order:

1. [Revised bank and original-topic wrappers](slave-voice/2026-10-18_ARGON_REVISED_DIALOGUE.md).
2. [Contextual page flow and question routing](slave-voice/2026-10-18_IMPRESSION_FLOW_AND_ROUTES.md), which updates the relevant routing/cache details.
3. [Assessment wording and semantic continuations](slave-voice/2026-10-18_RELATION_SEMANTIC_SPEECH.md), which updates the relation helper marker to V8.
4. [QSP release validation](QSP_RELEASE_VALIDATION.md).

Feature tests and isolated real-engine checks cover their stated inputs. They do not certify every possible authored combination, custom biography, save-loading UI/CRC result, or pixel layout. Dialogue quality and full gameplay still require playtesting.
