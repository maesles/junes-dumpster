// No layout of its own; the loader flag below is all this plugin styles.

export const CSS = `
/* Suppress the reader-mode sidebar fade during the initial paint.
   The reader-mode plugin animates opacity over 200ms; when reader mode is the
   default the attribute is already set before paint, so the animation would
   play on load as a visible "fade in". The flag is removed after the first
   couple of frames, so deliberate toggles still animate. */
:root[data-reader-mode-loading] .sidebar.left,
:root[data-reader-mode-loading] .sidebar.right {
  transition: none !important;
}
`
