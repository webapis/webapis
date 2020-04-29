import { j as useUserName, u as useRouteContext, a as useMediaQuery, b as useAppContext, p, h, v as validationTypes, c as valueChanged, k as changePassword } from './index-bb26dde7.js';
import { B as Button, I as Input, F as Form, P as Paper, G as Grid } from './Grid-5cecc622.js';
import './style-1cf71dce.js';

function ChangePassword() {
  const {
    token
  } = useUserName();
  const [route, setRoute] = useRouteContext();
  const {
    device
  } = useMediaQuery();
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
    error
  } = state; // useEffect(() => {
  //   let url = new URL(window.location.href);
  //   var token = url.searchParams.get('token');
  //   if (token) {
  //     actions.getTokenFromUrl({ token, dispatch, state });
  //   }
  // }, []);

  p(() => {
    if (auth.state.token) {
      setRoute('/');
    }
  }, [auth.state.token]);

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
      token,
      formDispatch: form.dispatch
    }));
  }

  return h(Grid, {
    width: device === 'phone' ? 100 : 25
  }, h(Paper, null, h(Form, {
    formTitle: "Change Password",
    error: error
  }, h(Input, {
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
  }))));
}

export default ChangePassword;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbmdlUGFzc3dvcmQtMzVkNjcxNjAuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9hdXRoL0NoYW5nZVBhc3N3b3JkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XHJcbmltcG9ydCBJbnB1dCBmcm9tICcuLi9mb3JtL0lucHV0JztcclxuaW1wb3J0IEZvcm0gZnJvbSAnLi4vZm9ybS9Gb3JtJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9mb3JtL0J1dHRvbic7XHJcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi4vZm9ybS92YWxpZGF0aW9uVHlwZXMnO1xyXG5pbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnLi4vYXBwLWNvbnRleHQnO1xyXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCB7IHVzZU1lZGlhUXVlcnkgfSBmcm9tICcuLi9sYXlvdXQvdXNlTWVkaWFRdWVyeSc7XHJcbmltcG9ydCB7IFBhcGVyIH0gZnJvbSAnLi4vbGF5b3V0L1BhcGVyJztcclxuaW1wb3J0IHsgR3JpZCB9IGZyb20gJy4uL2xheW91dC9HcmlkJztcclxuaW1wb3J0IHsgdXNlUm91dGVDb250ZXh0IH0gZnJvbSAnLi4vcm91dGUvcm91dGVyJztcclxuaW1wb3J0IHsgdXNlVXNlck5hbWUgfSBmcm9tICcuL3VzZVVzZXJOYW1lJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2hhbmdlUGFzc3dvcmQoKSB7XHJcbiAgY29uc3QgeyB0b2tlbiB9ID0gdXNlVXNlck5hbWUoKTtcclxuICBjb25zdCBbcm91dGUsIHNldFJvdXRlXSA9IHVzZVJvdXRlQ29udGV4dCgpO1xyXG4gIGNvbnN0IHsgZGV2aWNlIH0gPSB1c2VNZWRpYVF1ZXJ5KCk7XHJcbiAgY29uc3QgeyBmb3JtLCBhdXRoIH0gPSB1c2VBcHBDb250ZXh0KCk7XHJcbiAgY29uc3QgeyBzdGF0ZSwgZGlzcGF0Y2ggfSA9IGF1dGg7XHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSwgZXJyb3IgfSA9IHN0YXRlO1xyXG5cclxuICAvLyB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIC8vICAgbGV0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gIC8vICAgdmFyIHRva2VuID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3Rva2VuJyk7XHJcbiAgLy8gICBpZiAodG9rZW4pIHtcclxuICAvLyAgICAgYWN0aW9ucy5nZXRUb2tlbkZyb21VcmwoeyB0b2tlbiwgZGlzcGF0Y2gsIHN0YXRlIH0pO1xyXG4gIC8vICAgfVxyXG4gIC8vIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmIChhdXRoLnN0YXRlLnRva2VuKSB7XHJcbiAgICAgIHNldFJvdXRlKCcvJyk7XHJcbiAgICB9XHJcbiAgfSwgW2F1dGguc3RhdGUudG9rZW5dKTtcclxuXHJcbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGUpIHtcclxuICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IGUudGFyZ2V0O1xyXG4gICAgZGlzcGF0Y2goXHJcbiAgICAgIGFjdGlvbnMudmFsdWVDaGFuZ2VkKHtcclxuICAgICAgICBwcm9wTmFtZTogbmFtZSxcclxuICAgICAgICB2YWx1ZSxcclxuICAgICAgICBkaXNwYXRjaCxcclxuICAgICAgICBzdGF0ZSxcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZVBhc3MoKSB7XHJcbiAgICBkaXNwYXRjaChcclxuICAgICAgYWN0aW9ucy5jaGFuZ2VQYXNzd29yZCh7XHJcbiAgICAgICAgZGlzcGF0Y2gsXHJcbiAgICAgICAgc3RhdGUsXHJcbiAgICAgICAgdG9rZW4sXHJcbiAgICAgICAgZm9ybURpc3BhdGNoOiBmb3JtLmRpc3BhdGNoLFxyXG4gICAgICB9KVxyXG4gICAgKTtcclxuICB9XHJcbiAgcmV0dXJuIChcclxuICAgIDxHcmlkIHdpZHRoPXtkZXZpY2UgPT09ICdwaG9uZScgPyAxMDAgOiAyNX0+XHJcbiAgICAgIDxQYXBlcj5cclxuICAgICAgICA8Rm9ybSBmb3JtVGl0bGU9J0NoYW5nZSBQYXNzd29yZCcgZXJyb3I9e2Vycm9yfT5cclxuICAgICAgICAgIDxJbnB1dFxyXG4gICAgICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XHJcbiAgICAgICAgICAgIHR5cGU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgICBpZD0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIG5hbWU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nRW50ZXIgbmV3IHBhc3N3b3JkJ1xyXG4gICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1t2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT05dfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxJbnB1dFxyXG4gICAgICAgICAgICB2YWx1ZT17Y29uZmlybX1cclxuICAgICAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIGlkPSdjb25maXJtJ1xyXG4gICAgICAgICAgICBuYW1lPSdjb25maXJtJ1xyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nQ29uZmlybSBuZXcgcGFzc3dvcmQnXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XHJcbiAgICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W3ZhbGlkYXRpb25UeXBlcy5QQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTl19XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICB0eXBlPSdidXR0b24nXHJcbiAgICAgICAgICAgIGlkPSdjaGFuZ2UtcGFzcy1idG4nXHJcbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPSdjaGFuZ2UtcGFzcy1idG4nXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUNoYW5nZVBhc3N9XHJcbiAgICAgICAgICAgIHRpdGxlPSdDaGFuZ2UnXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvRm9ybT5cclxuICAgICAgPC9QYXBlcj5cclxuICAgIDwvR3JpZD5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJDaGFuZ2VQYXNzd29yZCIsInRva2VuIiwidXNlVXNlck5hbWUiLCJyb3V0ZSIsInNldFJvdXRlIiwidXNlUm91dGVDb250ZXh0IiwiZGV2aWNlIiwidXNlTWVkaWFRdWVyeSIsImZvcm0iLCJhdXRoIiwidXNlQXBwQ29udGV4dCIsInN0YXRlIiwiZGlzcGF0Y2giLCJwYXNzd29yZCIsImNvbmZpcm0iLCJlcnJvciIsInVzZUVmZmVjdCIsImhhbmRsZUNoYW5nZSIsImUiLCJuYW1lIiwidmFsdWUiLCJ0YXJnZXQiLCJhY3Rpb25zIiwicHJvcE5hbWUiLCJoYW5kbGVDaGFuZ2VQYXNzIiwiZm9ybURpc3BhdGNoIiwidmFsaWRhdGlvblR5cGVzIiwiUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT04iLCJQQVNTV09SRFNfTUFUQ0hfVkFMSURBVElPTiJdLCJtYXBwaW5ncyI6Ijs7OztBQWNlLFNBQVNBLGNBQVQsR0FBMEI7QUFDdkMsUUFBTTtBQUFFQyxJQUFBQTtBQUFGLE1BQVlDLFdBQVcsRUFBN0I7QUFDQSxRQUFNLENBQUNDLEtBQUQsRUFBUUMsUUFBUixJQUFvQkMsZUFBZSxFQUF6QztBQUNBLFFBQU07QUFBRUMsSUFBQUE7QUFBRixNQUFhQyxhQUFhLEVBQWhDO0FBQ0EsUUFBTTtBQUFFQyxJQUFBQSxJQUFGO0FBQVFDLElBQUFBO0FBQVIsTUFBaUJDLGFBQWEsRUFBcEM7QUFDQSxRQUFNO0FBQUVDLElBQUFBLEtBQUY7QUFBU0MsSUFBQUE7QUFB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
