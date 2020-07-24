module.exports.sendErrors = async function ({ req, res, collection }) {
  try {
    const errors = await collection.find().toArray();
    debugger;
    res.statusCode = 200;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ errors }));
    res.end();
    debugger;
  } catch (error) {
    debugger;
  }
};
//
module.exports.saveError = async function ({ req, res, collection }) {
  try {
    let error = req.body;
    const { message, stack } = error;
    const ip = req.connection.remoteAddress;
    const trimip = ip.slice(ip.lastIndexOf(":") + 1);
    const timestamp = Date.now();
    const rawHeaders = req.rawHeaders;
    debugger;
    const insertResult = await collection.insertOne({ message, stack });
  } catch (error) {
    debugger;
  }
};
