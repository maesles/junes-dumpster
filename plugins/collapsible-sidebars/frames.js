/**
 * Collapsible-sidebar page frame.
 *
 * Same three-column structure as Quartz's built-in `DefaultFrame`, plus a
 * toggle button on each sidebar that collapses that column. The behaviour is
 * provided by `SidebarToggleScript` in `components.js` — a frame can ship CSS
 * but not scripts, so the click handling lives in the component.
 */

import { jsx, jsxs, Fragment } from "preact/jsx-runtime"

export { CSS } from "./styles.js"
import { CSS } from "./styles.js"

const CHEVRON_LEFT = "15 6 9 12 15 18"
const CHEVRON_RIGHT = "9 6 15 12 9 18"

function chevron(points) {
  return jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true",
    children: jsx("polyline", { points }),
  })
}

function sidebarToggle(side) {
  // Collapsing points toward the edge the sidebar sits against.
  const points = side === "left" ? CHEVRON_LEFT : CHEVRON_RIGHT
  const label = side === "left" ? "Collapse left sidebar" : "Collapse right sidebar"
  return jsx("button", {
    type: "button",
    class: "sidebar-toggle",
    "data-sidebar-toggle": side,
    "aria-label": label,
    title: label,
    "aria-expanded": "true",
    children: chevron(points),
  })
}

function sidebarRail(side) {
  // The rail's arrow points toward where the sidebar reappears.
  const points = side === "left" ? CHEVRON_RIGHT : CHEVRON_LEFT
  const label = side === "left" ? "Show left sidebar" : "Show right sidebar"
  return jsx("button", {
    type: "button",
    class: `sidebar-rail ${side}`,
    "data-sidebar-toggle": side,
    "aria-label": label,
    title: label,
    "aria-expanded": "false",
    children: chevron(points),
  })
}

export const CollapsibleSidebarsFrame = {
  name: "collapsible-sidebars",
  css: CSS,
  render({
    componentData,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer,
    sidebars,
  }) {
    return jsxs(Fragment, {
      children: [
        jsx(
          "div",
          {
            class: "left sidebar",
            "data-sidebar-mode": (sidebars && sidebars.left) || "fit",
            children: [sidebarToggle("left"), ...left.map((C) => jsx(C, componentData))],
          },
          "left",
        ),
        jsxs(
          "div",
          {
            class: "center",
            children: [
              jsx("div", {
                class: "page-header",
                children: jsx("div", {
                  class: "popover-hint",
                  children: beforeBody.map((C) => jsx(C, componentData)),
                }),
              }),
              jsx(Content, componentData),
              jsx("hr", {}),
              jsx("div", {
                class: "page-footer",
                children: afterBody.map((C) => jsx(C, componentData)),
              }),
            ],
          },
          "center",
        ),
        jsx(
          "div",
          {
            class: "right sidebar",
            "data-sidebar-mode": (sidebars && sidebars.right) || "fit",
            children: [sidebarToggle("right"), ...right.map((C) => jsx(C, componentData))],
          },
          "right",
        ),
        sidebarRail("left"),
        sidebarRail("right"),
        ...footer.map((C) => jsx(C, componentData)),
      ],
    })
  },
}

export default CollapsibleSidebarsFrame
