const puppeteer = require("puppeteer-core");

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: "./Chrome/Application/chrome.exe",
      args: ["--ignore-certificate-errors"],
    });
    global.browser = browser;
    console.log("browser created");
  } catch (error) {
    console.log("error------------------", error);
    //await browser.close();
  }
})();
//
