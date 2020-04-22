import apiurl from 'url';
import httpStatus from './http-status';
import * as validations from './validations/validations';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

export default async function ({ req, res, collection }) {
  try {
    let errors = [];
    //const SALT_WORK_FACTOR = 10;
    let { username, email, password } = req.body;
    debugger;
    if (
      validations.isEmptyEmailOrUsername({ emailorusername: username }) ||
      !validations.isValidUsername({ username })
    ) {
      debugger;
      //empty username ----------------------405
      errors.push(httpStatus.usernameInvalid);
    }
    if (
      validations.isEmptyEmailOrUsername({ emailorusername: email }) ||
      !validations.isValidEmail({ email })
    ) {
      debugger;
      //empty email ------------------------407
      errors.push(httpStatus.emailInvalid);
    }
    if (
      validations.isEmptyPassword({ password }) ||
      !validations.isValidPasspword({ password })
    ) {
      debugger;
      //empty password --------------------406
      errors.push(httpStatus.passwordInvalid);
    }

    if (errors.length > 0) {
      debugger;
      //--------------405,406,407 tested
      debugger;
      res.statusCode = 400;
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ errors }));
      res.end();
    } else {
      await validations.userNameIsTaken({ collection, username }, () => {
        debugger;
        //  usernameIsTaken: '402'--------------------------------------
        errors.push(httpStatus.usernameIsTaken);
      });

      await validations.emailIsRegistered({ collection, email }, () => {
        debugger;
        //   emailIsRegistered: '403'-----------------------------------
        errors.push(httpStatus.emailIsRegistered);
      });

      if (errors.length > 0) {
        //-------------402,403
        debugger;
        res.statusCode = 400;
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ errors }));
        res.end();
      } else {
        debugger;
        //successful signup-------------------------------------
        const salt = await bcrypt.genSalt(10);
        debugger;
        const hash = await bcrypt.hash(password, salt);
        debugger;
        const result = await collection.insertOne({ password: hash, email, username });
        debugger;
        const user = result.ops[0];
        debugger;
        const payload = { id: user._id.toString(), name: user.email };
        debugger;
        const token = await jwt.sign(payload, process.env.secret, {
          expiresIn: 31556926,
        });
        debugger;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ token }));
        res.end();
      }
    }
  } catch (error) {
  
    debugger;
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error }));
    res.end();
  }
}
