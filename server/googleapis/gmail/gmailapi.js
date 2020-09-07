require("dotenv").config();
const htmlTemplate = require("./htmlTemplates");
const nodemailer = require("nodemailer");

module.exports = async function serverToServer({ req, res }) {
  try {
    const { from, to, subject, text, type } = req.body;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.user,
        clientId: process.env.clientId,
        clientSecret: process.env.clientSecret,
        refreshToken: process.env.refreshToken,
        accessToken: process.env.accessToken,
        // expires: 1484314697598
      },
    });

    // send mail with defined transport object//
    let info = await transporter.sendMail({
      from, //'"Fred Foo 👻" <tkm.house.new@gmail.com>', // sender address
      to, //: "webapis.github@gmail.com", // list of receivers
      subject, //: "Hello ✔ok", // Subject line
      text, //: "Hello world?!", // plain text body
      html: htmlTemplate({ type }), // html body
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(
      JSON.stringify({
        info,
      })
    );
    res.end();
  } catch (error) {
    const err = error;

    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(
      JSON.stringify({
        error,
      })
    );
    res.end();
    console.log("gmailapi error", error);
  }
};
