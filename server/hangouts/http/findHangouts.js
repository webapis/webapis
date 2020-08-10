const url = require("url");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
module.exports = async function findHangouts({ req, res, collection }) {
  try {
    // verify user authorization/
    const token = cookie.parse(req.headers["cookie"]);
    let uname = url.parse(req.url, true).query.username;
    const decoded = await jwt.verify(token[uname], process.env.secret);
    const { username } = decoded;
    // finduser
    let user = await collection.findOne({ username });
    if (user && user.hangouts) {
      // search for users hangouts
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify({
          hangouts: user.hangouts,
        })
      );
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify({
          hangouts: [],
        })
      );
      res.end();
    }
  } catch (error) {
    const err = error;

    res.statusCode = 500;
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error }));
    res.end();
  }
};
