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
    
    if (
      validations.isEmptyEmailOrUsername({ emailorusername: username }) ||
      !validations.isValidUsername({ username })
    ) {
      
      //empty username ----------------------405
      errors.push(httpStatus.usernameInvalid);
    }
    if (
      validations.isEmptyEmailOrUsername({ emailorusername: email }) ||
      !validations.isValidEmail({ email })
    ) {
      
      //empty email ------------------------407
      errors.push(httpStatus.emailInvalid);
    }
    if (
      validations.isEmptyPassword({ password }) ||
      !validations.isValidPasspword({ password })
    ) {
      
      //empty password --------------------406
      errors.push(httpStatus.passwordInvalid);
    }

    if (errors.length > 0) {
      
      //--------------405,406,407 tested
      
      res.statusCode = 400;
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ errors }));
      res.end();
    } else {
      await validations.userNameIsTaken({ collection, username }, () => {
        
        //  usernameIsTaken: '402'--------------------------------------
        errors.push(httpStatus.usernameIsTaken);
      });

      await validations.emailIsRegistered({ collection, email }, () => {
        
        //   emailIsRegistered: '403'-----------------------------------
        errors.push(httpStatus.emailIsRegistered);
      });

      if (errors.length > 0) {
        //-------------402,403
        
        res.statusCode = 400;
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ errors }));
        res.end();
      } else {
        
        //successful signup-------------------------------------
        const salt = await bcrypt.genSalt(10);
        
        const hash = await bcrypt.hash(password, salt);
        
        const result = await collection.insertOne({
          password: hash,
          email,
          username,
        });
        
        const user = result.ops[0];
        
        const payload = { id: user._id.toString(), email, username };
        
        const token = await jwt.sign(payload, process.env.secret, {
          expiresIn: 31556926,
        });
        
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Set-Cookie': `${user.username}=${token};Expires=Wed, 21 Oct 2025 07:28:00 GMT; Path=/hangouts`,
        });
        res.write(JSON.stringify({ token, email, username }));
        res.end();
      }
    }
  } catch (error) {
    
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error }));
    res.end();
  }
}
