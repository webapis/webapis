module.exports = function htmlTemplate({ type }) {
  switch (type) {
    case "GUEST_INVITATION":
      return "<b>Guest invitation</b>";
    default:
      throw "message type is not specified";
  }
};
