const userInputValidation = require("./validations/userInputValidation");
const passhash = require("../../server/auth/hashPassword");
const jwt = require("jsonwebtoken");
//
module.exports = async function ({ req, res, collection }) {
  try {
    let errors = [];

    let { username, email, password, browserId } = req.body;

    if (userInputValidation.signupConstraints({ username, email, password })) {
      errors = userInputValidation.signupConstraints({
        username,
        email,
        password,
      });
      res.statusCode = 400;
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ errors }));
      res.end();
    } else {
      await userInputValidation.userValidation(
        { collection, username, email },
        ({ errorCode }) => {
          if (errorCode) {
            errors.push(errorCode);
          }
        }
      );

      if (errors.length > 0) {
        res.statussCode = 400;
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ errors }));
        res.end();
      } else {
        //successful signup-------------------------------------

        const { hash, salt, iterations } = passhash.hashPassword(password);

        const result = await collection.insertOne({
          hash,
          salt,
          iterations,
          email,
          username,
          browsers: [{ browserId }],
        });

        const user = result.ops[0];

        const payload = { id: user._id.toString(), email, username };

        const token = await jwt.sign(payload, process.env.secret, {
          expiresIn: 31556926,
        });

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Set-Cookie": `${user.username}=${token};Expires=Wed, 21 Oct 2025 07:28:00 GMT; Path=/authed-msg;`,
        });
        res.write(
          JSON.stringify({ token, email, username, browserId: userBrowserId })
        );
        res.end();
      }
    }
  } catch (error) {
    const err = error;

    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error }));
    res.end();
  }
};
//
