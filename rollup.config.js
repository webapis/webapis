require("dotenv").config();
const path = require("path");
import image from "@rollup/plugin-image";
import serve from "rollup-plugin-serve";
import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import copy from "rollup-plugin-copy";
import alias from "rollup-plugin-alias";
import commonPlugins from "./rollup/commonPlugins";
import externals from "./rollup/externals";
const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: `assets/libs/dev/build-required/hooks.dev.cdn.js`,

    output: [
      {
        dir: `builds/${process.env.outputAppName}/build`,
        format: "es",
        // sourcemap: "inline",
      },
    ],
    plugins: [
      ...commonPlugins,
      del({ targets: `builds/${process.env.outputAppName}/build/*` }),
    ],
  },
  {
    input: `assets/libs/dev/build-required/preact.combat.dev.cdn.js`,

    output: [
      {
        dir: `builds/${process.env.outputAppName}/build`,
        format: "es",
        // sourcemap: "inline",
      },
    ],
    plugins: commonPlugins,
  },
  {
    input: `client/apps/${process.env.appName}/index.js`,
    external: externals,
    output: [
      {
        dir: `builds/${process.env.outputAppName}/build`,
        format: "es",
        sourcemap: "inline",
      },
    ],
    plugins: [
      !production &&
        copy({
          targets: [
            {
              src: "assets/libs/dev/build-not-required/**",
              dest: `builds/${process.env.outputAppName}/build`,
            },
            {
              src: "config/rollup/html-template/dev/index.html",
              dest: `builds/${process.env.outputAppName}/build`,
            },
          ],
        }),
      production &&
        copy({
          targets: [
            {
              src: "assets/libs/dev/build-not-required/**",
              dest: `builds/${process.env.outputAppName}/build`,
            },
            {
              src: "config/rollup/html-template/prod/index.html",
              dest: `builds/${process.env.outputAppName}/build`,
            },
          ],
        }),
      ...commonPlugins,
      copy({
        targets: [
          {
            src: "assets/sounds/**",
            dest: `builds/${process.env.outputAppName}/build`,
          },
          {
            src: "client/features/app-monitor/client-error.js",
            dest: `builds/${process.env.outputAppName}/build`,
          },
          {
            src: "assets/manifest/**",
            dest: `builds/${process.env.outputAppName}/build`,
          },
        ],
      }),
      serve({
        contentBase: `builds/${process.env.outputAppName}/build/`,
        openPage: "/index.html",
        port: 10001,
        open: false,
      }),
    ],
  },
];
