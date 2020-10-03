const mongoUrl = "mongodb://localhost:27017";
const url = "https://localhost:3007";
const { MongoClient } = require("mongodb");
const jestPuppeteerConfig = require("../jest-puppeteer.config");
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
    const berosPage = await browser.newPage();
    const demosPage = await browser.newPage();

    await berosPage.goto(url, { waitUntil: "networkidle2" });
    await demosPage.goto(url, { waitUntil: "networkidle2" });
    await berosPage.bringToFront();
    //navbar-toggler
    await berosPage.click(".navbar-toggler");
    await berosPage.click("#signup");
    await berosPage.waitFor(".show");
    await berosPage.click(".navbar-toggler");

    await berosPage.type("#username", "berouser");
    await berosPage.type("#email", "berouser@gmail.com");
    await berosPage.type("#password", "Testfly1977!");
    await berosPage.click("#signup-btn");

    await demosPage.bringToFront();

    // await demosPage.goto(url, { waitUntil: "networkidle2" });
    // await demosPage.click(".navbar-toggler");
    // await demosPage.click("#signup");
    // await demosPage.waitFor(".show");
    // await demosPage.click(".navbar-toggler");
    // await demosPage.type("#username", "demouser");
    // await demosPage.type("#email", "demouser@gmail.com");
    // await demosPage.type("#password", "Testfly1977!");
    // await demosPage.click("#signup-btn");

    // //berouser send invitation
    // await berosPage.type("input[data-testid=user-search-input]", "demouser");
    // await berosPage.click("button[data-testid=user-search-button]");
    // await berosPage.waitForSelector("a[data-testid=demouser]");
    // await berosPage.click("a[data-testid=demouser]");
    // await berosPage.waitForSelector("div[data-testid=invite-ui]");
    // await berosPage.click("button[data-testid=oninvite-btn]");

    // //demouser accepts invitation
    // await demosPage.waitForFunction(
    //   'document.querySelector("span[data-testid=message-count]").innerText.includes("1")'
    // );
    // await demosPage.click("a[data-testid=unread-link]");
    // await demosPage.waitForSelector("ul[data-testid=unread-ui]");
    // await demosPage.waitForSelector("li[data-testid=berouser]");
    // await demosPage.click("li[data-testid=berouser]");
    // await demosPage.waitForSelector("div[data-testid=hangchat-ui]");
    // await demosPage.click("button[data-testid=accept-btn]");

    // await berosPage.waitForSelector("div[data-testid=hangchat-ui]");
    // await berosPage.type(
    //   "input[data-testid=message-input]",
    //   "Hello bero. how are you ?"
    // );
    // await berosPage.click("button[data-testid=send-btn]");
  });
});
