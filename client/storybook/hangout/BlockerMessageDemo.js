import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import { BlockerMessage } from "features/hangouts/ui-components/messages/BlockerMessage";

const message = {
  text: "You can not send message because you are blocked",
  timestamp: 12323,
  username: "demo",
};
export function BlockerMessageDemo() {
  return <BlockerMessage message={message} />;
}
