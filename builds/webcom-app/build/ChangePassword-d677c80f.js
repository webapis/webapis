import { h } from './index-5361741e.js';
import { B as Button, T as TextInput } from './index-0ee26d97.js';
import { A as Alert } from './index-bcd4f557.js';

function ChangePassword(props) {
  const {
    password,
    confirm,
    validation,
    onChange,
    onPasswordChange,
    loading,
    error
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
    onChange: onChange,
    isValid: validation && validation['password'].isValid,
    message: validation && validation['password'].message
  }), h(TextInput, {
    label: "Confirm",
    value: confirm,
    type: "password",
    id: "confirm",
    name: "confirm",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbmdlUGFzc3dvcmQtZDY3N2M4MGYuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCBBbGVydCBmcm9tICdjb250cm9scy9hbGVydCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENoYW5nZVBhc3N3b3JkKHByb3BzKSB7XHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSwgdmFsaWRhdGlvbiwgb25DaGFuZ2UsIG9uUGFzc3dvcmRDaGFuZ2UsIGxvYWRpbmcsZXJyb3IgfSA9IHByb3BzO1xyXG5cclxuICAvLyB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gIC8vICAgbGV0IHVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gIC8vICAgdmFyIHVybHRva2VuID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3Rva2VuJyk7XHJcblxyXG4gIC8vICAgaWYgKHVybHRva2VuKSB7XHJcbiAgLy8gICAgIGRpc3BhdGNoKGFjdGlvbnMuZ2V0VG9rZW5Gcm9tVXJsKHsgdG9rZW46IHVybHRva2VuIH0pKTtcclxuICAvLyAgIH1cclxuICAvLyB9LCBbXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC00IGJvcmRlciBteC1hdXRvIHJvdW5kZWRcIiBzdHlsZT17eyBtYXJnaW46IDE1LCBwYWRkaW5nOiAxNiB9fT5cclxuICAgICAge2xvYWRpbmcgJiYgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzc1wiIHN0eWxlPVwiaGVpZ2h0OiA1cHg7XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjEwMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiIHN0eWxlPVwid2lkdGg6IDEwMCVcIj48L2Rpdj5cclxuICAgICAgPC9kaXY+fVxyXG4gICAgICB7ZXJyb3IgJiYgPEFsZXJ0IGFsZXJ0PVwiZGFuZ2VyXCIgbWVzc2FnZT17ZXJyb3IubWVzc2FnZX0gLz59XHJcbiAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcclxuICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XHJcbiAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgaWQ9J3Bhc3N3b3JkJ1xyXG4gICAgICAgIG5hbWU9J3Bhc3N3b3JkJ1xyXG4gICAgICAgXHJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgIGlzVmFsaWQ9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5pc1ZhbGlkfVxyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsncGFzc3dvcmQnXS5tZXNzYWdlfVxyXG5cclxuICAgICAgLz5cclxuICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgIGxhYmVsPVwiQ29uZmlybVwiXHJcbiAgICAgICAgdmFsdWU9e2NvbmZpcm19XHJcbiAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgaWQ9J2NvbmZpcm0nXHJcbiAgICAgICAgbmFtZT0nY29uZmlybSdcclxuICAgICAgIFxyXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ2NvbmZpcm0nXS5pc1ZhbGlkfVxyXG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvblsnY29uZmlybSddLm1lc3NhZ2V9XHJcblxyXG4gICAgICAvPlxyXG4gICAgICA8QnV0dG9uXHJcbiAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgIGxvYWRpbmc9e2xvYWRpbmd9XHJcbiAgICAgICAgZGF0YS10ZXN0aWQ9J2NoYW5nZS1wYXNzLWJ0bidcclxuICAgICAgICBvbkNsaWNrPXtvblBhc3N3b3JkQ2hhbmdlfVxyXG4gICAgICAgIHRpdGxlPVwiQ2hhbmdlXCIgYmc9XCJwcmltYXJ5XCIgLz5cclxuICAgIDwvZGl2PlxyXG5cclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJDaGFuZ2VQYXNzd29yZCIsInByb3BzIiwicGFzc3dvcmQiLCJjb25maXJtIiwidmFsaWRhdGlvbiIsIm9uQ2hhbmdlIiwib25QYXNzd29yZENoYW5nZSIsImxvYWRpbmciLCJlcnJvciIsIm1hcmdpbiIsInBhZGRpbmciLCJtZXNzYWdlIiwiaXNWYWxpZCJdLCJtYXBwaW5ncyI6Ijs7OztBQUtlLFNBQVNBLGNBQVQsQ0FBd0JDLEtBQXhCLEVBQStCO0FBQzVDLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQSxPQUFaO0FBQXFCQyxJQUFBQSxVQUFyQjtBQUFpQ0MsSUFBQUEsUUFBakM7QUFBMkNDLElBQUFBLGdCQUEzQztBQUE2REMsSUFBQUEsT0FBN0Q7QUFBcUVDLElBQUFBO0FBQXJFLE1BQStFUCxLQUFyRixDQUQ0QztBQUk1QztBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FDRTtBQUFLLElBQUEsU0FBUyxFQUFDLGlDQUFmO0FBQWlELElBQUEsS0FBSyxFQUFFO0FBQUVRLE1BQUFBLE1BQU0sRUFBRSxFQUFWO0FBQWNDLE1BQUFBLE9BQU8sRUFBRTtBQUF2QjtBQUF4RCxLQUNHSCxPQUFPLElBQUk7QUFBSyxJQUFBLFNBQVMsRUFBQyxVQUFmO0FBQTBCLElBQUEsS0FBSyxFQUFDO0FBQWhDLEtBQ1Y7QUFBSyxJQUFBLFNBQVMsRUFBQyx5REFBZjtBQUF5RSxJQUFBLElBQUksRUFBQyxhQUE5RTtBQUE0RixxQkFBYyxLQUExRztBQUFnSCxxQkFBYyxHQUE5SDtBQUFrSSxxQkFBYyxLQUFoSjtBQUFzSixJQUFBLEtBQUssRUFBQztBQUE1SixJQURVLENBRGQsRUFJR0MsS0FBSyxJQUFJLEVBQUMsS0FBRDtBQUFPLElBQUEsS0FBSyxFQUFDLFFBQWI7QUFBc0IsSUFBQSxPQUFPLEVBQUVBLEtBQUssQ0FBQ0c7QUFBckMsSUFKWixFQUtFLEVBQUMsU0FBRDtBQUNFLElBQUEsS0FBSyxFQUFDLFVBRFI7QUFFRSxJQUFBLEtBQUssRUFBRVQsUUFGVDtBQUdFLElBQUEsSUFBSSxFQUFDLFVBSFA7QUFJRSxJQUFBLEVBQUUsRUFBQyxVQUpMO0FBS0UsSUFBQSxJQUFJLEVBQUMsVUFMUDtBQU9FLElBQUEsUUFBUSxFQUFFRyxRQVBaO0FBUUUsSUFBQSxPQUFPLEVBQUVELFVBQVUsSUFBSUEsVUFBVSxDQUFDLFVBQUQsQ0FBVixDQUF1QlEsT0FSaEQ7QUFTRSxJQUFBLE9BQU8sRUFBRVIsVUFBVSxJQUFJQSxVQUFVLENBQUMsVUFBRCxDQUFWLENBQXVCTztBQVRoRCxJQUxGLEVBaUJFLEVBQUMsU0FBRDtBQUNFLElBQUEsS0FBSyxFQUFDLFNBRFI7QUFFRSxJQUFBLEtBQUssRUFBRVIsT0FGVDtBQUdFLElBQUEsSUFBSSxFQUFDLFVBSFA7QUFJRSxJQUFBLEVBQUUsRUFBQyxTQUpMO0FBS0UsSUFBQSxJQUFJLEVBQUMsU0FMUDtBQU9FLElBQUEsUUFBUSxFQUFFRSxRQVBaO0FBUUUsSUFBQSxPQUFPLEVBQUVELFVBQVUsSUFBSUEsVUFBVSxDQUFDLFNBQUQsQ0FBVixDQUFzQlEsT0FSL0M7QUFTRSxJQUFBLE9BQU8sRUFBRVIsVUFBVSxJQUFJQSxVQUFVLENBQUMsU0FBRCxDQUFWLENBQXNCTztBQVQvQyxJQWpCRixFQTZCRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLElBQUksRUFBQyxRQURQO0FBRUUsSUFBQSxPQUFPLEVBQUVKLE9BRlg7QUFHRSxtQkFBWSxpQkFIZDtBQUlFLElBQUEsT0FBTyxFQUFFRCxnQkFKWDtBQUtFLElBQUEsS0FBSyxFQUFDLFFBTFI7QUFLaUIsSUFBQSxFQUFFLEVBQUM7QUFMcEIsSUE3QkYsQ0FERjtBQXVDRDs7OzsifQ==
