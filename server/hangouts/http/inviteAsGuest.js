const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
module.exports = async function inviteasguest({ req, res, collection }) {
  try {
    debugger;
    //messageForGuest, username, guestEmail
    //const token = cookie.parse(req.headers["cookie"]);

    let { guestEmail, username, messageForGuest } = req.body;

    let user = await collection.findOne({ username });
    if (user) {
      //   let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: "gmail",

        auth: {
          xoauth2: xoauth2.createXOAuth2Generator({
            user: "tkm.house.new@gmail.com",
            clientId:
              "411487022438-ks2sh1ugndu8v7k55tdo605svqftlqpi.apps.googleusercontent.com",
            clientSecret: "yLXNiz_THAYxxQMhbzD0w0lx",
            refreshToken: "",
          }),
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: user && user.email, // sender address
        to: guestEmail, // list of receivers
        subject: "Invitation as guest", // Subject line
        text: messageForGuest, // plain text body
        html: "<b>Hello world?</b>", // html body
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({}));
      res.end();
      debugger;
    } else {
      debugger;
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ error: "Something went wrong" }));
      res.end();
    }
  } catch (error) {
    const err = error;
    console.log("error", error);
    debugger;
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error }));
    res.end();
  }
};

/*
const nodemailer = require("nodemailer");
module.exports = async function inviteasguest({ req, res, collection }) {
  try {
      debugger;
    //messageForGuest, username, guestEmail
    //const token = cookie.parse(req.headers["cookie"]);

    let { guestEmail, username, messageForGuest } = req.body;

 
    let user = await collection.findOne({ username });
    if (user) {
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: user && user.email, // sender address
        to: guestEmail, // list of receivers
        subject: "Invitation as guest", // Subject line
        text: messageForGuest, // plain text body
        html: "<b>Hello world?</b>", // html body
      });
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({}));
      res.end();
      debugger;
    } else {
      debugger;
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ error: "Something went wrong" }));
      res.end();
    }
  } catch (error) {
 
    const err=error;
    console.log("error",error)
    debugger;
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error }));
    res.end();
  }
};

*/
