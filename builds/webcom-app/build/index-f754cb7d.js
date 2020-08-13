import { h, _ as _extends } from "./index-c4021a67.js";

function TextInput(props) {
  const { label, name, type, isValid, message } = props;
  return h(
    "div",
    {
      className: "form-group p-0",
    },
    h(
      "label",
      {
        for: name,
      },
      label
    ),
    h(
      "input",
      _extends(
        {
          type: type,
          className: `form-control ${isValid && "is-valid"} ${
            !isValid && isValid !== undefined && "is-invalid"
          }`,
          id: name,
          "aria-describedby": name,
        },
        props
      )
    ),
    !isValid &&
      h(
        "small",
        {
          id: "emailHelp",
          className: `${!isValid && "invalid-feedback"}`,
          "data-testid": `message-${name}`,
        },
        message
      )
  );
}

export { TextInput as T };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtZjc1NGNiN2QuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9jb21wb25lbnRzL2NvbnRyb2xzL3RleHQtaW5wdXQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGV4dElucHV0KHByb3BzKSB7XG4gIGNvbnN0IHsgbGFiZWwsIG5hbWUsIHR5cGUsIGlzVmFsaWQsIG1lc3NhZ2UgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cCBwLTBcIj5cbiAgICAgIDxsYWJlbCBmb3I9e25hbWV9PntsYWJlbH08L2xhYmVsPlxuICAgICAgPGlucHV0XG4gICAgICAgIHR5cGU9e3R5cGV9XG4gICAgICAgIGNsYXNzTmFtZT17YGZvcm0tY29udHJvbCAke2lzVmFsaWQgJiYgXCJpcy12YWxpZFwifSAke1xuICAgICAgICAgICFpc1ZhbGlkICYmIGlzVmFsaWQgIT09IHVuZGVmaW5lZCAmJiBcImlzLWludmFsaWRcIlxuICAgICAgICB9YH1cbiAgICAgICAgaWQ9e25hbWV9XG4gICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9e25hbWV9XG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgIC8+XG4gICAgICB7IWlzVmFsaWQgJiYgKFxuICAgICAgICA8c21hbGxcbiAgICAgICAgICBpZD1cImVtYWlsSGVscFwiXG4gICAgICAgICAgY2xhc3NOYW1lPXtgJHshaXNWYWxpZCAmJiBcImludmFsaWQtZmVlZGJhY2tcIn1gfVxuICAgICAgICAgIGRhdGEtdGVzdGlkPXtgbWVzc2FnZS0ke25hbWV9YH1cbiAgICAgICAgPlxuICAgICAgICAgIHttZXNzYWdlfVxuICAgICAgICA8L3NtYWxsPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJUZXh0SW5wdXQiLCJwcm9wcyIsImxhYmVsIiwibmFtZSIsInR5cGUiLCJpc1ZhbGlkIiwibWVzc2FnZSIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7QUFFZSxTQUFTQSxTQUFULENBQW1CQyxLQUFuQixFQUEwQjtBQUN2QyxRQUFNO0FBQUVDLElBQUFBLEtBQUY7QUFBU0MsSUFBQUEsSUFBVDtBQUFlQyxJQUFBQSxJQUFmO0FBQXFCQyxJQUFBQSxPQUFyQjtBQUE4QkMsSUFBQUE7QUFBOUIsTUFBMENMLEtBQWhEO0FBQ0EsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRTtBQUFPLElBQUEsR0FBRyxFQUFFRTtBQUFaLEtBQW1CRCxLQUFuQixDQURGLEVBRUU7QUFDRSxJQUFBLElBQUksRUFBRUUsSUFEUjtBQUVFLElBQUEsU0FBUyxFQUFHLGdCQUFlQyxPQUFPLElBQUksVUFBVyxJQUMvQyxDQUFDQSxPQUFELElBQVlBLE9BQU8sS0FBS0UsU0FBeEIsSUFBcUMsWUFDdEMsRUFKSDtBQUtFLElBQUEsRUFBRSxFQUFFSixJQUxOO0FBTUUsd0JBQWtCQTtBQU5wQixLQU9NRixLQVBOLEVBRkYsRUFXRyxDQUFDSSxPQUFELElBQ0M7QUFDRSxJQUFBLEVBQUUsRUFBQyxXQURMO0FBRUUsSUFBQSxTQUFTLEVBQUcsR0FBRSxDQUFDQSxPQUFELElBQVksa0JBQW1CLEVBRi9DO0FBR0UsbUJBQWMsV0FBVUYsSUFBSztBQUgvQixLQUtHRyxPQUxILENBWkosQ0FERjtBQXVCRDs7OzsifQ==
