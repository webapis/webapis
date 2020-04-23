import { u as useAuthContext, a as useFormContext, h } from './index-8f498f14.js';
import { B as Button, v as validationTypes, I as Input, F as Form, f as forgotPassword, a as valueChanged } from './actions-1edbab9c.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9yZ290UGFzc3dvcmQtN2NlZjk0ZmQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NsaWVudC9hdXRoL0ZvcmdvdFBhc3N3b3JkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGggfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vZm9ybS9JbnB1dCc7XHJcbmltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vRm9ybSc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vZm9ybS9CdXR0b24nO1xyXG5pbXBvcnQgdmFsaWRhdGlvblR5cGVzIGZyb20gJy4uL2Zvcm0vdmFsaWRhdGlvblR5cGVzJztcclxuaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xyXG5pbXBvcnQgeyB1c2VBdXRoQ29udGV4dCB9IGZyb20gJy4vYXV0aC1jb250ZXh0JztcclxuaW1wb3J0IHt1c2VGb3JtQ29udGV4dH0gZnJvbSAnLi4vZm9ybS9mb3JtLWNvbnRleHQnXHJcbmltcG9ydCAqIGFzIGFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVxdWVzdFBhc3NDaGFuZ2UoKSB7XHJcbiAgY29uc3QgeyBkaXNwYXRjaCwgc3RhdGUgfSA9IHVzZUF1dGhDb250ZXh0KCk7XHJcbiAgY29uc3Qge2Rpc3BhdGNoOmZvcm1EaXNwYXRjaH09dXNlRm9ybUNvbnRleHQoKVxyXG4gIGNvbnN0IHsgZW1haWwgfSA9IHN0YXRlO1xyXG5cclxuICBmdW5jdGlvbiBoYW5kbGVGb3Jnb3RQYXNzd29yZCgpIHtcclxuICAgIGRpc3BhdGNoKGFjdGlvbnMuZm9yZ290UGFzc3dvcmQoeyBkaXNwYXRjaCwgc3RhdGUsZm9ybURpc3BhdGNoIH0pKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGUpIHtcclxuICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IGUudGFyZ2V0O1xyXG4gICAgZGlzcGF0Y2goYWN0aW9ucy52YWx1ZUNoYW5nZWQoeyBwcm9wTmFtZTogbmFtZSwgdmFsdWUsIGRpc3BhdGNoLCBzdGF0ZSB9KSk7XHJcbiAgfVxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwic2lnbnVwZm9ybVwiIGNsYXNzTmFtZT1cImF1dGgtZm9ybVwiPlxyXG4gICAgICA8Rm9ybSBmb3JtVGl0bGU9XCJGb3Jnb3QgUGFzc3dvcmRcIj5cclxuICAgICAgICA8SW5wdXRcclxuICAgICAgICAgIHZhbHVlPXtlbWFpbH1cclxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZW1haWxcIlxyXG4gICAgICAgICAgbmFtZT1cImVtYWlsXCJcclxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XHJcbiAgICAgICAgICB0eXBlPVwiZW1haWxcIlxyXG4gICAgICAgICAgaWQ9XCJlbWFpbFwiXHJcbiAgICAgICAgICB2YWxpZGF0aW9uVHlwZXM9e1tcclxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxyXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuRU1BSUxfTk9UX1JFR0lTVEVSRUQsXHJcbiAgICAgICAgICBdfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuXCJcclxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgb25DbGljaz17aGFuZGxlRm9yZ290UGFzc3dvcmR9XHJcbiAgICAgICAgICBpZD1cInJlcXVlc3RwYXNzY2hhbmdlLWJ0blwiXHJcbiAgICAgICAgICB0aXRsZT1cIlNlbmRcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvRm9ybT5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbIlJlcXVlc3RQYXNzQ2hhbmdlIiwiZGlzcGF0Y2giLCJzdGF0ZSIsInVzZUF1dGhDb250ZXh0IiwiZm9ybURpc3BhdGNoIiwidXNlRm9ybUNvbnRleHQiLCJlbWFpbCIsImhhbmRsZUZvcmdvdFBhc3N3b3JkIiwiYWN0aW9ucyIsImhhbmRsZUNoYW5nZSIsImUiLCJuYW1lIiwidmFsdWUiLCJ0YXJnZXQiLCJwcm9wTmFtZSIsInZhbGlkYXRpb25UeXBlcyIsIkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiRU1BSUxfTk9UX1JFR0lTVEVSRUQiXSwibWFwcGluZ3MiOiI7OztBQVNlLFNBQVNBLGlCQUFULEdBQTZCO0FBQzFDLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQTtBQUFaLE1BQXNCQyxjQUFjLEVBQTFDO0FBQ0EsUUFBTTtBQUFDRixJQUFBQSxRQUFRLEVBQUNHO0FBQVYsTUFBd0JDLGNBQWMsRUFBNUM7QUFDQSxRQUFNO0FBQUVDLElBQUFBO0FBQUYsTUFBWUosS0FBbEI7O0FBRUEsV0FBU0ssb0JBQVQsR0FBZ0M7QUFDOUJOLElBQUFBLFFBQVEsQ0FBQ08sY0FBQSxDQUF1QjtBQUFFUCxNQUFBQSxRQUFGO0FBQVlDLE1BQUFBLEtBQVo7QUFBa0JFLE1BQUFBO0FBQWxCLEtBQXZCLENBQUQsQ0FBUjtBQUNEOztBQUNELFdBQVNLLFlBQVQsQ0FBc0JDLENBQXRCLEVBQXlCO0FBQ3ZCLFVBQU07QUFBRUMsTUFBQUEsSUFBRjtBQUFRQyxNQUFBQTtBQUFSLFFBQWtCRixDQUFDLENBQUNHLE1BQTFCO0FBQ0FaLElBQUFBLFFBQVEsQ0FBQ08sWUFBQSxDQUFxQjtBQUFFTSxNQUFBQSxRQUFRLEVBQUVILElBQVo7QUFBa0JDLE1BQUFBLEtBQWxCO0FBQXlCWCxNQUFBQSxRQUF6QjtBQUFtQ0MsTUFBQUE7QUFBbkMsS0FBckIsQ0FBRCxDQUFSO0FBQ0Q7O0FBQ0QsU0FDRTtBQUFLLG1CQUFZLFlBQWpCO0FBQThCLElBQUEsU0FBUyxFQUFDO0FBQXhDLEtBQ0UsRUFBQyxJQUFEO0FBQU0sSUFBQSxTQUFTLEVBQUM7QUFBaEIsS0FDRSxFQUFDLEtBQUQ7QUFDRSxJQUFBLEtBQUssRUFBRUksS0FEVDtBQUVFLElBQUEsV0FBVyxFQUFDLE9BRmQ7QUFHRSxJQUFBLElBQUksRUFBQyxPQUhQO0FBSUUsSUFBQSxRQUFRLEVBQUVHLFlBSlo7QUFLRSxJQUFBLElBQUksRUFBQyxPQUxQO0FBTUUsSUFBQSxFQUFFLEVBQUMsT0FOTDtBQU9FLElBQUEsZUFBZSxFQUFFLENBQ2ZNLGVBQWUsQ0FBQ0MsdUJBREQsRUFFZkQsZUFBZSxDQUFDRSxvQkFGRDtBQVBuQixJQURGLEVBYUUsRUFBQyxNQUFEO0FBQ0UsSUFBQSxTQUFTLEVBQUMsS0FEWjtBQUVFLElBQUEsSUFBSSxFQUFDLFFBRlA7QUFHRSxJQUFBLE9BQU8sRUFBRVYsb0JBSFg7QUFJRSxJQUFBLEVBQUUsRUFBQyx1QkFKTDtBQUtFLElBQUEsS0FBSyxFQUFDO0FBTFIsSUFiRixDQURGLENBREY7QUF5QkQ7Ozs7In0=