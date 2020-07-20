import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";
export default function useOnlineStatus() {
  const [onlineStatus, setOnlineStatus] = useState(false);
  useEffect(() => {
    navigator.onLine ? setOnlineStatus(true) : setOnlineStatus(false);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
  }, []);

  function updateOnlineStatus(e) {
    debugger;
    navigator.onLine ? setOnlineStatus(true) : setOnlineStatus(false);
  }
  return { onlineStatus };
}
