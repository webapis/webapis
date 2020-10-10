const path = require("path");
import copy from "rollup-plugin-copy";
const production = !process.env.ROLLUP_WATCH;
export default [
  //production
  production &&
    copy({
      targets: [
        {
          //bootstrap.min.js
          src: path.resolve(
            __dirname + "/rollup/html-template/prod/index.html"
          ),
          dest: path.resolve(
            __dirname + `/builds/${process.env.outputAppName}/build`
          ),
        },
      ],
    }),
  //development
  !production &&
    copy({
      targets: [
        {
          //preact
          src: path.resolve(__dirname + "/rollup/html-template/dev/index.html"),
          dest: path.resolve(
            __dirname + `/builds/${process.env.outputAppName}/build`
          ),
        },
      ],
    }),
];
