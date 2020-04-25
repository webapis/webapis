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
    let errors = [];
    debugger;
    if (token) {
      //----CHANGE PASSWORD WITH TOKEN----------------------------
      debugger;
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
        //UPDATE PASSORD
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
      }
    } else {
      //---------CHANGE PASSWORD WITH EMAILORUSERNAME AND PASSWORD----------------!
      debugger;

      //-START -INITIAL INPUT CONSTRAINT TEST

      //UNAUTHENTICATED USER: user sent empty emailorusername 410 ----------------------------
      if (validations.isEmptyEmailOrUsername({ emailorusername })) {
        debugger;
        errors.push(httpStatus.emailorusernameNotValid);
      }
      //UNAUTHENTICATED USER: user sent not empty value but invalid email or username ----------------------------
      if (!validations.isEmptyEmailOrUsername({ emailorusername })) {
        if (
          !validations.isValidEmail({ email: emailorusername }) &&
          !validations.isValidUsername({ username: emailorusername })
        ) {
          errors.push(httpStatus.emailorusernameNotValid);
        }
      }
      //UNAUTHENTICATED USER:  user sent empty current 409  -----------------------------------
      if (validations.isEmptyPassword({ password: current })) {
        debugger;
        errors.push(httpStatus.emptyStringNotValid);
      }
      //UNAUTHENTICATED AND AUTHENTICATED USER:  user sent empty OR invalid password 406  ----------------------------------
      debugger;
      if (
        validations.isEmptyPassword({ password }) ||
        !validations.isValidPasspword({ password })
      ) {
        debugger;
        errors.push(httpStatus.passwordInvalid);
      }
      // UNAUTHENTICATED AND AUTHENTICATED USER: user sent empty OR mismached confirm 412 tested ----------------------------------
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
        //INITIAL INPUT CONSTRAINT TEST VALID
        // START- VALIDATION TEST
        if (validations.isValidEmail({ email: emailorusername })) {
          //USER SENT EMAIL
          debugger;
          user = await collection.findOne({ email: emailorusername });
          debugger;
          if (user) {
            //EMAIL EXIST
            debugger;
            resBcrypt = await bcrypt.compare(current, user.password);
            debugger;
            if (resBcrypt) {
              // EMAIL EXISTS BUT CURRENT PASS IS INVALID
              debugger;
              updatePassword({
                //UPDATE PASSWORD
                emailorusername: 'email',
                value: emailorusername,
                password,
                collection,
                res,
              });
            } else {
              //EMAIL EXISTS BUT PASSWORD IS INVALID
              debugger;
              //invalid credentials------------401
              errors.push(httpStatus.credentialInvalid);
              res.statusCode = 400;
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.write(JSON.stringify({ errors }));
              res.end();
            }
          } else {
            //EMAIL IS VALID BUT DOES NOT EXIST
            debugger;
            //email does not exist----------------401
            errors.push(httpStatus.credentialInvalid);
            res.statusCode = 400;
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ errors }));
            res.end();
          }
        } else {
          //USER SENT USERNAME
          //valid username-------------------------------------------
          debugger;
          user = await collection.findOne({ username: emailorusername });
          debugger;
          if (user) {
            // USERNAME EXISTS
            debugger;
            resBcrypt = await bcrypt.compare(current, user.password);
            debugger;
            if (resBcrypt) {
              //CURRENT PASSWORD MATCHES
              debugger;
              updatePassword({
                //UPDATE PASSWORD
                emailorusername: 'username',
                value: emailorusername,
                password,
                collection,
                res,
              });
            } else {
              //USERNAME EXISTS BUT CURRENT PASSWORD DOES NOT MATCH
              debugger;
              //invalid credentials----------401
              errors.push(httpStatus.credentialInvalid);
              res.statusCode = 400;
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.write(JSON.stringify({ errors }));
              res.end();
            }
          } else {
            //VALID USERNAME BUT DOES NOT EXIST
            debugger;
            //username does not exist ----------401
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
