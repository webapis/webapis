import { h, _ as _extends } from './index-a426f989.js';

function TextInput(props) {
  const {
    label,
    name,
    type,
    isValid,
    message
  } = props;
  return h("div", {
    className: "form-group p-0"
  }, h("label", {
    for: name
  }, label), h("input", _extends({
    type: type,
    className: `form-control ${isValid && 'is-valid'} ${!isValid && isValid !== undefined && 'is-invalid'}`,
    id: name,
    "aria-describedby": name
  }, props)), !isValid && h("small", {
    id: "emailHelp",
    className: `${!isValid && 'invalid-feedback'}`,
    "data-testid": `message-${name}`
  }, message));
}

function Button(props) {
  const {
    title,
    bg = "light",
    outline,
    size,
    loading = false,
    block
  } = props;
  return h("button", _extends({
    className: `${bg && !outline && `btn btn-${bg}`} ${outline && `btn btn-outline-${bg}`} ${size && `btn btn-${size}`} ${block && 'btn-block'}`
  }, props, {
    disabled: loading
  }), loading && h("span", {
    class: "spinner-border spinner-border-sm",
    role: "status",
    "aria-hidden": "true"
  }), loading ? 'wait...' : title);
}

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

export { Alert as A, Button as B, TextInput as T };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtMjc4ODk2YjkuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2NvbnRyb2xzL3RleHQtaW5wdXQvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9jb250cm9scy9idXR0b24vaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9jb250cm9scy9hbGVydC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGV4dElucHV0KHByb3BzKSB7XHJcbiAgY29uc3QgeyBsYWJlbCwgbmFtZSwgdHlwZSwgaXNWYWxpZCwgbWVzc2FnZSB9ID0gcHJvcHNcclxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwIHAtMFwiPlxyXG4gICAgPGxhYmVsIGZvcj17bmFtZX0gPntsYWJlbH08L2xhYmVsPlxyXG4gICAgPGlucHV0IHR5cGU9e3R5cGV9IGNsYXNzTmFtZT17YGZvcm0tY29udHJvbCAke2lzVmFsaWQgJiYgJ2lzLXZhbGlkJ30gJHshaXNWYWxpZCAmJiBpc1ZhbGlkICE9PSB1bmRlZmluZWQgJiYgJ2lzLWludmFsaWQnfWB9IGlkPXtuYW1lfSBhcmlhLWRlc2NyaWJlZGJ5PXtuYW1lfXsuLi5wcm9wc30gLz5cclxueyFpc1ZhbGlkICYmIDxzbWFsbCBpZD1cImVtYWlsSGVscFwiIGNsYXNzTmFtZT17YCR7IWlzVmFsaWQgJiYgJ2ludmFsaWQtZmVlZGJhY2snfWB9IGRhdGEtdGVzdGlkPXtgbWVzc2FnZS0ke25hbWV9YH0+e21lc3NhZ2V9PC9zbWFsbD59XHJcbiAgPC9kaXY+XHJcbn1cclxuIiwiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCdXR0b24ocHJvcHMpIHtcclxuICBjb25zdCB7IHRpdGxlLCBiZz1cImxpZ2h0XCIsb3V0bGluZSwgc2l6ZSxsb2FkaW5nPWZhbHNlLCBibG9ja30gPSBwcm9wcztcclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPGJ1dHRvbiBjbGFzc05hbWU9IHtgJHtiZyAmJiAhb3V0bGluZSYmYGJ0biBidG4tJHtiZ31gfSAke291dGxpbmUmJmBidG4gYnRuLW91dGxpbmUtJHtiZ31gfSAke3NpemUmJmBidG4gYnRuLSR7c2l6ZX1gfSAke2Jsb2NrICAmJiAnYnRuLWJsb2NrJ31gfSB7Li4ucHJvcHN9IGRpc2FibGVkPXtsb2FkaW5nfT5cclxuICAgICAgICB7bG9hZGluZyAmJiA8c3BhbiBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtXCIgcm9sZT1cInN0YXR1c1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj59IFxyXG4gICAgICAgIHsgbG9hZGluZyA/ICd3YWl0Li4uJzp0aXRsZX1cclxuICAgIDwvYnV0dG9uPlxyXG4gICk7XHJcbn1cclxuIiwiaW1wb3J0IHtofSBmcm9tICdwcmVhY3QnXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFsZXJ0IChwcm9wcyl7XHJcbmNvbnN0IHthbGVydCxtZXNzYWdlfT1wcm9wc1xyXG4gICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtgYWxlcnQgYWxlcnQtJHthbGVydH1gfSByb2xlPVwiYWxlcnRcIiBkYXRhLXRlc3RpZD1cImFsZXJ0XCI+XHJcbiAgICB7bWVzc2FnZX1cclxuICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxyXG4gICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cclxuICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxufSJdLCJuYW1lcyI6WyJUZXh0SW5wdXQiLCJwcm9wcyIsImxhYmVsIiwibmFtZSIsInR5cGUiLCJpc1ZhbGlkIiwibWVzc2FnZSIsInVuZGVmaW5lZCIsIkJ1dHRvbiIsInRpdGxlIiwiYmciLCJvdXRsaW5lIiwic2l6ZSIsImxvYWRpbmciLCJibG9jayIsIkFsZXJ0IiwiYWxlcnQiXSwibWFwcGluZ3MiOiI7O0FBSWUsU0FBU0EsU0FBVCxDQUFtQkMsS0FBbkIsRUFBMEI7QUFDdkMsUUFBTTtBQUFFQyxJQUFBQSxLQUFGO0FBQVNDLElBQUFBLElBQVQ7QUFBZUMsSUFBQUEsSUFBZjtBQUFxQkMsSUFBQUEsT0FBckI7QUFBOEJDLElBQUFBO0FBQTlCLE1BQTBDTCxLQUFoRDtBQUNBLFNBQU87QUFBSyxJQUFBLFNBQVMsRUFBQztBQUFmLEtBQ0w7QUFBTyxJQUFBLEdBQUcsRUFBRUU7QUFBWixLQUFvQkQsS0FBcEIsQ0FESyxFQUVMO0FBQU8sSUFBQSxJQUFJLEVBQUVFLElBQWI7QUFBbUIsSUFBQSxTQUFTLEVBQUcsZ0JBQWVDLE9BQU8sSUFBSSxVQUFXLElBQUcsQ0FBQ0EsT0FBRCxJQUFZQSxPQUFPLEtBQUtFLFNBQXhCLElBQXFDLFlBQWEsRUFBekg7QUFBNEgsSUFBQSxFQUFFLEVBQUVKLElBQWhJO0FBQXNJLHdCQUFrQkE7QUFBeEosS0FBaUtGLEtBQWpLLEVBRkssRUFHUixDQUFDSSxPQUFELElBQVk7QUFBTyxJQUFBLEVBQUUsRUFBQyxXQUFWO0FBQXNCLElBQUEsU0FBUyxFQUFHLEdBQUUsQ0FBQ0EsT0FBRCxJQUFZLGtCQUFtQixFQUFuRTtBQUFzRSxtQkFBYyxXQUFVRixJQUFLO0FBQW5HLEtBQXVHRyxPQUF2RyxDQUhKLENBQVA7QUFLRDs7QUNUYyxTQUFTRSxNQUFULENBQWdCUCxLQUFoQixFQUF1QjtBQUNwQyxRQUFNO0FBQUVRLElBQUFBLEtBQUY7QUFBU0MsSUFBQUEsRUFBRSxHQUFDLE9BQVo7QUFBb0JDLElBQUFBLE9BQXBCO0FBQTZCQyxJQUFBQSxJQUE3QjtBQUFrQ0MsSUFBQUEsT0FBTyxHQUFDLEtBQTFDO0FBQWlEQyxJQUFBQTtBQUFqRCxNQUEwRGIsS0FBaEU7QUFFQSxTQUNFO0FBQVEsSUFBQSxTQUFTLEVBQUksR0FBRVMsRUFBRSxJQUFJLENBQUNDLE9BQVAsSUFBaUIsV0FBVUQsRUFBRyxFQUFFLElBQUdDLE9BQU8sSUFBRyxtQkFBa0JELEVBQUcsRUFBRSxJQUFHRSxJQUFJLElBQUcsV0FBVUEsSUFBSyxFQUFFLElBQUdFLEtBQUssSUFBSyxXQUFZO0FBQS9JLEtBQXNKYixLQUF0SjtBQUE2SixJQUFBLFFBQVEsRUFBRVk7QUFBdkssTUFDS0EsT0FBTyxJQUFJO0FBQU0sSUFBQSxLQUFLLEVBQUMsa0NBQVo7QUFBK0MsSUFBQSxJQUFJLEVBQUMsUUFBcEQ7QUFBNkQsbUJBQVk7QUFBekUsSUFEaEIsRUFFTUEsT0FBTyxHQUFHLFNBQUgsR0FBYUosS0FGMUIsQ0FERjtBQU1EOztBQ1ZjLFNBQVNNLEtBQVQsQ0FBZ0JkLEtBQWhCLEVBQXNCO0FBQ3JDLFFBQU07QUFBQ2UsSUFBQUEsS0FBRDtBQUFPVixJQUFBQTtBQUFQLE1BQWdCTCxLQUF0QjtBQUNJLFNBQU87QUFBSyxJQUFBLFNBQVMsRUFBRyxlQUFjZSxLQUFNLEVBQXJDO0FBQXdDLElBQUEsSUFBSSxFQUFDLE9BQTdDO0FBQXFELG1CQUFZO0FBQWpFLEtBQ05WLE9BRE0sRUFFUDtBQUFRLElBQUEsSUFBSSxFQUFDLFFBQWI7QUFBc0IsSUFBQSxLQUFLLEVBQUMsT0FBNUI7QUFBb0Msb0JBQWEsT0FBakQ7QUFBeUQsa0JBQVc7QUFBcEUsS0FDQTtBQUFNLG1CQUFZO0FBQWxCLFlBREEsQ0FGTyxDQUFQO0FBTUg7Ozs7In0=
