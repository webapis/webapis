import { u as useAppContext, h } from './index-e8d41a01.js';
import { B as Button, v as validationTypes, I as Input, F as Form, s as signup, a as valueChanged } from './actions-0419c51d.js';
import './style-b7c41500.js';

function Signup() {
  const {
    form,
    auth
  } = useAppContext();
  const {
    username,
    password,
    email
  } = auth.state;

  function handleSignup() {
    auth.dispatch(signup({
      dispatch: auth.dispatch,
      state: auth.state,
      formDispatch: form.dispatch
    }));
  }

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

  return h("div", {
    "data-testid": "signupform",
    className: "auth-form"
  }, h(Form, {
    formTitle: "Sign up"
  }, h(Input, {
    value: username,
    onChange: handleChange,
    type: "text",
    id: "username",
    name: "username",
    placeholder: "username",
    validationTypes: [validationTypes.USERNAME_FORMAT_VALIDATION, validationTypes.USERNAME_TAKEN]
  }), h(Input, {
    onChange: handleChange,
    value: email,
    placeholder: "email",
    type: "email",
    id: "email",
    name: "email",
    validationTypes: [validationTypes.EMAIL_FORMAT_VALIDATION, validationTypes.REGISTERED_EMAIL]
  }), h(Input, {
    onChange: handleChange,
    value: password,
    placeholder: "password",
    type: "password",
    id: "password",
    name: "password",
    validationTypes: [validationTypes.PASSWORD_FORMAT_VALIDATION]
  }), h(Button, {
    className: "btn",
    type: "button",
    onClick: handleSignup,
    id: "signup-btn",
    title: "Signup"
  })));
}

export default Signup;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2lnbnVwLWU0M2E3YjgwLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9jbGllbnQvYXV0aC9TaWdudXAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XG5pbXBvcnQgRm9ybSBmcm9tICcuLi9mb3JtL0Zvcm0nO1xuaW1wb3J0IElucHV0IGZyb20gJy4uL2Zvcm0vSW5wdXQnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9mb3JtL0J1dHRvbic7XG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4uL2Zvcm0vdmFsaWRhdGlvblR5cGVzJztcbmltcG9ydCB7IHVzZUFwcENvbnRleHQgfSBmcm9tICcuLi9hcHAtY29udGV4dCc7XG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaWdudXAoKSB7XG4gIGNvbnN0IHsgZm9ybSwgYXV0aCB9ID0gdXNlQXBwQ29udGV4dCgpO1xuICBjb25zdCB7IHVzZXJuYW1lLCBwYXNzd29yZCwgZW1haWwgfSA9IGF1dGguc3RhdGU7XG5cbiAgZnVuY3Rpb24gaGFuZGxlU2lnbnVwKCkge1xuICAgIGF1dGguZGlzcGF0Y2goXG4gICAgICBhY3Rpb25zLnNpZ251cCh7XG4gICAgICAgIGRpc3BhdGNoOiBhdXRoLmRpc3BhdGNoLFxuICAgICAgICBzdGF0ZTogYXV0aC5zdGF0ZSxcbiAgICAgICAgZm9ybURpc3BhdGNoOiBmb3JtLmRpc3BhdGNoLFxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZS50YXJnZXQ7XG4gICAgYXV0aC5kaXNwYXRjaChcbiAgICAgIGFjdGlvbnMudmFsdWVDaGFuZ2VkKHtcbiAgICAgICAgcHJvcE5hbWU6IG5hbWUsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBkaXNwYXRjaDogYXV0aC5kaXNwYXRjaCxcbiAgICAgICAgc3RhdGU6IGF1dGguc3RhdGUsXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwic2lnbnVwZm9ybVwiIGNsYXNzTmFtZT1cImF1dGgtZm9ybVwiPlxuICAgICAgPEZvcm0gZm9ybVRpdGxlPVwiU2lnbiB1cFwiPlxuICAgICAgICA8SW5wdXRcbiAgICAgICAgICB2YWx1ZT17dXNlcm5hbWV9XG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgaWQ9XCJ1c2VybmFtZVwiXG4gICAgICAgICAgbmFtZT1cInVzZXJuYW1lXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cInVzZXJuYW1lXCJcbiAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1tcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9UQUtFTixcbiAgICAgICAgICBdfVxuICAgICAgICAvPlxuICAgICAgICA8SW5wdXRcbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIHZhbHVlPXtlbWFpbH1cbiAgICAgICAgICBwbGFjZWhvbGRlcj1cImVtYWlsXCJcbiAgICAgICAgICB0eXBlPVwiZW1haWxcIlxuICAgICAgICAgIGlkPVwiZW1haWxcIlxuICAgICAgICAgIG5hbWU9XCJlbWFpbFwiXG4gICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuUkVHSVNURVJFRF9FTUFJTCxcbiAgICAgICAgICBdfVxuICAgICAgICAvPlxuICAgICAgICA8SW5wdXRcbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICBwbGFjZWhvbGRlcj1cInBhc3N3b3JkXCJcbiAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgICAgIGlkPVwicGFzc3dvcmRcIlxuICAgICAgICAgIG5hbWU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OXX1cbiAgICAgICAgLz5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0blwiXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgb25DbGljaz17aGFuZGxlU2lnbnVwfVxuICAgICAgICAgIGlkPVwic2lnbnVwLWJ0blwiXG4gICAgICAgICAgdGl0bGU9XCJTaWdudXBcIlxuICAgICAgICAvPlxuICAgICAgPC9Gb3JtPlxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sIm5hbWVzIjpbIlNpZ251cCIsImZvcm0iLCJhdXRoIiwidXNlQXBwQ29udGV4dCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJlbWFpbCIsInN0YXRlIiwiaGFuZGxlU2lnbnVwIiwiZGlzcGF0Y2giLCJhY3Rpb25zIiwiZm9ybURpc3BhdGNoIiwiaGFuZGxlQ2hhbmdlIiwiZSIsIm5hbWUiLCJ2YWx1ZSIsInRhcmdldCIsInByb3BOYW1lIiwidmFsaWRhdGlvblR5cGVzIiwiVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9UQUtFTiIsIkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiUkVHSVNURVJFRF9FTUFJTCIsIlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OIl0sIm1hcHBpbmdzIjoiOzs7O0FBUWUsU0FBU0EsTUFBVCxHQUFrQjtBQUMvQixRQUFNO0FBQUVDLElBQUFBLElBQUY7QUFBUUMsSUFB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
