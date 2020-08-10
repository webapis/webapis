const puppeteer = require("puppeteer-core");
fs = require("fs");
// (async () => {
//   try {
//     const browser = await puppeteer.launch({executablePath:'./Chrome/Application/chrome.exe'});
//     const page = await browser.newPage();
//     await page.goto('https://example.com');
//     await page.screenshot({path: 'ssr/example.png'});
//   debugger;;
//     await browser.close();
//   } catch (error) {
//     console.log('error------------',error)
//   }

// })();

(async (url) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: "./Chrome/Application/chrome.exe",
      args: ["--ignore-certificate-errors"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    const html = await page.content();
    debugger;
    await page.screenshot({ path: "ssr/example.png" });
    fs.writeFile(
      `builds/${process.env.appName}/build/index.html`,
      html,
      function (err) {
        if (err) return console.log(err);
      }
    );
    await browser.close();
    return html;
  } catch (error) {
    console.log("error------------------", error);
  }
})("https://localhost:3000");
