import url from 'url';
export default async function ({ req, res, collection }) {
  try {
    let users = null;
    let filter = url.parse(req.url, true).query.filter;
    
    users = await collection.find({ username: filter }).toArray();
    

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(
      JSON.stringify({
        users,
      })
    );
    res.end();
  } catch (error) {
    const err = error;
    
    res.statusCode = 500;
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error }));
    res.end();
  }
}
