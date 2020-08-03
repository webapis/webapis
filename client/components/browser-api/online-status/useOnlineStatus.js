import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
export default function useOnlineStatus() {
  const [onlineStatus, setOnlineStatus] = useState(false);
  useEffect(() => {
    navigator.onLine ? setOnlineStatus(true) : setOnlineStatus(false);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
  }, []);

  function updateOnlineStatus(e) {
    navigator.onLine ? setOnlineStatus(true) : setOnlineStatus(false);
  }
  return { onlineStatus };
}
