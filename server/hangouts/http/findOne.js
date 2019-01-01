const url = require("url");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
module.exports = async function findOne({ req, res, collection }) {
  try {
    debugger;
    // verify user authorization/

    let username = url.parse(req.url, true).query.username;
    debugger;
    let search = url.parse(req.url, true).query.search;
    debugger;

    // prevent for searching users's own name
    if (search === username) {
      debugger;
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify({
          hangout: null,
        })
      );
      res.end();
    } else {
      debugger;
      // if hangout previously was not connected//
      let hangout = await collection.findOne({
        $or: [{ username: search }, { email: search }],
      });
      //.project({ salt: 0, hash: 0, iterations: 0 });//
      debugger;
      if (hangout) {
        const { username, email } = hangout;
        debugger;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({
            hangout: { target: username, email, state: "INVITEE" },
          })
        );
        res.end();
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({
            hangout: null,
          })
        );
        res.end();
      }
    }
  } catch (error) {
    const err = error;
    debugger;
    res.statusCode = 500;
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error }));
    res.end();
  }
};
