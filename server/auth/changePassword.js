import { ObjectID } from 'mongodb';
import * as validations from './validations/validations';
import httpStatus from './http-status';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

export default async function changePassword({ req, res, collection }) {
  debugger;

  try {
    const { password, confirm, token } = req.body;
    debugger;
    let user = null;
    let resBcrypt = null;
    let errors = [];

    //----CHANGE PASSWORD WITH TOKEN----------------------------

    //-START -INITIAL INPUT CONSTRAINT TEST

    // user sent empty OR invalid password 406  -----------------------------------
    debugger;
    if (
      validations.isEmptyPassword({ password }) ||
      !validations.isValidPasspword({ password })
    ) {
      debugger;
      errors.push(httpStatus.passwordInvalid);
    }
    //user sent empty OR mismached confirm 412 tested ----------------------------------
    if (
      validations.isEmptyPassword({ password: confirm }) ||
      !validations.passwordsMatch({ password, confirm })
    ) {
      debugger;
      errors.push(httpStatus.passwordDoNotMatch);
    }
    //-- END ----INITIAL INPUT CONSTRAINT TEST
    if (errors.length > 0) {
      //INITIAL INPUT CONSTRAINT TEST NOT VALID
      debugger;
      res.statusCode = 400;
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ errors }));
      res.end();
    } else {
      //INITIAL INPUT CONSTRAINT TEST  VALID
      //UPDATE PASSORD//
      const decoded = await jwt.verify(token, process.env.secret);
      debugger;
      let { id } = decoded;
      debugger;
      const salt = await bcrypt.genSalt(10);
      debugger;
      const hash = await bcrypt.hash(password, salt);
      debugger;

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectID(id) },
        { $set: { password: hash } }
      );
      debugger;
      user = result.value;
      debugger;
      const payload = { id, name: user.email };
      debugger;
      const newToken = jwt.sign(payload, process.env.secret, {
        expiresIn: '300d',
      });
      debugger;
      res.statusCode = 200;
      res.writeHead(200, { 'Content-Type': 'application/json' });
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
    debugger;
    res.statusCode = 500;
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error: { message: error.message } }));
    res.end();
  }
}
