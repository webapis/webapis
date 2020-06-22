import url from 'url';
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
export default async function ({ req, res, collection }) {
  try {
    const collectionName = 'users';
debugger;
    // verify user authorization
    const token = cookie.parse(req.headers['cookie']);
    debugger;
    let uname = url.parse(req.url, true).query.username;
    debugger;
    let search = url.parse(req.url, true).query.search;
    debugger;
    const decoded = await jwt.verify(token[uname], process.env.secret);
    debugger;
    const { username } = decoded;
    // finduser
    debugger;
    let user = await collection.findOne({username});
 debugger;
    
    if (user && user.hangouts && user.hangouts.find(h=> h.username===search)) {
debugger;
      // search for users hangouts
   
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(
          JSON.stringify({
            hangouts: user.hangouts
          })
        );
        res.end();
      
    }
    else{
     debugger;
      let users = await collection.find({username:{$regex: new RegExp(search,'i')}}).project({salt:0,hash:0,iterations:0}).toArray();
     debugger;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(
        JSON.stringify({
          hangouts: users && users.map(u=>{return {...u,state:'INVITE'}})
        })
      );
      res.end();
    
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
