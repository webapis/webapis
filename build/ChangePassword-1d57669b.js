import { u as useAuthContext, p, h } from './index-834af7fd.js';
import { B as Button, v as validationTypes, I as Input, F as Form, c as changePassword } from './actions-fb0d899b.js';

function ChangePassword() {
  const {
    dispatch,
    state
  } = useAuthContext();
  const {
    password,
    confirm,
    current,
    emailorusername,
    token,
    error
  } = state;
  p(() => {
    let url = new URL(window.location.href);
    var token = url.searchParams.get('token');
  }, []);

  function handleChange(e) {
    const {
      name,
      value
    } = e.target;
  }

  function handleChangePass() {
    changePassword({
      dispatch,
      state
    });
  }

  return h("div", {
    "data-testid": "signupform",
    className: "auth-form"
  }, h(Form, {
    formTitle: "Change Password",
    error: error
  }, !token && h(Input, {
    value: emailorusername,
    type: "text",
    id: "emailorusername",
    name: "emailorusername",
    placeholder: "Enter email or username",
    onChange: handleChange,
    validationTypes: [validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION, validationTypes.INVALID_CREDENTIALS]
  }), !token && h(Input, {
    value: current,
    type: "password",
    id: "current",
    name: "current",
    onChange: handleChange,
    placeholder: "Enter current password",
    validationTypes: [validationTypes.EMPTY_STRING_VALIDATION, validationTypes.INVALID_CREDENTIALS]
  }), h(Input, {
    value: password,
    type: "password",
    id: "password",
    name: "password",
    placeholder: "Enter new password",
    onChange: handleChange,
    validationTypes: [validationTypes.PASSWORD_FORMAT_VALIDATION]
  }), h(Input, {
    value: confirm,
    type: "password",
    id: "confirm",
    name: "confirm",
    placeholder: "Confirm new password",
    onChange: handleChange,
    validationTypes: [validationTypes.PASSWORDS_MATCH_VALIDATION]
  }), h(Button, {
    type: "button",
    id: "change-pass-btn",
    "data-testid": "change-pass-btn",
    onClick: handleChangePass,
    title: "Change"
  })));
}

