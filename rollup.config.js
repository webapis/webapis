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
    input: `client/apps/${process.env.appName}/index.js`,
    external: externals,
    output: [
      {
        dir: `builds/${process.env.appName}/build`,
        format: "es",
        sourcemap: "inline",
      },
    ],
    plugins: [
      del({ targets: `builds/${process.env.appName}/build/*` }),

      !production &&
        copy({
          targets: [
            {
              src: "assets/libs/dev/**",
              dest: `builds/${process.env.appName}/build`,
            },
            {
              src: "config/rollup/html-template/dev/index.html",
              dest: `builds/${process.env.appName}/build`,
            },
          ],
        }),
      production &&
        copy({
          targets: [
            {
              src: "assets/libs/prod/**",
              dest: `builds/${process.env.appName}/build`,
            },
            {
              src: "config/rollup/html-template/prod/index.html",
              dest: `builds/${process.env.appName}/build`,
            },
          ],
        }),
      ...commonPlugins,
      copy({
        targets: [
          {
            src: "assets/sounds/**",
            dest: `builds/${process.env.appName}/build`,
          },
          {
            src: "client/features/app-monitor/client-error.js",
            dest: `builds/${process.env.appName}/build`,
          },
          {
            src: "assets/manifest/**",
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
  //     // htmlTemplate({
  //     //   template: "config/rollup/html-template/changepassword.html",
  //     //   target: `builds/${process.env.appName}/build/changepassword.html`,
  //     //   attrs: ['type="module"'],
  //     // }),
  //     serve({
  //       contentBase: `builds/${process.env.appName}/build/`,
  //       openPage: "/changepassword.html",
  //       port: 10002,
  //       open: false,
  //     }),
  //   ],
  // },

  // {
  //   input: `client/storybook/index.js`,
  //   external: externals,
  //   output: [
  //     {
  //       dir: `client/storybook/build`,
  //       format: "es",
  //       sourcemap: "inline",
  //     },
  //   ],
  //   plugins: [
  //     del({ targets: `client/storybook/build/*` }),

  //     !production &&
  //       copy({
  //         targets: [
  //           { src: "assets/libs/dev/**", dest: `client/storybook/build` },
  //           {
  //             src: "config/rollup/html-template/dev/index.html",
  //             dest: `client/storybook/build`,
  //           },
  //         ],
  //       }),
  //     production &&
  //       copy({
  //         targets: [
  //           { src: "assets/libs/prod/**", dest: `client/storybook/build` },
  //           {
  //             src: "config/rollup/html-template/prod/index.html",
  //             dest: `client/storybook/build`,
  //           },
  //         ],
  //       }),
  //     ...commonPlugins,
  //     copy({
  //       targets: [
  //         { src: "assets/manifest/**", dest: `client/storybook/build` },

  //         {
  //           src: "config/rollup/html-template/index.html",
  //           dest: `client/storybook/build/`,
  //         },
  //       ],
  //     }),

  //     serve({
  //       contentBase: `client/storybook/build/`,
  //       openPage: "/index.html",
  //       port: 10004,
  //       open: true,
  //     }),
  //   ],
  // },
];
