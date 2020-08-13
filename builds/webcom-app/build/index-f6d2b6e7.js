import { h } from "./index-c4021a67.js";

function Alert(props) {
  const { alert, message } = props;
  return h(
    "div",
    {
      className: `alert alert-${alert}`,
      role: "alert",
      "data-testid": "alert",
    },
    message,
    h(
      "button",
      {
        type: "button",
        class: "close",
        "data-dismiss": "alert",
        "aria-label": "Close",
      },
      h(
        "span",
        {
          "aria-hidden": "true",
        },
        "\xD7"
      )
    )
  );
}

export { Alert as A };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtZjZkMmI2ZTcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2NvbnRyb2xzL2FsZXJ0L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydChwcm9wcykge1xuICBjb25zdCB7IGFsZXJ0LCBtZXNzYWdlIH0gPSBwcm9wcztcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17YGFsZXJ0IGFsZXJ0LSR7YWxlcnR9YH0gcm9sZT1cImFsZXJ0XCIgZGF0YS10ZXN0aWQ9XCJhbGVydFwiPlxuICAgICAge21lc3NhZ2V9XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzcz1cImNsb3NlXCJcbiAgICAgICAgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIlxuICAgICAgICBhcmlhLWxhYmVsPVwiQ2xvc2VcIlxuICAgICAgPlxuICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiQWxlcnQiLCJwcm9wcyIsImFsZXJ0IiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7QUFDZSxTQUFTQSxLQUFULENBQWVDLEtBQWYsRUFBc0I7QUFDbkMsUUFBTTtBQUFFQyxJQUFBQSxLQUFGO0FBQVNDLElBQUFBO0FBQVQsTUFBcUJGLEtBQTNCO0FBQ0EsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFHLGVBQWNDLEtBQU0sRUFBckM7QUFBd0MsSUFBQSxJQUFJLEVBQUMsT0FBN0M7QUFBcUQsbUJBQVk7QUFBakUsS0FDR0MsT0FESCxFQUVFO0FBQ0UsSUFBQSxJQUFJLEVBQUMsUUFEUDtBQUVFLElBQUEsS0FBSyxFQUFDLE9BRlI7QUFHRSxvQkFBYSxPQUhmO0FBSUUsa0JBQVc7QUFKYixLQU1FO0FBQU0sbUJBQVk7QUFBbEIsWUFORixDQUZGLENBREY7QUFhRDs7OzsifQ==
