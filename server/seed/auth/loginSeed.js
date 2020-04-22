//const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
export default async function loginSeed(req, res) {
  try {
    const collection = req.collection;
    const deleteResult = await collection.deleteMany();
    debugger;
    const salt = await bcrypt.genSalt(10);
    debugger;
    const hash = await bcrypt.hash(password, salt);
    const result = await collection.insertOne({
      password: hash,
      email,
      username,
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ token }));
    res.end();
    debugger;
  } catch (error) {
    let err = error;
    debugger;
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error }));
    res.end();
  }
}
