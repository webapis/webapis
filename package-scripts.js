const { crossEnv, series, concurrent } = require("nps-utils");
var client = crossEnv(
  "appName=webcom-app PREACT_APP_BACK=PREACT_APP_NODEJS  rollup -c -w"
);
var server = crossEnv(
  "appName=webcom-app PREACT_APP_BACK=PREACT_APP_NODEJS nodemon   server/index.js"
);
var cy =
  "cyp --spec cypress/integration/auth/1_Signup_client_side_validation_spec.js";
module.exports = {
  scripts: {
    cyTest: concurrent({
      server: {
        script:
          crossEnv(
            "appName=webcom-app PREACT_APP_BACK=PREACT_APP_NODEJS nodemon "
          ) + "server/index.js",
      },
      client: {
        script: crossEnv(
          "appName=webcom-app PREACT_APP_BACK=PREACT_APP_NODEJS  rollup -c -w"
        ),
      },
      cy: {
        script: "cypress run --headless  --spec cypress/integration/auth/**/*",
      },
    }),
    // server: {
    //   default: 'crossEnv appName=webcom-app PREACT_APP_BACK=PREACT_APP_NODEJS nodemon   server/index.js',
    //   watch: 'onchange "server/**/*.js" -- npm run node'
    // },
    // dev: 'nps "client npm run server"',
    // cypress: {
    //   open: 'npx cypress open back=parse'
    // },
    // cyhead: 'crossEnv appName=webcom-app PREACT_APP_BACK=PREACT_APP_NODEJS nodemon   server/index.js',
    // cy: {

    //   run: ' cypress run --spec cypress/integration/auth/1_Signup_client_side_validation_spec.js'
    // },
    // build: 'crossEnv appName=webcom-app rollup -c',
    // test: 'echo "Error: no test specified" && exit 1',
    // webcom: {
    //   client: 'crossEnv appName=webcom-app rollup -c -w ',
    //   node: '(crossEnv appName=webcom-app PREACT_APP_BACK=PREACT_APP_NODEJS nodemon   server/index.js) && npm run (cross-env appName=webcom-app PREACT_APP_BACK=PREACT_APP_NODEJS  rollup -c -w )',
    //   parse: 'concurrently "crossEnv appName=webcom-app PREACT_APP_BACK=\'PREACT_APP_PARSE\'  nodemon --exec babel-node server/index.js" " cross-env appName=webcom-app PREACT_APP_BACK=PREACT_APP_PARSE rollup -c -w " " parse-dashboard --config dashboard-config.json " '
    // },
    // webparse: {
    //   client: 'crossEnv appName=webparse-app rollup -c -w '
    // }
  },
};
