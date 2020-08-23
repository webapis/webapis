const test = require("ava");
const withPage = require("./test/_withPage");
const url = "https://localhost:3000";
// test("foo", (t) => {
//   t.pass();
// });

// test("bar", async (t) => {
//   const bar = Promise.resolve("bar");
//   t.is(await bar, "bar");
// });
test(
  'page title should contain "Google"',
  withPage,
  async (t, berosPage, demosPage) => {
    await berosPage.goto(url);
    await demosPage.goto(url);
    t.true((await berosPage.title()).includes("Document"));
  }
);
