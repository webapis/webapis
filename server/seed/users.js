const jwt = require("jsonwebtoken");
const passhash = require("../../server/auth/hashPassword");

module.exports = async function users(req, res) {
  try {
    const collectionName = "users";
    const database = req.client.db("auth");
    const collection = database.collection(collectionName);

    //successful signup-------------------------------------
    let { username, email, password } = req.body;

    const { hash, salt, iterations } = passhash.hashPassword(password);

    await collection.deleteMany({ username });
    const result = await collection.insertOne({
      hash,
      salt,
      iterations,
      email,
      username,
    });

    const user = result.ops[0];

    const payload = { id: user._id.toString(), name: user.email };

    const token = await jwt.sign(payload, process.env.secret, {
      expiresIn: 31556926,
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ token, username, email, password }));
    res.end();
  } catch (error) {
    const err = error;

    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error }));
    res.end();
  }
};
