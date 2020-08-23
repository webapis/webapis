const puppeteer = require("puppeteer-core");

module.exports = async (t, run) => {
  let BeroslaunchOptions = {
    headless: false,
    ignoreHTTPSErrors: true,
    args: ["--window-position=0,0", "--window-size=300,700"],
    executablePath: "Chrome/Application/chrome.exe", // because we are using puppeteer-core so we must define this option
  };

  let DemoslaunchOptions = {
    headless: false,
    ignoreHTTPSErrors: true,
    args: ["--window-position=550,0", "--window-size=300,700"],
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
  const demosBrowser = await puppeteer.launch(DemoslaunchOptions);
  const demosPage = await demosBrowser.newPage();
  await demosPage.setViewport({
    width: 500,
    height: 400,
    isMobile: true,
    deviceScaleFactor: 1,
  });
  //const browser = await puppeteer.launch();
  //const page = await browser.newPage();//
  try {
    await run(t, berosPage, demosPage);
  } finally {
    await berosPage.close();
    await demosPage.close();
    await demosBrowser.close();
    await berosBrowser.close();
  }
};
