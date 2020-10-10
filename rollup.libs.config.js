require("dotenv").config();

import buildLibraries from "./rollup/build-libraries";

const production = !process.env.ROLLUP_WATCH;

export default [...buildLibraries];
