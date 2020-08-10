const apiurl = require("url");
const validations = require("./validations/validations");
const httpStatus = require("./http-status");
const authHeader = require("./http-auth");
const jwt = require("jsonwebtoken");
const passhash = require("../../server/auth/hashPassword");
const userInputValidation = require("./validations/userInputValidation");
module.exports = async function ({ req, res, collection }) {
  try {
    let user = null;
    let resBcrypt = null;

    let { emailorusername, password } = authHeader.getCredentials(req);

    let errors = [];
    if (
      userInputValidation.loginFirstConstraints({ emailorusername, password })
    ) {
      errors = userInputValidation.loginFirstConstraints({
        emailorusername,
        password,
      });
      res.statusCode = 400;
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ errors }));
      res.end();
    } else {
      //is email
      if (validations.isValidEmail({ email: emailorusername })) {
        user = await collection.findOne({ email: emailorusername });
        resBcrypt = passhash.isPasswordCorrect(
          user.hash,
          user.salt,
          user.iterations,
          password
        );

        if (resBcrypt) {
          const payload = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
          };
          const token = await jwt.sign(payload, process.env.secret, {
            expiresIn: 31556926,
          });
          // success login---------------------------------------------
          res.writeHead(200, {
            "Content-Type": "application/json",
            "Set-Cookie": `${user.username}=${token};Expires=Wed, 21 Oct 2025 07:28:00 GMT;  Path=/hangouts`,
          });
          res.write(
            JSON.stringify({
              token,
              username: user.username,
              email: user.email,
            })
          );
          res.end();
        } else {
          // invalid credential 401-------------------------------------
          errors.push(212);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ errors }));
          res.end();
        }
      } else {
        //is username
        user = await collection.findOne({ username: emailorusername });

        if (!user) {
          // username is not registered 411  ------------------------------
          errors.push(212);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ errors }));
          res.end();
        } else {
          resBcrypt = passhash.isPasswordCorrect(
            user.hash,
            user.salt,
            user.iterations,
            password
          );

          if (resBcrypt) {
            const payload = {
              id: user._id.toString(),
              email: user.email,
              username: user.username,
            };
            const token = await jwt.sign(payload, process.env.secret, {
              expiresIn: 31556926,
            });
            //success login 200------------------------------------------
            res.writeHead(200, {
              "Content-Type": "application/json",
              "Set-Cookie": `${user.username}=${token};Expires=Wed, 21 Oct 2025 07:28:00 GMT; Path=/hangouts`,
            });
            res.write(
              JSON.stringify({
                token,
                username: user.username,
                email: user.email,
              })
            );

            res.end();
          } else {
            // invalid credential 401 ------------------------------------
            errors.push(212);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ errors }));
            res.end();
          }
        }
      }
    }
  } catch (error) {
    const err = error;

    console.log("err---------------", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error }));
    res.end();
  }
};
