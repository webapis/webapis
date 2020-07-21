require("dotenv").config();
const path = require("path");
import image from "@rollup/plugin-image";
import serve from "rollup-plugin-serve";
import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import copy from "rollup-plugin-copy";
import alias from "@rollup/plugin-alias";
import cleanup from "rollup-plugin-cleanup";
const production = !process.env.ROLLUP_WATCH;

const externals = [
  "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js",
  "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js",
  "https://cdn.jsdelivr.net/gh/webapis/webapis/preact.combat.cdn.js",
  "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js",
  "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js",
];

const commonPlugins = [
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
  production && cleanup(),
  replace({
    PREACT_APP_BACK: process.env.PREACT_APP_BACK
      ? `${JSON.stringify(process.env.PREACT_APP_BACK)}`
      : "PREACT_APP_PARSE",
  }),
  replace({
    ip: JSON.stringify(process.env.ip),
  }),
];

export default [
  {
    input: `client/apps/${process.env.appName}/index.js`,
    external: externals,
    output: [
      {
        dir: `builds/${process.env.appName}/build`,
        format: "es",
        // sourcemap: "inline",
      },
    ],
    plugins: [
      del({ targets: `builds/${process.env.appName}/build/*` }),
      ...commonPlugins,
      copy({
        targets: [
          {
            src: "assets/libs/parse.min.js",
            dest: `builds/${process.env.appName}/build`,
          },
          {
            src: "assets/fonts/Roboto/Roboto-Regular.ttf",
            dest: `builds/${process.env.appName}/build`,
          },
          {
            src: "assets/manifest/**",
            dest: `builds/${process.env.appName}/build`,
          },

          {
            src: "config/rollup/html-template/index.html",
            dest: `builds/${process.env.appName}/build`,
          },
        ],
      }),
      serve({
        contentBase: `builds/${process.env.appName}/build/`,
        openPage: "/index.html",
        port: 10001,
        open: false,
      }),
    ],
  },
  // {
  //   input: `client/features/authentication/change-password/change-password.js`,
  //   output: [
  //     {
  //       dir: `builds/${process.env.appName}/build`,
  //       format: "es",
  //       sourcemap: "inline",
  //     },
  //   ],
  //   plugins: [
  //     ...commonPlugins,
  //     copy({
  //       targets: [
  //         {
  //           src: "assets/libs/parse.min.js",
  //           dest: `builds/${process.env.appName}/build`,
  //         },
  //         {
  //           src: "assets/fonts/Roboto/Roboto-Regular.ttf",
  //           dest: `builds/${process.env.appName}/build`,
  //         },
  //         {
  //           src: "assets/manifest/**",
  //           dest: `builds/${process.env.appName}/build`,
  //         },
  //         {
  //           src: "node_modules/bootstrap/dist/css/bootstrap.min.css",
  //           dest: `builds/${process.env.appName}/build`,
  //         },
  //         {
  //           src: "node_modules/bootstrap/dist/js/bootstrap.min.js",
  //           dest: `builds/${process.env.appName}/build`,
  //         },
  //         //   { src: 'node_modules/bootstrap/js/dist/util.js', dest: `builds/${process.env.appName}/build` },
  //         {
  //           src: "node_modules/jquery/dist/jquery.min.js",
  //           dest: `builds/${process.env.appName}/build`,
  //         },
  //       ],
  //     }),
  //     htmlTemplate({
  //       template: "config/rollup/html-template/changepassword.html",
  //       target: `builds/${process.env.appName}/build/changepassword.html`,
  //       attrs: ['type="module"'],
  //     }),
  //     serve({
  //       contentBase: `builds/${process.env.appName}/build/`,
  //       openPage: "/changepassword.html",
  //       port: 10002,
  //       open: false,
  //     }),
  //   ],
  // },

  {
    input: `client/storybook/index.js`,
    external: externals,
    output: [
      {
        dir: `client/storybook/build`,
        format: "es",
        //  sourcemap: "inline",
      },
    ],
    plugins: [
      del({ targets: `client/storybook/build/*` }),
      ...commonPlugins,
      copy({
        targets: [
          { src: "assets/libs/parse.min.js", dest: `client/storybook/build` },
          {
            src: "assets/fonts/Roboto/Roboto-Regular.ttf",
            dest: `client/storybook/build`,
          },
          { src: "assets/manifest/**", dest: `client/storybook/build` },

          {
            src: "config/rollup/html-template/index.html",
            dest: `client/storybook/build/`,
          },
        ],
      }),

      serve({
        contentBase: `client/storybook/build/`,
        openPage: "/index.html",
        port: 10004,
        open: true,
      }),
    ],
  },
];
