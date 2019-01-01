import { u as useAuthContext, h } from './index-55e10466.js';
import { B as Button, v as validationTypes, I as Input, F as Form, a as valueChanged, l as login } from './actions-21cf9005.js';

function Login() {
  const {
    dispatch,
    state
  } = useAuthContext();
  const {
    emailorusername,
    password,
    error
  } = state;

  function handleChange(e) {
    const {
      name,
      value
    } = e.target;
    dispatch(valueChanged({
      propName,
      value,
      dispatch,
      state
    }));
  }

  function handleLogin() {
    dispatch(login({
      dispatch,
      state
    }));
  }

  return h("div", {
    "data-testid": "loginform",
    className: "auth-form"
  }, h(Form, {
    formTitle: "Login",
    error: error
  }, h(Input, {
    value: emailorusername,
    onChange: handleChange,
    name: "emailorusername",
    type: "text",
    placeholder: "Enter email or username",
    id: "emailOrUsername",
    "data-testid": "emailOrUsername",
    validationTypes: [validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION, validationTypes.INVALID_CREDENTIALS, validationTypes.EMAIL_NOT_REGISTERED, validationTypes.USERNAME_NOT_REGISTERED]
  }), h(Input, {
    value: password,
    onChange: handleChange,
    name: "password",
    type: "password",
    placeholder: "enter password",
    id: "password",
    "data-testid": "password",
    validationTypes: [validationTypes.EMPTY_STRING_VALIDATION, validationTypes.INVALID_CREDENTIALS]
  }), h(Button, {
    type: "button",
    id: "login-btn",
    "data-testid": "login-btn",
    onClick: handleLogin,
    title: "Login"
  }), h("a", {
    href: "#/requestpasschange"
  }, "Forgot Password!")));
}

