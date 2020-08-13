import { h } from "./index-c4021a67.js";
import { T as TextInput } from "./index-f754cb7d.js";
import { B as Button } from "./index-93758c5b.js";
import { A as Alert } from "./index-f6d2b6e7.js";

function Login(props) {
  const {
    emailorusername,
    password,
    loading,
    onLogin,
    onFocus,
    onChange,
    validation,
    onForgotPassword,
    onBlur,
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
      onFocus: onFocus,
      onBlur: onBlur,
      value: emailorusername,
      onChange: onChange,
      label: "Email or username",
      name: "emailorusername",
      type: "text",
      id: "emailorusername",
      "data-testid": "emailorusername",
      message: validation && validation["emailorusername"].message,
      isValid: validation && validation["emailorusername"].isValid,
    }),
    h(TextInput, {
      onFocus: onFocus,
      onBlur: onBlur,
      label: "Password",
      value: password,
      onChange: onChange,
      name: "password",
      type: "password",
      id: "password",
      "data-testid": "password",
      message: validation && validation["password"].message,
      isValid: validation && validation["password"].isValid,
    }),
    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
        },
      },
      h(Button, {
        type: "button",
        id: "login-btn",
        "data-testid": "login-btn",
        onClick: onLogin,
        loading: loading,
        title: "Login",
        bg: "primary",
      }),
      h(Button, {
        onClick: onForgotPassword,
        id: "forgotpassword",
        "data-testid": "forgotpassword",
        outline: true,
        bg: "primary",
        title: "Forgot Password!",
      })
    )
  );
}

