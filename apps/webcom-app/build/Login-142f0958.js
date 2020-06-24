import { a as useAppRoute, b as useMediaQuery, c as useAuthContext, d as useFormContext, p, h, v as validationTypes, e as valueChanged } from './index-a8b85bb1.js';
import { P as Paper, F as Form, I as Input, B as Button, G as Grid } from './Grid-53c089db.js';

function Login({
  login
}) {
  const {
    onAppRoute
  } = useAppRoute();
  const {
    device
  } = useMediaQuery();
  const {
    state,
    dispatch
  } = useAuthContext();
  const {
    dispatch: formDispatch
  } = useFormContext();
  const {
    emailorusername,
    password,
    error
  } = state;
  p(() => {
    if (state.token) {
      onAppRoute({
        featureRoute: '/',
        route: '/'
      });
    }
  }, [state.token]);

  function handleRoute(e) {
    e.preventDefault();
    onAppRoute({
      featureRoute: '/forgotpassword',
      route: '/auth'
    });
  }

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

  return h(Grid, {
    width: device === 'phone' ? 100 : 25
  }, h(Paper, null, h(Form, {
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
    onClick: login,
    title: "LOGIN"
  }), h("a", {
    href: "/",
    onClick: handleRoute,
    id: "forgotpassword",
    "data-testid": "forgotpassword"
  }, "Forgot Password!"))));
}

export default Login;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW4tMTQyZjA5NTguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9hdXRoL0xvZ2luLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vZm9ybS9JbnB1dCc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vZm9ybS9CdXR0b24nO1xyXG5pbXBvcnQgRm9ybSBmcm9tICcuLi9mb3JtL0Zvcm0nO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4uL2Zvcm0vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7dXNlRm9ybUNvbnRleHR9IGZyb20gJy4uL2Zvcm0vZm9ybS1jb250ZXh0J1xyXG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknO1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuaW1wb3J0IHsgUGFwZXIgfSBmcm9tICcuLi9sYXlvdXQvUGFwZXInO1xyXG5pbXBvcnQgeyBHcmlkIH0gZnJvbSAnLi4vbGF5b3V0L0dyaWQnO1xyXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb2dpbih7bG9naW59KSB7XHJcbiAgY29uc3Qge29uQXBwUm91dGV9ID0gdXNlQXBwUm91dGUoKTtcclxuXHJcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcclxuICBjb25zdCB7c3RhdGUsIGRpc3BhdGNofSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3Qge2Rpc3BhdGNoOmZvcm1EaXNwYXRjaH09dXNlRm9ybUNvbnRleHQoKVxyXG5cclxuICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQsIGVycm9yIH0gPXN0YXRlO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHN0YXRlLnRva2VuKSB7XHJcbiAgICBcclxuICAgICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOiAnLycscm91dGU6Jy8nfSk7XHJcbiAgICB9XHJcbiAgfSwgW3N0YXRlLnRva2VuXSk7XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZVJvdXRlKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgXHJcbiAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6ICcvZm9yZ290cGFzc3dvcmQnLHJvdXRlOicvYXV0aCd9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShlKSB7XHJcbiAgICBjb25zdCB7IG5hbWUsIHZhbHVlIH0gPSBlLnRhcmdldDtcclxuICAgIGRpc3BhdGNoKFxyXG4gICAgICBhY3Rpb25zLnZhbHVlQ2hhbmdlZCh7XHJcbiAgICAgICAgcHJvcE5hbWU6IG5hbWUsXHJcbiAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuIFxyXG5cclxuICByZXR1cm4gKFxyXG5cclxuXHJcbiBcclxuICAgIDxHcmlkIHdpZHRoPXtkZXZpY2UgPT09ICdwaG9uZScgPyAxMDAgOiAyNX0+XHJcbiAgICAgIDxQYXBlcj5cclxuICAgICAgICA8Rm9ybSBmb3JtVGl0bGU9J0xvZ2luJyBlcnJvcj17ZXJyb3J9PlxyXG4gICAgICAgICAgPElucHV0XHJcbiAgICAgICAgICAgIHZhbHVlPXtlbWFpbG9ydXNlcm5hbWV9XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XHJcbiAgICAgICAgICAgIG5hbWU9J2VtYWlsb3J1c2VybmFtZSdcclxuICAgICAgICAgICAgdHlwZT0ndGV4dCdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0VudGVyIGVtYWlsIG9yIHVzZXJuYW1lJ1xyXG4gICAgICAgICAgICBpZD0nZW1haWxPclVzZXJuYW1lJ1xyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0nZW1haWxPclVzZXJuYW1lJ1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1tcclxuICAgICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICAgICAgXX1cclxuICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgPElucHV0XHJcbiAgICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cclxuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgICAgbmFtZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nZW50ZXIgcGFzc3dvcmQnXHJcbiAgICAgICAgICAgIGlkPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9J3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1tcclxuICAgICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuRU1QVFlfU1RSSU5HX1ZBTElEQVRJT04sXHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgIF19XHJcbiAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgICAgICBpZD0nbG9naW4tYnRuJ1xyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0nbG9naW4tYnRuJ1xyXG4gICAgICAgICAgICBvbkNsaWNrPXtsb2dpbn1cclxuICAgICAgICAgICAgdGl0bGU9J0xPR0lOJ1xyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxhIGhyZWY9Jy8nIG9uQ2xpY2s9e2hhbmRsZVJvdXRlfSBpZD0nZm9yZ290cGFzc3dvcmQnIGRhdGEtdGVzdGlkPSdmb3Jnb3RwYXNzd29yZCc+XHJcbiAgICAgICAgICAgIEZvcmdvdCBQYXNzd29yZCFcclxuICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L0Zvcm0+XHJcbiAgICAgIDwvUGFwZXI+XHJcbiAgICA8L0dyaWQ+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiTG9naW4iLCJsb2dpbiIsIm9uQXBwUm91dGUiLCJ1c2VBcHBSb3V0ZSIsImRldmljZSIsInVzZU1lZGlhUXVlcnkiLCJzdGF0ZSIsImRpc3BhdGNoIiwidXNlQXV0aENvbnRleHQiLCJmb3JtRGlzcGF0Y2giLCJ1c2VGb3JtQ29udGV4dCIsImVtYWlsb3J1c2VybmFtZSIsInBhc3N3b3JkIiwiZXJyb3IiLCJ1c2VFZmZlY3QiLCJ0b2tlbiIsImZlYXR1cmVSb3V0ZSIsInJvdXRlIiwiaGFuZGxlUm91dGUiLCJlIiwicHJldmVudERlZmF1bHQiLCJoYW5kbGVDaGFuZ2UiLCJuYW1lIiwidmFsdWUiLCJ0YXJnZXQiLCJhY3Rpb25zIiwicHJvcE5hbWUiLCJ2YWxpZGF0aW9uVHlwZXMiLCJVU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTiIsIklOVkFMSURfQ1JFREVOVElBTFMiLCJFTUFJTF9OT1RfUkVHSVNURVJFRCIsIlVTRVJOQU1FX05PVF9SRUdJU1RFUkVEIiwiRU1Q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
