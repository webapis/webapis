const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({executablePath:'/Program Files (x86)/Google/Chrome/Application/chrome',headless: false,slowMo: 250,devtools: true});
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.screenshot({path: 'example.png'});

  await browser.close();
})();