import { h } from "./index-c4021a67.js";
import { T as TextInput } from "./index-f754cb7d.js";
import { B as Button } from "./index-93758c5b.js";
import { A as Alert } from "./index-f6d2b6e7.js";

function RequestPassChange(props) {
  const {
    email,
    validation,
    onRequestPasswordChange,
    loading,
    onChange,
    error,
  } = props;
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
      label: "Email",
      value: email,
      name: "email",
      onChange: onChange,
      type: "email",
      id: "email",
      isValid: validation && validation["email"].isValid,
      message: validation && validation["email"].message,
    }),
    h(Button, {
      type: "button",
      onClick: onRequestPasswordChange,
      "data-testid": "requestpasschange-btn",
      title: "Request password change",
      loading: loading,
      bg: "primary",
    })
  );
}

export default RequestPassChange;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yZ290UGFzc3dvcmQtZjQ1ZjYxOWQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9mZWF0dXJlcy9hdXRoZW50aWNhdGlvbi91aS1jb21wb25lbnRzL0ZvcmdvdFBhc3N3b3JkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgVGV4dElucHV0IGZyb20gXCJjb250cm9scy90ZXh0LWlucHV0XCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCJjb250cm9scy9idXR0b25cIjtcbmltcG9ydCBBbGVydCBmcm9tIFwiY29udHJvbHMvYWxlcnRcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJlcXVlc3RQYXNzQ2hhbmdlKHByb3BzKSB7XG4gIGNvbnN0IHtcbiAgICBlbWFpbCxcbiAgICB2YWxpZGF0aW9uLFxuICAgIG9uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlLFxuICAgIGxvYWRpbmcsXG4gICAgb25DaGFuZ2UsXG4gICAgZXJyb3IsXG4gIH0gPSBwcm9wcztcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cImNvbC1tZC00IGJvcmRlciBteC1hdXRvIHJvdW5kZWRcIlxuICAgICAgc3R5bGU9e3sgbWFyZ2luOiAxNSwgcGFkZGluZzogMTYgfX1cbiAgICA+XG4gICAgICB7bG9hZGluZyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHJvZ3Jlc3NcIiBzdHlsZT1cImhlaWdodDogNXB4O1wiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3RyaXBlZCBwcm9ncmVzcy1iYXItYW5pbWF0ZWRcIlxuICAgICAgICAgICAgcm9sZT1cInByb2dyZXNzYmFyXCJcbiAgICAgICAgICAgIGFyaWEtdmFsdWVub3c9XCIxMDBcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW1pbj1cIjBcIlxuICAgICAgICAgICAgYXJpYS12YWx1ZW1heD1cIjEwMFwiXG4gICAgICAgICAgICBzdHlsZT1cIndpZHRoOiAxMDAlXCJcbiAgICAgICAgICA+PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHtlcnJvciAmJiA8QWxlcnQgYWxlcnQ9XCJkYW5nZXJcIiBtZXNzYWdlPXtlcnJvci5tZXNzYWdlfSAvPn1cbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgbGFiZWw9XCJFbWFpbFwiXG4gICAgICAgIHZhbHVlPXtlbWFpbH1cbiAgICAgICAgbmFtZT1cImVtYWlsXCJcbiAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICB0eXBlPVwiZW1haWxcIlxuICAgICAgICBpZD1cImVtYWlsXCJcbiAgICAgICAgaXNWYWxpZD17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1wiZW1haWxcIl0uaXNWYWxpZH1cbiAgICAgICAgbWVzc2FnZT17dmFsaWRhdGlvbiAmJiB2YWxpZGF0aW9uW1wiZW1haWxcIl0ubWVzc2FnZX1cbiAgICAgIC8+XG4gICAgICA8QnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBvbkNsaWNrPXtvblJlcXVlc3RQYXNzd29yZENoYW5nZX1cbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJyZXF1ZXN0cGFzc2NoYW5nZS1idG5cIlxuICAgICAgICB0aXRsZT1cIlJlcXVlc3QgcGFzc3dvcmQgY2hhbmdlXCJcbiAgICAgICAgbG9hZGluZz17bG9hZGluZ31cbiAgICAgICAgYmc9XCJwcmltYXJ5XCJcbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiUmVxdWVzdFBhc3NDaGFuZ2UiLCJwcm9wcyIsImVtYWlsIiwidmFsaWRhdGlvbiIsIm9uUmVxdWVzdFBhc3N3b3JkQ2hhbmdlIiwibG9hZGluZyIsIm9uQ2hhbmdlIiwiZXJyb3IiLCJtYXJnaW4iLCJwYWRkaW5nIiwibWVzc2FnZSIsImlzVmFsaWQiXSwibWFwcGluZ3MiOiI7Ozs7O0FBSWUsU0FBU0EsaUJBQVQsQ0FBMkJDLEtBQTNCLEVBQWtDO0FBQy9DLFFBQU07QUFDSkMsSUFBQUEsS0FESTtBQUVKQyxJQUFBQSxVQUZJO0FBR0pDLElBQUFBLHVCQUhJO0FBSUpDLElBQUFBLE9BSkk7QUFLSkMsSUFBQUEsUUFMSTtBQU1KQyxJQUFBQTtBQU5JLE1BT0ZOLEtBUEo7QUFTQSxTQUNFO0FBQ0UsSUFBQSxTQUFTLEVBQUMsaUNBRFo7QUFFRSxJQUFBLEtBQUssRUFBRTtBQUFFTyxNQUFBQSxNQUFNLEVBQUUsRUFBVjtBQUFjQyxNQUFBQSxPQUFPLEVBQUU7QUFBdkI7QUFGVCxLQUlHSixPQUFPLElBQ047QUFBSyxJQUFBLFNBQVMsRUFBQyxVQUFmO0FBQTBCLElBQUEsS0FBSyxFQUFDO0FBQWhDLEtBQ0U7QUFDRSxJQUFBLFNBQVMsRUFBQyx5REFEWjtBQUVFLElBQUEsSUFBSSxFQUFDLGFBRlA7QUFHRSxxQkFBYyxLQUhoQjtBQUlFLHFCQUFjLEdBSmhCO0FBS0UscUJBQWMsS0FMaEI7QUFNRSxJQUFBLEtBQUssRUFBQztBQU5SLElBREYsQ0FMSixFQWdCR0UsS0FBSyxJQUFJLEVBQUMsS0FBRDtBQUFPLElBQUEsS0FBSyxFQUFDLFFBQWI7QUFBc0IsSUFBQSxPQUFPLEVBQUVBLEtBQUssQ0FBQ0c7QUFBckMsSUFoQlosRUFpQkUsRUFBQyxTQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUMsT0FEUjtBQUVFLElBQUEsS0FBSyxFQUFFUixLQUZUO0FBR0UsSUFBQSxJQUFJLEVBQUMsT0FIUDtBQUlFLElBQUEsUUFBUSxFQUFFSSxRQUpaO0FBS0UsSUFBQSxJQUFJLEVBQUMsT0FMUDtBQU1FLElBQUEsRUFBRSxFQUFDLE9BTkw7QUFPRSxJQUFBLE9BQU8sRUFBRUgsVUFBVSxJQUFJQSxVQUFVLENBQUMsT0FBRCxDQUFWLENBQW9CUSxPQVA3QztBQVFFLElBQUEsT0FBTyxFQUFFUixVQUFVLElBQUlBLFVBQVUsQ0FBQyxPQUFELENBQVYsQ0FBb0JPO0FBUjdDLElBakJGLEVBMkJFLEVBQUMsTUFBRDtBQUNFLElBQUEsSUFBSSxFQUFDLFFBRFA7QUFFRSxJQUFBLE9BQU8sRUFBRU4sdUJBRlg7QUFHRSxtQkFBWSx1QkFIZDtBQUlFLElBQUEsS0FBSyxFQUFDLHlCQUpSO0FBS0UsSUFBQSxPQUFPLEVBQUVDLE9BTFg7QUFNRSxJQUFBLEVBQUUsRUFBQztBQU5MLElBM0JGLENBREY7QUFzQ0Q7Ozs7In0=
