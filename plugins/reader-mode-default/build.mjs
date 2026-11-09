/**
 * Build step for the reader-mode-default plugin.
 *
 * Sources are already plain ESM, so "building" mirrors them into `dist/` (which
 * Quartz's plugin installer looks for) and emits minimal type declarations so
 * the plugin is also visible to the TS override registry.
 */
import { copyFileSync, mkdirSync, writeFileSync, existsSync, rmSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath, pathToFileURL } from "url"

const root = dirname(fileURLToPath(import.meta.url))
const dist = join(root, "dist")

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

const FILES = ["components.js", "styles.js", "index.js"]

for (const file of FILES) {
  const src = join(root, file)
  if (!existsSync(src)) {
    console.error(`missing ${file}`)
    process.exit(1)
  }
  copyFileSync(src, join(dist, file))
}

// Verify every module parses. A stray backtick inside one of the template
// literals silently truncates the string, and Quartz reports it only as
// "failed to load its entry module", which is easy to miss.
for (const file of FILES) {
  try {
    await import(pathToFileURL(join(dist, file)).href)
  } catch (error) {
    console.error(`✗ ${file} failed to parse: ${error.message.split("\n")[0]}`)
    process.exit(1)
  }
}

writeFileSync(
  join(dist, "styles.d.ts"),
  "export declare const CSS: string\n",
)

writeFileSync(
  join(dist, "components.d.ts"),
  [
    "export declare const PRESCRIPT: string",
    "export declare const SCRIPT: string",
    "export declare const ReaderModeDefault: any",
    "export default ReaderModeDefault",
    "",
  ].join("\n"),
)

writeFileSync(join(dist, "index.d.ts"), 'export * from "./components.js"\n')

console.log("built dist/")
