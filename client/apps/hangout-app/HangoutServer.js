import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import { clientCommands } from "../../features/hangouts/state/clientCommands";
export default function HangoutServer({ children }) {
  const [demoMessage, setDemoState] = useState(null);
  const [beroMessage, setBeroState] = useState(null);

  useEffect(() => {
    const beroInitState = JSON.parse(localStorage.getItem("beroInitState"));

    setBeroState(beroInitState);
    setDemoState(JSON.parse(localStorage.getItem("demoInitState")));
  }, []);

  function sendMessageDemo({ data, type }) {
    const { timestamp, browserId } = data;

    switch (data.command) {
      case clientCommands.INVITE:
        setDemoState({
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target: "berouser",
              timestamp,
              email: "berouser@gmail.com",
              state: "INVITED",
              browserId,
              message: data.message,
            },
          },
          type: "HANGOUT",
        });
        setBeroState({
          data: {
            type: "HANGOUT",
            hangout: {
              target: "demouser",
              timestamp,
              email: "demouser@gmail.com",
              state: "INVITER",
              message: data.message,
            },
          },
          type: "HANGOUT",
        });
        break;
      case clientCommands.ACCEPT:
        break;
      case clientCommands.DECLINE:
        break;
      case clientCommands.MESSAGE:
        setDemoState({
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target: "berouser",
              email: "berouser@gmail.com",
              state: "MESSAGED",
              timestamp,
              message: data.message,
            },
          },
          type: "HANGOUT",
        });

        setBeroState({
          data: {
            type: "HANGOUT",
            hangout: {
              target: "demouser",
              email: "demouser@gmail.com",
              state: "MESSANGER",
              message: data.message,
              timestamp,
            },
          },
          type: "HANGOUT",
        });
        break;
      case clientCommands.BLOCK:
        break;
      case clientCommands.UNBLOCK:
        break;
      default:
        throw "No client command provided";
    }
  }
  function sendMessageBero({ data, type }) {
    const { timestamp, browserId } = data;

    switch (data.command) {
      case clientCommands.ACCEPT:
        setBeroState({
          data: {
            hangout: {
              target: "demouser",
              timestamp,
              email: "demouser@gmail.com",
              state: "ACCEPTED",
              message: data.message,
            },
            type: "ACKHOWLEDGEMENT",
          },
          type: "HANGOUT",
        });

        setDemoState({
          type: "HANGOUT",
          data: {
            type: "HANGOUT",
            hangout: {
              state: "ACCEPTER",
              timestamp,
              message: data.message,
              target: "berouser",
              email: "berouser@gmail.com",
            },
          },
        });
        break;
      case clientCommands.MESSAGE:
        setBeroState({
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              state: "MESSAGED",
              timestamp,
              message: data.message,
              target: "demouser",
              email: "demouser@gmail.com",
            },
          },
          type: "HANGOUT",
        });
        setDemoState({
          data: {
            type: "HANGOUT",
            hangout: {
              target: "berouser",
              email: "berouser@gmail.com",
              message: data.message,
              state: "MESSANGER",
            },
          },
          type: "HANGOUT",
        });
        break;
      case clientCommands.BLOCK:
        setBeroState({
          data: {
            type: "ACKHOWLEDGEMENT",
            hangout: {
              target: "demouser",
              email: "demouser@gmail.com",
              state: "BLOCKED",
              message: data.message,
              timestamp: Date.now(),
            },
          },
          type: "HANGOUT",
        });

        setDemoState({
          data: {
            type: "HANGOUT",
            hangout: {
              target: "berouser",
              email: "berouser@gmail.com",
              state: "BLOCKER",
              message: { type: "blocker", message: "", timestamp: Date.now() },
              timestamp: Date.now(),
            },
          },
          type: "HANGOUT",
        });
        break;
      default:
        throw "No client command provided";
    }
  }
  return children({
    sendMessageDemo,
    sendMessageBero,
    beroMessage,
    demoMessage,
  });
}
