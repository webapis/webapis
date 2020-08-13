const validations = require("./validations/validations");
const httpStatus = require("./http-status");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

module.exports = async function ({ req, res, collection }) {
  try {
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

        const link = `${process.env.resetUrl}?token=${token}`;
        let transporter = nodemailer.createTransport({
          host: "smtp.googlemail.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.email, // generated ethereal user
            pass: process.env.password, // generated ethereal password
          },
        });

        await transporter.sendMail({
          from: process.env.email, // sender address
          to: email, // list of receivers
          subject: "Password Reset", // Subject line
          text: "Click the link below to reset password", // plain text body
          html: `<p>Click <a data-testid="resetlink" href="${link}">here</a> to reset your password</p>`, // html body
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "request accepted" }));
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
    res.write(JSON.stringify({ error }));
    res.end();
  }
};
