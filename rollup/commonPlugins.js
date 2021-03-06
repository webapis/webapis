require("dotenv").config();
const path = require("path");
import image from "@rollup/plugin-image";
//import serve from "rollup-plugin-serve";
//import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
//import copy from "rollup-plugin-copy";
import alias from "rollup-plugin-alias";
const production = !process.env.ROLLUP_WATCH;
export default [
  alias({
    entries: [
      {
        find: "controls",
        replacement: path.resolve(__dirname + "/client/components/controls"),
      },
      {
        find: "features",
        replacement: path.resolve(__dirname + "/client/features"),
      },
      {
        find: "components",
        replacement: path.resolve(__dirname + "/client/components"),
      },
      {
        find: "icons",
        replacement: path.resolve(__dirname + "/client/components/icons"),
      },
      { find: "server", replacement: path.resolve(__dirname + "/server") },
    ],
  }),
  image(),
  production && terser(),
  replace({
    PREACT_APP_BACK: process.env.PREACT_APP_BACK
      ? `${JSON.stringify(process.env.PREACT_APP_BACK)}`
      : "PREACT_APP_PARSE",
  }),

  replace({
    ip: JSON.stringify(process.env.ip),
    PORT: JSON.stringify(process.env.PORT),
    //  HOST: process.env.NODE_ENV==='production' ? location.origin.replace(/^http/, 'ws') :'wss//localhost:3000'
  }),
  !production &&
    replace({
      "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js":
        "https://localhost:3000/fetch.js",
      "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js":
        "https://localhost:3000/preact.module.js",
      "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js":
        "https://localhost:3000/htm.module.js",
      "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/preact.combat.cdn.js":
        "https://localhost:3000/preact.combat.dev.cdn.js",
      "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js":
        "https://localhost:3000/hooks.dev.cdn.js",
    }),
];
