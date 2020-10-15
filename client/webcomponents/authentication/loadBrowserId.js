export default function loadBrowserId() {
  if (localStorage.getItem("browserId")) {
    return localStorage.getItem("browserId");
  } else {
    let browserId = `BID${Date.now()}`;
    localStorage.setItem("browserId", browserId);
    return browserId;
  }
}
