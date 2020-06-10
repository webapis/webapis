import { k as useAppRoute, m as useMediaQuery, b as useAuthContext, n as useFormContext, l, j as h, v as validationTypes, o as valueChanged, p as login } from './index-ee4c3b28.js';
import { P as Paper, F as Form, I as Input, B as Button, G as Grid } from './Grid-b74e091d.js';

function Login() {
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
  l(() => {
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

  function handleLogin() {
    dispatch(login({
      dispatch,
      state,
      formDispatch
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
    onClick: handleLogin,
    title: "LOGIN"
  }), h("a", {
    href: "/",
    onClick: handleRoute,
    id: "forgotpassword",
    "data-testid": "forgotpassword"
  }, "Forgot Password!"))));
}

export default Login;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW4tNmQyMjcxNzEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9hdXRoL0xvZ2luLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vZm9ybS9JbnB1dCc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vZm9ybS9CdXR0b24nO1xyXG5pbXBvcnQgRm9ybSBmcm9tICcuLi9mb3JtL0Zvcm0nO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4uL2Zvcm0vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XHJcbmltcG9ydCB7dXNlRm9ybUNvbnRleHR9IGZyb20gJy4uL2Zvcm0vZm9ybS1jb250ZXh0J1xyXG5pbXBvcnQgeyB1c2VNZWRpYVF1ZXJ5IH0gZnJvbSAnLi4vbGF5b3V0L3VzZU1lZGlhUXVlcnknO1xyXG5pbXBvcnQge3VzZUFwcFJvdXRlfSBmcm9tICcuLi9hcHAtcm91dGUvQXBwUm91dGVQcm92aWRlcidcclxuaW1wb3J0IHsgUGFwZXIgfSBmcm9tICcuLi9sYXlvdXQvUGFwZXInO1xyXG5pbXBvcnQgeyBHcmlkIH0gZnJvbSAnLi4vbGF5b3V0L0dyaWQnO1xyXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBMb2dpbigpIHtcclxuICBjb25zdCB7b25BcHBSb3V0ZX0gPSB1c2VBcHBSb3V0ZSgpO1xyXG5cclxuICBjb25zdCB7IGRldmljZSB9ID0gdXNlTWVkaWFRdWVyeSgpO1xyXG4gIGNvbnN0IHtzdGF0ZSwgZGlzcGF0Y2h9ID0gdXNlQXV0aENvbnRleHQoKTtcclxuICBjb25zdCB7ZGlzcGF0Y2g6Zm9ybURpc3BhdGNofT11c2VGb3JtQ29udGV4dCgpXHJcblxyXG4gIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCwgZXJyb3IgfSA9c3RhdGU7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoc3RhdGUudG9rZW4pIHtcclxuICAgIFxyXG4gICAgICBvbkFwcFJvdXRlKHtmZWF0dXJlUm91dGU6ICcvJyxyb3V0ZTonLyd9KTtcclxuICAgIH1cclxuICB9LCBbc3RhdGUudG9rZW5dKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlUm91dGUoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICBcclxuICAgIG9uQXBwUm91dGUoe2ZlYXR1cmVSb3V0ZTogJy9mb3Jnb3RwYXNzd29yZCcscm91dGU6Jy9hdXRoJ30pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGUpIHtcclxuICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IGUudGFyZ2V0O1xyXG4gICAgZGlzcGF0Y2goXHJcbiAgICAgIGFjdGlvbnMudmFsdWVDaGFuZ2VkKHtcclxuICAgICAgICBwcm9wTmFtZTogbmFtZSxcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ2luKCkge1xyXG4gICAgZGlzcGF0Y2goXHJcbiAgICAgIGFjdGlvbnMubG9naW4oe1xyXG4gICAgICAgIGRpc3BhdGNoLFxyXG4gICAgICAgIHN0YXRlLFxyXG4gICAgICAgIGZvcm1EaXNwYXRjaFxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcblxyXG5cclxuIFxyXG4gICAgPEdyaWQgd2lkdGg9e2RldmljZSA9PT0gJ3Bob25lJyA/IDEwMCA6IDI1fT5cclxuICAgICAgPFBhcGVyPlxyXG4gICAgICAgIDxGb3JtIGZvcm1UaXRsZT0nTG9naW4nIGVycm9yPXtlcnJvcn0+XHJcbiAgICAgICAgICA8SW5wdXRcclxuICAgICAgICAgICAgdmFsdWU9e2VtYWlsb3J1c2VybmFtZX1cclxuICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cclxuICAgICAgICAgICAgbmFtZT0nZW1haWxvcnVzZXJuYW1lJ1xyXG4gICAgICAgICAgICB0eXBlPSd0ZXh0J1xyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nRW50ZXIgZW1haWwgb3IgdXNlcm5hbWUnXHJcbiAgICAgICAgICAgIGlkPSdlbWFpbE9yVXNlcm5hbWUnXHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPSdlbWFpbE9yVXNlcm5hbWUnXHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W1xyXG4gICAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5VU0VSTkFNRV9PUl9FTUFJTF9GT1JNQVRfVkFMSURBVElPTixcclxuICAgICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX05PVF9SRUdJU1RFUkVELFxyXG4gICAgICAgICAgICBdfVxyXG4gICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICA8SW5wdXRcclxuICAgICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxyXG4gICAgICAgICAgICBuYW1lPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdlbnRlciBwYXNzd29yZCdcclxuICAgICAgICAgICAgaWQ9J3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W1xyXG4gICAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcclxuICAgICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcclxuICAgICAgICAgICAgXX1cclxuICAgICAgICAgIC8+XHJcblxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICB0eXBlPSdidXR0b24nXHJcbiAgICAgICAgICAgIGlkPSdsb2dpbi1idG4nXHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPSdsb2dpbi1idG4nXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUxvZ2lufVxyXG4gICAgICAgICAgICB0aXRsZT0nTE9HSU4nXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdmb3Jnb3RwYXNzd29yZCcgZGF0YS10ZXN0aWQ9J2ZvcmdvdHBhc3N3b3JkJz5cclxuICAgICAgICAgICAgRm9yZ290IFBhc3N3b3JkIVxyXG4gICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvRm9ybT5cclxuICAgICAgPC9QYXBlcj5cclxuICAgIDwvR3JpZD5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJMb2dpbiIsIm9uQXBwUm91dGUiLCJ1c2VBcHBSb3V0ZSIsImRldmljZSIsInVzZU1lZGlhUXVlcnkiLCJzdGF0ZSIsImRpc3BhdGNoIiwidXNlQXV0aENvbnRleHQiLCJmb3JtRGlzcGF0Y2giLCJ1c2VGb3JtQ29udGV4dCIsImVtYWlsb3J1c2VybmFtZSIsInBhc3N3b3JkIiwiZXJyb3IiLCJ1c2VFZmZlY3QiLCJ0b2tlbiIsImZlYXR1cmVSb3V0ZSIsInJvdXRlIiwiaGFuZGxlUm91dGUiLCJlIiwicHJldmVudERlZmF1bHQiLCJoYW5kbGVDaGFuZ2UiLCJuYW1lIiwidmFsdWUiLCJ0YXJnZXQiLCJhY3Rpb25zIiwicHJvcE5hbWUiLCJoYW5kbGVMb2dpbiIsInZhbGlkYXRpb25UeXBlcyIsIlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiSU5WQUxJRF9DUkVERU5USUFMUyIsIkVNQUlMX05PVF9SRUdJU1RFUkVEIiwiVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQiLCJFTVBUWV9TVFJJTkdfVkFMSURBVElPTiJdLCJtYXBwaW5ncyI6Ijs7O0FBY2UsU0FBU0EsS0FBVCxHQUFpQjtBQUM5QixRQUFNO0FBQUNDLElBQUFBO0FBQUQsTUFBZUMsV0FBVyxFQUFoQztBQUVBLFFBQU07QUFBRUMsSUFBQUE7QUFBRixNQUFhQyxhQUFhLEVBQWhDO0FBQ0EsUUFBTTtBQUFDQyxJQUFBQSxLQUFEO0FBQVFDLElBQUFBO0FBQVIsTUFBb0JDLGNBQWMsRUFBeEM7QUFDQSxRQUFNO0FBQUNELElBQUFBLFFBQVEsRUFBQ0U7QUFBVixNQUF3QkMsY0FBYyxFQUE1QztBQUVBLFFBQU07QUFBRUMsSUFBQUEsZUFBRjtBQUFtQkMsSUFBQUEsUUFBbkI7QUFBNkJDLElBQUFBO0FBQTdCLE1BQXNDUCxLQUE1QztBQUVBUSxFQUFBQSxDQUFTLENBQUMsTUFBTTtBQUNkLFFBQUlSLEtBQUssQ0FBQ1MsS0FBVixFQUFpQjtBQUVmYixNQUFBQSxVQUFVLENBQUM7QUFBQ2MsUUFBQUEsWUFBWSxFQUFFLEdBQWY7QUFBbUJDLFFBQUFBLEtBQUssRUFBQztBQUF6QixPQUFELENBQVY7QUFDRDtBQUNGLEdBTFEsRUFLTixDQUFDWCxLQUFLLENBQUNTLEtBQVAsQ0FMTSxDQUFUOztBQU9BLFdBQVNHLFdBQVQsQ0FBcUJDLENBQXJCLEVBQXdCO0FBQ3RCQSxJQUFBQSxDQUFDLENBQUNDLGNBQUY7QUFFQWxCLElBQUFBLFVBQVUsQ0FBQztBQUFDYyxNQUFBQSxZQUFZLEVBQUUsaUJBQWY7QUFBaUNDLE1BQUFBLEtBQUssRUFBQztBQUF2QyxLQUFELENBQVY7QUFDRDs7QUFFRCxXQUFTSSxZQUFULENBQXNCRixDQUF0QixFQUF5QjtBQUN2QixVQUFNO0FBQUVHLE1BQUFBLElBQUY7QUFBUUMsTUFBQUE7QUFBUixRQUFrQkosQ0FBQyxDQUFDSyxNQUExQjtBQUNBakIsSUFBQUEsUUFBUSxDQUNOa0IsWUFBQSxDQUFxQjtBQUNuQkMsTUFBQUEsUUFBUSxFQUFFSixJQURTO0FBRW5CQyxNQUFBQSxLQUZtQjtBQUduQmhCLE1BQUFBLFFBSG1CO0FBSW5CRCxNQUFBQTtBQUptQixLQUFyQixDQURNLENBQVI7QUFRRDs7QUFDRCxXQUFTcUIsV0FBVCxHQUF1QjtBQUNyQnBCLElBQUFBLFFBQVEsQ0FDTmtCLEtBQUEsQ0FBYztBQUNabEIsTUFBQUEsUUFEWTtBQUVaRCxNQUFBQSxLQUZZO0FBR1pHLE1BQUFBO0FBSFksS0FBZCxDQURNLENBQVI7QUFPRDs7QUFFRCxTQUlFLEVBQUMsSUFBRDtBQUFNLElBQUEsS0FBSyxFQUFFTCxNQUFNLEtBQUssT0FBWCxHQUFxQixHQUFyQixHQUEyQjtBQUF4QyxLQUNFLEVBQUMsS0FBRCxRQUNFLEVBQUMsSUFBRDtBQUFNLElBQUEsU0FBUyxFQUFDLE9BQWhCO0FBQXdCLElBQUEsS0FBSyxFQUFFUztBQUEvQixLQUNFLEVBQUMsS0FBRDtBQUNFLElBQUEsS0FBSyxFQUFFRixlQURUO0FBRUUsSUFBQSxRQUFRLEVBQUVVLFlBRlo7QUFHRSxJQUFBLElBQUksRUFBQyxpQkFIUDtBQUlFLElBQUEsSUFBSSxFQUFDLE1BSlA7QUFLRSxJQUFBLFdBQVcsRUFBQyx5QkFMZDtBQU1FLElBQUEsRUFBRSxFQUFDLGlCQU5MO0FBT0UsbUJBQVksaUJBUGQ7QUFRRSxJQUFBLGVBQWUsRUFBRSxDQUNmTyxlQUFlLENBQUNDLG1DQURELEVBRWZELGVBQWUsQ0FBQ0UsbUJBRkQsRUFHZkYsZUFBZSxDQUFDRyxvQkFIRCxFQUlmSCxlQUFlLENBQUNJLHVCQUpEO0FBUm5CLElBREYsRUFpQkUsRUFBQyxLQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUVwQixRQURUO0FBRUUsSUFBQSxRQUFRLEVBQUVTLFlBRlo7QUFHRSxJQUFBLElBQUksRUFBQyxVQUhQO0FBSUUsSUFBQSxJQUFJLEVBQUMsVUFKUDtBQUtFLElBQUEsV0FBVyxFQUFDLGdCQUxkO0FBTUUsSUFBQSxFQUFFLEVBQUMsVUFOTDtBQU9FLG1CQUFZLFVBUGQ7QUFRRSxJQUFBLGVBQWUsRUFBRSxDQUNmTyxlQUFlLENBQUNLLHVCQURELEVBRWZMLGVBQWUsQ0FBQ0UsbUJBRkQ7QUFSbkIsSUFqQkYsRUErQkUsRUFBQyxNQUFEO0FBQ0UsSUFBQSxJQUFJLEVBQUMsUUFEUDtBQUVFLElBQUEsRUFBRSxFQUFDLFdBRkw7QUFHRSxtQkFBWSxXQUhkO0FBSUUsSUFBQSxPQUFPLEVBQUVILFdBSlg7QUFLRSxJQUFBLEtBQUssRUFBQztBQUxSLElBL0JGLEVBc0NFO0FBQUcsSUFBQSxJQUFJLEVBQUMsR0FBUjtBQUFZLElBQUEsT0FBTyxFQUFFVCxXQUFyQjtBQUFrQyxJQUFBLEVBQUUsRUFBQyxnQkFBckM7QUFBc0QsbUJBQVk7QUFBbEUsd0JBdENGLENBREYsQ0FERixDQUpGO0FBbUREOzs7OyJ9
