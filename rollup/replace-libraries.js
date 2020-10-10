const path = require("path");
import replace from "@rollup/plugin-replace";

const production = !process.env.ROLLUP_WATCH;
export default [
  replace({
    //  "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js": `https://localhost:${process.env.PORT}/fetch.js`,
    preact: `https://localhost:${process.env.PORT}/libs/preact.module.js`,
    "htm.module": `https://localhost:${process.env.PORT}/libs/htm.module.js`,
    "compat.module": `https://localhost:${process.env.PORT}/libs/compat.module.js`,
    "preact/hooks": `https://localhost:${process.env.PORT}/libs/hooks.module.js`,
    "preact/debug": `https://localhost:${process.env.PORT}/libs/debug.module.js`,
    "preact/devtools": `https://localhost:${process.env.PORT}/libs/devtools.module.js`,
  }),
];
