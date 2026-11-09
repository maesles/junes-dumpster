/**
 * Reader mode: on by default, remembered per visitor.
 *
 * The `@quartz-community/reader-mode` plugin renders the toolbar button but
 * keeps its on/off state in a private variable initialised to `false`, and
 * re-asserts that on every `nav`. Forcing its attribute on would desync the
 * button (first click does nothing, second turns it off while showing on).
 * So this plugin owns the state instead:
 *
 *  - it intercepts clicks on the plugin's own `.readermode` button in the
 *    capture phase, so the plugin's handler never touches the attribute, and
 *  - it decides `:root[reader-mode]` itself from localStorage, defaulting to on.
 *
 * The reader-mode plugin's stylesheet (`:root[reader-mode="on"] .sidebar {
 * opacity: 0 }`) does the actual visual work, so no CSS is duplicated here.
 * Requires `@quartz-community/reader-mode` to be enabled.
 */

import { jsx } from "preact/jsx-runtime"
import { CSS } from "./styles.js"

const STORAGE_KEY = "readerMode:enabled"

/**
 * Runs in `beforeDOMLoaded` (emitted into prescript.js, loaded in <head>) so
 * `:root[reader-mode]` is set before the body is parsed. That avoids the flash
 * of visible sidebars on first paint, which is what happens if the attribute is
 * only applied after the DOM is ready.
 */
export const PRESCRIPT = `
(function () {
  try {
    var v = localStorage.getItem("readerMode:enabled");
    var on = v === "true" ? true : v === "false" ? false : true;
    document.documentElement.setAttribute("reader-mode", on ? "on" : "off");
  } catch (e) {
    document.documentElement.setAttribute("reader-mode", "on");
  }
})();
`

export const SCRIPT = `
(function () {
  var KEY = "readerMode:enabled";

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === "true") return true;
      if (v === "false") return false;
    } catch (e) {}
    return null;
  }

  function isOn() {
    var s = stored();
    return s === null ? true : s;
  }

  function paint(on) {
    document.documentElement.setAttribute("reader-mode", on ? "on" : "off");
  }

  // Capture phase, so this runs before the reader-mode plugin's bubble-phase
  // listener and can stop it from touching the attribute.
  function intercept(event) {
    var target = event.target;
    if (!target || !target.closest) return;
    var button = target.closest(".readermode");
    if (!button) return;
    event.stopImmediatePropagation();
    event.preventDefault();
    var next = document.documentElement.getAttribute("reader-mode") !== "on";
    paint(next);
    try {
      localStorage.setItem(KEY, next ? "true" : "false");
    } catch (e) {}
    button.setAttribute("aria-pressed", next ? "true" : "false");
  }

  function syncButton() {
    var on = document.documentElement.getAttribute("reader-mode") === "on";
    var buttons = document.querySelectorAll(".readermode");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
  }

  function setup() {
    paint(isOn());
    syncButton();
  }

  // The reader-mode plugin ships a 200ms opacity transition on the sidebars, so
  // any change to the attribute animates. For the *initial* paint that reads as
  // a slow fade-in of the fade. Suppress transitions until after the first
  // frame, then allow them, so deliberate toggles still animate.
  function suppressInitialTransition() {
    var html = document.documentElement;
    if (html.hasAttribute("data-reader-mode-settled")) return;
    html.setAttribute("data-reader-mode-loading", "");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        html.removeAttribute("data-reader-mode-loading");
        html.setAttribute("data-reader-mode-settled", "");
      });
    });
  }

  // Attached once for the page lifetime; capture listeners on document survive
  // SPA navigation.
  if (!window.__readerModeDefaultBound) {
    window.__readerModeDefaultBound = true;
    document.addEventListener("click", intercept, true);
  }

  suppressInitialTransition();

  document.addEventListener("nav", setup);
  document.addEventListener("render", setup);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();
`

const ReaderModeDefault = (() => {
  const Component = () =>
    jsx("span", { "data-reader-mode-default": "", hidden: true, "aria-hidden": "true" })

  Component.beforeDOMLoaded = PRESCRIPT
  Component.afterDOMLoaded = SCRIPT
  Component.css = CSS

  const constructor = () => Component
  constructor.beforeDOMLoaded = PRESCRIPT
  constructor.afterDOMLoaded = SCRIPT
  constructor.css = CSS

  return constructor
})()

export { ReaderModeDefault }
export default ReaderModeDefault
