const jwt = require('jsonwebtoken');
const bcrypt = require('crypto');

export default async function users(req, res) {
  try {
    const collectionName = 'users';
    const database = req.client.db('auth');
    const collection = database.collection(collectionName);

    debugger;
    //successful signup-------------------------------------
    let { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    debugger;
    const hash = await bcrypt.hash(password, salt);
    debugger;
     await collection.deleteMany();
    const result = await collection.insertOne({
      password: hash,
      email,
      username,
    });
    debugger;
    const user = result.ops[0];
    debugger;
    const payload = { id: user._id.toString(), name: user.email };
    debugger;
    const token = await jwt.sign(payload, process.env.secret, {
      expiresIn: 31556926,
    });
    debugger;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ token, username, email, password }));
    res.end();
  } catch (error) {
    const err = error;
    debugger;
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ error }));
    res.end();
  }
}
