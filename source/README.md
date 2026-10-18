# Current game source snapshot

- `jack.qsp`: exact current game file, 47,824,002 bytes.
- SHA-256: `84e978d5b06bf9a3fb6ed6a030160c7761cfbec5cfa54d2fd90102f25552fc3a`.
- `locations.json`: lossless JSON with raw file header, 259 decoded locations, descriptions, bodies and actions.
- `index.json`: location names and per-location reading-view paths.
- `locations/*.qsrc`: readable views for browsing. They are not a supported rebuild input.

From the repository root, regenerate the JSON/views into a separate folder with:

```powershell
node tools/export-source.cjs source/jack.qsp qa-output/source-view
```

The decoder checks both the original QSP codec roundtrip and exact reconstruction from the serialized JSON. It never writes the input QSP. Location indices/names and executable fields are preserved; explanatory comments in the reading views are not part of the game.

Use `tools/text-workshop/core.cjs` and explicit reviewed edits against a backed-up QSP for maintenance. An older baseline plus all historical patches is not a supported reproduction recipe.
