import { u as useAppContext, p, h } from './index-2780fa73.js';
import { B as Button, v as validationTypes, I as Input, F as Form, a as valueChanged, c as changePassword } from './actions-6d7d0647.js';

function ChangePassword() {
  const {
    form,
    auth
  } = useAppContext();
  const {
    state,
    dispatch
  } = auth;
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
    dispatch(valueChanged({
      propName: name,
      value,
      dispatch,
      state
    }));
  }

  function handleChangePass() {
    dispatch(changePassword({
      dispatch,
      state,
      formDispatch: form.dispatch
    }));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbmdlUGFzc3dvcmQtYTZkNjRlYmEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9hdXRoL0NoYW5nZVBhc3N3b3JkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9mb3JtL0lucHV0JztcbmltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vRm9ybSc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2Zvcm0vQnV0dG9uJztcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi4vZm9ybS92YWxpZGF0aW9uVHlwZXMnO1xuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJy4uL2FwcC1jb250ZXh0JztcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2hhbmdlUGFzc3dvcmQoKSB7XG4gIGNvbnN0IHsgZm9ybSwgYXV0aCB9ID0gdXNlQXBwQ29udGV4dCgpO1xuY29uc3Qge3N0YXRlLGRpc3BhdGNofT1hdXRoXG4gIGNvbnN0IHtcbiAgICBwYXNzd29yZCxcbiAgICBjb25maXJtLFxuICAgIGN1cnJlbnQsXG4gICAgZW1haWxvcnVzZXJuYW1lLFxuICAgIHRva2VuLFxuICAgIGVycm9yLFxuICB9ID0gc3RhdGU7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgdXJsID0gbmV3IFVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgdmFyIHRva2VuID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3Rva2VuJyk7XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICBhY3Rpb25zLmdldFRva2VuRnJvbVVybCh7IHRva2VuLCBkaXNwYXRjaCwgc3RhdGUgfSk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGUpIHtcbiAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBlLnRhcmdldDtcbiAgIGRpc3BhdGNoKFxuICAgICAgYWN0aW9ucy52YWx1ZUNoYW5nZWQoe1xuICAgICAgICBwcm9wTmFtZTogbmFtZSxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGRpc3BhdGNoLFxuICAgICAgICBzdGF0ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZVBhc3MoKSB7XG4gICAgZGlzcGF0Y2goXG4gICAgICBhY3Rpb25zLmNoYW5nZVBhc3N3b3JkKHtcbiAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgIHN0YXRlLFxuICAgICAgICBmb3JtRGlzcGF0Y2g6IGZvcm0uZGlzcGF0Y2gsXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPSdzaWdudXBmb3JtJyBjbGFzc05hbWU9J2F1dGgtZm9ybSc+XG4gICAgICA8Rm9ybSBmb3JtVGl0bGU9J0NoYW5nZSBQYXNzd29yZCcgZXJyb3I9e2Vycm9yfT5cbiAgICAgICAgeyF0b2tlbiAmJiAoXG4gICAgICAgICAgPElucHV0XG4gICAgICAgICAgICB2YWx1ZT17ZW1haWxvcnVzZXJuYW1lfVxuICAgICAgICAgICAgdHlwZT0ndGV4dCdcbiAgICAgICAgICAgIGlkPSdlbWFpbG9ydXNlcm5hbWUnXG4gICAgICAgICAgICBuYW1lPSdlbWFpbG9ydXNlcm5hbWUnXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nRW50ZXIgZW1haWwgb3IgdXNlcm5hbWUnXG4gICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbXG4gICAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICBdfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIHshdG9rZW4gJiYgKFxuICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgdmFsdWU9e2N1cnJlbnR9XG4gICAgICAgICAgICB0eXBlPSdwYXNzd29yZCdcbiAgICAgICAgICAgIGlkPSdjdXJyZW50J1xuICAgICAgICAgICAgbmFtZT0nY3VycmVudCdcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nRW50ZXIgY3VycmVudCBwYXNzd29yZCdcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W1xuICAgICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXG4gICAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxuICAgICAgICAgICAgXX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuXG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICB0eXBlPSdwYXNzd29yZCdcbiAgICAgICAgICBpZD0ncGFzc3dvcmQnXG4gICAgICAgICAgbmFtZT0ncGFzc3dvcmQnXG4gICAgICAgICAgcGxhY2Vob2xkZXI9J0VudGVyIG5ldyBwYXNzd29yZCdcbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W3ZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTl19XG4gICAgICAgIC8+XG4gICAgICAgIDxJbnB1dFxuICAgICAgICAgIHZhbHVlPXtjb25maXJtfVxuICAgICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xuICAgICAgICAgIGlkPSdjb25maXJtJ1xuICAgICAgICAgIG5hbWU9J2NvbmZpcm0nXG4gICAgICAgICAgcGxhY2Vob2xkZXI9J0NvbmZpcm0gbmV3IHBhc3N3b3JkJ1xuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbdmFsaWRhdGlvblR5cGVzLlBBU1NXT1JEU19NQVRDSF9WQUxJREFUSU9OXX1cbiAgICAgICAgLz5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHR5cGU9J2J1dHRvbidcbiAgICAgICAgICBpZD0nY2hhbmdlLXBhc3MtYnRuJ1xuICAgICAgICAgIGRhdGEtdGVzdGlkPSdjaGFuZ2UtcGFzcy1idG4nXG4gICAgICAgICAgb25DbGljaz17aGFuZGxlQ2hhbmdlUGFzc31cbiAgICAgICAgICB0aXRsZT0nQ2hhbmdlJ1xuICAgICAgICAvPlxuICAgICAgPC9Gb3JtPlxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sIm5hbWVzIjpbIkNoYW5nZVBhc3N3b3JkIiwiZm9ybSIsImF1dGgiLCJ1c2VBcHBDb250ZXh0Iiwic3RhdGUiLCJkaXNwYXRjaCIsInBhc3N3b3JkIiwiY29uZmlybSIsImN1cnJlbnQiLCJlbWFpbG9ydXNlcm5hbWUiLCJ0b2tlbiIsImVycm9yIiwidXNlRWZmZWN0IiwidXJsIiwiVVJMIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwic2VhcmNoUGFyYW1zIiwiZ2V0IiwiaGFuZGxlQ2hhbmdlIiwiZSIsIm5hbWUiLCJ2YWx1ZSIsInRhcmdldCIsImFjdGlvbnMiLCJwcm9wTmFtZSIsImhhbmRsZUNoYW5nZVBhc3MiLCJmb3JtRGlzcGF0Y2giLCJ2YWxpZGF0aW9uVHlwZXMiLCJVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIklOVkFMSURfQ1JFREVOVElBTFMiLCJFTVBUWV9TVFJJTkdfVkFMSURBVElPTiIsIlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OIiwiUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT04iXSwibWFwcGluZ3MiOiI7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