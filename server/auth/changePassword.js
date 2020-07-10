import { ObjectID } from "mongodb";
import * as validations from "./validations/validations";
import httpStatus from "./http-status";
const jwt = require("jsonwebtoken");
const passhash = require("../../server/auth/hashPassword");

export default async function changePassword({ req, res, collection }) {
  try {
    const { password, confirm, token } = req.body;

    let user = null;
    let resBcrypt = null;
    let errors = [];

    //----CHANGE PASSWORD WITH TOKEN----------------------------

    //-START -INITIAL INPUT CONSTRAINT TEST

    // user sent empty OR invalid password 406  -----------------------------------

    if (
      validations.isEmptyPassword({ password }) ||
      !validations.isValidPasspword({ password })
    ) {
      errors.push(httpStatus.passwordInvalid);
    }
    //user sent empty OR mismached confirm 412 tested ----------------------------------
    if (
      validations.isEmptyPassword({ password: confirm }) ||
      !validations.passwordsMatch({ password, confirm })
    ) {
      errors.push(httpStatus.passwordDoNotMatch);
    }
    //-- END ----INITIAL INPUT CONSTRAINT TEST
    if (errors.length > 0) {
      //INITIAL INPUT CONSTRAINT TEST NOT VALID

      res.statusCode = 400;
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ errors }));
      res.end();
    } else {
      //INITIAL INPUT CONSTRAINT TEST  VALID
      //UPDATE PASSORD//
      const decoded = await jwt.verify(token, process.env.secret);

      let { id } = decoded;

      const { salt, hash, iterations } = passhash.hashPassword(password);

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectID(id) },
        {
          $set: {
            hash,
            salt,
            iterations,
          },
        }
      );

      user = result.value;

      const payload = { id, name: user.email };

      const newToken = jwt.sign(payload, process.env.secret, {
        expiresIn: "300d",
      });

      res.statusCode = 200;
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Set-Cookie": `${user.username}=${newToken};Expires=Wed, 21 Oct 2025 07:28:00 GMT; Path=/hangout`,
      });
      res.write(
        JSON.stringify({
          token: newToken,
          username: user.username,
          email: user.email,
        })
      );
      res.end();
    }
  } catch (error) {
    const er = error;

    res.statusCode = 500;
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error: { message: error.message } }));
    res.end();
  }
}

//
