import { h, _ as _extends } from './index-5361741e.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtMGVlMjZkOTcuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2NvbnRyb2xzL3RleHQtaW5wdXQvaW5kZXguanMiLCIuLi8uLi8uLi9jbGllbnQvY29tcG9uZW50cy9jb250cm9scy9idXR0b24vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRleHRJbnB1dChwcm9wcykge1xyXG4gIGNvbnN0IHsgbGFiZWwsIG5hbWUsIHR5cGUsIGlzVmFsaWQsIG1lc3NhZ2UgfSA9IHByb3BzXHJcbiAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cCBwLTBcIj5cclxuICAgIDxsYWJlbCBmb3I9e25hbWV9ID57bGFiZWx9PC9sYWJlbD5cclxuICAgIDxpbnB1dCB0eXBlPXt0eXBlfSBjbGFzc05hbWU9e2Bmb3JtLWNvbnRyb2wgJHtpc1ZhbGlkICYmICdpcy12YWxpZCd9ICR7IWlzVmFsaWQgJiYgaXNWYWxpZCAhPT0gdW5kZWZpbmVkICYmICdpcy1pbnZhbGlkJ31gfSBpZD17bmFtZX0gYXJpYS1kZXNjcmliZWRieT17bmFtZX17Li4ucHJvcHN9IC8+XHJcbnshaXNWYWxpZCAmJiA8c21hbGwgaWQ9XCJlbWFpbEhlbHBcIiBjbGFzc05hbWU9e2AkeyFpc1ZhbGlkICYmICdpbnZhbGlkLWZlZWRiYWNrJ31gfSBkYXRhLXRlc3RpZD17YG1lc3NhZ2UtJHtuYW1lfWB9PnttZXNzYWdlfTwvc21hbGw+fVxyXG4gIDwvZGl2PlxyXG59XHJcbiIsImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQnV0dG9uKHByb3BzKSB7XHJcbiAgY29uc3QgeyB0aXRsZSwgYmc9XCJsaWdodFwiLG91dGxpbmUsIHNpemUsbG9hZGluZz1mYWxzZX0gPSBwcm9wcztcclxuICBcclxuICByZXR1cm4gKFxyXG4gICAgPGJ1dHRvbiBjbGFzc05hbWU9IHtgJHtiZyAmJiAhb3V0bGluZSYmYGJ0biBidG4tJHtiZ31gfSAke291dGxpbmUmJmBidG4gYnRuLW91dGxpbmUtJHtiZ31gfSAke3NpemUmJmBidG4gYnRuLSR7c2l6ZX1gfWB9IHsuLi5wcm9wc30gZGlzYWJsZWQ9e2xvYWRpbmd9PlxyXG4gICAgICAgIHtsb2FkaW5nICYmIDxzcGFuIGNsYXNzPVwic3Bpbm5lci1ib3JkZXIgc3Bpbm5lci1ib3JkZXItc21cIiByb2xlPVwic3RhdHVzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPn0gXHJcbiAgICAgICAgeyBsb2FkaW5nID8gJ3dhaXQuLi4nOnRpdGxlfVxyXG4gICAgPC9idXR0b24+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiVGV4dElucHV0IiwicHJvcHMiLCJsYWJlbCIsIm5hbWUiLCJ0eXBlIiwiaXNWYWxpZCIsIm1lc3NhZ2UiLCJ1bmRlZmluZWQiLCJCdXR0b24iLCJ0aXRsZSIsImJnIiwib3V0bGluZSIsInNpemUiLCJsb2FkaW5nIl0sIm1hcHBpbmdzIjoiOztBQUllLFNBQVNBLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCO0FBQ3ZDLFFBQU07QUFBRUMsSUFBQUEsS0FBRjtBQUFTQyxJQUFBQSxJQUFUO0FBQWVDLElBQUFBLElBQWY7QUFBcUJDLElBQUFBLE9BQXJCO0FBQThCQyxJQUFBQTtBQUE5QixNQUEwQ0wsS0FBaEQ7QUFDQSxTQUFPO0FBQUssSUFBQSxTQUFTLEVBQUM7QUFBZixLQUNMO0FBQU8sSUFBQSxHQUFHLEVBQUVFO0FBQVosS0FBb0JELEtBQXBCLENBREssRUFFTDtBQUFPLElBQUEsSUFBSSxFQUFFRSxJQUFiO0FBQW1CLElBQUEsU0FBUyxFQUFHLGdCQUFlQyxPQUFPLElBQUksVUFBVyxJQUFHLENBQUNBLE9BQUQsSUFBWUEsT0FBTyxLQUFLRSxTQUF4QixJQUFxQyxZQUFhLEVBQXpIO0FBQTRILElBQUEsRUFBRSxFQUFFSixJQUFoSTtBQUFzSSx3QkFBa0JBO0FBQXhKLEtBQWlLRixLQUFqSyxFQUZLLEVBR1IsQ0FBQ0ksT0FBRCxJQUFZO0FBQU8sSUFBQSxFQUFFLEVBQUMsV0FBVjtBQUFzQixJQUFBLFNBQVMsRUFBRyxHQUFFLENBQUNBLE9BQUQsSUFBWSxrQkFBbUIsRUFBbkU7QUFBc0UsbUJBQWMsV0FBVUYsSUFBSztBQUFuRyxLQUF1R0csT0FBdkcsQ0FISixDQUFQO0FBS0Q7O0FDVGMsU0FBU0UsTUFBVCxDQUFnQlAsS0FBaEIsRUFBdUI7QUFDcEMsUUFBTTtBQUFFUSxJQUFBQSxLQUFGO0FBQVNDLElBQUFBLEVBQUUsR0FBQyxPQUFaO0FBQW9CQyxJQUFBQSxPQUFwQjtBQUE2QkMsSUFBQUEsSUFBN0I7QUFBa0NDLElBQUFBLE9BQU8sR0FBQztBQUExQyxNQUFtRFosS0FBekQ7QUFFQSxTQUNFO0FBQVEsSUFBQSxTQUFTLEVBQUksR0FBRVMsRUFBRSxJQUFJLENBQUNDLE9BQVAsSUFBaUIsV0FBVUQsRUFBRyxFQUFFLElBQUdDLE9BQU8sSUFBRyxtQkFBa0JELEVBQUcsRUFBRSxJQUFHRSxJQUFJLElBQUcsV0FBVUEsSUFBSyxFQUFFO0FBQXRILEtBQTZIWCxLQUE3SDtBQUFvSSxJQUFBLFFBQVEsRUFBRVk7QUFBOUksTUFDS0EsT0FBTyxJQUFJO0FBQU0sSUFBQSxLQUFLLEVBQUMsa0NBQVo7QUFBK0MsSUFBQSxJQUFJLEVBQUMsUUFBcEQ7QUFBNkQsbUJBQVk7QUFBekUsSUFEaEIsRUFFTUEsT0FBTyxHQUFHLFNBQUgsR0FBYUosS0FGMUIsQ0FERjtBQU1EOzs7OyJ9
