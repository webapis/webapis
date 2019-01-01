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
        break;
      case clientCommands.BLOCK:
        break;
      case clientCommands.UNBLOCK:
        break;
      default:
        throw "No client command provided";
    }
  }
  function sendMessageBero() {}
  return children({
    sendMessageDemo,
    sendMessageBero,
    beroMessage,
    demoMessage,
  });
}
