const puppeteer = require("puppeteer-core");

(async () => {
  // set some options (set headless to false so we can see
  // this automated browsing experience)
  let BeroslaunchOptions = {
    headless: false,
    ignoreHTTPSErrors: true,
    args: ["--window-position=0,0", "--window-size=300,700"],
    executablePath: "Chrome/Application/chrome.exe", // because we are using puppeteer-core so we must define this option
  };

  const berosBrowser = await puppeteer.launch(BeroslaunchOptions);

  const berosPage = await berosBrowser.newPage();
  await berosPage.setViewport({
    width: 500,
    height: 400,
    isMobile: true,
    deviceScaleFactor: 1,
  });
  // await berosBrowser.setViewport({width: 600, height: 768});
  await berosPage.goto("https://localhost:3000");

  // set viewport and user agent (just in case for nice viewing)
  // await page.setViewport({width: 600, height: 768});
  //  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

  // go to the target web
  // await page.goto('https://google.com');

  let DemoslaunchOptions = {
    headless: false,
    ignoreHTTPSErrors: true,
    args: ["--window-position=550,0", "--window-size=300,700"],
    executablePath: "Chrome/Application/chrome.exe", // because we are using puppeteer-core so we must define this option
  };

  const demosBrowser = await puppeteer.launch(DemoslaunchOptions);
  const demosPage = await demosBrowser.newPage();
  await demosPage.setViewport({
    width: 500,
    height: 400,
    isMobile: true,
    deviceScaleFactor: 1,
  });
  await demosPage.goto("https://localhost:3000");

  // close the browser
  // await browser.close();
})();
