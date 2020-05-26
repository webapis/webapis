
import apiurl from 'url';
import * as validations from './validations/validations';
import httpStatus from './http-status';
import { getCredentials } from './http-auth';
const jwt = require('jsonwebtoken');
const passhash = require('../../server/auth/hashPassword');

export default async function ({ req, res, collection }) {
  try {
    let user = null;
    let resBcrypt = null;

    let { emailorusername, password } = getCredentials(req);

    let errors = [];

    //user sent empty email or username 410 tested----------------------------
    if (validations.isEmptyEmailOrUsername({ emailorusername })) {
      errors.push(httpStatus.emailorusernameNotValid);
    }
    // user sent empty password 409 tested -----------------------------------
    if (validations.isEmptyPassword({ password })) {
      errors.push(httpStatus.emptyStringNotValid);
    }
    if (errors.length > 0) {
      res.statusCode = 400;
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ errors }));
      res.end();
    } else {
      //username or email is not valid 410 regex tested

      if (!validations.isValidUsernameOrEmail({ emailorusername })) {
        errors.push(httpStatus.emailorusernameNotValid);
      }
      if (errors.length > 0) {
        res.statusCode = 400;
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ errors }));
        res.end();
      } else {
        //username or email is valid
        if (validations.isValidUsernameOrEmail({ emailorusername })) {
          //is email
          if (validations.isValidEmail({ email: emailorusername })) {
            user = await collection.findOne({ email: emailorusername });

            if (user === null) {
              // email is not registered 408  ----------------------------///Cookies
              errors.push(httpStatus.credentialInvalid);
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.write(JSON.stringify({ errors }));
              res.end();
            } else {
            
              debugger
              resBcrypt = passhash.isPasswordCorrect(user.hash,user.salt,user.iterations,password);

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
                  'Content-Type': 'application/json',
                  'Set-Cookie': `${user.username}=${token};Expires=Wed, 21 Oct 2025 07:28:00 GMT;  Path=/hangouts`,
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
                errors.push(httpStatus.credentialInvalid);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ errors }));
                res.end();
              }
            }
          } else {
            //is username
            user = await collection.findOne({ username: emailorusername });

            if (!user) {
              // username is not registered 411  ------------------------------
              errors.push(httpStatus.usernameIsNotRegistered);
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.write(JSON.stringify({ errors }));
              res.end();
            } else {

              debugger;
    
              debugger
              resBcrypt = passhash.isPasswordCorrect(user.hash,user.salt,user.iterations,password);
              debugger;

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
                  'Content-Type': 'application/json',
                  'Set-Cookie': `${user.username}=${token};Expires=Wed, 21 Oct 2025 07:28:00 GMT; Path=/hangouts`,
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
    const err = error;

    console.log('err---------------',err)
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error }));
    res.end();
  }
}
