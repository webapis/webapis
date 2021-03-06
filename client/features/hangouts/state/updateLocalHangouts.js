export function updateLocalHangouts({ hangout, username }) {
  const key = `${username}-hangouts`;
  const hangouts = JSON.parse(localStorage.getItem(key));
  if (hangouts) {
    const hangoutExists = hangouts.find((g) => g.username === hangout.username);
    if (hangoutExists) {
      const updatedHangout = hangouts.map((g) => {
        if (g.username === hangout.username) {
          return hangout;
        } else {
          return g;
        }
      });
    } else {
    }
  } else {
  }
}
