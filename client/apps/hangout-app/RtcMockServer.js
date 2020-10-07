import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import { clientCommands } from "../../features/hangouts/state/clientCommands";
import protocolSender from "./protocolSender";
export default function RtcMockServer({ children, user }) {
  const [message, setMessage] = useState(null);
  const [connectionState, setConnectionState] = useState("");
  const [offlineHangouts, setOfflineHangouts] = useState([]);
  useEffect(() => {
    if (connectionState === "open" && offlineHangouts.length > 0) {
      setMessage({
        data: { hangouts: offlineHangouts, type: "UNDELIVERED_HANGOUTS" },
        type: "HANGOUT",
      });
    }
  }, [connectionState, offlineHangouts]);

  useEffect(() => {
    if (user) {
      const username = user.username;

      window.addEventListener(username, function (e) {
        const { message: remoteMessage } = e.detail;
        if (user && connectionState === "open") {
          setMessage(remoteMessage);
          console.log(`${username},recieved event issssss:`, e.detail);
        } else if (user && connectionState === "offline") {
          const {
            data: { hangout },
          } = remoteMessage;

          setOfflineHangouts((prev) => [...prev, hangout]);
        }
      });
    }
  }, [user, connectionState]);
  function dispatchMessage(message) {
    const targetUsername =
      user.username === "demouser" ? "berouser" : "demouser";
    var event = new CustomEvent(targetUsername, {
      detail: {
        message,
      },
    });
    window.dispatchEvent(event);
  }
  function handleSendMessage({ sender, hangout, type }) {
    const { timestamp, browserId, target, email, message } = hangout;
    let localMessage = {};
    switch (hangout.command) {
      case clientCommands.INVITE:
        localMessage = {
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "INVITED",
              browserId,
              message,
            },
            sender,
          },
          type: "HANGOUT",
        };

        if (type === "OFFLINE_HANGOUTS") {
          // setOfflineHangouts((prev) => [...prev, localMessage]);
        } else {
          setMessage(localMessage);
        }
        setTimeout(() => {
          const remoteMessage = {
            data: {
              type: "HANGOUT",
              hangout: {
                target: sender,
                timestamp,
                email: `${sender}@gmail.com`,
                state: "INVITER",
                message,
              },
              sender,
            },
            type: "HANGOUT",
          };
          dispatchMessage(remoteMessage);
        }, 500);
        return localMessage;
      case clientCommands.ACCEPT:
        localMessage = {
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "ACCEPTED",
              browserId,
              message,
            },
            sender,
          },
          type: "HANGOUT",
        };
        // setMessage(localMessage);
        if (type === "OFFLINE_HANGOUTS") {
          // setOfflineHangouts((prev) => [...prev, localMessage]);
        } else {
          setMessage(localMessage);
        }
        setTimeout(() => {
          let remoteMessage = {
            data: {
              type: "HANGOUT",
              hangout: {
                target: sender,
                timestamp,
                email: `${sender}@gmail.com`,
                state: "ACCEPTER",
                message,
              },
              sender,
            },
            type: "HANGOUT",
          };
          dispatchMessage(remoteMessage);
        }, 500);
        return localMessage;
      case clientCommands.DECLINE:
        localMessage = {
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "DECLINED",
              browserId,
              message,
            },
            sender,
          },
          type: "HANGOUT",
        };
        //  setMessage(localMessage);
        if (type === "OFFLINE_HANGOUTS") {
          //  setOfflineHangouts((prev) => [...prev, localMessage]);
        } else {
          setMessage(localMessage);
        }
        // setTimeout(()=>{
        //   setMessage({
        //     data: {
        //       type: "HANGOUT",
        //       hangout: {
        //         target:sender,
        //         timestamp,
        //         email:`${sender}@gmail.com`,
        //         state: "DECLINER",
        //         message: data.message,
        //       }
        //     },
        //     type: "HANGOUT",
        //   });
        // },5000)
        return localMessage;
      case clientCommands.BLOCK:
        localMessage = {
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "BLOCKED",
              browserId,
              message,
            },
            sender,
          },
          type: "HANGOUT",
        };
        // setMessage(localMessage);
        if (type === "OFFLINE_HANGOUTS") {
          //setOfflineHangouts((prev) => [...prev, localMessage]);
        } else {
          setMessage(localMessage);
        }
        setTimeout(() => {
          let remoteMessage = {
            data: {
              type: "HANGOUT",
              hangout: {
                target: sender,
                timestamp,
                email: `${sender}@gmail.com`,
                state: "BLOCKER",
                message,
              },
              sender,
            },
            type: "HANGOUT",
          };
          dispatchMessage(remoteMessage);
        }, 500);
        return localMessage;
      case clientCommands.UNBLOCK:
        localMessage = {
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "UNBLOCKED",
              browserId,
              message,
            },
            sender,
          },
          type: "HANGOUT",
        };
        // setMessage(localMessage);
        if (type === "OFFLINE_HANGOUTS") {
          // setOfflineHangouts((prev) => [...prev, localMessage]);
        } else {
          setMessage(localMessage);
        }
        setTimeout(() => {
          let remoteMessage = {
            data: {
              type: "HANGOUT",
              hangout: {
                target: sender,
                timestamp,
                email: `${sender}@gmail.com`,
                state: "UNBLOCKER",
                message,
              },
              sender,
            },
            type: "HANGOUT",
          };
          dispatchMessage(remoteMessage);
        }, 500);
        return localMessage;
      case clientCommands.UNDECLINE:
        localMessage = {
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "UNDECLINED",
              browserId,
              message,
            },
            sender,
          },
          type: "HANGOUT",
        };
        // setMessage(localMessage);
        if (type === "OFFLINE_HANGOUTS") {
          // setOfflineHangouts((prev) => [...prev, localMessage]);
        } else {
          setMessage(localMessage);
        }
        setTimeout(() => {
          let remoteMessage = {
            data: {
              type: "HANGOUT",
              hangout: {
                target: sender,
                timestamp,
                email: `${sender}@gmail.com`,
                state: "UNDECLINER",
                message,
              },
              sender,
            },
            type: "HANGOUT",
          };
          dispatchMessage(remoteMessage);
        }, 500);
        return localMessage;
      case clientCommands.MESSAGE:
        localMessage = {
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "MESSAGED",
              browserId,
              message,
            },
            sender,
          },
          type: "HANGOUT",
        };
        //  setMessage(localMessage);
        if (type === "OFFLINE_HANGOUTS") {
          // setOfflineHangouts((prev) => [...prev, localMessage]);
        } else {
          setMessage(localMessage);
        }
        setTimeout(() => {
          let remoteMessage = {
            data: {
              type: "HANGOUT",
              hangout: {
                target: sender,
                timestamp,
                email: `${sender}@gmail.com`,
                state: "MESSANGER",
                message,
              },
              sender,
            },
            type: "HANGOUT",
          };
          dispatchMessage(remoteMessage);
        }, 500);
        return localMessage;
      default:
        throw "No client command provided";
    }
  }
  function sendMessage({ data, type }) {
    if (data.type === "HANGOUT") {
      const { hangout, sender } = data;
      handleSendMessage({ hangout, sender, type: data.type });
    } else if (data.type === "OFFLINE_HANGOUTS") {
      const { hangouts, sender } = data;

      hangouts.forEach((hangout, i) => {
        let hgs = [];

        hgs.push(handleSendMessage({ hangout, sender, type: data.type }));
        if (i + 1 === hangouts.length) {
          setMessage({
            data: {
              type: "OFFLINE_ACKHOWLEDGEMENT",
              hangouts: hgs,
              sender,
            },
            type: "HANGOUT",
          });
        }
      });
    }
  }
  function setRtcUrl() {
    let cState = localStorage.getItem("connectionState");

    setConnectionState(cState);
  }
  return children({
    message,
    sendMessage,
    connectionState,
    setRtcUrl,
  });
}
