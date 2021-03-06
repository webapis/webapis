import {
  u as useRouteContext,
  a as useMediaQuery,
  b as useAuthContext,
  c as useFormContext,
  p,
  h,
  v as validationTypes,
  d as valueChanged,
  l as login,
} from "./index-a45f22ef.js";
import {
  P as Paper,
  F as Form,
  I as Input,
  B as Button,
  G as Grid,
} from "./Grid-5c4f045b.js";

function Login() {
  const [route, setRoute] = useRouteContext();
  const { device } = useMediaQuery();
  const { state, dispatch } = useAuthContext();
  const { dispatch: formDispatch } = useFormContext();
  const { emailorusername, password, error } = state;
  p(() => {
    if (state.token) {
      setRoute("/");
    }
  }, [state.token]);

  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    setRoute(`/${id}`);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(
      valueChanged({
        propName: name,
        value,
        dispatch,
        state,
      })
    );
  }

  function handleLogin() {
    dispatch(
      login({
        dispatch,
        state,
        formDispatch,
      })
    );
  }

  return h(
    Grid,
    {
      width: device === "phone" ? 100 : 25,
    },
    h(
      Paper,
      null,
      h(
        Form,
        {
          formTitle: "Login",
          error: error,
        },
        h(Input, {
          value: emailorusername,
          onChange: handleChange,
          name: "emailorusername",
          type: "text",
          placeholder: "Enter email or username",
          id: "emailOrUsername",
          "data-testid": "emailOrUsername",
          validationTypes: [
            validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
            validationTypes.INVALID_CREDENTIALS,
            validationTypes.EMAIL_NOT_REGISTERED,
            validationTypes.USERNAME_NOT_REGISTERED,
          ],
        }),
        h(Input, {
          value: password,
          onChange: handleChange,
          name: "password",
          type: "password",
          placeholder: "enter password",
          id: "password",
          "data-testid": "password",
          validationTypes: [
            validationTypes.EMPTY_STRING_VALIDATION,
            validationTypes.INVALID_CREDENTIALS,
          ],
        }),
        h(Button, {
          type: "button",
          id: "login-btn",
          "data-testid": "login-btn",
          onClick: handleLogin,
          title: "LOGIN",
        }),
        h(
          "a",
          {
            href: "/",
            onClick: handleRoute,
            id: "forgotpassword",
            "data-testid": "forgotpassword",
          },
          "Forgot Password!"
        )
      )
    )
  );
}

