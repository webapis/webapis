require("dotenv").config();
const path = require("path");
//import image from "@rollup/plugin-image";
import serve from "rollup-plugin-serve";
import del from "rollup-plugin-delete";
//import { terser } from "rollup-plugin-terser";
//import replace from "@rollup/plugin-replace";
import copy from "rollup-plugin-copy";
//import alias from "rollup-plugin-alias";
import commonPlugins from "./rollup/storybookPlugins";
import externals from "./rollup/externals";
const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "storybook/index.js",
    external: externals,
    output: [
      {
        dir: `storybook/build`,
        format: "es",
        sourcemap: "inline",
      },
    ],
    plugins: [
      del({ targets: `storybook/build/*` }),
      copy({
        targets: [
          { src: "assets/libs/storybook/**", dest: `storybook/build` },
          {
            src: "config/rollup/html-template/storybook/index.html",
            dest: `storybook/build`,
          },
        ],
      }),

      ...commonPlugins,
      copy({
        targets: [
          { src: "assets/manifest/**", dest: `storybook/build` },

          {
            src: "config/rollup/html-template/index.html",
            dest: `storybook/build/`,
          },
        ],
      }),

      serve({
        contentBase: `storybook/build/`,
        openPage: "/index.html",
        port: 10004,
        open: true,
      }),
    ],
  },
];
