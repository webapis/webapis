// setup.js
const path = require("path");
const fs = require("fs");
const os = require("os");
const mkdirp = require("mkdirp");
const puppeteer = require("puppeteer");

const DIR = path.join(os.tmpdir(), "jest_puppeteer_global_setup");

module.exports = async function () {
  const browserOne = await puppeteer.launch();
  const browserTwo = await puppeteer.launch();
  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  global.__BROWSER_ONE_GLOBAL__ = browserOne;
  global.__BROWSER_TWO_GLOBAL__ = browserTwo;
  // use the file system to expose the wsEndpoint for TestEnvironments
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, "wsEndpoint_one"), browserOne.wsEndpoint());
  fs.writeFileSync(path.join(DIR, "wsEndpoint_two"), browserTwo.wsEndpoint());
};
