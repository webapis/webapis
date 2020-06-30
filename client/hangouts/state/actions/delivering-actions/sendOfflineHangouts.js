
export function sendOfflineHangouts({ socket, name }) {
  const offlineHangoutKey = `${name}-offline-hangouts`;
  const offlineHangouts = JSON.parse(localStorage.getItem(offlineHangoutKey));
  if (offlineHangouts) {
    offlineHangouts.foreEach((h) => {
      socket.send(
        JSON.stringify({
          username: h.username,
          email: h.email,
          message: h.message,
          timestamp: h.timestamp,
          command: h.state,
          offline: true,
        })
      );
    });
  }
  return;
}
