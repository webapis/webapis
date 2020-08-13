import { h } from "./index-c4021a67.js";
import { T as TextInput } from "./index-f754cb7d.js";
import { B as Button } from "./index-93758c5b.js";
import { A as Alert } from "./index-f6d2b6e7.js";

function ChangePassword(props) {
  const {
    password,
    confirm,
    validation,
    onChange,
    onPasswordChange,
    loading,
    error,
  } = props; // useEffect(() => {
  //   let url = new URL(window.location.href);
  //   var urltoken = url.searchParams.get('token');
  //   if (urltoken) {
  //     dispatch(actions.getTokenFromUrl({ token: urltoken }));
  //   }
  // }, []);

  return h(
    "div",
    {
      className: "col-md-4 border mx-auto rounded",
      style: {
        margin: 15,
        padding: 16,
      },
    },
    loading &&
      h(
        "div",
        {
          className: "progress",
          style: "height: 5px;",
        },
        h("div", {
          className: "progress-bar progress-bar-striped progress-bar-animated",
          role: "progressbar",
          "aria-valuenow": "100",
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          style: "width: 100%",
        })
      ),
    error &&
      h(Alert, {
        alert: "danger",
        message: error.message,
      }),
    h(TextInput, {
      label: "Password",
      value: password,
      type: "password",
      id: "password",
      name: "password",
      onChange: onChange,
      isValid: validation && validation["password"].isValid,
      message: validation && validation["password"].message,
    }),
    h(TextInput, {
      label: "Confirm",
      value: confirm,
      type: "password",
      id: "confirm",
      name: "confirm",
      onChange: onChange,
      isValid: validation && validation["confirm"].isValid,
      message: validation && validation["confirm"].message,
    }),
    h(Button, {
      type: "button",
      loading: loading,
      "data-testid": "change-pass-btn",
      onClick: onPasswordChange,
      title: "Change",
      bg: "primary",
    })
  );
}

