---
title: Getting Started
description: How this vault is laid out and how to add notes.
tags:
  - meta
---

# Getting Started

Notes live in `content/`. Folders become sections of the site; the file structure in the **[Explorer](/)** matches the folder structure in Obsidian.

## Adding a note

1. Create a `.md` file anywhere under `content/`.
2. Optionally add frontmatter:

   ```yaml
   ---
   title: My Note
   description: A short summary shown in search and link previews.
   tags:
     - example
   ---
   ```

3. Link it from another note with `[[Note Name]]`.

## Things that are handled for you

- Wikilinks resolve across folders using the shortest unique path.
- Unresolved links render as plain text, not as dead links.
- Backlinks and the graph view update automatically.

Back to [[index|home]].
