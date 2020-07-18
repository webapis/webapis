import { useEffect, useState } from "preact/hooks";
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
