module.exports = async function hangouts(req, res) {
  try {
    const collectionName = "users";
    const database = req.client.db("hangouts");
    const collection = database.collection(collectionName);
    //successful signup-------------------------------------

    await collection.deleteMany({});
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "hangouts user is deleted" }));
    res.end();
  } catch (error) {
    const err = error;

    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error }));
    res.end();
  }
};
