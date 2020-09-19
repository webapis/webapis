import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import { clientCommands } from "../../features/hangouts/state/clientCommands";
import protocolSender from "./protocolSender";
export default function HangoutServer({ children }) {
  const [message, setMessage] = useState(null);

  function sendMessage({ data, type, sender }) {
    const { timestamp, browserId, target, email } = data;
    switch (data.command) {
      case clientCommands.INVITE:
        setMessage({
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "INVITED",
              browserId,
              message: data.message,
            },
            sender,
          },
          type: "HANGOUT",
        });

        setTimeout(() => {
          setMessage({
            data: {
              type: "HANGOUT",
              hangout: {
                target: sender,
                timestamp,
                email: `${sender}@gmail.com`,
                state: "INVITER",
                message: data.message,
              },
              sender,
            },
            type: "HANGOUT",
          });
        }, 500);
        break;
      case clientCommands.ACCEPT:
        setMessage({
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "ACCEPTED",
              browserId,
              message: data.message,
            },
            sender,
          },
          type: "HANGOUT",
        });

        setTimeout(() => {
          setMessage({
            data: {
              type: "HANGOUT",
              hangout: {
                target: sender,
                timestamp,
                email: `${sender}@gmail.com`,
                state: "ACCEPTER",
                message: data.message,
              },
              sender,
            },
            type: "HANGOUT",
          });
        }, 500);
        break;
      case clientCommands.DECLINE:
        setMessage({
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "DECLINED",
              browserId,
              message: data.message,
            },
            sender,
          },
          type: "HANGOUT",
        });

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
        break;
      case clientCommands.BLOCK:
        setMessage({
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "BLOCKED",
              browserId,
              message: data.message,
            },
            sender,
          },
          type: "HANGOUT",
        });

        setTimeout(() => {
          setMessage({
            data: {
              type: "HANGOUT",
              hangout: {
                target: sender,
                timestamp,
                email: `${sender}@gmail.com`,
                state: "BLOCKER",
                message: data.message,
              },
              sender,
            },
            type: "HANGOUT",
          });
        }, 500);
        break;
      case clientCommands.UNBLOCK:
        setMessage({
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "UNBLOCKED",
              browserId,
              message: data.message,
            },
            sender,
          },
          type: "HANGOUT",
        });

        setTimeout(() => {
          setMessage({
            data: {
              type: "HANGOUT",
              hangout: {
                target: sender,
                timestamp,
                email: `${sender}@gmail.com`,
                state: "UNBLOCKER",
                message: data.message,
              },
              sender,
            },
            type: "HANGOUT",
          });
        }, 500);
        break;
      case clientCommands.UNDECLINE:
        setMessage({
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "UNDECLINED",
              browserId,
              message: data.message,
            },
            sender,
          },
          type: "HANGOUT",
        });

        setTimeout(() => {
          setMessage({
            data: {
              type: "HANGOUT",
              hangout: {
                target: sender,
                timestamp,
                email: `${sender}@gmail.com`,
                state: "UNDECLINER",
                message: data.message,
              },
              sender,
            },
            type: "HANGOUT",
          });
        }, 500);
        break;
      case clientCommands.MESSAGE:
        setMessage({
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target,
              timestamp,
              email,
              state: "MESSAGED",
              browserId,
              message: data.message,
            },
            sender,
          },
          type: "HANGOUT",
        });

        setTimeout(() => {
          setMessage({
            data: {
              type: "HANGOUT",
              hangout: {
                target: sender,
                timestamp,
                email: `${sender}@gmail.com`,
                state: "MESSANGER",
                message: data.message,
              },
              sender,
            },
            type: "HANGOUT",
          });
        }, 500);
        break;
      default:
        throw "No client command provided";
    }
  }

  return children({
    message,
    sendMessage,
    connectionState: "open",
  });
}
