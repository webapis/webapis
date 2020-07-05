import { h } from './index-e818a723.js';
import { B as Button, T as TextInput } from './index-6be3ba0e.js';

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
  })), h(TextInput, {
    label: "Password",
    value: password,
    type: "password",
    id: "password",
    name: "password",
    placeholder: "Enter new password",
    onChange: onChange,
    isValid: validation && validation['password'].isValid,
    message: validation && validation['password'].message //  validationTypes={[validationTypes.PASSWORD_FORMAT_VALIDATION]}

  }), h(TextInput, {
    label: "Confirm",
    value: confirm,
    type: "password",
    id: "confirm",
    name: "confirm",
    placeholder: "Confirm new password",
    onChange: onChange,
    isValid: validation && validation['confirm'].isValid,
    message: validation && validation['confirm'].message //   validationTypes={[validationTypes.PASSWORDS_MATCH_VALIDATION]}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbmdlUGFzc3dvcmQtMWY3OGE5YTIuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnO1xyXG4vL2ltcG9ydCAnLi9jc3Mvc3R5bGUuc2Nzcyc7XHJcbmltcG9ydCBUZXh0SW5wdXQgZnJvbSAnY29udHJvbHMvdGV4dC1pbnB1dCc7XHJcblxyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcblxyXG5cclxuXHJcblxyXG5pbXBvcnQgeyB1c2VVc2VyTmFtZSB9IGZyb20gJy4uL3N0YXRlL3VzZVVzZXJOYW1lJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2hhbmdlUGFzc3dvcmQocHJvcHMpIHtcclxuICBcclxuXHJcbiAgY29uc3QgeyBwYXNzd29yZCwgY29uZmlybSwgdmFsaWRhdGlvbixvbkNoYW5nZSwgb25QYXNzd29yZENoYW5nZSxsb2FkaW5nIH0gPSBwcm9wcztcclxuXHJcbiAgLy8gdXNlRWZmZWN0KCgpID0+IHtcclxuICAvLyAgIGxldCB1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAvLyAgIHZhciB1cmx0b2tlbiA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KCd0b2tlbicpO1xyXG5cclxuICAvLyAgIGlmICh1cmx0b2tlbikge1xyXG4gIC8vICAgICBkaXNwYXRjaChhY3Rpb25zLmdldFRva2VuRnJvbVVybCh7IHRva2VuOiB1cmx0b2tlbiB9KSk7XHJcbiAgLy8gICB9XHJcbiAgLy8gfSwgW10pO1xyXG5cclxuXHJcblxyXG5cclxuIFxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1tZC00IGJvcmRlciBteC1hdXRvIHJvdW5kZWRcIiBzdHlsZT17e21hcmdpbjoxNSwgcGFkZGluZzoxNn19PlxyXG4gICAgICB7bG9hZGluZyAmJiAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzc1wiIHN0eWxlPVwiaGVpZ2h0OiA1cHg7XCI+XHJcbiAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkXCIgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjEwMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiIHN0eWxlPVwid2lkdGg6IDEwMCVcIj48L2Rpdj5cclxuPC9kaXY+fVxyXG4gICAgICAgICAgPFRleHRJbnB1dFxyXG4gICAgICAgICAgbGFiZWw9XCJQYXNzd29yZFwiXHJcbiAgICAgICAgICAgIHZhbHVlPXtwYXNzd29yZH1cclxuICAgICAgICAgICAgdHlwZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIGlkPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgbmFtZT0ncGFzc3dvcmQnXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdFbnRlciBuZXcgcGFzc3dvcmQnXHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydwYXNzd29yZCddLmlzVmFsaWR9XHJcbiAgICAgICAgICAgIG1lc3NhZ2UgPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ3Bhc3N3b3JkJ10ubWVzc2FnZX1cclxuICAgICAgICAgIC8vICB2YWxpZGF0aW9uVHlwZXM9e1t2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRfRk9STUFUX1ZBTElEQVRJT05dfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxUZXh0SW5wdXRcclxuICAgICAgICAgIGxhYmVsPVwiQ29uZmlybVwiXHJcbiAgICAgICAgICAgIHZhbHVlPXtjb25maXJtfVxyXG4gICAgICAgICAgICB0eXBlPSdwYXNzd29yZCdcclxuICAgICAgICAgICAgaWQ9J2NvbmZpcm0nXHJcbiAgICAgICAgICAgIG5hbWU9J2NvbmZpcm0nXHJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdDb25maXJtIG5ldyBwYXNzd29yZCdcclxuICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxyXG4gICAgICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bJ2NvbmZpcm0nXS5pc1ZhbGlkfVxyXG4gICAgICAgICAgICBtZXNzYWdlID17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydjb25maXJtJ10ubWVzc2FnZX1cclxuICAgICAgICAgLy8gICB2YWxpZGF0aW9uVHlwZXM9e1t2YWxpZGF0aW9uVHlwZXMuUEFTU1dPUkRTX01BVENIX1ZBTElEQVRJT05dfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICAgIDxCdXR0b25cclxuICAgICAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD0nY2hhbmdlLXBhc3MtYnRuJ1xyXG4gICAgICAgICAgICBvbkNsaWNrPXtvblBhc3N3b3JkQ2hhbmdlfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICB0aXRsZT1cIkNoYW5nZVwiIGJnPVwicHJpbWFyeVwiLz5cclxuICAgIDwvZGl2PlxyXG4gICBcclxuICApO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJDaGFuZ2VQYXNzd29yZCIsInByb3BzIiwicGFzc3dvcmQiLCJjb25maXJtIiwidmFsaWRhdGlvbiIsIm9uQ2hhbmdlIiwib25QYXNzd29yZENoYW5nZSIsImxvYWRpbmciLCJtYXJnaW4iLCJwYWRkaW5nIiwiaXNWYWxpZCIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7OztBQVdlLFNBQVNBLGNBQVQsQ0FBd0JDLEtBQXhCLEVBQStCO0FBRzVDLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQSxPQUFaO0FBQXFCQyxJQUFBQSxVQUFyQjtBQUFnQ0MsSUFBQUEsUUFBaEM7QUFBMENDLElBQUFBLGdCQUExQztBQUEyREMsSUFBQUE7QUFBM0QsTUFBdUVOLEtBQTdFLENBSDRDO0FBTTVDO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFNQSxTQUNFO0FBQUssSUFBQSxTQUFTLEVBQUMsaUNBQWY7QUFBaUQsSUFBQSxLQUFLLEVBQUU7QUFBQ08sTUFBQUEsTUFBTSxFQUFDLEVBQVI7QUFBWUMsTUFBQUEsT0FBTyxFQUFDO0FBQXBCO0FBQXhELEtBQ0dGLE9BQU8sSUFBSztBQUFLLElBQUEsU0FBUyxFQUFDLFVBQWY7QUFBMEIsSUFBQSxLQUFLLEVBQUM7QUFBaEMsS0FDakI7QUFBSyxJQUFBLFNBQVMsRUFBQyx5REFBZjtBQUF5RSxJQUFBLElBQUksRUFBQyxhQUE5RTtBQUE0RixxQkFBYyxLQUExRztBQUFnSCxxQkFBYyxHQUE5SDtBQUFrSSxxQkFBYyxLQUFoSjtBQUFzSixJQUFBLEtBQUssRUFBQztBQUE1SixJQURpQixDQURmLEVBSU0sRUFBQyxTQUFEO0FBQ0EsSUFBQSxLQUFLLEVBQUMsVUFETjtBQUVFLElBQUEsS0FBSyxFQUFFTCxRQUZUO0FBR0UsSUFBQSxJQUFJLEVBQUMsVUFIUDtBQUlFLElBQUEsRUFBRSxFQUFDLFVBSkw7QUFLRSxJQUFBLElBQUksRUFBQyxVQUxQO0FBTUUsSUFBQSxXQUFXLEVBQUMsb0JBTmQ7QUFPRSxJQUFBLFFBQVEsRUFBRUcsUUFQWjtBQVFFLElBQUEsT0FBTyxFQUFFRCxVQUFVLElBQUlBLFVBQVUsQ0FBQyxVQUFELENBQVYsQ0FBdUJNLE9BUmhEO0FBU0UsSUFBQSxPQUFPLEVBQUdOLFVBQVUsSUFBSUEsVUFBVSxDQUFDLFVBQUQsQ0FBVixDQUF1Qk8sT0FUakQ7O0FBQUEsSUFKTixFQWdCTSxFQUFDLFNBQUQ7QUFDQSxJQUFBLEtBQUssRUFBQyxTQUROO0FBRUUsSUFBQSxLQUFLLEVBQUVSLE9BRlQ7QUFHRSxJQUFBLElBQUksRUFBQyxVQUhQO0FBSUUsSUFBQSxFQUFFLEVBQUMsU0FKTDtBQUtFLElBQUEsSUFBSSxFQUFDLFNBTFA7QUFNRSxJQUFBLFdBQVcsRUFBQyxzQkFOZDtBQU9FLElBQUEsUUFBUSxFQUFFRSxRQVBaO0FBUUUsSUFBQSxPQUFPLEVBQUVELFVBQVUsSUFBSUEsVUFBVSxDQUFDLFNBQUQsQ0FBVixDQUFzQk0sT0FSL0M7QUFTRSxJQUFBLE9BQU8sRUFBR04sVUFBVSxJQUFJQSxVQUFVLENBQUMsU0FBRCxDQUFWLENBQXNCTyxPQVRoRDs7QUFBQSxJQWhCTixFQTRCTSxFQUFDLE1BQUQ7QUFDRSxJQUFBLElBQUksRUFBQyxRQURQO0FBRUUsSUFBQSxPQUFPLEVBQUVKLE9BRlg7QUFHRSxtQkFBWSxpQkFIZDtBQUlFLElBQUEsT0FBTyxFQUFFRCxnQkFKWDtBQU1GLElBQUEsS0FBSyxFQUFDLFFBTko7QUFNYSxJQUFBLEVBQUUsRUFBQztBQU5oQixJQTVCTixDQURGO0FBdUNEOzs7OyJ9