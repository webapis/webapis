// puppeteer_environment.js
const fs = require("fs");
const path = require("path");
const os = require("os");
const puppeteer = require("puppeteer");
const NodeEnvironment = require("jest-environment-node");

const DIR = path.join(os.tmpdir(), "jest_puppeteer_global_setup");

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    // get the wsEndpoint
    const wsEndpointOne = fs.readFileSync(
      path.join(DIR, "wsEndpoint_one"),
      "utf8"
    );
    if (!wsEndpointOne) {
      throw new Error("wsEndpointOne not found");
    }

    // connect to puppeteer
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpointOne,
    });
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment;
