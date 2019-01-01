const test = require("ava");
const assert = require("assert");
const withPage = require("./test/_withPage");

const mongoUrl = "mongodb://localhost:27017";
const url = "https://localhost:3007";
const { MongoClient } = require("mongodb");

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
  } catch (error) {
    let err = error;
    debugger;
  }
});
test.after((t) => {
  debugger;
});

// test("bar", async (t) => {
//   const bar = Promise.resolve("bar");
//   t.is(await bar, "bar");
// });
test(
  'page title should contain "Document"',
  withPage,
  async (t, berosPage, demosPage) => {
    await berosPage.goto(url, { waitUntil: "networkidle2" });
    //navbar-toggler
    await berosPage.click(".navbar-toggler");
    await berosPage.click("#signup");
    await berosPage.waitFor(".show");
    await berosPage.click(".navbar-toggler");
    debugger;
    await berosPage.type("#username", "berouser");
    await berosPage.type("#email", "berouser@gmail.com");
    await berosPage.type("#password", "Testfly1977!");
    await berosPage.click("#signup-btn");

    await demosPage.goto(url, { waitUntil: "networkidle2" });
    await demosPage.click(".navbar-toggler");
    await demosPage.click("#signup");
    await demosPage.waitFor(".show");
    await demosPage.click(".navbar-toggler");
    await demosPage.type("#username", "demouser");
    await demosPage.type("#email", "demouser@gmail.com");
    await demosPage.type("#password", "Testfly1977!");
    await demosPage.click("#signup-btn");
    //berouser send invitation
    await berosPage.type("input[data-testid=user-search-input]", "demouser");
    await berosPage.click("button[data-testid=user-search-button]");
    await berosPage.waitForSelector("a[data-testid=demouser]");
    await berosPage.click("a[data-testid=demouser]");
    await berosPage.waitForSelector("div[data-testid=invite-ui]");
    await berosPage.click("button[data-testid=oninvite-btn]");
    //demouser accepts invitation
    await demosPage.waitForFunction(
      'document.querySelector("span[data-testid=message-count]").innerText.includes("1")'
    );
    await demosPage.click("a[data-testid=unread-link]");
    await demosPage.waitForSelector("ul[data-testid=unread-ui]");
    await demosPage.waitForSelector("li[data-testid=berouser]");
    await demosPage.click("li[data-testid=berouser]");
    await demosPage.waitForSelector("div[data-testid=inviter-ui]");
    await demosPage.click("button[data-testid=accept-btn]");

    //berouser sees new unread message
    //berouser opens unread new message
    await berosPage.waitForFunction(
      'document.querySelector("span[data-testid=message-count]").innerText.includes("1")'
    );
    await berosPage.click("a[data-testid=unread-link]");
    await berosPage.waitForSelector("ul[data-testid=unread-ui]");
    await berosPage.waitForSelector("li[data-testid=demouser]");
    await berosPage.click("li[data-testid=demouser]");
    //hangchat-ui visible
    //berouser types a message
    //berouser sends a message to demouser
    await berosPage.waitForSelector("div[data-testid=hangchat-ui]");
    await berosPage.type(
      "input[data-testid=message-input]",
      "Hello bero. how are you ?"
    );
    await berosPage.click("button[data-testid=send-btn]");

    debugger;

    debugger;
    t.true((await berosPage.title()).includes("Document"));
  }
);
