import apiurl from 'url';
import * as validations from './validations/validations';
import httpStatus from './http-status';
import { getCredentials } from './http-auth';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

export default async function ({ req, res, collection }) {
  debugger;
  try {
    let user = null;
    let resBcrypt = null;
    debugger;
    let { emailorusername, password } = getCredentials(req);
    debugger;
    let errors = [];

    //user sent empty email or username 410 tested----------------------------
    if (validations.isEmptyEmailOrUsername({ emailorusername })) {
      debugger;
      errors.push(httpStatus.emailorusernameNotValid);
    }
    // user sent empty password 409 tested -----------------------------------
    if (validations.isEmptyPassword({ password })) {
      debugger;
      errors.push(httpStatus.emptyStringNotValid);
    }
    if (errors.length > 0) {
      debugger;
      res.statusCode = 400;
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ errors }));
      res.end();
    } else {
      //username or email is not valid 410 regex tested
      debugger;
      if (!validations.isValidUsernameOrEmail({ emailorusername })) {
        debugger;
        errors.push(httpStatus.emailorusernameNotValid);
      }
      if (errors.length > 0) {
        debugger;
        res.statusCode = 400;
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ errors }));
        res.end();
      } else {
        //username or email is valid
        if (validations.isValidUsernameOrEmail({ emailorusername })) {
          debugger;
          //is email
          if (validations.isValidEmail({ email: emailorusername })) {
            debugger;
            user = await collection.findOne({ email: emailorusername });
            debugger;
            if (user === null) {
              debugger;
              // email is not registered 408  ----------------------------
              errors.push(httpStatus.credentialInvalid);
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.write(JSON.stringify({ errors }));
              res.end();
            } else {
              resBcrypt = await bcrypt.compare(password, user.password);

              if (resBcrypt) {
                debugger;
                const payload = { id: user._id.toString(), name: user.email };
                const token = await jwt.sign(payload, process.env.secret, {
                  expiresIn: 31556926,
                });
                // success login---------------------------------------------
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ token }));
                res.end();
              } else {
                // invalid credential 401-------------------------------------
                errors.push(httpStatus.credentialInvalid);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ errors }));
                res.end();
              }
            }
          } else {
            debugger;
            //is username
            user = await collection.findOne({ username: emailorusername });

            if (!user) {
              debugger;
              // username is not registered 411  ------------------------------
              errors.push(httpStatus.usernameIsNotRegistered);
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.write(JSON.stringify({ errors }));
              res.end();
            } else {
              debugger;
              resBcrypt = await bcrypt.compare(password, user.password);
              debugger;
              if (resBcrypt) {
                debugger;
                const payload = { id: user._id.toString(), name: user.email };
                const token = await jwt.sign(payload, process.env.secret, {
                  expiresIn: 31556926,
                });
                //success login 200------------------------------------------
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ token }));
                res.end();
              } else {
                debugger;
                // invalid credential 401 ------------------------------------
                errors.push(httpStatus.credentialInvalid);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ errors }));
                res.end();
              }
            }
          }
        }
      }
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error }));
    res.end();
  }
}
