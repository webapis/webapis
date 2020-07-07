import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import List, { ListItem } from "controls/list";
import { reducerUnreadhangouts } from "features/hangouts/state/reduceUnreadhangouts";
export default function UnreadHangouts({
  unreadhangouts,
  onSelectUnread,
  onRemoveUnread,
}) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (unreadhangouts) {
      const reduced = reducerUnreadhangouts({ unreadhangouts });

      setItems(reduced);
    }
  }, [unreadhangouts]);

  return (
    <div data-testid="unreadhangouts" className="list-group">
      {items &&
        items.length > 0 &&
        items.map((u) => {
          return (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              onClick={onSelectUnread}
              id={u.username}
              data-testid={`${u.username}-select`}
            >
              {u.username} messages: {u.messageCount}
              <span
                className="badge badge-danger badge-pill"
                onClick={onRemoveUnread}
                id={u.username}
                data-testid={`${u.username}-remove`}
              >
                x
              </span>
            </li>
          );
        })}
    </div>
  );
}
