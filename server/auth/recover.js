import * as validations from './validations/validations';
import httpStatus from './http-status';
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

export default async function ({ req, res, collection }) {
  try {
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
        const link = `${process.env.resetUrl}?token=${token}`;
        let transporter = nodemailer.createTransport({
          host: 'smtp.googlemail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.email, // generated ethereal user
            pass: process.env.password, // generated ethereal password
          },
        });
        debugger;
        await transporter.sendMail({
          from: process.env.email, // sender address
          to: email, // list of receivers
          subject: 'Password Reset', // Subject line
          text: 'Click the link below to reset password', // plain text body
          html: `<p>Click <a href="${link}">here</a> to reset your password</p>`, // html body
        });
        debugger;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message:"request accepted" }));
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
    res.write(JSON.stringify({ error }));
    res.end();
  }
}
