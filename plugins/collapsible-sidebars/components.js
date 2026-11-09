import { jsx } from "preact/jsx-runtime"

/**
 * Sidebar toggle behaviour.
 *
 * Rendered as an empty node: it exists only to contribute `afterDOMLoaded`.
 * Frames can ship CSS (`PageFrame.css`) but not scripts, so the click handling
 * for `CollapsibleSidebarsFrame` lives here, where Quartz does collect
 * component scripts.
 */

const STORAGE = { left: "collapsibleSidebars:left", right: "collapsibleSidebars:right" }

export const SCRIPT = `
(function () {
  var STORAGE = { left: "collapsibleSidebars:left", right: "collapsibleSidebars:right" };

  function read(side) {
    try {
      return localStorage.getItem(STORAGE[side]) === "true";
    } catch (e) {
      return false;
    }
  }

  function write(side, value) {
    try {
      localStorage.setItem(STORAGE[side], value ? "true" : "false");
    } catch (e) {}
  }

  function setup() {
    var root = document.querySelector('#quartz-root[data-frame="collapsible-sidebars"]');
    if (!root) return;
    var body = root.querySelector("#quartz-body");
    if (!body) return;

    body.setAttribute("data-left-collapsed", read("left") ? "true" : "false");
    body.setAttribute("data-right-collapsed", read("right") ? "true" : "false");

    var cleanups = [];
    var buttons = body.querySelectorAll("[data-sidebar-toggle]");

    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var listener = function () {
        var side = this.getAttribute("data-sidebar-toggle");
        var attr = "data-" + side + "-collapsed";
        var next = body.getAttribute(attr) !== "true";
        body.setAttribute(attr, next ? "true" : "false");
        write(side, next);

        var same = body.querySelectorAll('[data-sidebar-toggle="' + side + '"]');
        for (var j = 0; j < same.length; j++) {
          var el = same[j];
          // The in-sidebar toggle reports expanded state; the rail is the inverse.
          var isRail = el.classList.contains("sidebar-rail");
          el.setAttribute("aria-expanded", (isRail ? next : !next) ? "true" : "false");
        }
      };
      btn.addEventListener("click", listener);
      cleanups.push(
        (function (b, l) {
          return function () {
            b.removeEventListener("click", l);
          };
        })(btn, listener)
      );
    }

    if (window.addCleanup) {
      window.addCleanup(function () {
        for (var k = 0; k < cleanups.length; k++) cleanups[k]();
      });
    }
  }

  document.addEventListener("nav", setup);
  document.addEventListener("render", setup);
})();
`

/** Renders nothing; the value is in the attached script. */
const SidebarToggleScript = (() => {
  const Component = () =>
    jsx("span", { "data-collapsible-sidebars": "", hidden: true, "aria-hidden": "true" })

  Component.afterDOMLoaded = SCRIPT

  const constructor = () => Component
  constructor.afterDOMLoaded = SCRIPT
  constructor.css = undefined

  return constructor
})()

export { SidebarToggleScript }
export default SidebarToggleScript
