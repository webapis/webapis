import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import Unread from "features/hangouts/ui-components/UnreadHangouts";
import { reducerUnreadhangouts } from "features/hangouts/state/reduceUnreadhangouts";
const unreads = [
  {
    username: "demo",
    state: "MESSANGER",
    message: { text: "Hello you", timestamp: 1591810458630 },
  },

  {
    username: "demo",
    state: "MESSANGER",
    message: { text: "Hello you", timestamp: 1591810458630 },
  },
  {
    username: "bero",
    state: "MESSANGER",
    message: { text: "Hello you", timestamp: 1591810458630 },
  },
];

export function UnreadDemo() {
  return (
    <Unread
      unreadhangouts={reducerUnreadhangouts({ unreadhangouts: unreads })}
    />
  );
}
