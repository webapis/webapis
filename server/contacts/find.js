module.exports = async function ({ req, res, collection }) {
  try {
    let contacts = null;
    contacts = await collection.find().toArray();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(
      JSON.stringify({
        contacts,
      })
    );
    res.end();
  } catch (error) {
    const err = error;

    res.statusCode = 500;
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ error }));
    res.end();
  }
};