export default ChangePassword;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhbmdlUGFzc3dvcmQtNThjNzVmZDAuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0NoYW5nZVBhc3N3b3JkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgVGV4dElucHV0IGZyb20gXCJjb250cm9scy90ZXh0LWlucHV0XCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCJjb250cm9scy9idXR0b25cIjtcbmltcG9ydCBBbGVydCBmcm9tIFwiY29udHJvbHMvYWxlcnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2hhbmdlUGFzc3dvcmQocHJvcHMpIHtcbiAgY29uc3Qge1xuICAgIHBhc3N3b3JkLFxuICAgIGNvbmZpcm0sXG4gICAgdmFsaWRhdGlvbixcbiAgICBvbkNoYW5nZSxcbiAgICBvblBhc3N3b3JkQ2hhbmdlLFxuICAgIGxvYWRpbmcsXG4gICAgZXJyb3IsXG4gIH0gPSBwcm9wcztcblxuICAvLyB1c2VFZmZlY3QoKCkgPT4ge1xuICAvLyAgIGxldCB1cmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgLy8gICB2YXIgdXJsdG9rZW4gPSB1cmwuc2VhcmNoUGFyYW1zLmdldCgndG9rZW4nKTtcblxuICAvLyAgIGlmICh1cmx0b2tlbikge1xuICAvLyAgICAgZGlzcGF0Y2goYWN0aW9ucy5nZXRUb2tlbkZyb21VcmwoeyB0b2tlbjogdXJsdG9rZW4gfSkpO1xuICAvLyAgIH1cbiAgLy8gfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiXG4gICAgICBzdHlsZT17eyBtYXJnaW46IDE1LCBwYWRkaW5nOiAxNiB9fVxuICAgID5cbiAgICAgIHtsb2FkaW5nICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwcm9ncmVzc1wiIHN0eWxlPVwiaGVpZ2h0OiA1cHg7XCI+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdHJpcGVkIHByb2dyZXNzLWJhci1hbmltYXRlZFwiXG4gICAgICAgICAgICByb2xlPVwicHJvZ3Jlc3NiYXJcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW5vdz1cIjEwMFwiXG4gICAgICAgICAgICBhcmlhLXZhbHVlbWluPVwiMFwiXG4gICAgICAgICAgICBhcmlhLXZhbHVlbWF4PVwiMTAwXCJcbiAgICAgICAgICAgIHN0eWxlPVwid2lkdGg6IDEwMCVcIlxuICAgICAgICAgID48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAge2Vycm9yICYmIDxBbGVydCBhbGVydD1cImRhbmdlclwiIG1lc3NhZ2U9e2Vycm9yLm1lc3NhZ2V9IC8+fVxuICAgICAgPFRleHRJbnB1dFxuICAgICAgICBsYWJlbD1cIlBhc3N3b3JkXCJcbiAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxuICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxuICAgICAgICBpZD1cInBhc3N3b3JkXCJcbiAgICAgICAgbmFtZT1cInBhc3N3b3JkXCJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJwYXNzd29yZFwiXS5pc1ZhbGlkfVxuICAgICAgICBtZXNzYWdlPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJwYXNzd29yZFwiXS5tZXNzYWdlfVxuICAgICAgLz5cbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgbGFiZWw9XCJDb25maXJtXCJcbiAgICAgICAgdmFsdWU9e2NvbmZpcm19XG4gICAgICAgIHR5cGU9XCJwYXNzd29yZFwiXG4gICAgICAgIGlkPVwiY29uZmlybVwiXG4gICAgICAgIG5hbWU9XCJjb25maXJtXCJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICBpc1ZhbGlkPXt2YWxpZGF0aW9uICYmIHZhbGlkYXRpb25bXCJjb25maXJtXCJdLmlzVmFsaWR9XG4gICAgICAgIG1lc3NhZ2U9e3ZhbGlkYXRpb24gJiYgdmFsaWRhdGlvbltcImNvbmZpcm1cIl0ubWVzc2FnZX1cbiAgICAgIC8+XG4gICAgICA8QnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxuICAgICAgICBkYXRhLXRlc3RpZD1cImNoYW5nZS1wYXNzLWJ0blwiXG4gICAgICAgIG9uQ2xpY2s9e29uUGFzc3dvcmRDaGFuZ2V9XG4gICAgICAgIHRpdGxlPVwiQ2hhbmdlXCJcbiAgICAgICAgYmc9XCJwcmltYXJ5XCJcbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiQ2hhbmdlUGFzc3dvcmQiLCJwcm9wcyIsInBhc3N3b3JkIiwiY29uZmlybSIsInZhbGlkYXRpb24iLCJvbkNoYW5nZSIsIm9uUGFzc3dvcmRDaGFuZ2UiLCJsb2FkaW5nIiwiZXJyb3IiLCJtYXJnaW4iLCJwYWRkaW5nIiwibWVzc2FnZSIsImlzVmFsaWQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBS2UsU0FBU0EsY0FBVCxDQUF3QkMsS0FBeEIsRUFBK0I7QUFDNUMsUUFBTTtBQUNKQyxJQUFBQSxRQURJO0FBRUpDLElBQUFBLE9BRkk7QUFHSkMsSUFBQUEsVUFISTtBQUlKQyxJQUFBQSxRQUpJO0FBS0pDLElBQUFBLGdCQUxJO0FBTUpDLElBQUFBLE9BTkk7QUFPSkMsSUFBQUE7QUFQSSxNQVFGUCxLQVJKLENBRDRDO0FBWTVDO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUNFO0FBQ0UsSUFBQSxTQUFTLEVBQUMsaUNBRFo7QUFFRSxJQUFBLEtBQUssRUFBRTtBQUFFUSxNQUFBQSxNQUFNLEVBQUUsRUFBVjtBQUFjQyxNQUFBQSxPQUFPLEVBQUU7QUFBdkI7QUFGVCxLQUlHSCxPQUFPLElBQ047QUFBSyxJQUFBLFNBQVMsRUFBQyxVQUFmO0FBQTBCLElBQUEsS0FBSyxFQUFDO0FBQWhDLEtBQ0U7QUFDRSxJQUFBLFNBQVMsRUFBQyx5REFEWjtBQUVFLElBQUEsSUFBSSxFQUFDLGFBRlA7QUFHRSxxQkFBYyxLQUhoQjtBQUlFLHFCQUFjLEdBSmhCO0FBS0UscUJBQWMsS0FMaEI7QUFNRSxJQUFBLEtBQUssRUFBQztBQU5SLElBREYsQ0FMSixFQWdCR0MsS0FBSyxJQUFJLEVBQUMsS0FBRDtBQUFPLElBQUEsS0FBSyxFQUFDLFFBQWI7QUFBc0IsSUFBQSxPQUFPLEVBQUVBLEtBQUssQ0FBQ0c7QUFBckMsSUFoQlosRUFpQkUsRUFBQyxTQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUMsVUFEUjtBQUVFLElBQUEsS0FBSyxFQUFFVCxRQUZUO0FBR0UsSUFBQSxJQUFJLEVBQUMsVUFIUDtBQUlFLElBQUEsRUFBRSxFQUFDLFVBSkw7QUFLRSxJQUFBLElBQUksRUFBQyxVQUxQO0FBTUUsSUFBQSxRQUFRLEVBQUVHLFFBTlo7QUFPRSxJQUFBLE9BQU8sRUFBRUQsVUFBVSxJQUFJQSxVQUFVLENBQUMsVUFBRCxDQUFWLENBQXVCUSxPQVBoRDtBQVFFLElBQUEsT0FBTyxFQUFFUixVQUFVLElBQUlBLFVBQVUsQ0FBQyxVQUFELENBQVYsQ0FBdUJPO0FBUmhELElBakJGLEVBMkJFLEVBQUMsU0FBRDtBQUNFLElBQUEsS0FBSyxFQUFDLFNBRFI7QUFFRSxJQUFBLEtBQUssRUFBRVIsT0FGVDtBQUdFLElBQUEsSUFBSSxFQUFDLFVBSFA7QUFJRSxJQUFBLEVBQUUsRUFBQyxTQUpMO0FBS0UsSUFBQSxJQUFJLEVBQUMsU0FMUDtBQU1FLElBQUEsUUFBUSxFQUFFRSxRQU5aO0FBT0UsSUFBQSxPQUFPLEVBQUVELFVBQVUsSUFBSUEsVUFBVSxDQUFDLFNBQUQsQ0FBVixDQUFzQlEsT0FQL0M7QUFRRSxJQUFBLE9BQU8sRUFBRVIsVUFBVSxJQUFJQSxVQUFVLENBQUMsU0FBRCxDQUFWLENBQXNCTztBQVIvQyxJQTNCRixFQXFDRSxFQUFDLE1BQUQ7QUFDRSxJQUFBLElBQUksRUFBQyxRQURQO0FBRUUsSUFBQSxPQUFPLEVBQUVKLE9BRlg7QUFHRSxtQkFBWSxpQkFIZDtBQUlFLElBQUEsT0FBTyxFQUFFRCxnQkFKWDtBQUtFLElBQUEsS0FBSyxFQUFDLFFBTFI7QUFNRSxJQUFBLEVBQUUsRUFBQztBQU5MLElBckNGLENBREY7QUFnREQ7Ozs7In0=
