import url from 'url';
export default async function ({ req, res, collection }) {
  try {
    let users = null;
    let search = url.parse(req.url, true).query.search;
    debugger;
    users = await collection.find({ username: search }).toArray();
    

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(
      JSON.stringify({
        users: users.map(user=> { return {username:user.username, email:user.email}}),
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
