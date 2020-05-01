import * as validations from '../auth/validations/validations';
import httpStatus from '../auth/http-status';
const jwt = require('jsonwebtoken');

export default async function seedRecover(req, res) {
  try {
    const collectionName = 'users';
    const database = req.client.db('auth');
    const collection = database.collection(collectionName);
    const { email } = req.body;
    let user = null;
    let errors = [];
    debugger;
    if (
      validations.isEmptyEmailOrUsername({ emailorusername: email }) ||
      !validations.isValidEmail({ email })
    ) {
      debugger;
      errors.push(httpStatus.emailInvalid);
    }

    if (errors.length > 0) {
      debugger;
      res.statusCode = 400;
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ errors }));
      res.end();
    } else {
      //valid email but not registered
      debugger;
      user = await collection.findOne({ email });
      debugger;
      if (user) {
        debugger;
        const payload = { id: user._id.toString() };
        const token = await jwt.sign(payload, process.env.secret, {
          expiresIn: '10h',
        });
        debugger;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ token }));
        res.end();
      } else {
        //user not registered
        debugger;
        errors.push(httpStatus.emailIsNotRegistered);
        res.statusCode = 400;
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ errors }));
        res.end();
      }
    }
    debugger;
  } catch (error) {
    const err = error;
    debugger;
    res.statusCode = 500;
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error: { message: error.message } }));
    res.end();
  }
}
//