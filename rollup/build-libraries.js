const path = require("path");
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";
import externals from "./externals";
import replaceLabraries from "./replace-libraries";
import buildEnv from "./build-environments";
import copyLibraries from "./copy-libraries";
import copyAssets from "./copy-assets";
//import commonPlugins from "./rollup/commonPlugins";
const production = !process.env.ROLLUP_WATCH;

export default [
  //hooks
  {
    input: path.resolve(
      __dirname + "/node_modules/preact/hooks/dist/hooks.module.js"
    ),
    external: externals,
    output: [
      {
        dir: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
        format: "es",
        plugins: [...buildEnv, ...replaceLabraries],
        sourcemap: true,
      },
    ],
    plugins: [
      // del({ targets: `builds/${process.env.outputAppName}/build/*` }),
      // copy({
      //   targets: [
      //     {
      //       //preact
      //       src: path.resolve(
      //         __dirname + "/node_modules/preact/hooks/dist/hooks.module.js.map"
      //       ),
      //       dest: path.resolve(
      //         __dirname + `/builds/${process.env.outputAppName}/build`
      //       ),
      //     },
      //   ],
      // }),
    ],
  },
  //combat
  {
    input: path.resolve(
      __dirname + "/node_modules/preact/compat/dist/compat.module.js"
    ),
    external: externals,
    output: [
      {
        dir: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
        format: "es",
        sourcemap: true,
        plugins: [...buildEnv, ...replaceLabraries],
      },
    ],
  },
  {
    //preact/debug
    input: path.resolve(
      __dirname + "/node_modules/preact/debug/dist/debug.module.js"
    ),
    external: externals,
    output: [
      {
        dir: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
        format: "es",
        sourcemap: true,
        plugins: [...buildEnv, ...replaceLabraries],
      },
    ],
  },
  {
    //preact/devtools
    input: path.resolve(
      __dirname + "/node_modules/preact/devtools/dist/devtools.module.js"
    ),
    external: externals,
    output: [
      {
        dir: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
        format: "es",
        sourcemap: true,
        plugins: [...buildEnv, ...replaceLabraries],
      },
    ],
  },
];