export default Login;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW4tNTgxMjJhZTguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0xvZ2luLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgVGV4dElucHV0IGZyb20gXCJjb250cm9scy90ZXh0LWlucHV0XCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCJjb250cm9scy9idXR0b25cIjtcbmltcG9ydCBBbGVydCBmcm9tIFwiY29udHJvbHMvYWxlcnRcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExvZ2luKHByb3BzKSB7XG4gIGNvbnN0IHtcbiAgICBlbWFpbG9ydXNlcm5hbWUsXG4gICAgcGFzc3dvcmQsXG4gICAgbG9hZGluZyxcbiAgICBvbkxvZ2luLFxuICAgIG9uRm9jdXMsXG4gICAgb25DaGFuZ2UsXG4gICAgdmFsaWRhdGlvbixcbiAgICBvbkZvcmdvdFBhc3N3b3JkLFxuICAgIG9uQmx1cixcbiAgICBlcnJvcixcbiAgfSA9IHByb3BzO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiXG4gICAgICBzdHlsZT17eyBtYXJnaW46IDE1LCBwYWRkaW5nOiAxNiB9fVxuICAgID5cbiAgICAgIHtsb2FkaW5nICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzc1wiIHN0eWxlPVwiaGVpZ2h0OiA1cHg7XCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdHJpcGVkIHByb2dyZXNzLWJhci1hbmltYXRlZFwiXG4gICAgICAgICAgICByb2xlPVwicHJvZ3Jlc3NiYXJcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW5vdz1cIjEwMFwiXG4gICAgICAgICAgICBhcmlhLXZhbHVlbWluPVwiMFwiXG4gICAgICAgICAgICBhcmlhLXZhbHVlbWF4PVwiMTAwXCJcbiAgICAgICAgICAgIHN0eWxlPVwid2lkdGg6IDEwMCVcIlxuICAgICAgICAgID48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAge2Vycm9yICYmIDxBbGVydCBhbGVydD1cImRhbmdlclwiIG1lc3NhZ2U9e2Vycm9yLm1lc3NhZ2V9IC8+fVxuICAgICAgPFRleHRJbnB1dFxuICAgICAgICBvbkZvY3VzPXtvbkZvY3VzfVxuICAgICAgICBvbkJsdXI9e29uQmx1cn1cbiAgICAgICAgdmFsdWU9e2VtYWlsb3J1c2VybmFtZX1cbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICBsYWJlbD1cIkVtYWlsIG9yIHVzZXJuYW1lXCJcbiAgICAgICAgbmFtZT1cImVtYWlsb3J1c2VybmFtZVwiXG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgaWQ9XCJlbWFpbG9ydXNlcm5hbWVcIlxuICAgICAgICBkYXRhLXRlc3RpZD1cImVtYWlsb3J1c2VybmFtZVwiXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcImVtYWlsb3J1c2VybmFtZVwiXS5tZXNzYWdlfVxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJlbWFpbG9ydXNlcm5hbWVcIl0uaXNWYWxpZH1cbiAgICAgIC8+XG5cbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgb25Gb2N1cz17b25Gb2N1c31cbiAgICAgICAgb25CbHVyPXtvbkJsdXJ9XG4gICAgICAgIGxhYmVsPVwiUGFzc3dvcmRcIlxuICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgaWQ9XCJwYXNzd29yZFwiXG4gICAgICAgIGRhdGEtdGVzdGlkPVwicGFzc3dvcmRcIlxuICAgICAgICBtZXNzYWdlPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJwYXNzd29yZFwiXS5tZXNzYWdlfVxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJwYXNzd29yZFwiXS5pc1ZhbGlkfVxuICAgICAgLz5cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiB9fT5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGlkPVwibG9naW4tYnRuXCJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImxvZ2luLWJ0blwiXG4gICAgICAgICAgb25DbGljaz17b25Mb2dpbn1cbiAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICAgIHRpdGxlPVwiTG9naW5cIlxuICAgICAgICAgIGJnPVwicHJpbWFyeVwiXG4gICAgICAgIC8+XG5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e29uRm9yZ290UGFzc3dvcmR9XG4gICAgICAgICAgaWQ9XCJmb3Jnb3RwYXNzd29yZFwiXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJmb3Jnb3RwYXNzd29yZFwiXG4gICAgICAgICAgb3V0bGluZVxuICAgICAgICAgIGJnPVwicHJpbWFyeVwiXG4gICAgICAgICAgdGl0bGU9XCJGb3Jnb3QgUGFzc3dvcmQhXCJcbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sIm5hbWVzIjpbIkxvZ2luIiwicHJvcHMiLCJlbWFpbG9ydXNlcm5hbWUiLCJwYXNzd29yZCIsImxvYWRpbmciLCJvbkxvZ2luIiwib25Gb2N1cyIsIm9uQ2hhbmdlIiwidmFsaWRhdGlvbiIsIm9uRm9yZ290UGFzc3dvcmQiLCJvbkJsdXIiLCJlcnJvciIsIm1hcmdpbiIsInBhZGRpbmciLCJtZXNzYWdlIiwiaXNWYWxpZCIsImRpc3BsYXkiLCJqdXN0aWZ5Q29udGVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJZSxTQUFTQSxLQUFULENBQWVDLEtBQWYsRUFBc0I7QUFDbkMsUUFBTTtBQUNKQyxJQUFBQSxlQURJO0FBRUpDLElBQUFBLFFBRkk7QUFHSkMsSUFBQUEsT0FISTtBQUlKQyxJQUFBQSxPQUpJO0FBS0pDLElBQUFBLE9BTEk7QUFNSkMsSUFBQUEsUUFOSTtBQU9KQyxJQUFBQSxVQVBJO0FBUUpDLElBQUFBLGdCQVJJO0FBU0pDLElBQUFBLE1BVEk7QUFVSkMsSUFBQUE7QUFWSSxNQVdGVixLQVhKO0FBYUEsU0FDRTtBQUNFLElBQUEsU0FBUyxFQUFDLGlDQURaO0FBRUUsSUFBQSxLQUFLLEVBQUU7QUFBRVcsTUFBQUEsTUFBTSxFQUFFLEVBQVY7QUFBY0MsTUFBQUEsT0FBTyxFQUFFO0FBQXZCO0FBRlQsS0FJR1QsT0FBTyxJQUNOO0FBQUssSUFBQSxTQUFTLEVBQUMsVUFBZjtBQUEwQixJQUFBLEtBQUssRUFBQztBQUFoQyxLQUNFO0FBQ0UsSUFBQSxTQUFTLEVBQUMseURBRFo7QUFFRSxJQUFBLElBQUksRUFBQyxhQUZQO0FBR0UscUJBQWMsS0FIaEI7QUFJRSxxQkFBYyxHQUpoQjtBQUtFLHFCQUFjLEtBTGhCO0FBTUUsSUFBQSxLQUFLLEVBQUM7QUFOUixJQURGLENBTEosRUFnQkdPLEtBQUssSUFBSSxFQUFDLEtBQUQ7QUFBTyxJQUFBLEtBQUssRUFBQyxRQUFiO0FBQXNCLElBQUEsT0FBTyxFQUFFQSxLQUFLLENBQUNHO0FBQXJDLElBaEJaLEVBaUJFLEVBQUMsU0FBRDtBQUNFLElBQUEsT0FBTyxFQUFFUixPQURYO0FBRUUsSUFBQSxNQUFNLEVBQUVJLE1BRlY7QUFHRSxJQUFBLEtBQUssRUFBRVIsZUFIVDtBQUlFLElBQUEsUUFBUSxFQUFFSyxRQUpaO0FBS0UsSUFBQSxLQUFLLEVBQUMsbUJBTFI7QUFNRSxJQUFBLElBQUksRUFBQyxpQkFOUDtBQU9FLElBQUEsSUFBSSxFQUFDLE1BUFA7QUFRRSxJQUFBLEVBQUUsRUFBQyxpQkFSTDtBQVNFLG1CQUFZLGlCQVRkO0FBVUUsSUFBQSxPQUFPLEVBQUVDLFVBQVUsSUFBSUEsVUFBVSxDQUFDLGlCQUFELENBQVYsQ0FBOEJNLE9BVnZEO0FBV0UsSUFBQSxPQUFPLEVBQUVOLFVBQVUsSUFBSUEsVUFBVSxDQUFDLGlCQUFELENBQVYsQ0FBOEJPO0FBWHZELElBakJGLEVBK0JFLEVBQUMsU0FBRDtBQUNFLElBQUEsT0FBTyxFQUFFVCxPQURYO0FBRUUsSUFBQSxNQUFNLEVBQUVJLE1BRlY7QUFHRSxJQUFBLEtBQUssRUFBQyxVQUhSO0FBSUUsSUFBQSxLQUFLLEVBQUVQLFFBSlQ7QUFLRSxJQUFBLFFBQVEsRUFBRUksUUFMWjtBQU1FLElBQUEsSUFBSSxFQUFDLFVBTlA7QUFPRSxJQUFBLElBQUksRUFBQyxVQVBQO0FBUUUsSUFBQSxFQUFFLEVBQUMsVUFSTDtBQVNFLG1CQUFZLFVBVGQ7QUFVRSxJQUFBLE9BQU8sRUFBRUMsVUFBVSxJQUFJQSxVQUFVLENBQUMsVUFBRCxDQUFWLENBQXVCTSxPQVZoRDtBQVdFLElBQUEsT0FBTyxFQUFFTixVQUFVLElBQUlBLFVBQVUsQ0FBQyxVQUFELENBQVYsQ0FBdUJPO0FBWGhELElBL0JGLEVBNENFO0FBQUssSUFBQSxLQUFLLEVBQUU7QUFBRUMsTUFBQUEsT0FBTyxFQUFFLE1BQVg7QUFBbUJDLE1BQUFBLGNBQWMsRUFBRTtBQUFuQztBQUFaLEtBQ0UsRUFBQyxNQUFEO0FBQ0UsSUFBQSxJQUFJLEVBQUMsUUFEUDtBQUVFLElBQUEsRUFBRSxFQUFDLFdBRkw7QUFHRSxtQkFBWSxXQUhkO0FBSUUsSUFBQSxPQUFPLEVBQUVaLE9BSlg7QUFLRSxJQUFBLE9BQU8sRUFBRUQsT0FMWDtBQU1FLElBQUEsS0FBSyxFQUFDLE9BTlI7QUFPRSxJQUFBLEVBQUUsRUFBQztBQVBMLElBREYsRUFXRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLE9BQU8sRUFBRUssZ0JBRFg7QUFFRSxJQUFBLEVBQUUsRUFBQyxnQkFGTDtBQUdFLG1CQUFZLGdCQUhkO0FBSUUsSUFBQSxPQUFPLE1BSlQ7QUFLRSxJQUFBLEVBQUUsRUFBQyxTQUxMO0FBTUUsSUFBQSxLQUFLLEVBQUM7QUFOUixJQVhGLENBNUNGLENBREY7QUFtRUQ7Ozs7In0=
