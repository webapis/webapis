export function generateBrowserId() {
  return Date.now() + 10;
}

export function saveBrowserIdToLocalStorage({ username, browserId }) {
  localStorage.setItem(`${username}-browserId`, JSON.stringify(browserId));
}

export function browserIdExists({ username }) {
  return JSON.parse(localStorage.getItem(`${username}-browserId`));
}

export function loadBrowserId({ username }) {
  return JSON.parse(localStorage.getItem(`${username}-browserId`));
}
