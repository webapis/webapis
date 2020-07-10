export default async function ({ req, res, collection }) {
  try {
    let invitations = null;
    invitations = await collection.find().toArray();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(
      JSON.stringify({
        invitations,
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
}
