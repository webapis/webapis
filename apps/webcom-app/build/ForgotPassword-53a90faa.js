import { e as useAuthContext, f as useFormContext, h } from './index-2780fa73.js';
import { B as Button, v as validationTypes, I as Input, F as Form, f as forgotPassword, a as valueChanged } from './actions-6d7d0647.js';

function RequestPassChange() {
  const {
    dispatch,
    state
  } = useAuthContext();
  const {
    dispatch: formDispatch
  } = useFormContext();
  const {
    email
  } = state;

  function handleForgotPassword() {
    dispatch(forgotPassword({
      dispatch,
      state,
      formDispatch
    }));
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

  return h("div", {
    "data-testid": "signupform",
    className: "auth-form"
  }, h(Form, {
    formTitle: "Forgot Password"
  }, h(Input, {
    value: email,
    placeholder: "email",
    name: "email",
    onChange: handleChange,
    type: "email",
    id: "email",
    validationTypes: [validationTypes.EMAIL_FORMAT_VALIDATION, validationTypes.EMAIL_NOT_REGISTERED]
  }), h(Button, {
    className: "btn",
    type: "button",
    onClick: handleForgotPassword,
    id: "requestpasschange-btn",
    title: "Send"
  })));
}

export default RequestPassChange;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yZ290UGFzc3dvcmQtNTNhOTBmYWEuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9hdXRoL0ZvcmdvdFBhc3N3b3JkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xuaW1wb3J0IElucHV0IGZyb20gJy4uL2Zvcm0vSW5wdXQnO1xuaW1wb3J0IEZvcm0gZnJvbSAnLi4vZm9ybS9Gb3JtJztcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vZm9ybS9CdXR0b24nO1xuaW1wb3J0IHZhbGlkYXRpb25UeXBlcyBmcm9tICcuLi9mb3JtL3ZhbGlkYXRpb25UeXBlcyc7XG5pbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vYXV0aC1jb250ZXh0JztcbmltcG9ydCB7dXNlRm9ybUNvbnRleHR9IGZyb20gJy4uL2Zvcm0vZm9ybS1jb250ZXh0J1xuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVxdWVzdFBhc3NDaGFuZ2UoKSB7XG4gIGNvbnN0IHsgZGlzcGF0Y2gsIHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xuICBjb25zdCB7ZGlzcGF0Y2g6Zm9ybURpc3BhdGNofT11c2VGb3JtQ29udGV4dCgpXG4gIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUZvcmdvdFBhc3N3b3JkKCkge1xuICAgIGRpc3BhdGNoKGFjdGlvbnMuZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsZm9ybURpc3BhdGNoIH0pKTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IGUudGFyZ2V0O1xuICAgIGRpc3BhdGNoKGFjdGlvbnMudmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWU6IG5hbWUsIHZhbHVlLCBkaXNwYXRjaCwgc3RhdGUgfSkpO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInNpZ251cGZvcm1cIiBjbGFzc05hbWU9XCJhdXRoLWZvcm1cIj5cbiAgICAgIDxGb3JtIGZvcm1UaXRsZT1cIkZvcmdvdCBQYXNzd29yZFwiPlxuICAgICAgICA8SW5wdXRcbiAgICAgICAgICB2YWx1ZT17ZW1haWx9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJlbWFpbFwiXG4gICAgICAgICAgbmFtZT1cImVtYWlsXCJcbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIHR5cGU9XCJlbWFpbFwiXG4gICAgICAgICAgaWQ9XCJlbWFpbFwiXG4gICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXG4gICAgICAgICAgXX1cbiAgICAgICAgLz5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0blwiXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgb25DbGljaz17aGFuZGxlRm9yZ290UGFzc3dvcmR9XG4gICAgICAgICAgaWQ9XCJyZXF1ZXN0cGFzc2NoYW5nZS1idG5cIlxuICAgICAgICAgIHRpdGxlPVwiU2VuZFwiXG4gICAgICAgIC8+XG4gICAgICA8L0Zvcm0+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiUmVxdWVzdFBhc3NDaGFuZ2UiLCJkaXNwYXRjaCIsInN0YXRlIiwidXNlQXV0aENvbnRleHQiLCJmb3JtRGlzcGF0Y2giLCJ1c2VGb3JtQ29udGV4dCIsImVtYWlsIiwiaGFuZGxlRm9yZ290UGFzc3dvcmQiLCJhY3Rpb25zIiwiaGFuZGxlQ2hhbmdlIiwiZSIsIm5hbWUiLCJ2YWx1ZSIsInRhcmdldCIsInByb3BOYW1lIiwidmFsaWRhdGlvblR5cGVzIiwiRU1BSUxfRk9STUFUX1ZBTElEQVRJT04iLCJFTUFJTF9OT1RfUkVHSVNURVJFRCJdLCJtYXBwaW5ncyI6Ijs7O0FBU2UsU0FBU0EsaUJBQVQsR0FBNkI7QUFDMUMsUUFBTTtBQUFFQyxJQUFBQSxRQUFGO0FBQVlDLElBQUFBO0FBQVosTUFBc0JDLGNBQWMsRUFBMUM7QUFDQSxRQUFNO0FBQUNGLElBQUFBLFFBQVEsRUFBQ0c7QUFBVixNQUF3QkMsY0FBYyxFQUE1QztBQUNBLFFBQU07QUFBRUMsSUFBQUE7QUFBRixNQUFZSixLQUFsQjs7QUFFQSxXQUFTSyxvQkFBVCxHQUFnQztBQUM5Qk4sSUFBQUEsUUFBUSxDQUFDTyxjQUFBLENBQXVCO0FBQUVQLE1BQUFBLFFBQUY7QUFBWUMsTUFBQUEsS0FBWjtBQUFrQkUsTUFBQUE7QUFBbEIsS0FBdkIsQ0FBRCxDQUFSO0FBQ0Q7O0FBQ0QsV0FBU0ssWUFBVCxDQUFzQkMsQ0FBdEIsRUFBeUI7QUFDdkIsVUFBTTtBQUFFQyxNQUFBQSxJQUFGO0FBQVFDLE1BQUFBO0FBQVIsUUFBa0JGLENBQUMsQ0FBQ0csTUFBMUI7QUFDQVosSUFBQUEsUUFBUSxDQUFDTyxZQUFBLENBQXFCO0FBQUVNLE1BQUFBLFFBQVEsRUFBRUgsSUFBWjtBQUFrQkMsTUFBQUEsS0FBbEI7QUFBeUJYLE1BQUFBLFFBQXpCO0FBQW1DQyxNQUFBQTtBQUFuQyxLQUFyQixDQUFELENBQVI7QUFDRDs7QUFDRCxTQUNFO0FBQUssbUJBQVksWUFBakI7QUFBOEIsSUFBQSxTQUFTLEVBQUM7QUFBeEMsS0FDRSxFQUFDLElBQUQ7QUFBTSxJQUFBLFNBQVMsRUFBQztBQUFoQixLQUNFLEVBQUMsS0FBRDtBQUNFLElBQUEsS0FBSyxFQUFFSSxLQURUO0FBRUUsSUFBQSxXQUFXLEVBQUMsT0FGZDtBQUdFLElBQUEsSUFBSSxFQUFDLE9BSFA7QUFJRSxJQUFBLFFBQVEsRUFBRUcsWUFKWjtBQUtFLElBQUEsSUFBSSxFQUFDLE9BTFA7QUFNRSxJQUFBLEVBQUUsRUFBQyxPQU5MO0FBT0UsSUFBQSxlQUFlLEVBQUUsQ0FDZk0sZUFBZSxDQUFDQyx1QkFERCxFQUVmRCxlQUFlLENBQUNFLG9CQUZEO0FBUG5CLElBREYsRUFhRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLFNBQVMsRUFBQyxLQURaO0FBRUUsSUFBQSxJQUFJLEVBQUMsUUFGUDtBQUdFLElBQUEsT0FBTyxFQUFFVixvQkFIWDtBQUlFLElBQUEsRUFBRSxFQUFDLHVCQUpMO0FBS0UsSUFBQSxLQUFLLEVBQUM7QUFMUixJQWJGLENBREYsQ0FERjtBQXlCRDs7OzsifQ==