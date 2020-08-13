module.exports.containsHttpAuthHeader = function (req) {
  // check for basic auth header
  if (
    (req.headers["authorization"] &&
      req.headers["authorization"].indexOf("Basic ") !== -1) ||
    req.headers["authorization"].indexOf("Bearer ") !== -1
  ) {
    return true;
  } else {
    return false;
  }
};

module.exports.getAuthType = function (req) {
  if (req.headers["authorization"].startsWith("Bearer ")) {
    return "Bearer";
  }
  if (req.headers["authorization"].startsWith("Basic ")) {
    return "Basic";
  } else {
    return null;
  }
};

module.exports.getCredentials = function (req) {
  try {
    const base64Credentials = req.headers.authorization.substring(
      "Basic ".length
    );

    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );

    const [emailorusername, password] = credentials.split(":");

    return { emailorusername, password };
  } catch (error) {
    return error;
  }
};

module.exports.getToken = function (req) {
  return req.headers.authorization.substring("Bearer ".length);
};
