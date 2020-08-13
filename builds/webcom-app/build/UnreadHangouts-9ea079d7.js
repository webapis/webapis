import { h } from "./index-c4021a67.js";

function UnreadHangouts({ unreadhangouts, onUnreadSelect, onUnreadRemove }) {
  return h(
    "ul",
    {
      class: "list-group",
    },
    unreadhangouts.length > 0 &&
      unreadhangouts.map((u) => {
        return h(
          "li",
          {
            "data-testid": u.username,
            onClick: () =>
              onUnreadSelect({
                hangout: u,
              }),
            className:
              "list-group-item d-flex justify-content-between align-items-center list-group-item-action",
          },
          u.username,
          ",",
          u.message && u.message.text,
          h(
            "span",
            {
              onClick: () => {
                onUnreadRemove({
                  hangout: u,
                });
              },
              className: "btn badge badge-danger badge-pill",
            },
            "X"
          )
        );
      })
  );
}

export default UnreadHangouts;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5yZWFkSGFuZ291dHMtOWVhMDc5ZDcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9oYW5nb3V0cy91aS1jb21wb25lbnRzL1VucmVhZEhhbmdvdXRzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBVbnJlYWRIYW5nb3V0cyh7XG4gIHVucmVhZGhhbmdvdXRzLFxuICBvblVucmVhZFNlbGVjdCxcbiAgb25VbnJlYWRSZW1vdmUsXG59KSB7XG4gIHJldHVybiAoXG4gICAgPHVsIGNsYXNzPVwibGlzdC1ncm91cFwiPlxuICAgICAge3VucmVhZGhhbmdvdXRzLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgdW5yZWFkaGFuZ291dHMubWFwKCh1KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxsaVxuICAgICAgICAgICAgICBkYXRhLXRlc3RpZD17dS51c2VybmFtZX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25VbnJlYWRTZWxlY3QoeyBoYW5nb3V0OiB1IH0pfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJsaXN0LWdyb3VwLWl0ZW0gZC1mbGV4IGp1c3RpZnktY29udGVudC1iZXR3ZWVuIGFsaWduLWl0ZW1zLWNlbnRlciBsaXN0LWdyb3VwLWl0ZW0tYWN0aW9uXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3UudXNlcm5hbWV9LHt1Lm1lc3NhZ2UgJiYgdS5tZXNzYWdlLnRleHR9XG4gICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgb25VbnJlYWRSZW1vdmUoeyBoYW5nb3V0OiB1IH0pO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJhZGdlIGJhZGdlLWRhbmdlciBiYWRnZS1waWxsXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIFhcbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICApO1xuICAgICAgICB9KX1cbiAgICA8L3VsPlxuICApO1xufVxuIl0sIm5hbWVzIjpbIlVucmVhZEhhbmdvdXRzIiwidW5yZWFkaGFuZ291dHMiLCJvblVucmVhZFNlbGVjdCIsIm9uVW5yZWFkUmVtb3ZlIiwibGVuZ3RoIiwibWFwIiwidSIsInVzZXJuYW1lIiwiaGFuZ291dCIsIm1lc3NhZ2UiLCJ0ZXh0Il0sIm1hcHBpbmdzIjoiOztBQUNlLFNBQVNBLGNBQVQsQ0FBd0I7QUFDckNDLEVBQUFBLGNBRHFDO0FBRXJDQyxFQUFBQSxjQUZxQztBQUdyQ0MsRUFBQUE7QUFIcUMsQ0FBeEIsRUFJWjtBQUNELFNBQ0U7QUFBSSxJQUFBLEtBQUssRUFBQztBQUFWLEtBQ0dGLGNBQWMsQ0FBQ0csTUFBZixHQUF3QixDQUF4QixJQUNDSCxjQUFjLENBQUNJLEdBQWYsQ0FBb0JDLENBQUQsSUFBTztBQUN4QixXQUNFO0FBQ0UscUJBQWFBLENBQUMsQ0FBQ0MsUUFEakI7QUFFRSxNQUFBLE9BQU8sRUFBRSxNQUFNTCxjQUFjLENBQUM7QUFBRU0sUUFBQUEsT0FBTyxFQUFFRjtBQUFYLE9BQUQsQ0FGL0I7QUFHRSxNQUFBLFNBQVMsRUFBQztBQUhaLE9BS0dBLENBQUMsQ0FBQ0MsUUFMTCxPQUtnQkQsQ0FBQyxDQUFDRyxPQUFGLElBQWFILENBQUMsQ0FBQ0csT0FBRixDQUFVQyxJQUx2QyxFQU1FO0FBQ0UsTUFBQSxPQUFPLEVBQUUsTUFBTTtBQUNiUCxRQUFBQSxjQUFjLENBQUM7QUFBRUssVUFBQUEsT0FBTyxFQUFFRjtBQUFYLFNBQUQsQ0FBZDtBQUNELE9BSEg7QUFJRSxNQUFBLFNBQVMsRUFBQztBQUpaLFdBTkYsQ0FERjtBQWlCRCxHQWxCRCxDQUZKLENBREY7QUF3QkQ7Ozs7In0=
