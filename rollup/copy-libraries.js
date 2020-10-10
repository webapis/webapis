const path = require("path");
import copy from "rollup-plugin-copy";
const production = !process.env.ROLLUP_WATCH;
export default [
  //common
  copy({
    targets: [
      {
        //preact
        src: path.resolve(
          __dirname + "/node_modules/preact/dist/preact.module.js"
        ),
        dest: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
      },
      {
        //preact
        src: path.resolve(
          __dirname + "/node_modules/preact/dist/preact.module.js.map"
        ),
        dest: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
      },
      {
        //htm
        src: path.resolve(__dirname + "/node_modules/htm/dist/htm.module.js"),
        dest: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
      },
      {
        //jquery.slim.min.js
        src: path.resolve(
          __dirname + "/node_modules/jquery/dist/jquery.slim.min.js"
        ),
        dest: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
      },
      {
        //jquery.slim.min.js.map
        src: path.resolve(
          __dirname + "/node_modules/jquery/dist/jquery.slim.min.js.map"
        ),
        dest: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
      },
      {
        //popper.js
        src: path.resolve(
          __dirname + "/node_modules/@popperjs/core/dist/esm/popper.js"
        ),
        dest: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
      },
      {
        //webrtc.adapter.js
        src: path.resolve(
          __dirname + "/node_modules/webrtc-adapter/dist/adapter_core.js"
        ),
        dest: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
      },
      {
        src: path.resolve(
          __dirname + "/client/features/app-monitor/client-error.js"
        ),
        dest: path.resolve(
          __dirname + `/builds/${process.env.outputAppName}/build`
        ),
      },
    ],
  }),
  //production
  production &&
    copy({
      targets: [
        {
          //bootstrap.min.js
          src: path.resolve(
            __dirname + "/node_modules/bootstrap/dist/js/bootstrap.min.js"
          ),
          dest: path.resolve(
            __dirname + `/builds/${process.env.outputAppName}/build`
          ),
        },
        {
          //bootstrap.min.js.map
          src: path.resolve(
            __dirname + "/node_modules/bootstrap/dist/js/bootstrap.min.js.map"
          ),
          dest: path.resolve(
            __dirname + `/builds/${process.env.outputAppName}/build`
          ),
        },
        {
          //bootstrap.min.css
          src: path.resolve(
            __dirname + "/node_modules/bootstrap/dist/css/bootstrap.min.css"
          ),
          dest: path.resolve(
            __dirname + `/builds/${process.env.outputAppName}/build`
          ),
        },
        {
          //bootstrap.min.css.map
          src: path.resolve(
            __dirname + "/node_modules/bootstrap/dist/css/bootstrap.min.css.map"
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
          src: path.resolve(
            __dirname + "/node_modules/preact/dist/preact.module.js"
          ),
          dest: path.resolve(
            __dirname + `/builds/${process.env.outputAppName}/build`
          ),
        },
        {
          //preact
          src: path.resolve(
            __dirname + "/node_modules/preact/dist/preact.module.js.map"
          ),
          dest: path.resolve(
            __dirname + `/builds/${process.env.outputAppName}/build`
          ),
        },

        {
          //bootstrap js
          src: path.resolve(
            __dirname + "/node_modules/bootstrap/dist/js/bootstrap.js"
          ),
          dest: path.resolve(
            __dirname + `/builds/${process.env.outputAppName}/build`
          ),
        },
        {
          //bootstrap.js
          src: path.resolve(
            __dirname + "/node_modules/bootstrap/dist/js/bootstrap.js.map"
          ),
          dest: path.resolve(
            __dirname + `/builds/${process.env.outputAppName}/build`
          ),
        },
        {
          //bootstrap.css
          src: path.resolve(
            __dirname + "/node_modules/bootstrap/dist/css/bootstrap.css"
          ),
          dest: path.resolve(
            __dirname + `/builds/${process.env.outputAppName}/build`
          ),
        },
        {
          //bootstrap.css.map
          src: path.resolve(
            __dirname + "/node_modules/bootstrap/dist/css/bootstrap.css.map"
          ),
          dest: path.resolve(
            __dirname + `/builds/${process.env.outputAppName}/build`
          ),
        },
        {
          //whatwg-fetch
          src: path.resolve(
            __dirname + "/node_modules/whatwg-fetch/dist/fetch.umd.js"
          ),
          dest: path.resolve(
            __dirname + `/builds/${process.env.outputAppName}/build`
          ),
        },
      ],
    }),
];
