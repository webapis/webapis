import * as validations from "../auth/validations/validations";
import httpStatus from "../auth/http-status";
const jwt = require("jsonwebtoken");

export default async function seedRecover(req, res) {
  try {
    const collectionName = "users";
    const database = req.client.db("auth");
    const collection = database.collection(collectionName);
    const { email } = req.body;
    let user = null;
    let errors = [];

    if (
      validations.isEmptyEmailOrUsername({ emailorusername: email }) ||
      !validations.isValidEmail({ email })
    ) {
      errors.push(httpStatus.emailInvalid);
    }

    if (errors.length > 0) {
      res.statusCode = 400;
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ errors }));
      res.end();
    } else {
      //valid email but not registered

      user = await collection.findOne({ email });

      if (user) {
        const payload = { id: user._id.toString() };
        const token = await jwt.sign(payload, process.env.secret, {
          expiresIn: "10h",
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ token }));
        res.end();
      } else {
        //user not registered

        errors.push(httpStatus.emailIsNotRegistered);
        res.statusCode = 400;
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ errors }));
        res.end();
      }
    }
  } catch (error) {
    const err = error;

    res.statusCode = 500;
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error: { message: error.message } }));
    res.end();
  }
}
//
