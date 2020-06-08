import url from 'url';
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
export default async function ({ req, res, collection }) {
  try {
    const collectionName = 'users';

    // verify user authorization
    const token = cookie.parse(req.headers['cookie']);
    let uname = url.parse(req.url, true).query.username;
    let search = url.parse(req.url, true).query.search;
    const decoded = await jwt.verify(token[uname], process.env.secret);
    const { username } = decoded;
    // finduser
    let user = await collection.findOne({username});
    debugger;
    
    if (user && user.hangouts) {
debugger;
      // search for users hangouts
        debugger;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(
          JSON.stringify({
            hangouts: user.hangouts
          })
        );
        res.end();
      
    }
    else{
      debugger
      let users = await collection.find({username:{$regex: new RegExp(search,'i')}}).project({salt:0,hash:0,iterations:0}).toArray();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(
        JSON.stringify({
          hangouts: users && users.map(u=>{return {...u,state:'INVITE'}})
        })
      );
      res.end();
      debugger;
    }
  
//
  } catch (error) {
    const err = error;
    debugger;
    res.statusCode = 500;
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error }));
    res.end();
  }
}
