const puppeteer = require("puppeteer-core");
const test = require("ava");
const assert = require("assert");
const withPage = require("./test/_withPage");

const mongoUrl = "mongodb://localhost:27017";
const url = "https://localhost:3007";
const { MongoClient } = require("mongodb");
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

test.before(async (t) => {
  try {
    const client = await new MongoClient(mongoUrl, {
      useUnifiedTopology: true,
    });
    await client.connect();
    const collectionName = "users";
    const database = await client.db("auth");
    const collection = database.collection(collectionName);
    await collection.deleteMany({});

    const { browser: berosBrowser, page: berosPage } = await createPage({
      options: BeroslaunchOptions,
    });
    const { browser: demosBrowser, page: demosPage } = await createPage({
      options: DemoslaunchOptions,
    });
    t.context = {
      berosBrowser,
      demosBrowser,
      berosPage,
      demosPage,
    };
  } catch (error) {
    let err = error;
    debugger;
  }
});
test.after((t) => {
  t.context.berosBrowser.close();
  t.context.demosBrowser.close();
  t.context.berosPage.close();
  t.context.demosPage.close();
});

// test("bar", async (t) => {
//   const bar = Promise.resolve("bar");
//   t.is(await bar, "bar");
// });
test('page title should contain "Document"', async (t) => {
  // //navbar-toggler

  await page.waitForSelector(".navbar-toggler");

  await t.context.berosPage.waitForSelector(".navbar-toggler");
  await t.context.berosPage.click(".navbar-toggler");

  await t.context.berosPage.waitForSelector("#signup");

  await t.context.berosPage.click("#signup");

  await t.context.berosPage.click(".navbar-toggler");
  await t.context.berosPage.waitForSelector("#username");
  // debugger;
  await t.context.berosPage.type("#username", "berouser");

  await t.context.berosPage.type("#email", "berouser@gmail.com");
  await t.context.berosPage.type("#password", "Testfly1977!");
  await t.context.berosPage.click("#signup-btn");
  //await t.context.demosPage.goto(url, { waitUntil: "networkidle2" });

  await t.context.demosPage.click(".navbar-toggler");
  await t.context.demosPage.waitForSelector("#signup");

  await t.context.demosPage.click("#signup");
  await t.context.demosPage.click(".navbar-toggler");
  await t.context.demosPage.waitForSelector("#username");
  await t.context.demosPage.type("#username", "demouser");
  await t.context.demosPage.type("#email", "demouser@gmail.com");
  await t.context.demosPage.type("#password", "Testfly1977!");
  await t.context.demosPage.click("#signup-btn");

  // //berouser send invitation
  await t.context.demosPage.waitForSelector(
    "input[data-testid=user-search-input]"
  );
  await t.context.berosPage.type(
    "input[data-testid=user-search-input]",
    "demouser"
  );
  await t.context.berosPage.click("button[data-testid=user-search-button]");
  await t.context.berosPage.waitForSelector("a[data-testid=demouser]");
  await t.context.berosPage.click("a[data-testid=demouser]");
  debugger;
  await t.context.berosPage.waitForSelector("div[data-testid=invite-ui]");
  await t.context.berosPage.click("button[data-testid=oninvite-btn]");
  debugger;
  // //demouser accepts invitation
  await t.context.demosPage.waitForFunction(
    'document.querySelector("span[data-testid=message-count]").innerText.includes("1")'
  );
  // await demosPage.click("a[data-testid=unread-link]");
  // await demosPage.waitForSelector("ul[data-testid=unread-ui]");
  // await demosPage.waitForSelector("li[data-testid=berouser]");
  // await demosPage.click("li[data-testid=berouser]");
  // await demosPage.waitForSelector("div[data-testid=hangchat-ui]");
  // await demosPage.click("button[data-testid=accept-btn]");

  // //berouser sees new unread message
  // //berouser opens unread new message
  // await berosPage.waitForFunction(
  //   'document.querySelector("span[data-testid=message-count]").innerText.includes("1")'
  // );
  // await berosPage.click("a[data-testid=unread-link]");
  // await berosPage.waitForSelector("ul[data-testid=unread-ui]");
  // await berosPage.waitForSelector("li[data-testid=demouser]");
  // await berosPage.click("li[data-testid=demouser]");

  //hangchat-ui visible
  //berouser types a message
  //berouser sends a message to demouser
  // await berosPage.waitForSelector("div[data-testid=hangchat-ui]");
  // await berosPage.type(
  //   "input[data-testid=message-input]",
  //   "Hello bero. how are you ?"
  // );
  // await berosPage.click("button[data-testid=send-btn]");

  t.true(true);
});
