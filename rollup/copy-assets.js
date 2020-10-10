const path = require("path");
import copy from "rollup-plugin-copy";
const production = !process.env.ROLLUP_WATCH;
export default [
  //common
  copy({
    targets: [
      {
        //manifest
        src: path.resolve(__dirname + "/assets/manifest/**"),
        dest: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
      },
    ],
  }),
];
