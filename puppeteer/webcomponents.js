const puppeteer = require("puppeteer-core");

const url = "https://localhost:3011";

let beroslaunchOptions = {
  slowMo: 5,
  isMobile: true,
  headless: false,
  ignoreHTTPSErrors: true,
  args: [
    // "--no-sandbox",
    // "--disable-setuid-sandbox",
    "--window-position=0,0",
    "--window-size=1200,800",
    "--allow-insecure-localhost",
  ],
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // because we are using puppeteer-core so we must define this option
};

// let demoslaunchOptions = {
//   slowMo: 5,
//   isMobile: true,
//   headless: false,
//   ignoreHTTPSErrors: true,
//   args: [
//     // "--no-sandbox",
//     // "--disable-setuid-sandbox",
//     "--window-position=550,0",
//     "--window-size=300,800",
//     "--allow-insecure-localhost",
//   ],
//   executablePath:
//     "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // because we are using puppeteer-core so we must define this option
// };
//const puppeteer = require("puppeteer");
(async () => {
  let berosBrowser;

  let berosPage;

  try {
    berosBrowser = await puppeteer.launch(beroslaunchOptions);
    berosPage = await berosBrowser.newPage();
    // demosBrowser = await puppeteer.launch(demoslaunchOptions);
    // demosPage = await demosBrowser.newPage();
    await berosPage.setViewport({
      width: 1200,
      height: 800,
      //isMobile: true,
      deviceScaleFactor: 1,
    });
    await berosPage.goto(url, { waitUntil: "networkidle2" });
    // await demosPage.setViewport({
    //   width: 500,
    //   height: 800,
    //   isMobile: true,
    //   deviceScaleFactor: 1,
    // });
    // await demosPage.goto(url, { waitUntil: "networkidle2" });
    // //navbar-toggler
    //await berosPage.waitForNavigation({ waitUntil: "networkidle2" });
    // await berosPage.waitForSelector(".navbar-toggler");

    // await berosPage.click(".navbar-toggler");
    debugger;
    await berosPage.waitForSelector("auth-component");
    debugger;
    const shadowRott = await berosPage.waitForSelector("auth-component");
    await berosPage.evaluate(() => {
      let authComponent = document.querySelector("auth-component");
      debugger;
    });
    debugger;
    await berosPage.click("#signup-btn");
    debugger;
    // await berosPage.click("#signup");

    // await berosPage.waitForSelector("#username");
    // // // debugger;
    // await berosPage.type("#username", "berouser");

    // await berosPage.type("#email", "berouser@gmail.com");
    // await berosPage.type("#password", "Testfly1977!");
    // await berosPage.click("#signup-btn");
    // await demosPage.goto(url, { waitUntil: "networkidle2" });

    // await demosPage.click(".navbar-toggler");
    // await demosPage.waitForSelector("#signup");

    // await demosPage.click("#signup");

    // await demosPage.waitForSelector("#username");
    // await demosPage.type("#username", "demouser");
    // await demosPage.type("#email", "demouser@gmail.com");
    // await demosPage.type("#password", "Testfly1977!");
    // await demosPage.click("#signup-btn");

    // // // // //berouser send invitation
    // await berosPage.waitForSelector("input[data-testid=user-search-input]");
    // await berosPage.type("input[data-testid=user-search-input]", "demouser");
    // await berosPage.click("button[data-testid=user-search-button]");
    // await berosPage.waitForSelector("a[data-testid=demouser]");
    // await berosPage.click("a[data-testid=demouser]");

    // await berosPage.waitForSelector("div[data-testid=invite-ui]");
    // await berosPage.click("button[data-testid=oninvite-btn]");

    // // // //demouser accepts invitation
    // await demosPage.waitForFunction(
    //   'document.querySelector("span[data-testid=message-count]").innerText.includes("1")'
    // );

    // await demosPage.click("a[data-testid=unread-link]");
    // await demosPage.waitForSelector("ul[data-testid=unread-ui]");
    // await demosPage.waitForSelector("li[data-testid=berouser]");
    // await demosPage.click("li[data-testid=berouser]");
    // await demosPage.waitForSelector("div[data-testid=hangchat-ui]");
    // await demosPage.click("button[data-testid=accept-btn]");
    // await demosPage.waitForSelector("div[data-testid=hangchat-ui]");

    // //berouser types a message
    // //berouser sends a message to demouser
    // await berosPage.waitForSelector("div[data-testid=hangchat-ui]");
    // await berosPage.type(
    //   "input[data-testid=message-input]",
    //   "Hello bero. how are you ?"
    // );
    // await berosPage.click("button[data-testid=send-btn]");
    // //  await berosPage.waitForSelector("div[data-testid=hangchat-ui]");
    // await demosPage.type(
    //   "input[data-testid=message-input]",
    //   "I am fine thanks how are you?"
    // );
    // await demosPage.click("button[data-testid=send-btn]");
    // debugger;
  } catch (error) {
    console.log("error", error);
  } finally {
    await berosPage.close();

    //  database.close();
  }
})();
