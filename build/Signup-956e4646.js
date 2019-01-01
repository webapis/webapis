import { u as useAuthContext, h } from './index-c8eec607.js';
import { B as Button, v as validationTypes, I as Input, F as Form, s as signup, a as valueChanged } from './actions-c0e4857e.js';

function Signup() {
  const {
    dispatch,
    state
  } = useAuthContext();
  const {
    username,
    password,
    email
  } = state;

  function handleSignup() {
    dispatch(signup({
      dispatch,
      state
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
    formTitle: "Sign up"
  }, h(Input, {
    value: username,
    onChange: handleChange,
    type: "text",
    id: "username",
    name: "username",
    placeholder: "username",
    validationTypes: [validationTypes.USERNAME_FORMAT_VALIDATION, validationTypes.USERNAME_TAKEN]
  }), h(Input, {
    onChange: handleChange,
    value: email,
    placeholder: "email",
    type: "email",
    id: "email",
    name: "email",
    validationTypes: [validationTypes.EMAIL_FORMAT_VALIDATION, validationTypes.REGISTERED_EMAIL]
  }), h(Input, {
    onChange: handleChange,
    value: password,
    placeholder: "password",
    type: "password",
    id: "password",
    name: "password",
    validationTypes: [validationTypes.PASSWORD_FORMAT_VALIDATION]
  }), h(Button, {
    className: "btn",
    type: "button",
    onClick: handleSignup,
    id: "signup-btn",
    title: "Signup"
  })));
}

export default Signup;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2lnbnVwLTk1NmU0NjQ2LmpzIiwic291cmNlcyI6WyIuLi9hdXRoL1NpZ251cC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBoIH0gZnJvbSAncHJlYWN0JztcbmltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcbmltcG9ydCBGb3JtIGZyb20gJy4uL2Zvcm0vRm9ybSc7XG5pbXBvcnQgSW5wdXQgZnJvbSAnLi4vZm9ybS9JbnB1dCc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2Zvcm0vQnV0dG9uJztcbmltcG9ydCB2YWxpZGF0aW9uVHlwZXMgZnJvbSAnLi4vZm9ybS92YWxpZGF0aW9uVHlwZXMnO1xuaW1wb3J0IHsgdXNlQXV0aENvbnRleHQgfSBmcm9tICcuL2F1dGgtY29udGV4dCc7XG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaWdudXAoKSB7XG4gIGNvbnN0IHsgZGlzcGF0Y2gsIHN0YXRlIH0gPSB1c2VBdXRoQ29udGV4dCgpO1xuXG4gIGNvbnN0IHsgdXNlcm5hbWUsIHBhc3N3b3JkLCBlbWFpbCB9ID0gc3RhdGU7XG5cbiAgZnVuY3Rpb24gaGFuZGxlU2lnbnVwKCkge1xuICAgIGRpc3BhdGNoKGFjdGlvbnMuc2lnbnVwKHsgZGlzcGF0Y2gsIHN0YXRlIH0pKTtcbiAgfVxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZSkge1xuICAgIGNvbnN0IHsgbmFtZSwgdmFsdWUgfSA9IGUudGFyZ2V0O1xuICAgIGRpc3BhdGNoKGFjdGlvbnMudmFsdWVDaGFuZ2VkKHsgcHJvcE5hbWU6IG5hbWUsIHZhbHVlLCBkaXNwYXRjaCwgc3RhdGUgfSkpO1xuICB9XG4gIHJldHVybiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInNpZ251cGZvcm1cIiBjbGFzc05hbWU9XCJhdXRoLWZvcm1cIj5cbiAgICAgIDxGb3JtIGZvcm1UaXRsZT1cIlNpZ24gdXBcIj5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgdmFsdWU9e3VzZXJuYW1lfVxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgIGlkPVwidXNlcm5hbWVcIlxuICAgICAgICAgIG5hbWU9XCJ1c2VybmFtZVwiXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJ1c2VybmFtZVwiXG4gICAgICAgICAgdmFsaWRhdGlvblR5cGVzPXtbXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04sXG4gICAgICAgICAgICB2YWxpZGF0aW9uVHlwZXMuVVNFUk5BTUVfVEFLRU4sXG4gICAgICAgICAgXX1cbiAgICAgICAgLz5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICB2YWx1ZT17ZW1haWx9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJlbWFpbFwiXG4gICAgICAgICAgdHlwZT1cImVtYWlsXCJcbiAgICAgICAgICBpZD1cImVtYWlsXCJcbiAgICAgICAgICBuYW1lPVwiZW1haWxcIlxuICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W1xuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OLFxuICAgICAgICAgICAgdmFsaWRhdGlvblR5cGVzLlJFR0lTVEVSRURfRU1BSUwsXG4gICAgICAgICAgXX1cbiAgICAgICAgLz5cbiAgICAgICAgPElucHV0XG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICB2YWx1ZT17cGFzc3dvcmR9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJwYXNzd29yZFwiXG4gICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcbiAgICAgICAgICBpZD1cInBhc3N3b3JkXCJcbiAgICAgICAgICBuYW1lPVwicGFzc3dvcmRcIlxuICAgICAgICAgIHZhbGlkYXRpb25UeXBlcz17W3ZhbGlkYXRpb25UeXBlcy5QQVNTV09SRF9GT1JNQVRfVkFMSURBVElPTl19XG4gICAgICAgIC8+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJidG5cIlxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVNpZ251cH1cbiAgICAgICAgICBpZD1cInNpZ251cC1idG5cIlxuICAgICAgICAgIHRpdGxlPVwiU2lnbnVwXCJcbiAgICAgICAgLz5cbiAgICAgIDwvRm9ybT5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJTaWdudXAiLCJkaXNwYXRjaCIsInN0YXRlIiwidXNlQXV0aENvbnRleHQiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwiZW1haWwiLCJoYW5kbGVTaWdudXAiLCJhY3Rpb25zIiwiaGFuZGxlQ2hhbmdlIiwiZSIsIm5hbWUiLCJ2YWx1ZSIsInRhcmdldCIsInByb3BOYW1lIiwidmFsaWRhdGlvblR5cGVzIiwiVVNFUk5BTUVfRk9STUFUX1ZBTElEQVRJT04iLCJVU0VSTkFNRV9UQUtFTiIsIkVNQUlMX0ZPUk1BVF9WQUxJREFUSU9OIiwiUkVHSVNURVJFRF9FTUFJTCIsIlBBU1NXT1JEX0ZPUk1BVF9WQUxJREFUSU9OIl0sIm1hcHBpbmdzIjoiOzs7QUFRZSxTQUFTQSxNQUFULEdBQWtCO0FBQy9CLFFBQU07QUFBRUMsSUFBQUEsUUFBRjtBQUFZQyxJQUFBQTtBQUFaLE1BQXNCQyxjQUFjLEVBQTFDO0FBRUEsUUFBTTtBQUFFQyxJQUFBQSxRQUFGO0FBQVlDLElBQUFBLFFBQVo7QUFBc0JDLElBQUFBO0FBQXRCLE1BQWdDSixLQUF0Qzs7QUFFQSxXQUFTSyxZQUFULEdBQXdCO0FBQ3RCTixJQUFBQSxRQUFRLENBQUNPLE1BQUEsQ0FBZTtBQUFFUCxNQUFBQSxRQUFGO0FBQVlDLE1BQUFBO0FBQVosS0FBZixDQUFELENBQVI7QUFDRDs7QUFDRCxXQUFTTyxZQUFULENBQXNCQyxDQUF0QixFQUF5QjtBQUN2QixVQUFNO0FBQUVDLE1BQUFBLElBQUY7QUFBUUMsTUFBQUE7QUFBUixRQUFrQkYsQ0FBQyxDQUFDRyxNQUExQjtBQUNBWixJQUFBQSxRQUFRLENBQUNPLFlBQUEsQ0FBcUI7QUFBRU0sTUFBQUEsUUFBUSxFQUFFSCxJQUFaO0FBQWtCQyxNQUFBQSxLQUFsQjtBQUF5QlgsTUFBQUEsUUFBekI7QUFBbUNDLE1BQUFBO0FBQW5DLEtBQXJCLENBQUQsQ0FBUjtBQUNEOztBQUNELFNBQ0U7QUFBSyxtQkFBWSxZQUFqQjtBQUE4QixJQUFBLFNBQVMsRUFBQztBQUF4QyxLQUNFLEVBQUMsSUFBRDtBQUFNLElBQUEsU0FBUyxFQUFDO0FBQWhCLEtBQ0UsRUFBQyxLQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQUVFLFFBRFQ7QUFFRSxJQUFBLFFBQVEsRUFBRUssWUFGWjtBQUdFLElBQUEsSUFBSSxFQUFDLE1BSFA7QUFJRSxJQUFBLEVBQUUsRUFBQyxVQUpMO0FBS0UsSUFBQSxJQUFJLEVBQUMsVUFMUDtBQU1FLElBQUEsV0FBVyxFQUFDLFVBTmQ7QUFPRSxJQUFBLGVBQWUsRUFBRSxDQUNmTSxlQUFlLENBQUNDLDBCQURELEVBRWZELGVBQWUsQ0FBQ0UsY0FGRDtBQVBuQixJQURGLEVBYUUsRUFBQyxLQUFEO0FBQ0UsSUFBQSxRQUFRLEVBQUVSLFlBRFo7QUFFRSxJQUFBLEtBQUssRUFBRUgsS0FGVDtBQUdFLElBQUEsV0FBVyxFQUFDLE9BSGQ7QUFJRSxJQUFBLElBQUksRUFBQyxPQUpQO0FBS0UsSUFBQSxFQUFFLEVBQUMsT0FMTDtBQU1FLElBQUEsSUFBSSxFQUFDLE9BTlA7QUFPRSxJQUFBLGVBQWUsRUFBRSxDQUNmUyxlQUFlLENBQUNHLHVCQURELEVBRWZILGVBQWUsQ0FBQ0ksZ0JBRkQ7QUFQbkIsSUFiRixFQXlCRSxFQUFDLEtBQUQ7QUFDRSxJQUFBLFFBQVEsRUFBRVYsWUFEWjtBQUVFLElBQUEsS0FBSyxFQUFFSixRQUZUO0FBR0UsSUFBQSxXQUFXLEVBQUMsVUFIZDtBQUlFLElBQUEsSUFBSSxFQUFDLFVBSlA7QUFLRSxJQUFBLEVBQUUsRUFBQyxVQUxMO0FBTUUsSUFBQSxJQUFJLEVBQUMsVUFOUDtBQU9FLElBQUEsZUFBZSxFQUFFLENBQUNVLGVBQWUsQ0FBQ0ssMEJBQWpCO0FBUG5CLElBekJGLEVBa0NFLEVBQUMsTUFBRDtBQUNFLElBQUEsU0FBUyxFQUFDLEtBRFo7QUFFRSxJQUFBLElBQUksRUFBQyxRQUZQO0FBR0UsSUFBQSxPQUFPLEVBQUViLFlBSFg7QUFJRSxJQUFBLEVBQUUsRUFBQyxZQUpMO0FBS0UsSUFBQSxLQUFLLEVBQUM7QUFMUixJQWxDRixDQURGLENBREY7QUE4Q0Q7Ozs7In0=
