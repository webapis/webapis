import { ObjectID } from 'mongodb';
import * as validations from './validations/validations';
import httpStatus from './http-status';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

export default async function changePassword({ req, res, collection }) {
  debugger;

  try {
    const { emailorusername, password, current, confirm, token } = req.body;
  debugger;
    let user = null;
    let resBcrypt = null;
    debugger;
    if (token) {
      debugger;
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
      res.write(JSON.stringify({ token: newToken }));
      res.end();
    } else {
      debugger;
      let errors = [];

      //user sent empty email or username 410 tested----------------------------
      if (validations.isEmptyEmailOrUsername({ emailorusername })) {
        debugger;
        errors.push(httpStatus.emailorusernameNotValid);
      }
      // user sent empty password 409 tested -----------------------------------
      if (validations.isEmptyPassword({ password: current })) {
        debugger;
        errors.push(httpStatus.emptyStringNotValid);
      }
      // user sent empty password 409 tested -----------------------------------
      debugger;
      if (
        validations.isEmptyPassword({ password }) ||
        !validations.isValidPasspword({ password })
      ) {
        debugger;
        errors.push(httpStatus.passwordInvalid);
      }
      // user sent empty password 409 tested ----------------------------------
      if (
        validations.isEmptyPassword({ password: confirm }) ||
        !validations.passwordsMatch({ password, confirm })
      ) {
        debugger;
        errors.push(httpStatus.passwordDoNotMatch);
      }

      if (errors.length > 0) {
        debugger;
        res.statusCode = 400;
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ errors }));
        res.end();
      } else {
        //valid email
        if (validations.isValidEmail({ email: emailorusername })) {
          debugger;
          user = await collection.findOne({ email: emailorusername });
          debugger;
          if (user) {
            debugger;
            resBcrypt = await bcrypt.compare(current, user.password);
            debugger;
            if (resBcrypt) {
              debugger;
              updatePassword({
                emailorusername: 'email',
                value: emailorusername,
                password,
                collection,
                res,
              });
            } else {
              debugger;
              //invalid credentials
              errors.push(httpStatus.credentialInvalid);
              res.statusCode = 400;
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.write(JSON.stringify({ errors }));
              res.end();
            }
          } else {
            debugger;
            //email does not exist
            errors.push(httpStatus.credentialInvalid);
            res.statusCode = 400;
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ errors }));
            res.end();
          }
        } else {
          //valid username-------------------------------------------
          debugger;
          user = await collection.findOne({ username: emailorusername });
          debugger;
          if (user) {
            debugger;
            resBcrypt = await bcrypt.compare(password, user.password);
            debugger;
            if (resBcrypt) {
              debugger;
              updatePassword({
                emailorusername: 'username',
                value: emailorusername,
                password,
                collection,
                res,
              });
            } else {
              debugger;
              //invalid credentials
              errors.push(httpStatus.credentialInvalid);
              res.statusCode = 400;
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.write(JSON.stringify({ errors }));
              res.end();
            }
          } else {
            debugger;
            //username does not exist
            errors.push(httpStatus.credentialInvalid);
            res.statusCode = 400;
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ errors }));
            res.end();
          }
        }
      }
    }
  } catch (error) {
    const er = error;
    debugger;
    res.statusCode = 500;
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error }));
    res.end();
  }
}

async function updatePassword({
  value,
  emailorusername,
  password,
  collection,
  res,
}) {
  debugger;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const result = await collection.findOneAndUpdate(
    { [emailorusername]: value },
    { $set: { password: hash } }
  );
  const user = result.value;
  const payload = { id: result._id, name: user.email };
  const newToken = await jwt.sign(payload, process.env.secret, {
    expiresIn: '300d',
  });
  res.statusCode = 200;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ token: newToken }));
  res.end();
}
