import { u as useAppRoute, b as useMediaQuery, c as useAuthContext, p, h, v as valueChanged } from './index-4e980601.js';
import { T as TextInput } from './index-ccfb22a4.js';
import { A as AsyncButton } from './index-5b14cc3a.js';
import { P as Paper, G as Grid } from './Grid-9197e26f.js';

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
    error,
    loading
  } = state;
  p(() => {
    if (state.user && state.user.token) {
      onAppRoute({
        featureRoute: '/',
        route: '/'
      });
    }
  }, [state.user]);

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
    width: device === 'phone' ? 100 : 50
  }, h(Paper, null, h(TextInput, {
    value: emailorusername,
    onChange: handleChange,
    name: "emailorusername",
    type: "text",
    placeholder: "Enter email or username",
    id: "emailOrUsername",
    "data-testid": "emailOrUsername" // validationTypes={[
    //   validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
    //   validationTypes.INVALID_CREDENTIALS,
    //   validationTypes.EMAIL_NOT_REGISTERED,
    //   validationTypes.USERNAME_NOT_REGISTERED,
    // ]}

  }), h(TextInput, {
    value: password,
    onChange: handleChange,
    name: "password",
    type: "password",
    placeholder: "enter password",
    id: "password",
    "data-testid": "password" // validationTypes={[
    //   validationTypes.EMPTY_STRING_VALIDATION,
    //   validationTypes.INVALID_CREDENTIALS,
    // ]}

  }), h(AsyncButton, {
    type: "button",
    id: "login-btn",
    "data-testid": "login-btn",
    onClick: login,
    loading: loading
  }, "LOGIN"), h("a", {
    href: "/",
    onClick: handleRoute,
    id: "forgotpassword",
    "data-testid": "forgotpassword"
  }, "Forgot Password!")));
}

