import { h } from './index-63ebe6d2.js';

function Alert(props) {
  const {
    alert,
    message
  } = props;
  return h("div", {
    className: `alert alert-${alert}`,
    role: "alert",
    "data-testid": "alert"
  }, message, h("button", {
    type: "button",
    class: "close",
    "data-dismiss": "alert",
    "aria-label": "Close"
  }, h("span", {
    "aria-hidden": "true"
  }, "\xD7")));
}

export { Alert as A };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtZjc3ZDZmYjQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2NvbnRyb2xzL2FsZXJ0L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aH0gZnJvbSAncHJlYWN0J1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBbGVydCAocHJvcHMpe1xyXG5jb25zdCB7YWxlcnQsbWVzc2FnZX09cHJvcHNcclxuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17YGFsZXJ0IGFsZXJ0LSR7YWxlcnR9YH0gcm9sZT1cImFsZXJ0XCIgZGF0YS10ZXN0aWQ9XCJhbGVydFwiPlxyXG4gICAge21lc3NhZ2V9XHJcbiAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj5cclxuICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XHJcbiAgPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcbn0iXSwibmFtZXMiOlsiQWxlcnQiLCJwcm9wcyIsImFsZXJ0IiwibWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7QUFDZSxTQUFTQSxLQUFULENBQWdCQyxLQUFoQixFQUFzQjtBQUNyQyxRQUFNO0FBQUNDLElBQUFBLEtBQUQ7QUFBT0MsSUFBQUE7QUFBUCxNQUFnQkYsS0FBdEI7QUFDSSxTQUFPO0FBQUssSUFBQSxTQUFTLEVBQUcsZUFBY0MsS0FBTSxFQUFyQztBQUF3QyxJQUFBLElBQUksRUFBQyxPQUE3QztBQUFxRCxtQkFBWTtBQUFqRSxLQUNOQyxPQURNLEVBRVA7QUFBUSxJQUFBLElBQUksRUFBQyxRQUFiO0FBQXNCLElBQUEsS0FBSyxFQUFDLE9BQTVCO0FBQW9DLG9CQUFhLE9BQWpEO0FBQXlELGtCQUFXO0FBQXBFLEtBQ0E7QUFBTSxtQkFBWTtBQUFsQixZQURBLENBRk8sQ0FBUDtBQU1IOzs7OyJ9
