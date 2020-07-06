import { h } from './index-63ebe6d2.js';
import { B as Button, T as TextInput } from './index-ef9e6820.js';
import { A as Alert } from './index-f77d6fb4.js';

function ChangePassword(props) {
  const {
    password,
    confirm,
    validation,
    onChange,
    onPasswordChange,
    loading
  } = props; // useEffect(() => {
  //   let url = new URL(window.location.href);
  //   var urltoken = url.searchParams.get('token');
  //   if (urltoken) {
  //     dispatch(actions.getTokenFromUrl({ token: urltoken }));
  //   }
  // }, []);

  return h("div", {
    className: "col-md-4 border mx-auto rounded",
    style: {
      margin: 15,
      padding: 16
    }
  }, loading && h("div", {
    className: "progress",
    style: "height: 5px;"
  }, h("div", {
    className: "progress-bar progress-bar-striped progress-bar-animated",
    role: "progressbar",
    "aria-valuenow": "100",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    style: "width: 100%"
  })), error && h(Alert, {
    alert: "danger",
    message: error.message
  }), h(TextInput, {
    label: "Password",
    value: password,
    type: "password",
    id: "password",
    name: "password",
    placeholder: "Enter new password",
    onChange: onChange,
    isValid: validation && validation['password'].isValid,
    message: validation && validation['password'].message
  }), h(TextInput, {
    label: "Confirm",
    value: confirm,
    type: "password",
    id: "confirm",
    name: "confirm",
    placeholder: "Confirm new password",
    onChange: onChange,
    isValid: validation && validation['confirm'].isValid,
    message: validation && validation['confirm'].message
  }), h(Button, {
    type: "button",
    loading: loading,
    "data-testid": "change-pass-btn",
    onClick: onPasswordChange,
    title: "Change",
    bg: "primary"
  }));
}

