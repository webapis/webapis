import { u as useAuthContext, h } from './index-82d4eea2.js';
import { B as Button, v as validationTypes, I as Input, F as Form, a as valueChanged, l as login } from './actions-354b40fc.js';

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
      propName: name,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW4tZDNjZmIxMTUuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9hdXRoL0xvZ2luLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9mb3JtL0lucHV0JztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9mb3JtL0J1dHRvbic7XHJcbmltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vRm9ybSc7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi4vZm9ybS92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vYXV0aC1jb250ZXh0JztcclxuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb2dpbigpIHtcclxuICBjb25zdCB7IGRpc3BhdGNoLCBzdGF0ZSB9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuXHJcbiAgY29uc3QgeyBlbWFpbG9ydXNlcm5hbWUsIHBhc3N3b3JkLCBlcnJvciB9ID0gc3RhdGU7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShlKSB7XHJcbiAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBlLnRhcmdldDtcclxuICAgIGRpc3BhdGNoKGFjdGlvbnMudmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWU6bmFtZSwgdmFsdWUsIGRpc3BhdGNoLCBzdGF0ZSB9KSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ2luKCkge1xyXG4gICAgZGlzcGF0Y2goYWN0aW9ucy5sb2dpbih7IGRpc3BhdGNoLCBzdGF0ZSB9KSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvZ2luZm9ybVwiIGNsYXNzTmFtZT1cImF1dGgtZm9ybVwiPlxyXG4gICAgICA8Rm9ybSBmb3JtVGl0bGU9XCJMb2dpblwiIGVycm9yPXtlcnJvcn0+XHJcbiAgICAgICAgPElucHV0XHJcbiAgICAgICAgICB2YWx1ZT17ZW1haWxvcnVzZXJuYW1lfVxyXG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgIG5hbWU9XCJlbWFpbG9ydXNlcm5hbWVcIlxyXG4gICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJFbnRlciBlbWFpbCBvciB1c2VybmFtZVwiXHJcbiAgICAgICAgICBpZD1cImVtYWlsT3JVc2VybmFtZVwiXHJcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImVtYWlsT3JVc2VybmFtZVwiXHJcbiAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1tcclxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgICBdfVxyXG4gICAgICAgIC8+XHJcblxyXG4gICAgICAgIDxJbnB1dFxyXG4gICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXHJcbiAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxyXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJlbnRlciBwYXNzd29yZFwiXHJcbiAgICAgICAgICBpZD1cInBhc3N3b3JkXCJcclxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwicGFzc3dvcmRcIlxyXG4gICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbXHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICBdfVxyXG4gICAgICAgIC8+XHJcblxyXG4gICAgICAgIDxCdXR0b25cclxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgaWQ9XCJsb2dpbi1idG5cIlxyXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJsb2dpbi1idG5cIlxyXG4gICAgICAgICAgb25DbGljaz17aGFuZGxlTG9naW59XHJcbiAgICAgICAgICB0aXRsZT1cIkxvZ2luXCJcclxuICAgICAgICAvPlxyXG4gICAgICAgIDxhIGhyZWY9XCIjL3JlcXVlc3RwYXNzY2hhbmdlXCI+Rm9yZ290IFBhc3N3b3JkITwvYT5cclxuICAgICAgPC9Gb3JtPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiTG9naW4iLCJkaXNwYXRjaCIsInN0YXRlIiwidXNlQXV0aENvbnRleHQiLCJlbWFpbG9ydXNlcm5hbWUiLCJwYXNzd29yZCIsImVycm9yIiwiaGFuZGxlQ2hhbmdlIiwiZSIsIm5hbWUiLCJ2YWx1ZSIsInRhcmdldCIsImFjdGlvbnMiLCJwcm9wTmFtZSIsImhhbmRsZUxvZ2luIiwidmFsaWRhdGlvblR5cGVzIiwiVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJJTlZBTElEX0NSRURFTlRJQUxTIiwiRU1BSUxfTk9UX1JFR0lTVEVSRUQiLCJVU0VSTkFNRV9OT1RfUkVHSVNURVJFRCIsIkVNUFRZX1NUUklOR19WQUxJREFUSU9OIl0sIm1hcHBpbmdzIjoiOzs7QUFRZSxTQUFTQSxLQUFULEdBQWlCO0FBQzlCLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQTtBQUFaLE1BQXNCQyxjQUFjLEVBQTFDO0FBRUEsUUFBTTtBQUFFQyxJQUFBQSxlQUFGO0FBQW1CQyxJQUFBQSxRQUFuQjtBQUE2QkMsSUFBQUE7QUFBN0IsTUFBdUNKLEtBQTdDOztBQUVBLFdBQVNLLFlBQVQsQ0FBc0JDLENBQXRCLEVBQXlCO0FBQ3ZCLFVBQU07QUFBRUMsTUFBQUEsSUFBRjtBQUFRQyxNQUFBQTtBQUFSLFFBQWtCRixDQUFDLENBQUNHLE1BQTFCO0FBQ0FWLElBQUFBLFFBQVEsQ0FBQ1csWUFBQSxDQUFxQjtBQUFFQyxNQUFBQSxRQUFRLEVBQUNKLElBQVg7QUFBaUJDLE1BQUFBLEtBQWpCO0FBQXdCVCxNQUFBQSxRQUF4QjtBQUFrQ0MsTUFBQUE7QUFBbEMsS0FBckIsQ0FBRCxDQUFSO0FBQ0Q7O0FBQ0QsV0FBU1ksV0FBVCxHQUF1QjtBQUNyQmIsSUFBQUEsUUFBUSxDQUFDVyxLQUFBLENBQWM7QUFBRVgsTUFBQUEsUUFBRjtBQUFZQyxNQUFBQTtBQUFaLEtBQWQsQ0FBRCxDQUFSO0FBQ0Q7O0FBRUQsU0FDRTtBQUFLLG1CQUFZLFdBQWpCO0FBQTZCLElBQUEsU0FBUyxFQUFDO0FBQXZDLEtBQ0UsRUFBQyxJQUFEO0FBQU0sSUFBQSxTQUFTLEVBQUMsT0FBaEI7QUFBd0IsSUFBQSxLQUFLLEVBQUVJO0FBQS9CLEtBQ0UsRUFBQyxLQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUVGLGVBRFQ7QUFFRSxJQUFBLFFBQVEsRUFBRUcsWUFGWjtBQUdFLElBQUEsSUFBSSxFQUFDLGlCQUhQO0FBSUUsSUFBQSxJQUFJLEVBQUMsTUFKUDtBQUtFLElBQUEsV0FBVyxFQUFDLHlCQUxkO0FBTUUsSUFBQSxFQUFFLEVBQUMsaUJBTkw7QUFPRSxtQkFBWSxpQkFQZDtBQVFFLElBQUEsZUFBZSxFQUFFLENBQ2ZRLGVBQWUsQ0FBQ0MsbUNBREQsRUFFZkQsZUFBZSxDQUFDRSxtQkFGRCxFQUdmRixlQUFlLENBQUNHLG9CQUhELEVBSWZILGVBQWUsQ0FBQ0ksdUJBSkQ7QUFSbkIsSUFERixFQWlCRSxFQUFDLEtBQUQ7QUFDRSxJQUFBLEtBQUssRUFBRWQsUUFEVDtBQUVFLElBQUEsUUFBUSxFQUFFRSxZQUZaO0FBR0UsSUFBQSxJQUFJLEVBQUMsVUFIUDtBQUlFLElBQUEsSUFBSSxFQUFDLFVBSlA7QUFLRSxJQUFBLFdBQVcsRUFBQyxnQkFMZDtBQU1FLElBQUEsRUFBRSxFQUFDLFVBTkw7QUFPRSxtQkFBWSxVQVBkO0FBUUUsSUFBQSxlQUFlLEVBQUUsQ0FDZlEsZUFBZSxDQUFDSyx1QkFERCxFQUVmTCxlQUFlLENBQUNFLG1CQUZEO0FBUm5CLElBakJGLEVBK0JFLEVBQUMsTUFBRDtBQUNFLElBQUEsSUFBSSxFQUFDLFFBRFA7QUFFRSxJQUFBLEVBQUUsRUFBQyxXQUZMO0FBR0UsbUJBQVksV0FIZDtBQUlFLElBQUEsT0FBTyxFQUFFSCxXQUpYO0FBS0UsSUFBQSxLQUFLLEVBQUM7QUFMUixJQS9CRixFQXNDRTtBQUFHLElBQUEsSUFBSSxFQUFDO0FBQVIsd0JBdENGLENBREYsQ0FERjtBQTRDRDs7OzsifQ==
