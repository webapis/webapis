import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
export default function UnreadHangouts({
  unreadhangouts,
  onUnreadSelect,
  onUnreadRemove,
}) {
  return (
    <ul class="list-group">
      {unreadhangouts.length > 0 &&
        unreadhangouts.map((u) => {
          return (
            <li
              data-testid={u.username}
              onClick={() => onUnreadSelect({ hangout: u })}
              className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
            >
              {u.username},{u.message && u.message.text}
              <span
                onClick={() => {
                  onUnreadRemove({ hangout: u });
                }}
                className="btn badge badge-danger badge-pill"
              >
                X
              </span>
            </li>
          );
        })}
    </ul>
  );
}
