import { u as useAppContext, h } from './index-2780fa73.js';
import { B as Button, v as validationTypes, I as Input, F as Form, a as valueChanged, l as login } from './actions-6d7d0647.js';

function Login() {
  const {
    auth,
    form
  } = useAppContext();
  const {
    emailorusername,
    password,
    error
  } = auth.state;

  function handleChange(e) {
    const {
      name,
      value
    } = e.target;
    auth.dispatch(valueChanged({
      propName: name,
      value,
      dispatch: auth.dispatch,
      state: auth.state
    }));
  }

  function handleLogin() {
    auth.dispatch(login({
      dispatch: auth.dispatch,
      state: auth.state,
      formDispatch: form.dispatch
    }));
  }

  return h("div", {
    "dat-testid": "laoginform",
    className: "surface"
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
    title: "LOGIN"
  }), h("a", {
    href: "#/requestpasschange"
  }, "Forgot Password!")));
}

export default Login;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW4tYjdkMzJjZmEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9hdXRoL0xvZ2luLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xuaW1wb3J0IElucHV0IGZyb20gJy4uL2Zvcm0vSW5wdXQnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9mb3JtL0J1dHRvbic7XG5pbXBvcnQgRm9ybSBmcm9tICcuLi9mb3JtL0Zvcm0nO1xuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuLi9mb3JtL3ZhbGlkYXRpb25UeXBlcyc7XG5pbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnLi4vYXBwLWNvbnRleHQnO1xuXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIExvZ2luKCkge1xuICBjb25zdCB7IGF1dGgsIGZvcm0gfSA9IHVzZUFwcENvbnRleHQoKTtcblxuICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQsIGVycm9yIH0gPSBhdXRoLnN0YXRlO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZS50YXJnZXQ7XG4gICAgYXV0aC5kaXNwYXRjaChcbiAgICAgIGFjdGlvbnMudmFsdWVDaGFuZ2VkKHtcbiAgICAgICAgcHJvcE5hbWU6IG5hbWUsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBkaXNwYXRjaDogYXV0aC5kaXNwYXRjaCxcbiAgICAgICAgc3RhdGU6IGF1dGguc3RhdGUsXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgZnVuY3Rpb24gaGFuZGxlTG9naW4oKSB7XG4gICAgYXV0aC5kaXNwYXRjaChcbiAgICAgIGFjdGlvbnMubG9naW4oe1xuICAgICAgICBkaXNwYXRjaDogYXV0aC5kaXNwYXRjaCxcbiAgICAgICAgc3RhdGU6IGF1dGguc3RhdGUsXG4gICAgICAgIGZvcm1EaXNwYXRjaDogZm9ybS5kaXNwYXRjaCxcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBkYXQtdGVzdGlkPSdsYW9naW5mb3JtJyBjbGFzc05hbWU9J3N1cmZhY2UnPlxuICAgICAgPEZvcm0gZm9ybVRpdGxlPSdMb2dpbicgZXJyb3I9e2Vycm9yfT5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgdmFsdWU9e2VtYWlsb3J1c2VybmFtZX1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIG5hbWU9J2VtYWlsb3J1c2VybmFtZSdcbiAgICAgICAgICB0eXBlPSd0ZXh0J1xuICAgICAgICAgIHBsYWNlaG9sZGVyPSdFbnRlciBlbWFpbCBvciB1c2VybmFtZSdcbiAgICAgICAgICBpZD0nZW1haWxPclVzZXJuYW1lJ1xuICAgICAgICAgIGRhdGEtdGVzdGlkPSdlbWFpbE9yVXNlcm5hbWUnXG4gICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5FTUFJTF9OT1RfUkVHSVNURVJFRCxcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcbiAgICAgICAgICBdfVxuICAgICAgICAvPlxuXG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIG5hbWU9J3Bhc3N3b3JkJ1xuICAgICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xuICAgICAgICAgIHBsYWNlaG9sZGVyPSdlbnRlciBwYXNzd29yZCdcbiAgICAgICAgICBpZD0ncGFzc3dvcmQnXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9J3Bhc3N3b3JkJ1xuICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W1xuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgXX1cbiAgICAgICAgLz5cblxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgdHlwZT0nYnV0dG9uJ1xuICAgICAgICAgIGlkPSdsb2dpbi1idG4nXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9J2xvZ2luLWJ0bidcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVMb2dpbn1cbiAgICAgICAgICB0aXRsZT0nTE9HSU4nXG4gICAgICAgIC8+XG4gICAgICAgIDxhIGhyZWY9JyMvcmVxdWVzdHBhc3NjaGFuZ2UnPkZvcmdvdCBQYXNzd29yZCE8L2E+XG4gICAgICA8L0Zvcm0+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiTG9naW4iLCJhdXRoIiwiZm9ybSIsInVzZUFwcENvbnRleHQiLCJlbWFpbG9ydXNlcm5hbWUiLCJwYXNzd29yZCIsImVycm9yIiwic3RhdGUiLCJoYW5kbGVDaGFuZ2UiLCJlIiwibmFtZSIsInZhbHVlIiwidGFyZ2V0IiwiZGlzcGF0Y2giLCJhY3Rpb25zIiwicHJvcE5hbWUiLCJoYW5kbGVMb2dpbiIsImZvcm1EaXNwYXRjaCIsInZhbGlkYXRpb25UeXBlcyIsIlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiSU5WQUxJRF9DUkVERU5USUFMUyIsIkVNQUlMX05PVF9SRUdJU1RFUkVEIiwiVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQiLCJFTVBUWV9TVFJJTkdfVkFMSURBVElPTiJdLCJtYXBwaW5ncyI6Ijs7O0FBVWUsU0FBU0EsS0FB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