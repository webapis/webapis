const url = require("url");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
module.exports = async function findOne({ req, res, collection }) {
  try {
    // verify user authorization/
    const token = cookie.parse(req.headers["cookie"]);

    let uname = url.parse(req.url, true).query.username;

    let search = url.parse(req.url, true).query.search;

    const decoded = await jwt.verify(token[uname], process.env.secret);

    const { username } = decoded;
    // finduser
    if (search === username) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify({
          hangouts: [],
        })
      );
      res.end();
    } else {
      let user = await collection.findOne({ username });

      if (
        user &&
        user.hangouts &&
        user.hangouts.find((h) => h.username === search)
      ) {
        // search for users hangouts

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({
            hangouts: user.hangouts,
          })
        );
        res.end();
      } else {
        let users = await collection
          .find({ username: { $regex: new RegExp(search, "i") } })
          .project({ salt: 0, hash: 0, iterations: 0 })
          .toArray();

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({
            hangouts:
              users &&
              users.map((u) => {
                return { ...u, state: "INVITEE" };
              }),
          })
        );
        res.end();
      }
    }
  } catch (error) {
    const err = error;

    res.statusCode = 500;
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error }));
    res.end();
  }
};
