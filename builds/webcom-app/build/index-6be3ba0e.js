import { h, _ as _extends } from './index-e818a723.js';

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
    className: `${!isValid && 'invalid-feedback'}`
  }, message));
}

function Button(props) {
  const {
    title,
    bg = "light",
    outline,
    size,
    loading = false
  } = props;
  return h("button", _extends({
    className: `${bg && !outline && `btn btn-${bg}`} ${outline && `btn btn-outline-${bg}`} ${size && `btn btn-${size}`}`
  }, props, {
    disabled: loading
  }), loading && h("span", {
    class: "spinner-border spinner-border-sm",
    role: "status",
    "aria-hidden": "true"
  }), loading ? 'wait...' : title);
}

export { Button as B, TextInput as T };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtNmJlM2JhMGUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2NvbnRyb2xzL3RleHQtaW5wdXQvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9jb250cm9scy9idXR0b24vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRleHRJbnB1dChwcm9wcykge1xyXG4gIGNvbnN0IHsgbGFiZWwsIG5hbWUsIHR5cGUsIGlzVmFsaWQsIG1lc3NhZ2UgfSA9IHByb3BzXHJcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cCBwLTBcIj5cclxuICAgIDxsYWJlbCBmb3I9e25hbWV9ID57bGFiZWx9PC9sYWJlbD5cclxuICAgIDxpbnB1dCB0eXBlPXt0eXBlfSBjbGFzc05hbWU9e2Bmb3JtLWNvbnRyb2wgJHtpc1ZhbGlkICYmICdpcy12YWxpZCd9ICR7IWlzVmFsaWQgJiYgaXNWYWxpZCAhPT0gdW5kZWZpbmVkICYmICdpcy1pbnZhbGlkJ31gfSBpZD17bmFtZX0gYXJpYS1kZXNjcmliZWRieT17bmFtZX17Li4ucHJvcHN9IC8+XHJcbnshaXNWYWxpZCAmJiA8c21hbGwgaWQ9XCJlbWFpbEhlbHBcIiBjbGFzc05hbWU9e2AkeyFpc1ZhbGlkICYmICdpbnZhbGlkLWZlZWRiYWNrJ31gfT57bWVzc2FnZX08L3NtYWxsPn1cclxuICA8L2Rpdj5cclxufVxyXG4iLCJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJ1dHRvbihwcm9wcykge1xyXG4gIGNvbnN0IHsgdGl0bGUsIGJnPVwibGlnaHRcIixvdXRsaW5lLCBzaXplLGxvYWRpbmc9ZmFsc2V9ID0gcHJvcHM7XHJcbiAgXHJcbiAgcmV0dXJuIChcclxuICAgIDxidXR0b24gY2xhc3NOYW1lPSB7YCR7YmcgJiYgIW91dGxpbmUmJmBidG4gYnRuLSR7Ymd9YH0gJHtvdXRsaW5lJiZgYnRuIGJ0bi1vdXRsaW5lLSR7Ymd9YH0gJHtzaXplJiZgYnRuIGJ0bi0ke3NpemV9YH1gfSB7Li4ucHJvcHN9IGRpc2FibGVkPXtsb2FkaW5nfT5cclxuICAgICAgICB7bG9hZGluZyAmJiA8c3BhbiBjbGFzcz1cInNwaW5uZXItYm9yZGVyIHNwaW5uZXItYm9yZGVyLXNtXCIgcm9sZT1cInN0YXR1c1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj59IFxyXG4gICAgICAgIHsgbG9hZGluZyA/ICd3YWl0Li4uJzp0aXRsZX1cclxuICAgIDwvYnV0dG9uPlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIlRleHRJbnB1dCIsInByb3BzIiwibGFiZWwiLCJuYW1lIiwidHlwZSIsImlzVmFsaWQiLCJtZXNzYWdlIiwidW5kZWZpbmVkIiwiQnV0dG9uIiwidGl0bGUiLCJiZyIsIm91dGxpbmUiLCJzaXplIiwibG9hZGluZyJdLCJtYXBwaW5ncyI6Ijs7QUFJZSxTQUFTQSxTQUFULENBQW1CQyxLQUFuQixFQUEwQjtBQUN2QyxRQUFNO0FBQUVDLElBQUFBLEtBQUY7QUFBU0MsSUFBQUEsSUFBVDtBQUFlQyxJQUFBQSxJQUFmO0FBQXFCQyxJQUFBQSxPQUFyQjtBQUE4QkMsSUFBQUE7QUFBOUIsTUFBMENMLEtBQWhEO0FBQ0EsU0FBTztBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDTDtBQUFPLElBQUEsR0FBRyxFQUFFRTtBQUFaLEtBQW9CRCxLQUFwQixDQURLLEVBRUw7QUFBTyxJQUFBLElBQUksRUFBRUUsSUFBYjtBQUFtQixJQUFBLFNBQVMsRUFBRyxnQkFBZUMsT0FBTyxJQUFJLFVBQVcsSUFBRyxDQUFDQSxPQUFELElBQVlBLE9BQU8sS0FBS0UsU0FBeEIsSUFBcUMsWUFBYSxFQUF6SDtBQUE0SCxJQUFBLEVBQUUsRUFBRUosSUFBaEk7QUFBc0ksd0JBQWtCQTtBQUF4SixLQUFpS0YsS0FBakssRUFGSyxFQUdSLENBQUNJLE9BQUQsSUFBWTtBQUFPLElBQUEsRUFBRSxFQUFDLFdBQVY7QUFBc0IsSUFBQSxTQUFTLEVBQUcsR0FBRSxDQUFDQSxPQUFELElBQVksa0JBQW1CO0FBQW5FLEtBQXVFQyxPQUF2RSxDQUhKLENBQVA7QUFLRDs7QUNUYyxTQUFTRSxNQUFULENBQWdCUCxLQUFoQixFQUF1QjtBQUNwQyxRQUFNO0FBQUVRLElBQUFBLEtBQUY7QUFBU0MsSUFBQUEsRUFBRSxHQUFDLE9BQVo7QUFBb0JDLElBQUFBLE9BQXBCO0FBQTZCQyxJQUFBQSxJQUE3QjtBQUFrQ0MsSUFBQUEsT0FBTyxHQUFDO0FBQTFDLE1BQW1EWixLQUF6RDtBQUVBLFNBQ0U7QUFBUSxJQUFBLFNBQVMsRUFBSSxHQUFFUyxFQUFFLElBQUksQ0FBQ0MsT0FBUCxJQUFpQixXQUFVRCxFQUFHLEVBQUUsSUFBR0MsT0FBTyxJQUFHLG1CQUFrQkQsRUFBRyxFQUFFLElBQUdFLElBQUksSUFBRyxXQUFVQSxJQUFLLEVBQUU7QUFBdEgsS0FBNkhYLEtBQTdIO0FBQW9JLElBQUEsUUFBUSxFQUFFWTtBQUE5SSxNQUNLQSxPQUFPLElBQUk7QUFBTSxJQUFBLEtBQUssRUFBQyxrQ0FBWjtBQUErQyxJQUFBLElBQUksRUFBQyxRQUFwRDtBQUE2RCxtQkFBWTtBQUF6RSxJQURoQixFQUVNQSxPQUFPLEdBQUcsU0FBSCxHQUFhSixLQUYxQixDQURGO0FBTUQ7Ozs7In0=
