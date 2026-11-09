# June's Cool Vault

A [Quartz v5](https://quartz.jzhao.xyz) site, published at **https://vault.dumpster.town**.

The vault itself lives in `content/`. Open that folder in Obsidian — everything in it is
published, so keep private notes out of this repo.

## Writing

- Notes are plain Markdown under `content/`.
- Folders become sections of the site; the sidebar explorer mirrors them.
- Link between notes with `[[Note Name]]`. Links to notes that don't exist render as
  plain text rather than dead links.
- Add frontmatter for metadata:

  ```yaml
  ---
  title: My Note
  description: Shown in search results and link previews.
  tags:
    - example
  ---
  ```

- `draft: true` in frontmatter keeps a note out of the build.
- Files starting with `.` or in `.obsidian/` are never published.

### Folders and files to be aware of

| Path | Behaviour |
| --- | --- |
| `content/_drafts/` | Ignored by the build and by the repo's CI check. Safe for scratch work. |
| `content/.obsidian/` | Obsidian settings. Not published. `workspace.json` is gitignored. |
| `*.canvas`, `*.base` | Ignored by the build. |
| `content/attachments/` | Images and other files, linked normally in notes. |

Both ignore rules live in `quartz.config.yaml` under `configuration.ignorePatterns`.

## Preview locally

Requires Node 22+ (see `.node-version`).

```bash
npm ci
npx quartz plugin install
npx quartz build --serve
```

Then open <http://localhost:8080>. The dev server rebuilds on file changes.

## Publish

Push to `main`. GitHub Actions builds the site and deploys it to Pages.

- `.github/workflows/deploy.yml` — builds and deploys on every push to `main`.
- `.github/workflows/build-check.yml` — builds on every pull request and fails if
  `_drafts/` or `.obsidian/` content ends up in the output.

## Site configuration

Everything lives in `quartz.config.yaml`:

- `configuration.pageTitle` — the site name.
- `configuration.baseUrl` — the public hostname. **The `CNAME` file for the custom
  domain is generated from this value** (the `@quartz-community/cname` plugin), so
  changing the domain means changing this one line.
- `configuration.ignorePatterns` — folders and files excluded from the build.
- `plugins:` — the full plugin list, with layout positions in `layout:`.

Styling overrides go in `quartz/styles/custom.scss`.

## One-time GitHub + DNS setup

1. Create the repository and push this code to `main`.
2. In the repo: **Settings → Pages → Source: GitHub Actions**.
3. Add a `CNAME` DNS record from `vault.dumpster.town` to `<your-username>.github.io`
   (or, if `vault` is a subdomain of an apex you host, point that subdomain at
   `<your-username>.github.io`). For an apex domain instead, use GitHub's `A` records:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
4. Wait for DNS to propagate, then enable **Enforce HTTPS** in Settings → Pages once the
   certificate is issued.
