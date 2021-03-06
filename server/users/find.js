const url = require("url");
module.exports = async function ({ req, res, collection }) {
  try {
    let users = null;
    let search = url.parse(req.url, true).query.search;

    users = await collection
      .find({ username: search }, { username: 1, email: 1 })
      .toArray();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(
      JSON.stringify({
        users,
      })
    );
    res.end();
  } catch (error) {
    const err = error;

    res.statusCode = 500;
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error }));
    res.end();
  }
};
