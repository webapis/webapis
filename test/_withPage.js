const puppeteer = require("puppeteer-core");
let executablePath =
  process.env.machine === "mac"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "Chrome/Application/chrome.exe";
module.exports = async (t, run) => {
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

  const berosBrowser = await puppeteer.launch(BeroslaunchOptions);
  const berosPage = await berosBrowser.newPage();
  await berosPage.setViewport({
    width: 500,
    height: 800,
    isMobile: true,
    deviceScaleFactor: 1,
  });
  const demosBrowser = await puppeteer.launch(DemoslaunchOptions);
  const demosPage = await demosBrowser.newPage();
  await demosPage.setViewport({
    width: 500,
    height: 800,
    isMobile: true,
    deviceScaleFactor: 1,
  });
  //const browser = await puppeteer.launch();
  //const page = await browser.newPage();//
  try {
    await run(t, berosPage, demosPage);
  } catch (e) {
    console.log("er", e);
  } finally {
    await berosPage.close();
    await demosPage.close();
    await demosBrowser.close();
    await berosBrowser.close();
  }
};