export default ChangePassword;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbmdlUGFzc3dvcmQtNTk1NTZjOTguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCBBbGVydCBmcm9tICdjb250cm9scy9hbGVydCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENoYW5nZVBhc3N3b3JkKHByb3BzKSB7XHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSwgdmFsaWRhdGlvbiwgb25DaGFuZ2UsIG9uUGFzc3dvcmRDaGFuZ2UsIGxvYWRpbmcgfSA9IHByb3BzO1xyXG5cclxuICAvLyB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIC8vICAgbGV0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gIC8vICAgdmFyIHVybHRva2VuID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3Rva2VuJyk7XHJcblxyXG4gIC8vICAgaWYgKHVybHRva2VuKSB7XHJcbiAgLy8gICAgIGRpc3BhdGNoKGFjdGlvbnMuZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW46IHVybHRva2VuIH0pKTtcclxuICAvLyAgIH1cclxuICAvLyB9LCBbXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC00IGJvcmRlciBteC1hdXRvIHJvdW5kZWRcIiBzdHlsZT17eyBtYXJnaW46IDE1LCBwYWRkaW5nOiAxNiB9fT5cclxuICAgICAge2xvYWRpbmcgJiYgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzc1wiIHN0eWxlPVwiaGVpZ2h0OiA1cHg7XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjEwMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiIHN0eWxlPVwid2lkdGg6IDEwMCVcIj48L2Rpdj5cclxuICAgICAgPC9kaXY+fVxyXG4gICAgICB7ZXJyb3IgJiYgPEFsZXJ0IGFsZXJ0PVwiZGFuZ2VyXCIgbWVzc2FnZT17ZXJyb3IubWVzc2FnZX0gLz59XHJcbiAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcclxuICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XHJcbiAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgaWQ9J3Bhc3N3b3JkJ1xyXG4gICAgICAgIG5hbWU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgIHBsYWNlaG9sZGVyPSdFbnRlciBuZXcgcGFzc3dvcmQnXHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5pc1ZhbGlkfVxyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5tZXNzYWdlfVxyXG5cclxuICAgICAgLz5cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIGxhYmVsPVwiQ29uZmlybVwiXHJcbiAgICAgICAgdmFsdWU9e2NvbmZpcm19XHJcbiAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgaWQ9J2NvbmZpcm0nXHJcbiAgICAgICAgbmFtZT0nY29uZmlybSdcclxuICAgICAgICBwbGFjZWhvbGRlcj0nQ29uZmlybSBuZXcgcGFzc3dvcmQnXHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsnY29uZmlybSddLmlzVmFsaWR9XHJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydjb25maXJtJ10ubWVzc2FnZX1cclxuXHJcbiAgICAgIC8+XHJcbiAgICAgIDxCdXR0b25cclxuICAgICAgICB0eXBlPSdidXR0b24nXHJcbiAgICAgICAgbG9hZGluZz17bG9hZGluZ31cclxuICAgICAgICBkYXRhLXRlc3RpZD0nY2hhbmdlLXBhc3MtYnRuJ1xyXG4gICAgICAgIG9uQ2xpY2s9e29uUGFzc3dvcmRDaGFuZ2V9XHJcbiAgICAgICAgdGl0bGU9XCJDaGFuZ2VcIiBiZz1cInByaW1hcnlcIiAvPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIkNoYW5nZVBhc3N3b3JkIiwicHJvcHMiLCJwYXNzd29yZCIsImNvbmZpcm0iLCJ2YWxpZGF0aW9uIiwib25DaGFuZ2UiLCJvblBhc3N3b3JkQ2hhbmdlIiwibG9hZGluZyIsIm1hcmdpbiIsInBhZGRpbmciLCJlcnJvciIsIm1lc3NhZ2UiLCJpc1ZhbGlkIl0sIm1hcHBpbmdzIjoiOzs7O0FBS2UsU0FBU0EsY0FBVCxDQUF3QkMsS0FBeEIsRUFBK0I7QUFDNUMsUUFBTTtBQUFFQyxJQUFBQSxRQUFGO0FBQVlDLElBQUFBLE9BQVo7QUFBcUJDLElBQUFBLFVBQXJCO0FBQWlDQyxJQUFBQSxRQUFqQztBQUEyQ0MsSUFBQUEsZ0JBQTNDO0FBQTZEQyxJQUFBQTtBQUE3RCxNQUF5RU4sS0FBL0UsQ0FENEM7QUFJNUM7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQ0U7QUFBSyxJQUFBLFNBQVMsRUFBQyxpQ0FBZjtBQUFpRCxJQUFBLEtBQUssRUFBRTtBQUFFTyxNQUFBQSxNQUFNLEVBQUUsRUFBVjtBQUFjQyxNQUFBQSxPQUFPLEVBQUU7QUFBdkI7QUFBeEQsS0FDR0YsT0FBTyxJQUFJO0FBQUssSUFBQSxTQUFTLEVBQUMsVUFBZjtBQUEwQixJQUFBLEtBQUssRUFBQztBQUFoQyxLQUNWO0FBQUssSUFBQSxTQUFTLEVBQUMseURBQWY7QUFBeUUsSUFBQSxJQUFJLEVBQUMsYUFBOUU7QUFBNEYscUJBQWMsS0FBMUc7QUFBZ0gscUJBQWMsR0FBOUg7QUFBa0kscUJBQWMsS0FBaEo7QUFBc0osSUFBQSxLQUFLLEVBQUM7QUFBNUosSUFEVSxDQURkLEVBSUdHLEtBQUssSUFBSSxFQUFDLEtBQUQ7QUFBTyxJQUFBLEtBQUssRUFBQyxRQUFiO0FBQXNCLElBQUEsT0FBTyxFQUFFQSxLQUFLLENBQUNDO0FBQXJDLElBSlosRUFLRSxFQUFDLFNBQUQ7QUFDRSxJQUFBLEtBQUssRUFBQyxVQURSO0FBRUUsSUFBQSxLQUFLLEVBQUVULFFBRlQ7QUFHRSxJQUFBLElBQUksRUFBQyxVQUhQO0FBSUUsSUFBQSxFQUFFLEVBQUMsVUFKTDtBQUtFLElBQUEsSUFBSSxFQUFDLFVBTFA7QUFNRSxJQUFBLFdBQVcsRUFBQyxvQkFOZDtBQU9FLElBQUEsUUFBUSxFQUFFRyxRQVBaO0FBUUUsSUFBQSxPQUFPLEVBQUVELFVBQVUsSUFBSUEsVUFBVSxDQUFDLFVBQUQsQ0FBVixDQUF1QlEsT0FSaEQ7QUFTRSxJQUFBLE9BQU8sRUFBRVIsVUFBVSxJQUFJQSxVQUFVLENBQUMsVUFBRCxDQUFWLENBQXVCTztBQVRoRCxJQUxGLEVBaUJFLEVBQUMsU0FBRDtBQUNFLElBQUEsS0FBSyxFQUFDLFNBRFI7QUFFRSxJQUFBLEtBQUssRUFBRVIsT0FGVDtBQUdFLElBQUEsSUFBSSxFQUFDLFVBSFA7QUFJRSxJQUFBLEVBQUUsRUFBQyxTQUpMO0FBS0UsSUFBQSxJQUFJLEVBQUMsU0FMUDtBQU1FLElBQUEsV0FBVyxFQUFDLHNCQU5kO0FBT0UsSUFBQSxRQUFRLEVBQUVFLFFBUFo7QUFRRSxJQUFBLE9BQU8sRUFBRUQsVUFBVSxJQUFJQSxVQUFVLENBQUMsU0FBRCxDQUFWLENBQXNCUSxPQVIvQztBQVNFLElBQUEsT0FBTyxFQUFFUixVQUFVLElBQUlBLFVBQVUsQ0FBQyxTQUFELENBQVYsQ0FBc0JPO0FBVC9DLElBakJGLEVBNkJFLEVBQUMsTUFBRDtBQUNFLElBQUEsSUFBSSxFQUFDLFFBRFA7QUFFRSxJQUFBLE9BQU8sRUFBRUosT0FGWDtBQUdFLG1CQUFZLGlCQUhkO0FBSUUsSUFBQSxPQUFPLEVBQUVELGdCQUpYO0FBS0UsSUFBQSxLQUFLLEVBQUMsUUFMUjtBQUtpQixJQUFBLEVBQUUsRUFBQztBQUxwQixJQTdCRixDQURGO0FBdUNEOzs7OyJ9
