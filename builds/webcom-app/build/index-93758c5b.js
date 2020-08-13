import { h, _ as _extends } from "./index-c4021a67.js";

function Button(props) {
  const { title, bg = "light", outline, size, loading = false, block } = props;
  return h(
    "button",
    _extends(
      {
        className: `${bg && !outline && `btn btn-${bg}`} ${
          outline && `btn btn-outline-${bg}`
        } ${size && `btn btn-${size}`} ${block && "btn-block"}`,
      },
      props,
      {
        disabled: loading,
      }
    ),
    loading &&
      h("span", {
        class: "spinner-border spinner-border-sm",
        role: "status",
        "aria-hidden": "true",
      }),
    loading ? "wait..." : title
  );
}

export { Button as B };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtOTM3NThjNWIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2NvbnRyb2xzL2J1dHRvbi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCdXR0b24ocHJvcHMpIHtcbiAgY29uc3QgeyB0aXRsZSwgYmcgPSBcImxpZ2h0XCIsIG91dGxpbmUsIHNpemUsIGxvYWRpbmcgPSBmYWxzZSwgYmxvY2sgfSA9IHByb3BzO1xuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgY2xhc3NOYW1lPXtgJHtiZyAmJiAhb3V0bGluZSAmJiBgYnRuIGJ0bi0ke2JnfWB9ICR7XG4gICAgICAgIG91dGxpbmUgJiYgYGJ0biBidG4tb3V0bGluZS0ke2JnfWBcbiAgICAgIH0gJHtzaXplICYmIGBidG4gYnRuLSR7c2l6ZX1gfSAke2Jsb2NrICYmIFwiYnRuLWJsb2NrXCJ9YH1cbiAgICAgIHsuLi5wcm9wc31cbiAgICAgIGRpc2FibGVkPXtsb2FkaW5nfVxuICAgID5cbiAgICAgIHtsb2FkaW5nICYmIChcbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtXCJcbiAgICAgICAgICByb2xlPVwic3RhdHVzXCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICA+PC9zcGFuPlxuICAgICAgKX1cbiAgICAgIHtsb2FkaW5nID8gXCJ3YWl0Li4uXCIgOiB0aXRsZX1cbiAgICA8L2J1dHRvbj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJCdXR0b24iLCJwcm9wcyIsInRpdGxlIiwiYmciLCJvdXRsaW5lIiwic2l6ZSIsImxvYWRpbmciLCJibG9jayJdLCJtYXBwaW5ncyI6Ijs7QUFFZSxTQUFTQSxNQUFULENBQWdCQyxLQUFoQixFQUF1QjtBQUNwQyxRQUFNO0FBQUVDLElBQUFBLEtBQUY7QUFBU0MsSUFBQUEsRUFBRSxHQUFHLE9BQWQ7QUFBdUJDLElBQUFBLE9BQXZCO0FBQWdDQyxJQUFBQSxJQUFoQztBQUFzQ0MsSUFBQUEsT0FBTyxHQUFHLEtBQWhEO0FBQXVEQyxJQUFBQTtBQUF2RCxNQUFpRU4sS0FBdkU7QUFFQSxTQUNFO0FBQ0UsSUFBQSxTQUFTLEVBQUcsR0FBRUUsRUFBRSxJQUFJLENBQUNDLE9BQVAsSUFBbUIsV0FBVUQsRUFBRyxFQUFFLElBQzlDQyxPQUFPLElBQUssbUJBQWtCRCxFQUFHLEVBQ2xDLElBQUdFLElBQUksSUFBSyxXQUFVQSxJQUFLLEVBQUUsSUFBR0UsS0FBSyxJQUFJLFdBQVk7QUFIeEQsS0FJTU4sS0FKTjtBQUtFLElBQUEsUUFBUSxFQUFFSztBQUxaLE1BT0dBLE9BQU8sSUFDTjtBQUNFLElBQUEsS0FBSyxFQUFDLGtDQURSO0FBRUUsSUFBQSxJQUFJLEVBQUMsUUFGUDtBQUdFLG1CQUFZO0FBSGQsSUFSSixFQWNHQSxPQUFPLEdBQUcsU0FBSCxHQUFlSixLQWR6QixDQURGO0FBa0JEOzs7OyJ9
