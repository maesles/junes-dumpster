// Styles for the collapsible-sidebars frame.

export const CSS = `
/* Smooth width change when a column collapses. */
#quartz-root[data-frame="collapsible-sidebars"] > #quartz-body {
  transition: grid-template-columns 200ms ease;
}

/* Override the core grid-template shorthand rather than only
   grid-template-columns: the shorthand sets the area map and the track list
   together, and giving it a 2-track list while the areas still name three
   columns collapses the whole page into a single column.

   The area map never changes — only the track widths do, via the two custom
   properties below. */
@media all and (min-width: 1200px) {
  #quartz-root[data-frame="collapsible-sidebars"] > #quartz-body {
    grid-template:
      "grid-sidebar-left grid-header grid-sidebar-right"
      "grid-sidebar-left grid-center grid-sidebar-right"
      "grid-sidebar-left grid-footer grid-sidebar-right"
      / var(--sb-left, 320px) auto var(--sb-right, 320px) !important;
  }
}

@media all and (min-width: 800px) and (max-width: 1200px) {
  #quartz-root[data-frame="collapsible-sidebars"] > #quartz-body {
    grid-template:
      "grid-sidebar-left grid-header"
      "grid-sidebar-left grid-center"
      "grid-sidebar-left grid-sidebar-right"
      "grid-sidebar-left grid-footer"
      / var(--sb-left, 320px) auto !important;
  }
}

/* Collapsed: zero-width track and no sidebar content. */
#quartz-root[data-frame="collapsible-sidebars"] > #quartz-body[data-left-collapsed="true"] {
  --sb-left: 0px;
}
#quartz-root[data-frame="collapsible-sidebars"] > #quartz-body[data-left-collapsed="true"] > .sidebar.left {
  display: none;
}
#quartz-root[data-frame="collapsible-sidebars"] > #quartz-body[data-right-collapsed="true"] {
  --sb-right: 0px;
}
#quartz-root[data-frame="collapsible-sidebars"] > #quartz-body[data-right-collapsed="true"] > .sidebar.right {
  display: none;
}

/* The core stylesheet assigns grid-area to the sidebars, header and footer but
   NOT to .center, so it relies on source-order auto-placement, which lands it in
   the grid-header cell (row 1, at the top). That breaks as soon as a sibling is
   display:none or an extra element (the rails) joins the grid, so place .center
   explicitly in the same cell the auto-placement would have chosen.

   Without this, .center falls into the grid-center cell instead — row 2, which
   starts below the header row — and short pages appear vertically centred/low. */
#quartz-root[data-frame="collapsible-sidebars"] > #quartz-body > .center {
  grid-area: grid-header;
}

.sidebar-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--gray);
  cursor: pointer;
  flex-shrink: 0;
  transition: color 150ms ease, background-color 150ms ease;
}
.sidebar-toggle:hover {
  color: var(--dark);
  background-color: var(--highlight);
}
.sidebar-toggle svg {
  width: 1rem;
  height: 1rem;
}

/* Toggles only make sense where the sidebars are real columns. */
@media all and (min-width: 800px) {
  .sidebar-toggle {
    display: inline-flex;
  }
}

/* Pin the left toggle to the top-right of its column. */
#quartz-root[data-frame="collapsible-sidebars"] .sidebar.left {
  position: relative;
}
#quartz-root[data-frame="collapsible-sidebars"] .sidebar.left > .sidebar-toggle {
  position: absolute;
  top: 1rem;
  right: 0.5rem;
  z-index: 2;
}
#quartz-root[data-frame="collapsible-sidebars"] .sidebar.right > .sidebar-toggle {
  margin-bottom: 0.5rem;
  align-self: flex-end;
}

/* Thin edge rails that re-open a collapsed sidebar.
   They are position:fixed, but they are still grid items and would otherwise
   take part in auto-placement and steal a slot from .center (which has no
   grid-area and relies on source order). Pin them to an explicit row/column so
   they never participate in that flow. */
.sidebar-rail {
  display: none;
  grid-area: 1 / 1 / -1 / -1;
  position: fixed;
  top: 0;
  bottom: 0;
  width: 1.25rem;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  background: transparent;
  color: var(--gray);
  cursor: pointer;
  z-index: 10;
  opacity: 0.35;
  transition: opacity 150ms ease, background-color 150ms ease;
}
.sidebar-rail:hover {
  opacity: 1;
  background-color: var(--highlight);
}
.sidebar-rail svg {
  width: 1rem;
  height: 1rem;
}
.sidebar-rail.left {
  left: 0;
}
.sidebar-rail.right {
  right: 0;
}

@media all and (min-width: 800px) {
  #quartz-root[data-frame="collapsible-sidebars"] > #quartz-body[data-left-collapsed="true"] > .sidebar-rail.left,
  #quartz-root[data-frame="collapsible-sidebars"] > #quartz-body[data-right-collapsed="true"] > .sidebar-rail.right {
    display: flex;
  }
}

@media all and (max-width: 800px) {
  .sidebar-rail {
    display: none !important;
  }
}
`
