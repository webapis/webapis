import {
  useEffect,
  useState,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/hooks.module.js";
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
