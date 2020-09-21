let demoAuthState = JSON.stringify({
  user: {
    username: "demouser",
    email: "demouser@gmail.com",
    browserId: "1234567890",
  },
  browsers: [{ browserId: "1234567890" }],
});
let beroAuthState = JSON.stringify({
  user: {
    username: "berouser",
    email: "berouser@gmail.com",
    browserId: "1234567890",
  },
  browsers: [{ browserId: "1234567890" }],
});

exports.hgws = {
  rtcUrl: ({ PORT }) => {
    return `wss://localhost:${PORT}/hangout-app/unauthed-msg`;
  },
};
exports.hgmock = {
  rtcUrl: ({ PORT }) => {
    return `kk`;
  },
};
exports.hgwsmb = {
  rtcUrl: ({ PORT }) => {
    return `"wss://localhost:${PORT}/mongodb/hangout-app/unauthed-msg"`;
  },
};

exports.ws = {
  rtcUrl: ({ PORT }) => {
    return `wss://localhost:${PORT}/websocket-app/unauthed-msg`;
  },
};