export default ChangePassword;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbmdlUGFzc3dvcmQtMWQ1NzY2OWIuanMiLCJzb3VyY2VzIjpbIi4uL2F1dGgvQ2hhbmdlUGFzc3dvcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCB9IGZyb20gJ3ByZWFjdCc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xuaW1wb3J0IElucHV0IGZyb20gJy4uL2Zvcm0vSW5wdXQnO1xuaW1wb3J0IEZvcm0gZnJvbSAnLi4vZm9ybS9Gb3JtJztcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vZm9ybS9CdXR0b24nO1xuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuLi9mb3JtL3ZhbGlkYXRpb25UeXBlcyc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vYXV0aC1jb250ZXh0JztcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcbmltcG9ydCB7IGdldFRva2VuRnJvbVVybCB9IGZyb20gJy4vYWN0aW9ucyc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDaGFuZ2VQYXNzd29yZCgpIHtcbiAgY29uc3QgeyBkaXNwYXRjaCwgc3RhdGUgfSA9IHVzZUF1dGhDb250ZXh0KCk7XG5cbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSwgY3VycmVudCwgZW1haWxvcnVzZXJuYW1lLCB0b2tlbiwgZXJyb3IgfSA9IHN0YXRlO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgIHZhciB0b2tlbiA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KCd0b2tlbicpO1xuICAgIGlmICh0b2tlbikge1xuICAgICAgYWN0aW9ucy5nZXRUb2tlbkZyb21VcmwoeyB0b2tlbiwgZGlzcGF0Y2gsIHN0YXRlIH0pO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZS50YXJnZXQ7XG4gICAgYWN0aW9ucy52YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZTogbmFtZSwgdmFsdWUsIGRpc3BhdGNoLCBzdGF0ZSB9KTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2VQYXNzKCkge1xuICAgIGFjdGlvbnMuY2hhbmdlUGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUgfSk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwic2lnbnVwZm9ybVwiIGNsYXNzTmFtZT1cImF1dGgtZm9ybVwiPlxuICAgICAgPEZvcm0gZm9ybVRpdGxlPVwiQ2hhbmdlIFBhc3N3b3JkXCIgZXJyb3I9e2Vycm9yfT5cbiAgICAgICAgeyF0b2tlbiAmJiAoXG4gICAgICAgICAgPElucHV0XG4gICAgICAgICAgICB2YWx1ZT17ZW1haWxvcnVzZXJuYW1lfVxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgaWQ9XCJlbWFpbG9ydXNlcm5hbWVcIlxuICAgICAgICAgICAgbmFtZT1cImVtYWlsb3J1c2VybmFtZVwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIGVtYWlsIG9yIHVzZXJuYW1lXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1tcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICAgIF19XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cbiAgICAgICAgeyF0b2tlbiAmJiAoXG4gICAgICAgICAgPElucHV0XG4gICAgICAgICAgICB2YWx1ZT17Y3VycmVudH1cbiAgICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgICBpZD1cImN1cnJlbnRcIlxuICAgICAgICAgICAgbmFtZT1cImN1cnJlbnRcIlxuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgY3VycmVudCBwYXNzd29yZFwiXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1tcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICAgIF19XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cblxuICAgICAgICA8SW5wdXRcbiAgICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XG4gICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICBpZD1cInBhc3N3b3JkXCJcbiAgICAgICAgICBuYW1lPVwicGFzc3dvcmRcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgbmV3IHBhc3N3b3JkXCJcbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W3ZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTl19XG4gICAgICAgIC8+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIHZhbHVlPXtjb25maXJtfVxuICAgICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgICAgaWQ9XCJjb25maXJtXCJcbiAgICAgICAgICBuYW1lPVwiY29uZmlybVwiXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJDb25maXJtIG5ldyBwYXNzd29yZFwiXG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1t2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT05dfVxuICAgICAgICAvPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgaWQ9XCJjaGFuZ2UtcGFzcy1idG5cIlxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiY2hhbmdlLXBhc3MtYnRuXCJcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVDaGFuZ2VQYXNzfVxuICAgICAgICAgIHRpdGxlPVwiQ2hhbmdlXCJcbiAgICAgICAgLz5cbiAgICAgIDwvRm9ybT5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJDaGFuZ2VQYXNzd29yZCIsImRpc3BhdGNoIiwic3RhdGUiLCJ1c2VBdXRoQ29udGV4dCIsInBhc3N3b3JkIiwiY29uZmlybSIsImN1cnJlbnQiLCJlbWFpbG9ydXNlcm5hbWUiLCJ0b2tlbiIsImVycm9yIiwidXNlRWZmZWN0IiwidXJsIiwiVVJMIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwic2VhcmNoUGFyYW1zIiwiZ2V0IiwiaGFuZGxlQ2hhbmdlIiwiZSIsIm5hbWUiLCJ2YWx1ZSIsInRhcmdldCIsImhhbmRsZUNoYW5nZVBhc3MiLCJhY3Rpb25zIiwidmFsaWRhdGlvblR5cGVzIiwiVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJJTlZBTElEX0NSRURFTlRJQUxTIiwiRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04iLCJQQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTiIsIlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OIl0sIm1hcHBpbmdzIjoiOzs7QUFVZSxTQUFTQSxjQUFULEdBQTBCO0FBQ3ZDLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQTtBQUFaLE1BQXNCQyxjQUFjLEVBQTFDO0FBRUEsUUFBTTtBQUFFQyxJQUFBQSxRQUFGO0FBQVlDLElBQUFBLE9BQVo7QUFBcUJDLElBQUFBLE9BQXJCO0FBQThCQyxJQUFBQSxlQUE5QjtB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