export default Login;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW4tZjFjMzZkMjYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9hdXRoL0xvZ2luLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncHJlYWN0L2hvb2tzJztcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9mb3JtL0lucHV0JztcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vZm9ybS9CdXR0b24nO1xuaW1wb3J0IEZvcm0gZnJvbSAnLi4vZm9ybS9Gb3JtJztcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi4vZm9ybS92YWxpZGF0aW9uVHlwZXMnO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XG5pbXBvcnQge3VzZUZvcm1Db250ZXh0fSBmcm9tICcuLi9mb3JtL2Zvcm0tY29udGV4dCdcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XG5pbXBvcnQgeyB1c2VSb3V0ZUNvbnRleHQgfSBmcm9tICcuLi9yb3V0ZS9yb3V0ZXInO1xuaW1wb3J0IHsgUGFwZXIgfSBmcm9tICcuLi9sYXlvdXQvUGFwZXInO1xuaW1wb3J0IHsgR3JpZCB9IGZyb20gJy4uL2xheW91dC9HcmlkJztcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9naW4oKSB7XG4gIGNvbnN0IFtyb3V0ZSwgc2V0Um91dGVdID0gdXNlUm91dGVDb250ZXh0KCk7XG4gIGNvbnN0IHsgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XG4gIGNvbnN0IHtzdGF0ZSwgZGlzcGF0Y2h9ID0gdXNlQXV0aENvbnRleHQoKTtcbiAgY29uc3Qge2Rpc3BhdGNoOmZvcm1EaXNwYXRjaH09dXNlRm9ybUNvbnRleHQoKVxuXG4gIGNvbnN0IHsgZW1haWxvcnVzZXJuYW1lLCBwYXNzd29yZCwgZXJyb3IgfSA9c3RhdGU7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc3RhdGUudG9rZW4pIHtcbiAgICAgIHNldFJvdXRlKCcvJyk7XG4gICAgfVxuICB9LCBbc3RhdGUudG9rZW5dKTtcblxuICBmdW5jdGlvbiBoYW5kbGVSb3V0ZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGNvbnN0IHsgaWQgfSA9IGUudGFyZ2V0O1xuICAgIHNldFJvdXRlKGAvJHtpZH1gKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShlKSB7XG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSB9ID0gZS50YXJnZXQ7XG4gICAgZGlzcGF0Y2goXG4gICAgICBhY3Rpb25zLnZhbHVlQ2hhbmdlZCh7XG4gICAgICAgIHByb3BOYW1lOiBuYW1lLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgIHN0YXRlLFxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIGZ1bmN0aW9uIGhhbmRsZUxvZ2luKCkge1xuICAgIGRpc3BhdGNoKFxuICAgICAgYWN0aW9ucy5sb2dpbih7XG4gICAgICAgIGRpc3BhdGNoLFxuICAgICAgICBzdGF0ZSxcbiAgICAgICAgZm9ybURpc3BhdGNoXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuXG5cbiBcbiAgICA8R3JpZCB3aWR0aD17ZGV2aWNlID09PSAncGhvbmUnID8gMTAwIDogMjV9PlxuICAgICAgPFBhcGVyPlxuICAgICAgICA8Rm9ybSBmb3JtVGl0bGU9J0xvZ2luJyBlcnJvcj17ZXJyb3J9PlxuICAgICAgICAgIDxJbnB1dFxuICAgICAgICAgICAgdmFsdWU9e2VtYWlsb3J1c2VybmFtZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICBuYW1lPSdlbWFpbG9ydXNlcm5hbWUnXG4gICAgICAgICAgICB0eXBlPSd0ZXh0J1xuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0VudGVyIGVtYWlsIG9yIHVzZXJuYW1lJ1xuICAgICAgICAgICAgaWQ9J2VtYWlsT3JVc2VybmFtZSdcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPSdlbWFpbE9yVXNlcm5hbWUnXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1tcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuSU5WQUxJRF9DUkVERU5USUFMUyxcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLkVNQUlMX05PVF9SRUdJU1RFUkVELFxuICAgICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQsXG4gICAgICAgICAgICBdfVxuICAgICAgICAgIC8+XG5cbiAgICAgICAgICA8SW5wdXRcbiAgICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgICBuYW1lPSdwYXNzd29yZCdcbiAgICAgICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J2VudGVyIHBhc3N3b3JkJ1xuICAgICAgICAgICAgaWQ9J3Bhc3N3b3JkJ1xuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9J3Bhc3N3b3JkJ1xuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbXG4gICAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcy5FTVBUWV9TVFJJTkdfVkFMSURBVElPTixcbiAgICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLklOVkFMSURfQ1JFREVOVElBTFMsXG4gICAgICAgICAgICBdfVxuICAgICAgICAgIC8+XG5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICB0eXBlPSdidXR0b24nXG4gICAgICAgICAgICBpZD0nbG9naW4tYnRuJ1xuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9J2xvZ2luLWJ0bidcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUxvZ2lufVxuICAgICAgICAgICAgdGl0bGU9J0xPR0lOJ1xuICAgICAgICAgIC8+XG4gICAgICAgICAgPGEgaHJlZj0nLycgb25DbGljaz17aGFuZGxlUm91dGV9IGlkPSdmb3Jnb3RwYXNzd29yZCcgZGF0YS10ZXN0aWQ9J2ZvcmdvdHBhc3N3b3JkJz5cbiAgICAgICAgICAgIEZvcmdvdCBQYXNzd29yZCFcbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvRm9ybT5cbiAgICAgIDwvUGFwZXI+XG4gICAgPC9HcmlkPlxuICApO1xufVxuIl0sIm5hbWVzIjpbIkxvZ2luIiwicm91dGUiLCJzZXRSb3V0ZSIsInVzZVJvdXRlQ29udGV4dCIsImRldmljZSIsInVzZU1lZGlhUXVlcnkiLCJzdGF0ZSIsImRpc3BhdGNoIiwidXNlQXV0aENvbnRleHQiLCJmb3JtRGlzcGF0Y2giLCJ1c2VGb3JtQ29udGV4dCIsImVtYWlsb3J1c2VybmFtZSIsInBhc3N3b3JkIiwiZXJyb3IiLCJ1c2VFZmZlY3QiLCJ0b2tlbiIsImhhbmRsZVJvdXRlIiwiZSIsInByZXZlbnREZWZhdWx0IiwiaWQiLCJ0YXJnZXQiLCJoYW5kbGVDaGFuZ2UiLCJuYW1lIiwidmFsdWUiLCJhY3Rpb25zIiwicHJvcE5hbWUiLCJoYW5kbGVMb2dpbiIsInZhbGlkYXRpb25UeXBlcyIsIlVTRVJOQU1FX09SX0VNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiSU5WQUxJRF9DUkVERU5USUFMUyIsIkVNQUlMX05PVF9SRUdJU1RFUkVEIiwiVVNFUk5BTUVfTk9UX1JFR0lTVEVSRUQiLCJFTVBUWV9TVFJJTkdfVkFMSURBVElPTiJdLCJtYXBwaW5ncyI6Ijs7O0FBY2UsU0FBU0EsS0FBVCxHQUFpQjtBQUM5QixRQUFNLENBQUNDLEtBQUQsRUFBUUMsUUFBUixJQUFvQkMsZUFBZSxFQUF6QztB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
