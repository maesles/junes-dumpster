/**
 * Build step for the collapsible-sidebars plugin.
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

for (const file of ["frames.js", "components.js", "styles.js", "index.js"]) {
  const src = join(root, file)
  if (!existsSync(src)) {
    console.error(`missing ${file}`)
    process.exit(1)
  }
  copyFileSync(src, join(dist, file))
}

// Verify every module parses. A stray backtick inside one of the CSS/JS
// template literals silently truncates the string, and Quartz reports it only
// as "failed to load its entry module", which is easy to miss.
for (const file of ["frames.js", "components.js", "styles.js", "index.js"]) {
  try {
    await import(pathToFileURL(join(dist, file)).href)
  } catch (error) {
    console.error(`✗ ${file} failed to parse: ${error.message.split("\n")[0]}`)
    process.exit(1)
  }
}

writeFileSync(
  join(dist, "frames.d.ts"),
  [
    "export interface PageFrameProps {",
    "  componentData: any",
    "  header: any[]",
    "  beforeBody: any[]",
    "  pageBody: any",
    "  afterBody: any[]",
    "  left: any[]",
    "  right: any[]",
    "  footer: any[]",
    "  sidebars?: { left: string; right: string }",
    "}",
    "",
    "export interface PageFrame {",
    "  name: string",
    "  css?: string",
    "  render: (props: PageFrameProps) => any",
    "}",
    "",
    "export declare const CollapsibleSidebarsFrame: PageFrame",
    "export default CollapsibleSidebarsFrame",
    "",
  ].join("\n"),
)

writeFileSync(
  join(dist, "components.d.ts"),
  [
    "export declare const SCRIPT: string",
    "export declare const SidebarToggleScript: any",
    "export default SidebarToggleScript",
    "",
  ].join("\n"),
)

writeFileSync(join(dist, "styles.d.ts"), 'export declare const CSS: string\n')

writeFileSync(join(dist, "index.d.ts"), 'export * from "./frames.js"\n')

console.log("built dist/")