export default Login;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW4tYzNhMzk4YTcuanMiLCJzb3VyY2VzIjpbIi4uL2F1dGgvTG9naW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vZm9ybS9JbnB1dCc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2Zvcm0vQnV0dG9uJztcbmltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vRm9ybSc7XG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4uL2Zvcm0vdmFsaWRhdGlvblR5cGVzJztcbmltcG9ydCB7IHVzZUF1dGhDb250ZXh0IH0gZnJvbSAnLi9hdXRoLWNvbnRleHQnO1xuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9naW4oKSB7XG4gIGNvbnN0IHsgZGlzcGF0Y2gsIHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xuXG4gIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCwgZXJyb3IgfSA9IHN0YXRlO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZS50YXJnZXQ7XG4gICAgZGlzcGF0Y2goYWN0aW9ucy52YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZSwgdmFsdWUsIGRpc3BhdGNoLCBzdGF0ZSB9KSk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlTG9naW4oKSB7XG4gICAgZGlzcGF0Y2goYWN0aW9ucy5sb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSB9KSk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2dpbmZvcm1cIiBjbGFzc05hbWU9XCJhdXRoLWZvcm1cIj5cbiAgICAgIDxGb3JtIGZvcm1UaXRsZT1cIkxvZ2luXCIgZXJyb3I9e2Vycm9yfT5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgdmFsdWU9e2VtYWlsb3J1c2VybmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIG5hbWU9XCJlbWFpbG9ydXNlcm5hbWVcIlxuICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIGVtYWlsIG9yIHVzZXJuYW1lXCJcbiAgICAgICAgICBpZD1cImVtYWlsT3JVc2VybmFtZVwiXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJlbWFpbE9yVXNlcm5hbWVcIlxuICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W1xuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXG4gICAgICAgICAgXX1cbiAgICAgICAgLz5cblxuICAgICAgICA8SW5wdXRcbiAgICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICBuYW1lPVwicGFzc3dvcmRcIlxuICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJlbnRlciBwYXNzd29yZFwiXG4gICAgICAgICAgaWQ9XCJwYXNzd29yZFwiXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJwYXNzd29yZFwiXG4gICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICBdfVxuICAgICAgICAvPlxuXG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBpZD1cImxvZ2luLWJ0blwiXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2dpbi1idG5cIlxuICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUxvZ2lufVxuICAgICAgICAgIHRpdGxlPVwiTG9naW5cIlxuICAgICAgICAvPlxuICAgICAgICA8YSBocmVmPVwiIy9yZXF1ZXN0cGFzc2NoYW5nZVwiPkZvcmdvdCBQYXNzd29yZCE8L2E+XG4gICAgICA8L0Zvcm0+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiTG9naW4iLCJkaXNwYXRjaCIsInN0YXRlIiwidXNlQXV0aENvbnRleHQiLCJlbWFpbG9ydXNlcm5hbWUiLCJwYXNzd29yZCIsImVycm9yIiwiaGFuZGxlQ2hhbmdlIiwiZSIsIm5hbWUiLCJ2YWx1ZSIsInRhcmdldCIsImFjdGlvbnMiLCJwcm9wTmFtZSIsImhhbmRsZUxvZ2luIiwidmFsaWRhdGlvblR5cGVzIiwiVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJJTlZBTElEX0NSRURFTlRJQUxTIiwiRU1BSUxfTk9UX1JFR0lTVEVSRUQiLCJVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCIsIkVNUFRZX1NUUklOR19WQUxJREFUSU9OIl0sIm1hcHBpbmdzIjoiOzs7QUFRZSxTQUFTQSxLQUFULEdBQWlCO0FBQzlCLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQTtBQUFaLE1BQXNCQyxjQUFjLEVBQTFDO0FBRUEsUUFBTTtBQUFFQyxJQUFBQSxlQUFGO0FBQW1CQyxJQUFBQSxRQUFuQjtBQUE2QkMsSUFBQUE7QUFBN0IsTUFBdUNKLEtBQTdDOztBQUVBLFdBQVNLLFlBQVQsQ0FBc0JDLENBQXRCLEVBQXlCO0FBQ3ZCLFVBQU07QUFBRUMsTUFBQUEsSUFBRjtBQUFRQyxNQUFBQTtBQUFSLFFBQWtCRixDQUFDLENBQUNHLE1BQTFCO0FBQ0FWLElBQUFBLFFBQVEsQ0FBQ1csWUFBQSxDQUFxQjtBQUFFQyxNQUFBQSxRQUFGO0FBQVlILE1BQUFBLEtBQVo7QUFBbUJULE1BQUFBLFFBQW5CO0FBQTZCQyxNQUFBQTtBQUE3QixLQUFyQixDQUFELENBQVI7QUFDRDs7QUFDRCxXQUFTWSxXQUFULEdBQXVCO0FBQ3JCYixJQUFBQSxRQUFRLENBQUNXLEtBQUEsQ0FBYztBQUFFWCxNQUFBQSxRQUFGO0FBQVlDLE1BQUFBO0FBQVosS0FBZCxDQUFELENBQVI7QUFDRDs7QUFFRCxTQUNFO0FBQUssbUJBQVksV0FBakI7QUFBNkIsSUFBQSxTQUFTLEVBQUM7QUFBdkMsS0FDRSxFQUFDLElBQUQ7QUFBTSxJQUFBLFNBQVMsRUFBQyxPQUFoQjtBQUF3QixJQUFBLEtBQUssRUFBRUk7QUFBL0IsS0FDRSxFQUFDLEtBQUQ7QUFDRSxJQUFBLEtBQUssRUFBRUYsZUFEVDtBQUVFLElBQUEsUUFBUSxFQUFFRyxZQUZaO0FBR0UsSUFBQSxJQUFJLEVBQUMsaUJBSFA7QUFJRSxJQUFBLElBQUksRUFBQyxNQUpQO0FBS0UsSUFBQSxXQUFXLEVBQUMseUJBTGQ7QUFNRSxJQUFBLEVBQUUsRUFBQyxpQkFOTDtBQU9FLG1CQUFZLGlCQVBkO0FBUUUsSUFBQSxlQUFlLEVBQUUsQ0FDZlEsZUFBZSxDQUFDQyxtQ0FERCxFQUVmRCxlQUFlLENBQUNFLG1CQUZELEVBR2ZGLGVBQWUsQ0FBQ0csb0JBSEQsRUFJZkgsZUFBZSxDQUFDSSx1QkFKRDtBQVJuQixJQURGLEVBaUJFLEVBQUMsS0FBRDtBQUNFLElBQUEsS0FBSyxFQUFFZCxRQURUO0FBRUUsSUFBQSxRQUFRLEVBQUVFLFlBRlo7QUFHRSxJQUFBLElBQUksRUFBQyxVQUhQO0FBSUUsSUFBQSxJQUFJLEVBQUMsVUFKUDtBQUtFLElBQUEsV0FBVyxFQUFDLGdCQUxkO0FBTUUsSUFBQSxFQUFFLEVBQUMsVUFOTDtBQU9FLG1CQUFZLFVBUGQ7QUFRRSxJQUFBLGVBQWUsRUFBRSxDQUNmUSxlQUFlLENBQUNLLHVCQURELEVBRWZMLGVBQWUsQ0FBQ0UsbUJBRkQ7QUFSbkIsSUFqQkYsRUErQkUsRUFBQyxNQUFEO0FBQ0UsSUFBQSxJQUFJLEVBQUMsUUFEUDtBQUVFLElBQUEsRUFBRSxFQUFDLFdBRkw7QUFHRSxtQkFBWSxXQUhkO0FBSUUsSUFBQSxPQUFPLEVBQUVILFdBSlg7QUFLRSxJQUFBLEtBQUssRUFBQztBQUxSLElBL0JGLEVBc0NFO0FBQUcsSUFBQSxJQUFJLEVBQUM7QUFBUix3QkF0Q0YsQ0FERixDQURGO0FBNENEOzs7OyJ9
