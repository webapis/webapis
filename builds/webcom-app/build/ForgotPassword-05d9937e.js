import { h } from './index-5361741e.js';
import { B as Button, T as TextInput } from './index-0ee26d97.js';
import { A as Alert } from './index-bcd4f557.js';

function RequestPassChange(props) {
  const {
    email,
    validation,
    onRequestPasswordChange,
    loading,
    onChange,
    error
  } = props;
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
    label: "Email",
    value: email,
    name: "email",
    onChange: onChange,
    type: "email",
    id: "email",
    isValid: validation && validation['email'].isValid,
    message: validation && validation['email'].message
  }), h(Button, {
    type: "button",
    onClick: onRequestPasswordChange,
    "data-testid": "requestpasschange-btn",
    title: "Request password change",
    loading: loading,
    bg: "primary"
  }));
}

export default RequestPassChange;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yZ290UGFzc3dvcmQtMDVkOTkzN2UuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0ZvcmdvdFBhc3N3b3JkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgVGV4dElucHV0IGZyb20gJ2NvbnRyb2xzL3RleHQtaW5wdXQnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJ2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCBBbGVydCBmcm9tICdjb250cm9scy9hbGVydCdcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVxdWVzdFBhc3NDaGFuZ2UocHJvcHMpIHtcclxuICBjb25zdCB7IGVtYWlsLCB2YWxpZGF0aW9uLCBvblJlcXVlc3RQYXNzd29yZENoYW5nZSwgbG9hZGluZywgb25DaGFuZ2UsZXJyb3IgfSA9IHByb3BzXHJcblxyXG5cclxuICByZXR1cm4gKFxyXG5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLW1kLTQgYm9yZGVyIG14LWF1dG8gcm91bmRlZFwiIHN0eWxlPXt7IG1hcmdpbjogMTUsIHBhZGRpbmc6IDE2IH19PlxyXG4gICAgICB7bG9hZGluZyAmJiA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzXCIgc3R5bGU9XCJoZWlnaHQ6IDVweDtcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMTAwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCIgc3R5bGU9XCJ3aWR0aDogMTAwJVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj59XHJcbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfS8+fVxyXG4gICAgICA8VGV4dElucHV0XHJcbiAgICAgICAgbGFiZWw9XCJFbWFpbFwiXHJcbiAgICAgICAgdmFsdWU9e2VtYWlsfVxyXG4gICAgIFxyXG4gICAgICAgIG5hbWU9J2VtYWlsJ1xyXG4gICAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cclxuICAgICAgICB0eXBlPSdlbWFpbCdcclxuICAgICAgICBpZD0nZW1haWwnXHJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLmlzVmFsaWR9XHJcbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uWydlbWFpbCddLm1lc3NhZ2V9XHJcblxyXG4gICAgXHJcbiAgICAgIC8+XHJcbiAgICAgIDxCdXR0b25cclxuXHJcbiAgICAgICAgdHlwZT0nYnV0dG9uJ1xyXG4gICAgICAgIG9uQ2xpY2s9e29uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlfVxyXG4gICAgICAgIGRhdGEtdGVzdGlkPVwicmVxdWVzdHBhc3NjaGFuZ2UtYnRuXCJcclxuICAgICAgICB0aXRsZT1cIlJlcXVlc3QgcGFzc3dvcmQgY2hhbmdlXCJcclxuICAgICAgICBsb2FkaW5nPXtsb2FkaW5nfVxyXG4gICAgICAgIGJnPVwicHJpbWFyeVwiXHJcblxyXG4gICAgICAvPlxyXG5cclxuXHJcblxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsiUmVxdWVzdFBhc3NDaGFuZ2UiLCJwcm9wcyIsImVtYWlsIiwidmFsaWRhdGlvbiIsIm9uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlIiwibG9hZGluZyIsIm9uQ2hhbmdlIiwiZXJyb3IiLCJtYXJnaW4iLCJwYWRkaW5nIiwibWVzc2FnZSIsImlzVmFsaWQiXSwibWFwcGluZ3MiOiI7Ozs7QUFJZSxTQUFTQSxpQkFBVCxDQUEyQkMsS0FBM0IsRUFBa0M7QUFDL0MsUUFBTTtBQUFFQyxJQUFBQSxLQUFGO0FBQVNDLElBQUFBLFVBQVQ7QUFBcUJDLElBQUFBLHVCQUFyQjtBQUE4Q0MsSUFBQUEsT0FBOUM7QUFBdURDLElBQUFBLFFBQXZEO0FBQWdFQyxJQUFBQTtBQUFoRSxNQUEwRU4sS0FBaEY7QUFHQSxTQUVFO0FBQUssSUFBQSxTQUFTLEVBQUMsaUNBQWY7QUFBaUQsSUFBQSxLQUFLLEVBQUU7QUFBRU8sTUFBQUEsTUFBTSxFQUFFLEVBQVY7QUFBY0MsTUFBQUEsT0FBTyxFQUFFO0FBQXZCO0FBQXhELEtBQ0dKLE9BQU8sSUFBSTtBQUFLLElBQUEsU0FBUyxFQUFDLFVBQWY7QUFBMEIsSUFBQSxLQUFLLEVBQUM7QUFBaEMsS0FDVjtBQUFLLElBQUEsU0FBUyxFQUFDLHlEQUFmO0FBQXlFLElBQUEsSUFBSSxFQUFDLGFBQTlFO0FBQTRGLHFCQUFjLEtBQTFHO0FBQWdILHFCQUFjLEdBQTlIO0FBQWtJLHFCQUFjLEtBQWhKO0FBQXNKLElBQUEsS0FBSyxFQUFDO0FBQTVKLElBRFUsQ0FEZCxFQUlHRSxLQUFLLElBQUksRUFBQyxLQUFEO0FBQU8sSUFBQSxLQUFLLEVBQUMsUUFBYjtBQUFzQixJQUFBLE9BQU8sRUFBRUEsS0FBSyxDQUFDRztBQUFyQyxJQUpaLEVBS0UsRUFBQyxTQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUMsT0FEUjtBQUVFLElBQUEsS0FBSyxFQUFFUixLQUZUO0FBSUUsSUFBQSxJQUFJLEVBQUMsT0FKUDtBQUtFLElBQUEsUUFBUSxFQUFFSSxRQUxaO0FBTUUsSUFBQSxJQUFJLEVBQUMsT0FOUDtBQU9FLElBQUEsRUFBRSxFQUFDLE9BUEw7QUFRRSxJQUFBLE9BQU8sRUFBRUgsVUFBVSxJQUFJQSxVQUFVLENBQUMsT0FBRCxDQUFWLENBQW9CUSxPQVI3QztBQVNFLElBQUEsT0FBTyxFQUFFUixVQUFVLElBQUlBLFVBQVUsQ0FBQyxPQUFELENBQVYsQ0FBb0JPO0FBVDdDLElBTEYsRUFrQkUsRUFBQyxNQUFEO0FBRUUsSUFBQSxJQUFJLEVBQUMsUUFGUDtBQUdFLElBQUEsT0FBTyxFQUFFTix1QkFIWDtBQUlFLG1CQUFZLHVCQUpkO0FBS0UsSUFBQSxLQUFLLEVBQUMseUJBTFI7QUFNRSxJQUFBLE9BQU8sRUFBRUMsT0FOWDtBQU9FLElBQUEsRUFBRSxFQUFDO0FBUEwsSUFsQkYsQ0FGRjtBQW1DRDs7OzsifQ==
