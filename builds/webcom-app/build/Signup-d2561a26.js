import { h } from "./index-c4021a67.js";
import { T as TextInput } from "./index-f754cb7d.js";
import { B as Button } from "./index-93758c5b.js";
import { A as Alert } from "./index-f6d2b6e7.js";

function Signup(props) {
  const {
    username,
    password,
    email,
    loading,
    onSignup,
    onChange,
    validation,
    onBlur,
    onFocus,
    error,
  } = props;
  return h(
    "div",
    {
      className: "col-md-4 border mx-auto rounded",
      style: {
        margin: 15,
        padding: 16,
      },
    },
    loading &&
      h(
        "div",
        {
          className: "progress",
          style: "height: 5px;",
        },
        h("div", {
          className: "progress-bar progress-bar-striped progress-bar-animated",
          role: "progressbar",
          "aria-valuenow": "100",
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          style: "width: 100%",
        })
      ),
    error &&
      h(Alert, {
        alert: "danger",
        message: error.message,
      }),
    h(TextInput, {
      onBlur: onBlur,
      onFocus: onFocus,
      label: "Username",
      value: username,
      onChange: onChange,
      type: "text",
      "data-testid": "username",
      name: "username",
      isValid: validation && validation["username"].isValid,
      message: validation && validation["username"].message,
    }),
    h(TextInput, {
      onBlur: onBlur,
      onFocus: onFocus,
      label: "Email",
      onChange: onChange,
      value: email,
      type: "email",
      "data-testid": "email",
      name: "email",
      isValid: validation && validation["email"].isValid,
      message: validation && validation["email"].message,
    }),
    h(TextInput, {
      onBlur: onBlur,
      onFocus: onFocus,
      label: "Password",
      onChange: onChange,
      value: password,
      type: "password",
      "data-testid": "password",
      name: "password",
      isValid: validation && validation["password"].isValid,
      message: validation && validation["password"].message,
    }),
    h(Button, {
      type: "button",
      onClick: onSignup,
      id: "signup-btn",
      "data-testid": "signup-btn",
      loading: loading,
      title: "Signup",
      bg: "primary",
    })
  );
}

export default Signup;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2lnbnVwLWQyNTYxYTI2LmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvZmVhdHVyZXMvYXV0aGVudGljYXRpb24vdWktY29tcG9uZW50cy9TaWdudXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gXCJwcmVhY3RcIjtcblxuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiY29udHJvbHMvYnV0dG9uXCI7XG5pbXBvcnQgVGV4dElucHV0IGZyb20gXCJjb250cm9scy90ZXh0LWlucHV0XCI7XG5pbXBvcnQgQWxlcnQgZnJvbSBcImNvbnRyb2xzL2FsZXJ0XCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaWdudXAocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIHVzZXJuYW1lLFxuICAgIHBhc3N3b3JkLFxuICAgIGVtYWlsLFxuICAgIGxvYWRpbmcsXG4gICAgb25TaWdudXAsXG4gICAgb25DaGFuZ2UsXG4gICAgdmFsaWRhdGlvbixcbiAgICBvbkJsdXIsXG4gICAgb25Gb2N1cyxcbiAgICBlcnJvcixcbiAgfSA9IHByb3BzO1xuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cImNvbC1tZC00IGJvcmRlciBteC1hdXRvIHJvdW5kZWRcIlxuICAgICAgc3R5bGU9e3sgbWFyZ2luOiAxNSwgcGFkZGluZzogMTYgfX1cbiAgICA+XG4gICAgICB7bG9hZGluZyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3NcIiBzdHlsZT1cImhlaWdodDogNXB4O1wiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIlxuICAgICAgICAgICAgcm9sZT1cInByb2dyZXNzYmFyXCJcbiAgICAgICAgICAgIGFyaWEtdmFsdWVub3c9XCIxMDBcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW1pbj1cIjBcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgICAgICBzdHlsZT1cIndpZHRoOiAxMDAlXCJcbiAgICAgICAgICA+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfSAvPn1cbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XG4gICAgICAgIGxhYmVsPVwiVXNlcm5hbWVcIlxuICAgICAgICB2YWx1ZT17dXNlcm5hbWV9XG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICBkYXRhLXRlc3RpZD1cInVzZXJuYW1lXCJcbiAgICAgICAgbmFtZT1cInVzZXJuYW1lXCJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1widXNlcm5hbWVcIl0uaXNWYWxpZH1cbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1widXNlcm5hbWVcIl0ubWVzc2FnZX1cbiAgICAgIC8+XG4gICAgICA8VGV4dElucHV0XG4gICAgICAgIG9uQmx1cj17b25CbHVyfVxuICAgICAgICBvbkZvY3VzPXtvbkZvY3VzfVxuICAgICAgICBsYWJlbD1cIkVtYWlsXCJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICB2YWx1ZT17ZW1haWx9XG4gICAgICAgIHR5cGU9XCJlbWFpbFwiXG4gICAgICAgIGRhdGEtdGVzdGlkPVwiZW1haWxcIlxuICAgICAgICBuYW1lPVwiZW1haWxcIlxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJlbWFpbFwiXS5pc1ZhbGlkfVxuICAgICAgICBtZXNzYWdlPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJlbWFpbFwiXS5tZXNzYWdlfVxuICAgICAgLz5cbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XG4gICAgICAgIG9uRm9jdXM9e29uRm9jdXN9XG4gICAgICAgIGxhYmVsPVwiUGFzc3dvcmRcIlxuICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJwYXNzd29yZFwiXG4gICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcInBhc3N3b3JkXCJdLmlzVmFsaWR9XG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcInBhc3N3b3JkXCJdLm1lc3NhZ2V9XG4gICAgICAvPlxuICAgICAgPEJ1dHRvblxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgb25DbGljaz17b25TaWdudXB9XG4gICAgICAgIGlkPVwic2lnbnVwLWJ0blwiXG4gICAgICAgIGRhdGEtdGVzdGlkPVwic2lnbnVwLWJ0blwiXG4gICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XG4gICAgICAgIHRpdGxlPVwiU2lnbnVwXCJcbiAgICAgICAgYmc9XCJwcmltYXJ5XCJcbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiU2lnbnVwIiwicHJvcHMiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiZW1haWwiLCJsb2FkaW5nIiwib25TaWdudXAiLCJvbkNoYW5nZSIsInZhbGlkYXRpb24iLCJvbkJsdXIiLCJvbkZvY3VzIiwiZXJyb3IiLCJtYXJnaW4iLCJwYWRkaW5nIiwibWVzc2FnZSIsImlzVmFsaWQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBS2UsU0FBU0EsTUFBVCxDQUFnQkMsS0FBaEIsRUFBdUI7QUFDcEMsUUFBTTtBQUNK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