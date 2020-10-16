const path = require("path");

import del from "rollup-plugin-delete";
//import babel from "@rollup/plugin-babel";
import commonPlugins from "./commonPlugins";
import externals from "./externals";
import buildLibraries from "./build-libraries";
import buildTimeEnv from "./build-environments";

import copyHtml from "./copy-html";
import replaceLibraries from "./replace-libraries";
import copyAssets from "./copy-assets";
//import copyHtml from './copy-html'
const production = !process.env.ROLLUP_WATCH;

export default {
  input: `client/apps/${process.env.appName}/index.js`,
  external: externals,
  output: [
    {
      dir: `builds/${process.env.outputAppName}/build`,
      format: "es",
      sourcemap: true,
      plugins: [...replaceLibraries],
    },
  ],
  plugins: [
    del({
      targets: [
        `builds/${process.env.outputAppName}/build/*.js`,
        `builds/${process.env.outputAppName}/build/*.map`,
      ],
    }),
    //  babel({ babelHelpers: 'bundled' }),
    ...buildTimeEnv,
    ...copyHtml,
    ...commonPlugins,
    ...copyAssets,
  ],
};
