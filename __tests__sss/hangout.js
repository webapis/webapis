const puppeteer = require("puppeteer-core");
const mongoUrl = "mongodb://localhost:27017";
const url = "https://localhost:3007";
const { MongoClient } = require("mongodb");
const jestPuppeteerConfig = require("../jest-puppeteer.config");
let BeroslaunchOptions = {
  slowMo: 5,
  isMobile: true,
  headless: false,
  ignoreHTTPSErrors: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--window-position=0,0",
    "--window-size=300,800",
    "--allow-insecure-localhost",
  ],
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // because we are using puppeteer-core so we must define this option
};

let DemoslaunchOptions = {
  slowMo: 5,
  isMobile: true,
  headless: false,
  ignoreHTTPSErrors: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--window-position=550,0",
    "--window-size=300,800",
    "--allow-insecure-localhost",
  ],
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // because we are using puppeteer-core so we must define this option
};

async function createPage({ options }) {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  await page.setViewport({
    width: 500,
    height: 800,
    isMobile: true,
    deviceScaleFactor: 1,
  });
  await page.goto(url, { waitUntil: "networkidle2" });

  return { browser, page };
}

describe("Google", () => {
  let client;
  let database;
  beforeAll(async () => {
    try {
      client = await new MongoClient(mongoUrl, {
        useUnifiedTopology: true,
      });
      await client.connect();
      const collectionName = "users";
      database = await client.db("auth");
      const collection = database.collection(collectionName);
      await collection.deleteMany({});
    } catch (error) {
      let err = error;
      debugger;
    }
  });
  afterAll(() => {
    try {
    } catch (error) {
    } finally {
      client.close();
      database.close();
    }
  });
  it("should be titled Google", async () => {
    const { browser: berosBrowser, page: berosPage } = await createPage({
      options: BeroslaunchOptions,
    });
    const { browser: demosBrowser, page: demosPage } = await createPage({
      options: DemoslaunchOptions,
    });
    await berosPage.waitForSelector(".navbar-toggler");

    await berosPage.waitForSelector(".navbar-toggler");
    await berosPage.click(".navbar-toggler");

    await berosPage.waitForSelector("#signup");

    await berosPage.click("#signup");

    await berosPage.click(".navbar-toggler");
    await berosPage.waitForSelector("#username");
    // debugger;
    await berosPage.type("#username", "berouser");

    await berosPage.type("#email", "berouser@gmail.com");
    await berosPage.type("#password", "Testfly1977!");
    await berosPage.click("#signup-btn");
    //await t.context.demosPage.goto(url, { waitUntil: "networkidle2" });

    await demosPage.click(".navbar-toggler");
    await demosPage.waitForSelector("#signup");

    await demosPage.click("#signup");
    await demosPage.click(".navbar-toggler");
    await demosPage.waitForSelector("#username");
    await demosPage.type("#username", "demouser");
    await demosPage.type("#email", "demouser@gmail.com");
    await demosPage.type("#password", "Testfly1977!");
    await demosPage.click("#signup-btn");

    // //berouser send invitation
    await demosPage.waitForSelector("input[data-testid=user-search-input]");
    await berosPage.type("input[data-testid=user-search-input]", "demouser");
  });
});
