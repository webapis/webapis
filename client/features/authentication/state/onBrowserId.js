export default function createBrowserId({ username }) {
  const browserId = JSON.parse(localStorage.getItem(`${username}-browserId`));
  if (!browserId) {
    let newbrowserId = Date.now() + 10;
    localStorage.setItem(`${username}-browserId`, JSON.stringify(newbrowserId));
  }
}
