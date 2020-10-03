module.exports = {
  launch: {
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
  },
};