export default Login;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW4tNmQzMGRmMGYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0xvZ2luLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQXN5bmNCdXR0b24gZnJvbSAnY29udHJvbHMvYXN5bmMtYnV0dG9uJ1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4uL3N0YXRlL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICdjb21wb25lbnRzL2xheW91dC91c2VNZWRpYVF1ZXJ5JztcclxuaW1wb3J0IHt1c2VBcHBSb3V0ZX0gZnJvbSAnY29tcG9uZW50cy9hcHAtcm91dGUnXHJcbmltcG9ydCB7IFBhcGVyIH0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvUGFwZXInO1xyXG5pbXBvcnQgeyBHcmlkIH0gZnJvbSAnY29tcG9uZW50cy9sYXlvdXQvR3JpZCc7XHJcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi4vc3RhdGUvYWN0aW9ucyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb2dpbih7bG9naW59KSB7XHJcbiAgY29uc3Qge29uQXBwUm91dGV9ID0gdXNlQXBwUm91dGUoKTtcclxuXHJcbiAgY29uc3QgeyBkZXZpY2UgfSA9IHVzZU1lZGlhUXVlcnkoKTtcclxuICBjb25zdCB7c3RhdGUsIGRpc3BhdGNofSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3Qge2Rpc3BhdGNoOmZvcm1EaXNwYXRjaH09dXNlRm9ybUNvbnRleHQoKVxyXG5cclxuICBjb25zdCB7IGVtYWlsb3J1c2VybmFtZSwgcGFzc3dvcmQsIGVycm9yLGxvYWRpbmcgfSA9c3RhdGU7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUudXNlciYmIHN0YXRlLnVzZXIudG9rZW4pIHtcclxuICAgIFxyXG4gICAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6ICcvJyxyb3V0ZTonLyd9KTtcclxuICAgIH1cclxuICB9LCBbc3RhdGUudXNlcl0pO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgIFxyXG4gICAgb25BcHBSb3V0ZSh7ZmVhdHVyZVJvdXRlOiAnL2ZvcmdvdHBhc3N3b3JkJyxyb3V0ZTonL2F1dGgnfSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZSkge1xyXG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZS50YXJnZXQ7XHJcbiAgICBkaXNwYXRjaChcclxuICAgICAgYWN0aW9ucy52YWx1ZUNoYW5nZWQoe1xyXG4gICAgICAgIHByb3BOYW1lOiBuYW1lLFxyXG4gICAgICAgIHZhbHVlLFxyXG4gICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcbiBcclxuXHJcbiAgcmV0dXJuIChcclxuXHJcblxyXG4gXHJcbiAgICA8R3JpZCB3aWR0aD17ZGV2aWNlID09PSAncGhvbmUnID8gMTAwIDo1MH0+XHJcbiAgICAgIDxQYXBlcj5cclxuICAgICAgXHJcbiAgICAgICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgICAgIHZhbHVlPXtlbWFpbG9ydXNlcm5hbWV9XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XHJcbiAgICAgICAgICAgIG5hbWU9J2VtYWlsb3J1c2VybmFtZSdcclxuICAgICAgICAgICAgdHlwZT0ndGV4dCdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0VudGVyIGVtYWlsIG9yIHVzZXJuYW1lJ1xyXG4gICAgICAgICAgICBpZD0nZW1haWxPclVzZXJuYW1lJ1xyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0nZW1haWxPclVzZXJuYW1lJ1xyXG4gICAgICAgICAgICAvLyB2YWxpZGF0aW9uVHlwZXM9e1tcclxuICAgICAgICAgICAgLy8gICB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfT1JfRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXHJcbiAgICAgICAgICAgIC8vICAgdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXHJcbiAgICAgICAgICAgIC8vICAgdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgICAgICAvLyAgIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9OT1RfUkVHSVNURVJFRCxcclxuICAgICAgICAgICAgLy8gXX1cclxuICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XHJcbiAgICAgICAgICAgIG5hbWU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgICB0eXBlPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J2VudGVyIHBhc3N3b3JkJ1xyXG4gICAgICAgICAgICBpZD0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgLy8gdmFsaWRhdGlvblR5cGVzPXtbXHJcbiAgICAgICAgICAgIC8vICAgdmFsaWRhdGlvblR5cGVzLkVNUFRZX1NUUklOR19WQUxJREFUSU9OLFxyXG4gICAgICAgICAgICAvLyAgIHZhbGlkYXRpb25UeXBlcy5JTlZBTElEX0NSRURFTlRJQUxTLFxyXG4gICAgICAgICAgICAvLyBdfVxyXG4gICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICA8QXN5bmNCdXR0b25cclxuICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgICAgICBpZD0nbG9naW4tYnRuJ1xyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0nbG9naW4tYnRuJ1xyXG4gICAgICAgICAgICBvbkNsaWNrPXtsb2dpbn1cclxuICAgICAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgTE9HSU5cclxuICAgICAgICAgIDwvQXN5bmNCdXR0b24+XHJcbiAgICAgICAgICA8YSBocmVmPScvJyBvbkNsaWNrPXtoYW5kbGVSb3V0ZX0gaWQ9J2ZvcmdvdHBhc3N3b3JkJyBkYXRhLXRlc3RpZD0nZm9yZ290cGFzc3dvcmQnPlxyXG4gICAgICAgICAgICBGb3Jnb3QgUGFzc3dvcmQhXHJcbiAgICAgICAgICA8L2E+XHJcbiAgXHJcbiAgICAgIDwvUGFwZXI+XHJcbiAgICA8L0dyaWQ+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiTG9naW4iLCJsb2dpbiIsIm9uQXBwUm91dGUiLCJ1c2VBcHBSb3V0ZSIsImRldmljZSIsInVzZU1lZGlhUXVlcnkiLCJzdGF0ZSIsImRpc3BhdGNoIiwidXNlQXV0aENvbnRleHQiLCJmb3JtRGlzcGF0Y2giLCJ1c2VGb3JtQ29udGV4dCIsImVtYWlsb3J1c2VybmFtZSIsInBhc3N3b3JkIiwiZXJyb3IiLCJsb2FkaW5nIiwidXNlRWZmZWN0IiwidXNlciIsInRva2VuIiwiZmVhdHVyZVJvdXRlIiwicm91dGUiLCJoYW5kbGVSb3V0ZSIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImhhbmRsZUNoYW5nZSIsIm5hbWUiLCJ2YWx1ZSIsInRhcmdldCIsImFjdGlvbnMiLCJwcm9wTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFXZSxTQUFTQSxLQUFULENBQWU7QUFBQ0MsRUFBQUE7QUFBRCxDQUFmLEVBQXdCO0FBQ3JDLFFBQU07QUFBQ0MsSUFBQUE7QUFBRCxNQUFlQyxXQUFXLEVBQWhDO0FB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
