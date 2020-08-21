export function generateBrowserId() {
  return Date.now() + 10;
}

export function saveBrowserIdToLocalStorage({ browserId }) {
  localStorage.setItem("browserId", JSON.stringify(browserId));
}

export function browserIdExists() {
  const browserId = JSON.parse(localStorage.getItem("browserId"));

  if (browserId) {
    return true;
  } else {
    return false;
  }
}

export function loadBrowserId() {
  return JSON.parse(localStorage.getItem("browserId"));
}
