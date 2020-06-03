import url from 'url';
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
export default async function ({ req, res, collection }) {
  try {

    // verify user authorization
    const token = cookie.parse(req.headers['cookie']);
    let uname = url.parse(req.url, true).query.username;
    const decoded = await jwt.verify(token[uname], process.env.secret);
    const { username } = decoded;
    // finduser
    let user = await collection.findOne({username});
    // search for users hangouts
    let search = url.parse(req.url, true).query.search;
    let hangouts =user.hangouts.filter((g)=> g.username.includes(search))
   

    debugger
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(
      JSON.stringify({
        hangouts
      })
    );
    res.end();
  } catch (error) {
    const err = error;
    debugger;
    res.statusCode = 500;
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error }));
    res.end();
  }
}
